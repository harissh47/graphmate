from sqlalchemy import create_engine, inspect
import pandas as pd
from typing import Dict, Any
from models.database_connection import DatabaseConnection
from extensions.database import db

class DatabaseService:
    # Updated DB_TYPES to include SQLite
    DB_TYPES = {
        'MYSQL': 'mysql+pymysql',
        'POSTGRESQL': 'postgresql+psycopg2',
        'MSSQL': 'mssql+pyodbc',
        'SQLITE': 'sqlite'
    }

    @staticmethod
    def create_connection(connection_details: Dict[str, Any]) -> DatabaseConnection:
        db_type = connection_details['db_type'].upper()
        
        # Special handling for SQLite
        if db_type == 'SQLITE':
            connection = DatabaseConnection(
                user_id=connection_details['user_id'],
                db_type=db_type,
                db_name='',  
                username='', 
                password='', 
                host='',     
                port='',     
                table_name=connection_details['table_name'],
                connection_uri=connection_details['connection_uri']
            )
        else:
            # Standard handling for MySQL, PostgreSQL, and MSSQL
            connection = DatabaseConnection(
                user_id=connection_details['user_id'],
                db_type=db_type,
                db_name=connection_details['db_name'],
                username=connection_details['username'],
                password=connection_details['password'],
                host=connection_details['host'],
                port=connection_details['port'],
                table_name=connection_details['table_name'],
                connection_uri='' 
            )
        
        db.session.add(connection)
        db.session.commit()
        return connection
