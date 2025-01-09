import re
import json
import logging

from extensions.database import db
from models.files import UploadFile
from models.dataset import GraphmatesDatasetDesc
from services.llm_ops_api import LLMOpsAPI
from controllers.error import InvalidResponseFormatError, InvalidRequestError
from flask import current_app
from sqlalchemy import inspect


def extract_metadata_response(response, upload_file: UploadFile, column_types: dict, table_name: str):
    llm_answer = response.get("answer", "")

    json_match = re.search(r"```json\n(.*?)```", llm_answer, re.DOTALL)

    extracted_json = {}

    if json_match:
        try:
            parsed_json = json.loads(json_match.group(1))
            parsed_json["datasetName"] = upload_file.name.rsplit(".", 1)[0]

            # Use SQLAlchemy inspector to get column types from the database
            inspector = inspect(db.engine)

            # Ensure table_name is not None or empty
            if not table_name:
                raise ValueError("Table name is missing or empty.")

            columns_info = inspector.get_columns(table_name)

            # Create a mapping of column names to their SQL data types
            column_type_mapping = {col['name']: col['type'] for col in columns_info}

            if "columns" in parsed_json:
                for column in parsed_json["columns"]:
                    column_name = column.get("columnName")
                    if column_name in column_type_mapping:
                        # Directly use the SQL type name
                        column["columnDataType"] = str(column_type_mapping[column_name])

            extracted_json = parsed_json
        except json.JSONDecodeError:
            return {}
    else:
        extracted_json = {"datasetName": upload_file.name.rsplit(".", 1)[0]}

    metadata = GraphmatesDatasetDesc(
        file_id=upload_file.id, user_id="123", data=extracted_json
    )

    db.session.add(metadata)
    db.session.commit()

    extracted_json["datasetId"] = metadata.id

    return extracted_json