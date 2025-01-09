import pandas as pd
from typing import Any, Dict
from io import BytesIO
from services.error import UnsupportedFileTypeError
from models.database_connection import DatabaseConnection
from services.database_services import DatabaseService
from sqlalchemy import create_engine


class DataAnalysis:

    @staticmethod
    def prepare_api_data(df: Any) -> Dict[str, str]:
        # Convert DataFrame to a format that can be JSON serialized with semicolons
        def convert_value(val):
            if pd.isna(val):
                return "N/A"
            elif isinstance(val, pd.Timestamp):
                return val.strftime("%Y-%m-%d")
            return str(val)

        header_line = ";".join(df.columns.tolist())
        data_lines = [
            ";".join(map(convert_value, row)) for _, row in df.head(10).iterrows()
        ]

        return {"headers": header_line, "sample_data": "\n".join(data_lines)}

    @staticmethod
    def analyze_file(file: Any, extension: str) -> Any:
        try:
            if extension.lower() == "csv":
                df = pd.read_csv(BytesIO(file))
            elif extension.lower() in ["xlsx", "xls"]:
                df = pd.read_excel(BytesIO(file))
            else:
                raise UnsupportedFileTypeError(f"Unsupported file type: {extension}")

            df.columns = [str(col).lower().replace(" ", "_") for col in df.columns]

            return df
        except UnsupportedFileTypeError:
            raise
        except Exception as e:
            raise

    @staticmethod
    def analyze_table(connection: DatabaseConnection) -> pd.DataFrame:
        if connection.db_type not in DatabaseService.DB_TYPES:
            raise ValueError(f"Unsupported database type: {connection.db_type}")

        try:
            # Special handling for SQLite
            if connection.db_type == "SQLITE":
                engine = create_engine(connection.connection_uri)
            else:
                # Standard handling for other databases
                db_prefix = DatabaseService.DB_TYPES[connection.db_type]
                if connection.db_type == "MSSQL":
                    connection_string = f"{db_prefix}://{connection.username}:{connection.password}@{connection.host}:{connection.port}/{connection.db_name}?driver=ODBC+Driver+17+for+SQL+Server"
                else:
                    connection_string = f"{db_prefix}://{connection.username}:{connection.password}@{connection.host}:{connection.port}/{connection.db_name}"
                engine = create_engine(connection_string)

            # Adjust query based on database type
            if connection.db_type == "MSSQL":
                query = f"SELECT TOP 10 * FROM {connection.table_name}"
            else:
                query = f"SELECT * FROM {connection.table_name} LIMIT 10"

            df = pd.read_sql(query, engine)
            return df

        except Exception as e:
            raise Exception(f"Error analyzing table: {str(e)}")
        finally:
            engine.dispose()
