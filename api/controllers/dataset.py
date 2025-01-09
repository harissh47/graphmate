from flask import request, current_app
from flask_restful import Resource
from controllers import api
from models.dataset import GraphmatesDatasetDesc
from extensions.database import db
from libs.exception import BaseHTTPException
from controllers.error import DatasetDescriptionNotFoundError, ChartProcessingError, InvalidResponseFormatError, InvalidRequestError, LLMAPIError, DatasetUpdateError, InvalidColumnsFormatError, MissingFieldsError, ChartNotFoundError, ChartExecutionError
from services.llm_ops_api import LLMOpsAPI
# from utils.superset_auth import requires_superset_auth
import json
# import logging
from models.chart import GraphmatesChart
import uuid
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from models.dataset_relations import GraphmatesDatasetRelations


 
 
 
class DatasetApi(Resource):
    # Remove @requires_superset_auth since it's handled globally
    def put(self):
        try:
            request_data = request.get_json()
            if not request_data or 'datasetId' not in request_data or 'columns' not in request_data:
                raise MissingFieldsError()
 
            columns = request_data['columns']
            if not isinstance(columns, list) or not all(
                isinstance(col, dict) and
                'columnName' in col and
                'columnDescription' in col and
                'columnDataDescription' in col
                for col in columns
            ):
                raise InvalidColumnsFormatError()
 
            dataset_desc = GraphmatesDatasetDesc.query.filter_by(
                id=request_data['datasetId']
            ).first()
 
            if not dataset_desc:
                raise DatasetDescriptionNotFoundError()
           
            description = {
                "datasetDescription": request_data.get('datasetDescription', "Dataset description"),
                "columns": {
                    col['columnName']: {
                        "description": col['columnDescription'],
                        "dataDescription": col['columnDataDescription']
                    } for col in columns
                }
            }
           
            dataset_desc.data = description
            db.session.commit()
 
            return {
                "message": "Data Updated",
                "status": "success",
            }, 200
 
        except (DatasetDescriptionNotFoundError, MissingFieldsError, InvalidColumnsFormatError) as e:
            raise e
        except Exception as e:
            db.session.rollback()
            raise DatasetUpdateError(message=str(e))

class DatasetChartApi(Resource):
    def post(self):
        try:
            # Get the incoming JSON data from the request body
            request_data = request.get_json()

            # Validate the payload structure
            if not isinstance(request_data, dict) or 'name' not in request_data or 'data' not in request_data:
                raise InvalidRequestError("Missing required fields: name or data")

            name = request_data['name']
            data = request_data['data']

            # Ensure that 'data' is not empty and contains the dataset_relation_id
            if not isinstance(data, list) or len(data) == 0 or 'dataset_relation_id' not in data[0]:
                raise InvalidRequestError("Missing dataset_relation_id in the data array")

            # Extract dataset_relation_id from the first element of the data array
            dataset_relation_id = data[0]['dataset_relation_id']

            # Initialize the LLMOpsAPI
            llmOps = LLMOpsAPI(
                authToken=current_app.config['AUTH_TOKEN_CHART'],
                baseUrl=current_app.config['LLM_OPS_BASEURL'],
            )

            # Fetch the response from the LLM
            response = llmOps.fetch_api(query=json.dumps(data))

            if isinstance(response, tuple):
                raise LLMAPIError(description=f"LLM API error: {response[0]}")

            answer = response.get("answer")
            if not answer:
                raise ChartProcessingError("No answer received from LLM API")

            try:
                chart_suggestions = json.loads(answer)
            except json.JSONDecodeError:
                raise InvalidResponseFormatError("Failed to parse LLM response")

            if not isinstance(chart_suggestions, list):
                raise InvalidResponseFormatError("Chart suggestions must be a list")

            enhanced_suggestions = []

            # Add a unique ID to each chart suggestion and save them to the database
            for chart in chart_suggestions:
                chart_id = str(uuid.uuid4())

                # Create a new GraphmatesChart instance with the dataset_relation_id
                new_chart = GraphmatesChart(
                    id=chart_id,
                    chart_type=chart.get('chart_type'),
                    parameters=chart.get('parameters', []),
                    sql_query=chart.get('sql_query', ''),
                    llm_prompt=chart.get('llm_prompt', ''),
                    created_at=datetime.utcnow(),
                    dataset_relation_id=dataset_relation_id  # Store the dataset_relation_id here
                )

                # Add the new chart to the session
                db.session.add(new_chart)
                
                # Create enhanced suggestion with ID
                enhanced_suggestion = chart.copy()
                enhanced_suggestion['id'] = chart_id
                enhanced_suggestions.append(enhanced_suggestion)

            # Commit all the new charts to the database
            db.session.commit()

            if not enhanced_suggestions:
                raise ChartProcessingError("No valid charts were processed")

            # Now update the name in the GraphmatesDatasetRelations table based on the dataset_relation_id
            dataset_relation = GraphmatesDatasetRelations.query.filter_by(id=dataset_relation_id).first()
            if dataset_relation:
                dataset_relation.name = name  # Update the name field with the provided name

                # Commit the change to the database
                db.session.commit()

            # Return the modified chart suggestions with IDs
            return enhanced_suggestions, 200

        except (ChartProcessingError, InvalidResponseFormatError, InvalidRequestError, LLMAPIError) as e:
            return {"error": e.error_code, "message": e.description}, e.code
        except Exception as e:
            return {
                "error": "processing_error", 
                "message": f"Error processing request: {str(e)}"
            }, 500


class DatasetChartExecuteApi(Resource):
    def post(self):
        try:
            request_data = request.get_json()
            if not request_data or 'id' not in request_data:
                raise MissingFieldsError()

            chart_id = request_data['id']
            
            chart = GraphmatesChart.query.get(chart_id)
            if not chart:
                raise ChartNotFoundError()

            rows = []
            chart_output = {
                'headers': {},  
                'data': {      
                    'value': [],
                    'series': [],
                    'category': [],
                    'additional': []
                }
            }
            
            with db.engine.connect() as connection:
                result = connection.execute(text(chart.sql_query))
                columns = [str(col) for col in result.keys()]
                
                # Process rows as before
                for row in result.mappings():
                    row_dict = {}
                    for column in columns:
                        value = row[column]
                        if not isinstance(value, (str, int, float, bool, type(None))):
                            value = str(value)
                        row_dict[column] = value
                    rows.append(row_dict)
            
            parameters = chart.parameters
            
            # Process parameters and populate data
            for key, val in parameters.items():
                if val == None:
                    chart_output['data'][key] = []
                    chart_output['headers'][key] = None
                else:
                    chart_output['data'][key] = [row[val] for row in rows]
                    chart_output['headers'][key] = val
            
            # Add additional columns
            used_columns = set(val for val in parameters.values() if val is not None)
            for column in columns:
                if column not in used_columns:
                    chart_output['data']['additional'].append({
                        'name': column,
                        'values': [row[column] for row in rows]
                    })
                    
            if not rows:
                return [], 200

            return chart_output, 200

        except (ChartNotFoundError, MissingFieldsError) as e:
            return {"error": e.error_code, "message": e.description}, e.code
        except SQLAlchemyError as e:
            return {
                "error": "database_error",
                "message": f"Error executing query: {str(e)}"
            }, 500
        except Exception as e:
            return {
                "error": "execution_error", 
                "message": f"Error processing request: {str(e)}"
            }, 500

class DatasetChartBookmarkApi(Resource):
    def post(self):
        try:
            request_data = request.get_json()
            if not request_data or 'id' not in request_data:
                raise MissingFieldsError()

            chart_id = request_data['id']
            chart = GraphmatesChart.query.get(chart_id)
            if not chart:
                raise ChartNotFoundError()

            chart.is_bookmarked = True
            db.session.commit()

            return {"message": "Chart bookmarked successfully"}, 200

        except (ChartNotFoundError, MissingFieldsError) as e:
            return {"error": e.error_code, "message": e.description}, e.code
        except Exception as e:
            return {
                "error": "bookmark_error", 
                "message": f"Error processing request: {str(e)}"
            }, 500

class DatasetChartUnbookmarkApi(Resource):
    def post(self):
        try:
            request_data = request.get_json()
            if not request_data or 'id' not in request_data:
                raise MissingFieldsError()

            chart_id = request_data['id']
            chart = GraphmatesChart.query.get(chart_id)
            if not chart:
                raise ChartNotFoundError()

            chart.is_bookmarked = False
            db.session.commit()

            return {"message": "Chart unbookmarked successfully"}, 200

        except (ChartNotFoundError, MissingFieldsError) as e:
            return {"error": e.error_code, "message": e.description}, e.code
        except Exception as e:
            return {
                "error": "unbookmark_error", 
                "message": f"Error processing request: {str(e)}"
            }, 500

class ShowDetailsOfBookMark(Resource):
    def post(self):
        try:
            request_data = request.get_json()
            if not request_data or 'user_id' not in request_data:
                raise MissingFieldsError()

            user_id = request_data['user_id']

            # Fetch dataset relations for the given user_id
            dataset_relations = GraphmatesDatasetRelations.query.filter_by(user_id=user_id).all()

            # Prepare the response structure
            response = []

            for relation in dataset_relations:
                # Fetch bookmarked charts for each dataset relation ID
                bookmarked_charts = GraphmatesChart.query.filter(
                    GraphmatesChart.dataset_relation_id == relation.id,
                    GraphmatesChart.is_bookmarked == True
                ).all()

                # Collect chart details
                chart_details = [
                    {
                        "id": chart.id,
                        "chart_type": chart.chart_type,
                        "sql_query": chart.sql_query,
                        "llm_prompt": chart.llm_prompt,
                        "parameters": chart.parameters
                    }
                    for chart in bookmarked_charts
                ]

                # Append the relation name and its charts to the response only if both are present
                if relation.name and chart_details:
                    response.append({
                        "name": relation.name,
                        "charts": chart_details
                    })

            # Return the response
            return response, 200

        except (MissingFieldsError) as e:
            return {"error": e.error_code, "message": e.description}, e.code
        except Exception as e:
            return {
                "error": "processing_error", 
                "message": f"Error processing request: {str(e)}"
            }, 500

# Add the new resources to the API
api.add_resource(DatasetApi, '/dataset/update')
api.add_resource(DatasetChartApi, '/dataset/chart')
api.add_resource(DatasetChartExecuteApi, '/dataset/generate-data')
api.add_resource(DatasetChartBookmarkApi, '/dataset/chart/bookmark')
api.add_resource(DatasetChartUnbookmarkApi, '/dataset/chart/unbookmark')
api.add_resource(ShowDetailsOfBookMark, '/dataset/chart/bookmark/details')






