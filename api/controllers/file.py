from flask import request, current_app
from flask_restful import Resource
from services.file_service import FileService
from controllers import api
from controllers.error import NoFileUploadedError, DatasetDescriptionNotFoundError, DatabaseTransactionError, UnsupportedFileTypeError
from services.data_analysis import DataAnalysis
from services.llm_ops_api import LLMOpsAPI
from utils.llm_extractor import extract_metadata_response
from models.dataset_relations import GraphmatesDatasetRelations
from extensions.database import db
from extensions.storage import storage
from sqlalchemy import Table, Column, String, MetaData
import pandas as pd
import io
from utils.sqlalchemy_extracts import get_db_dialect


class FileApi(Resource):
    def post(self):
        if "file" not in request.files:
            raise NoFileUploadedError()

        # Get dataset_relation_id from request if it exists
        dataset_relation_id = request.form.get('dataset_relation_id')

        file = request.files["file"]
        file_content = file.read()

        try:
            # Upload file and create table
            upload_file, table_name, column_types = FileService.upload_file(file, file_content)

            # Continue with existing logic
            data_analysis = DataAnalysis.analyze_file(file_content, upload_file.extension)
            extract_data_from_file = DataAnalysis.prepare_api_data(data_analysis)
            query_data = (
                extract_data_from_file["headers"]
                + "\n"
                + extract_data_from_file["sample_data"]
            )

            llmOps = LLMOpsAPI(
                authToken=current_app.config['AUTH_TOKEN'],
                baseUrl=current_app.config['LLM_OPS_BASEURL'],
            )

            metadata = llmOps.fetch_api(query=query_data)
            final_response = extract_metadata_response(metadata, upload_file, column_types, table_name)
            dataset_id = final_response.get('datasetId')

            # Handle dataset relations
            if dataset_relation_id:
                dataset_relation = GraphmatesDatasetRelations.query.get(dataset_relation_id)
                if not dataset_relation:
                    raise DatasetDescriptionNotFoundError()
                
                current_ids = dataset_relation.dataset_ids_list
                if dataset_id not in current_ids:
                    current_ids.append(dataset_id)
                    dataset_relation.dataset_ids_list = current_ids
            else:
                dataset_relation = GraphmatesDatasetRelations(
                    user_id="123",  # Replace with actual user_id
                    dataset_ids_list=[dataset_id]
                )
                db.session.add(dataset_relation)

            db.session.commit()

            final_response.update({
                'dataset_relation_id': dataset_relation.id,
                'table_name': table_name,
                'db_type': get_db_dialect(),
                # 'file_name': upload_file.key
            })

            return final_response, 201

        except Exception as e:
            # FileService handles its own cleanup
            raise DatabaseTransactionError(str(e))


api.add_resource(FileApi, "/files/upload")
