import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

DEFAULTS = {
    'CURRENT_VERSION': '0.0.1',
    'LLM_OPS_BASEURL': 'test url',
    'SECRET_KEY': 'Y9+bBLPT9lBwY+P150VlVKTtH1XLRLbVp1NxeVVj/nOi8QN+diM54bfk',
    'LOG_LEVEL': 'INFO',
    'LOG_FORMAT': '%(asctime)s.%(msecs)03d %(levelname)s [%(threadName)s] [%(filename)s:%(lineno)d] - %(message)s',
    'LOG_DATEFORMAT': '%Y-%m-%d %H:%M:%S',
    'DEPLOY_ENV': 'DEVELOPMENT',
    'STORAGE_LOCAL_PATH': 'storage',
    'STORAGE_TYPE': 'local',
    'DB_USERNAME': 'root',
    'DB_PASSWORD': 'Sify%40123',
    'DB_HOST': 'localhost',
    'DB_PORT': '3306',
    'DB_DATABASE': 'chart_db',
    'SQLALCHEMY_DATABASE_URI_SCHEME': 'mysql+pymysql',
    'AUTH_TOKEN': 'your_default_auth_token',
    'AUTH_TOKEN_CHART': 'Add_your_auth_token_here',
    'SUPERSET_AUTH_TOKEN': 'add your superset auth token here'
}

def get_env(key):
    return os.environ.get(key, DEFAULTS.get(key))

def get_bool_env(key):
    value = get_env(key)
    if isinstance(value, str):
        return value.lower() in ['true', '1', 't', 'y', 'yes']
    return bool(value)

class Config:
    """Application configuration class."""

    def __init__(self):
        # ------------------------
        # General Configurations.
        # ------------------------
        self.CURRENT_VERSION = get_env('CURRENT_VERSION')
        self.LLM_OPS_BASEURL = get_env('LLM_OPS_BASEURL')
        self.SECRET_KEY = get_env('SECRET_KEY')

        # Logging Configuration
        self.LOG_LEVEL = get_env('LOG_LEVEL')
        self.LOG_FORMAT = get_env('LOG_FORMAT')
        self.LOG_DATEFORMAT = get_env('LOG_DATEFORMAT')

        # Deployment Environment
        self.DEPLOY_ENV = get_env('DEPLOY_ENV')

        # Storage Configuration
        self.STORAGE_LOCAL_PATH = get_env('STORAGE_LOCAL_PATH')
        self.STORAGE_TYPE = get_env('STORAGE_TYPE')

        # ------------------------
        # Database Configurations.
        # ------------------------
        db_credentials = {
            key: get_env(key) for key in
            ['DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_DATABASE']
        }
        self.SQLALCHEMY_DATABASE_URI_SCHEME = get_env('SQLALCHEMY_DATABASE_URI_SCHEME')

        self.SQLALCHEMY_DATABASE_URI = f"{self.SQLALCHEMY_DATABASE_URI_SCHEME}://{db_credentials['DB_USERNAME']}:{db_credentials['DB_PASSWORD']}@{db_credentials['DB_HOST']}:{db_credentials['DB_PORT']}/{db_credentials['DB_DATABASE']}"

        # ------------------------
        # External API and Tokens
        # ------------------------
        self.AUTH_TOKEN = get_env('AUTH_TOKEN')
        self.AUTH_TOKEN_CHART = get_env('AUTH_TOKEN_CHART')

        # Superset Auth Token
        self.SUPERSET_AUTH_TOKEN = get_env('SUPERSET_AUTH_TOKEN')

        # Swagger UI Configuration
        self.SWAGGER_UI_ENABLED = True
        self.SWAGGER_UI_DOC_EXPANSION = 'list'

