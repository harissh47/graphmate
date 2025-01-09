# import uuid
# import hashlib
# import logging
# from typing import Any
# from werkzeug.datastructures import FileStorage
# from flask import current_app
# import pandas as pd
# import io
# from sqlalchemy import Table, Column, String, MetaData, Integer, Float, Boolean, DateTime

# from extensions.database import db
# from extensions.storage import storage
# from utils.sqlalchemy_extracts import generate_unique_table_name
# from services.error import UnsupportedFileTypeError
# from models.files import UploadFile
# from services.data_analysis import DataAnalysis


# logger = logging.getLogger(__name__)
# FILE_EXTENSIONS = ["csv", "xlsx", "xls"]


# class FileService:
#     @staticmethod
#     def upload_file(file: FileStorage, file_content: Any) -> UploadFile:
#         try:
#             extension = file.filename.split(".")[-1].lower()

#             if extension not in FILE_EXTENSIONS:
#                 raise UnsupportedFileTypeError()

#             file_uuid = str(uuid.uuid4())

#             formatted_uuid = file_uuid.replace("-", "_")
#             table_name = generate_unique_table_name(
#                 file.filename.split(".")[-2].lower()
#             )

#             # Use the same formatted UUID for file storage
#             file_key = f"upload_files/{formatted_uuid}.{extension}"
#             storage.save(file_key, file_content)

#             # Save file record in the database
#             config = current_app.config
#             upload_file = UploadFile(
#                 storage_type=config["STORAGE_TYPE"],
#                 key=file_key,
#                 name=file.filename,
#                 extension=extension,
#                 mime_type=file.mimetype,
#                 hash=hashlib.sha3_256(file_content).hexdigest(),
#             )

#             # Create and populate the dynamic table
#             column_types, table_name = FileService._create_and_populate_table(file_content, extension, table_name)

#             db.session.add(upload_file)
#             db.session.commit()

#             return upload_file, table_name, column_types

#         except Exception as e:
#             db.session.rollback()
#             logger.error(f"Error uploading file: {str(e)}")
#             # Clean up any created resources
#             try:
#                 storage.delete(file_key)
#             except:
#                 pass
#             raise

#     @staticmethod
#     def _create_and_populate_table(
#         file_content: bytes, extension: str, table_name: str
#     ):
#         """
#         Create and populate a dynamic table based on the file content
#         """
#         try:
#             # Analyze file to get DataFrame
#             df = DataAnalysis.analyze_file(file_content, extension)

#             # Preprocess data to handle special characters
#             df = FileService._preprocess_data(df)

#             # Infer data types
#             column_types = FileService._infer_column_types(df)

#             # Create dynamic table using UUID
#             metadata = MetaData()

#             # Create columns dynamically from DataFrame
#             columns = [Column("id", String(36), primary_key=True)]
#             for column, col_type in column_types.items():
#                 columns.append(Column(str(column), col_type))

#             # Create table
#             dynamic_table = Table(table_name, metadata, *columns, extend_existing=True)

#             # Create table in database
#             metadata.create_all(db.engine)

#             # Insert data into table
#             with db.engine.connect() as connection:
#                 for index, row in df.iterrows():
#                     # Convert all values to string and handle NaN
#                     row_dict = {
#                         col: str(val) if pd.notna(val) else None
#                         for col, val in row.items()
#                     }
#                     row_dict["id"] = str(index)  # Add id column
#                     connection.execute(dynamic_table.insert().values(**row_dict))
#                 connection.commit()

#         except Exception as e:
#             logger.error(f"Error creating table: {str(e)}")
#             # Clean up if table creation fails
#             try:
#                 if "dynamic_table" in locals():
#                     dynamic_table.drop(db.engine, checkfirst=True)
#             except:
#                 pass
#             raise

#         return column_types, table_name

#     @staticmethod
#     def _preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
#         """
#         Preprocess data to handle special characters in numeric columns
#         """
#         for column in df.columns:
#             # Check if the column can be converted to a numeric type
#             if pd.api.types.is_numeric_dtype(df[column]):
#                 # Attempt to convert columns to numeric, coercing errors to NaN
#                 df[column] = pd.to_numeric(df[column].replace(r'[^\d.-]', '', regex=True), errors='coerce')
#         return df

#     @staticmethod
#     def _infer_column_types(df: pd.DataFrame) -> dict:
#         """
#         Infer SQLAlchemy column types from pandas DataFrame dtypes
#         """
#         type_mapping = {
#             'int64': Integer,
#             'float64': Float,
#             'object': String(255),
#             'bool': Boolean,
#             'datetime64[ns]': DateTime,
#             # Add more mappings as needed
#         }

#         column_types = {}
#         for column, dtype in df.dtypes.items():
#             # Use the type mapping to get the SQLAlchemy type
#             column_types[column] = type_mapping.get(str(dtype), String(255))

#         return column_types

    

#     @staticmethod
#     def delete_table(table_name: str):
#         """
#         Delete a dynamic table
#         """
#         try:
#             metadata = MetaData()
#             table = Table(table_name, metadata)
#             table.drop(db.engine, checkfirst=True)
#         except Exception as e:
#             logger.error(f"Error deleting table {table_name}: {str(e)}")
#             raise




import uuid
import hashlib
import logging
from typing import Any
from werkzeug.datastructures import FileStorage
from flask import current_app
import pandas as pd
import io
from sqlalchemy import Table, Column, String, MetaData, Integer, Float, Boolean, DateTime

from extensions.database import db
from extensions.storage import storage
from utils.sqlalchemy_extracts import generate_unique_table_name
from services.error import UnsupportedFileTypeError
from models.files import UploadFile
from services.data_analysis import DataAnalysis


logger = logging.getLogger(__name__)
FILE_EXTENSIONS = ["csv", "xlsx", "xls"]


class FileService:
    @staticmethod
    def upload_file(file: FileStorage, file_content: Any) -> UploadFile:
        try:
            extension = file.filename.split(".")[-1].lower()

            if extension not in FILE_EXTENSIONS:
                raise UnsupportedFileTypeError()

            file_uuid = str(uuid.uuid4())

            formatted_uuid = file_uuid.replace("-", "_")
            table_name = generate_unique_table_name(
                file.filename.split(".")[-2].lower()
            )

            # Use the same formatted UUID for file storage
            file_key = f"upload_files/{formatted_uuid}.{extension}"
            storage.save(file_key, file_content)

            # Save file record in the database
            config = current_app.config
            upload_file = UploadFile(
                storage_type=config["STORAGE_TYPE"],
                key=file_key,
                name=file.filename,
                extension=extension,
                mime_type=file.mimetype,
                hash=hashlib.sha3_256(file_content).hexdigest(),
            )

            # Create and populate the dynamic table
            column_types, table_name = FileService._create_and_populate_table(file_content, extension, table_name)

            db.session.add(upload_file)
            db.session.commit()

            return upload_file, table_name, column_types

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error uploading file: {str(e)}")
            # Clean up any created resources
            try:
                storage.delete(file_key)
            except:
                pass
            raise

    @staticmethod
    def _create_and_populate_table(
        file_content: bytes, extension: str, table_name: str
    ):
        """
        Create and populate a dynamic table based on the file content
        """
        try:
            # Analyze file to get DataFrame
            df = DataAnalysis.analyze_file(file_content, extension)

            # Preprocess data to handle special characters
            df = FileService._preprocess_data(df)

            # Infer data types
            column_types = FileService._infer_column_types(df)

            # Create dynamic table using UUID
            metadata = MetaData()

            # Check if 'id' column exists in the DataFrame
            if 'id' not in df.columns:
                # Add 'id' column if it doesn't exist
                df['id'] = df.index.astype(str)
                column_types['id'] = String(36)  # Add 'id' to column_types
                columns = [Column("id", String(36), primary_key=True)]
            else:
                # Use existing 'id' column as primary key
                id_type = column_types.get('id', String(36))  # Default to String if not found
                columns = [Column("id", id_type, primary_key=True)]

            # Create columns dynamically from DataFrame
            for column, col_type in column_types.items():
                if column != 'id':  # Avoid redefining 'id' column
                    columns.append(Column(str(column), col_type))

            # Create table
            dynamic_table = Table(table_name, metadata, *columns, extend_existing=True)

            # Create table in database
            metadata.create_all(db.engine)

            # Insert data into table
            with db.engine.connect() as connection:
                for index, row in df.iterrows():
                    # Convert all values to string and handle NaN
                    row_dict = {
                        col: (bool(val) if col_type == Boolean else str(val)) if pd.notna(val) else None
                        for col, val in row.items()
                        for col_type in [column_types[col]]
                    }
                    connection.execute(dynamic_table.insert().values(**row_dict))
                connection.commit()

        except Exception as e:
            logger.error(f"Error creating table: {str(e)}")
            # Clean up if table creation fails
            try:
                if "dynamic_table" in locals():
                    dynamic_table.drop(db.engine, checkfirst=True)
            except:
                pass
            raise

        return column_types, table_name

    @staticmethod
    def _preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
        """
        Preprocess data to handle special characters in numeric columns
        """
        for column in df.columns:
            # Check if the column can be converted to a numeric type
            if pd.api.types.is_numeric_dtype(df[column]):
                # Attempt to convert columns to numeric, coercing errors to NaN
                df[column] = pd.to_numeric(df[column].replace(r'[^\d.-]', '', regex=True), errors='coerce')
        return df

    @staticmethod
    def _infer_column_types(df: pd.DataFrame) -> dict:
        """
        Infer SQLAlchemy column types from pandas DataFrame dtypes
        """
        type_mapping = {
            'int64': Integer,
            'float64': Float,
            'object': String(255),
            'bool': Boolean,
            'datetime64[ns]': DateTime,
            # Add more mappings as needed
        }

        column_types = {}
        for column, dtype in df.dtypes.items():
            # Use the type mapping to get the SQLAlchemy type
            column_types[column] = type_mapping.get(str(dtype), String(255))

        return column_types

    

    @staticmethod
    def delete_table(table_name: str):
        """
        Delete a dynamic table
        """
        try:
            metadata = MetaData()
            table = Table(table_name, metadata)
            table.drop(db.engine, checkfirst=True)
        except Exception as e:
            logger.error(f"Error deleting table {table_name}: {str(e)}")
            raise