import re
from datetime import datetime as dt
from extensions.database import db


def get_db_dialect():
    """
    Extracts and returns a friendly database type name from SQLAlchemy engine URL.
    """
    db_url = str(db.engine.url)
    db_type = db_url.split(":")[0].lower()

    # Map common dialects to friendly names
    db_type_mapping = {
        "postgresql": "PostgreSQL",
        "mysql": "MySQL",
        "mssql": "MSSQL",
        "sqlite": "SQLite",
    }
    return db_type_mapping.get(db_type, db_type.upper())


def generate_unique_table_name(file_name):
    # Generate a datetime string
    datetime_string = dt.now().strftime("%Y%m%d_%H%M%S")  # e.g., 20230220_143030

    # Sanitize the file name (keeping only letters, numbers, and underscores)
    sanitized_file_name = re.sub("[^A-Za-z0-9_]+", "_", file_name)

    # Combine the sanitized file name with the datetime string
    unique_table_name = f"{sanitized_file_name}_{datetime_string}"

    # Ensure the table name doesn't exceed the database's character limit (e.g., 64 for MySQL)
    max_length = 64
    if len(unique_table_name) > max_length:
        # Trim the sanitized file name if necessary
        trim_length = max_length - len(datetime_string) - 1  # -1 for the underscore
        unique_table_name = f"{sanitized_file_name[:trim_length]}_{datetime_string}"

    return unique_table_name
