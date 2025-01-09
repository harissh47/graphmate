from flask import request
from flask_restful import Resource
from services.database_services import DatabaseService
from services.data_analysis import DataAnalysis
from services.llm_ops_api import LLMOpsAPI
from utils.llm_extractor import extract_metadata_response
from controllers import api
# from config import Config
from flask import request, current_app


# from utils.database_extractor import extract_metadata_response

class DatabaseApi(Resource):
    def post(self):
        data = request.get_json()
        
        # Create database connection
        connection = DatabaseService.create_connection(data)
        
        # Analyze the table
        # df = DatabaseService.analyze_table(connection)
        df = DataAnalysis.analyze_table(connection)
        
        # Prepare data for LLM API
        # extract_data = DatabaseService.prepare_api_data(df)
        extract_data = DataAnalysis.prepare_api_data(df)
        
        query_data = (
            extract_data["headers"]
            + "\n"
            + extract_data["sample_data"]
        )

        # Get LLM response
        # config = Config()
        # llmOps = LLMOpsAPI(
        #     authToken=config.AUTH_TOKEN,
        #     baseUrl=config.EXTERNAL_API_ENDPOINT,
        # )
        llmOps = LLMOpsAPI(
            authToken=current_app.config['AUTH_TOKEN'],
            baseUrl=current_app.config['LLM_OPS_BASEURL'],
        )

        metadata = llmOps.fetch_api(query=query_data)
        
        final_response = extract_metadata_response(metadata, connection)

        return final_response, 200

api.add_resource(DatabaseApi, "/database/analyze")