from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask_swagger_ui import get_swaggerui_blueprint
from marshmallow import Schema, fields

# Create APISpec with more details
spec = APISpec(
    title="Chart Backend API",
    version="1.0.0",
    openapi_version="3.0.2",
    plugins=[MarshmallowPlugin()],
    info={
        "description": "API for chart generation and dataset management",
        "contact": {"email": "support@example.com"}
    },
    servers=[
        {"url": "http://localhost:8321", "description": "Development server"},
    ]
)

# Schema definitions
class ColumnSchema(Schema):
    columnName = fields.Str(required=True, example="sales_amount")
    columnDescription = fields.Str(required=True, example="Total sales amount in USD")
    columnDataDescription = fields.Str(required=True, example="Numeric value representing sales")
    columnDataType = fields.Str(required=True, example="String")

class DatasetUpdateSchema(Schema):
    datasetId = fields.Str(required=True, example="dataset_123")
    columns = fields.List(fields.Nested(ColumnSchema), required=True)
    datasetDescription = fields.Str(example="Sales data for Q1 2024")
    datasetName = fields.Str(example="Sales")
    dataset_relation_id = fields.Str(example="relation_123")
    table_name = fields.Str(example="sales_20240101")
    db_type = fields.Str(example="MYSQL+PYMYSQL")

class ChartParametersSchema(Schema):
    value = fields.List(fields.Str(), example=["amount"])
    series = fields.List(fields.Str(), example=["category"])
    category = fields.List(fields.Str(), example=["date"])

class ChartResponseSchema(Schema):
    id = fields.Str(example="chart_456")
    chart_type = fields.Str(example="bar")
    parameters = fields.Nested(ChartParametersSchema)
    sql_query = fields.Str(example="SELECT amount, category, date FROM sales")
    llm_prompt = fields.Str(example="Generate a bar chart showing sales by category")

class ChartExecuteRequestSchema(Schema):
    id = fields.Str(required=True, example="chart_456")

class ChartExecuteResponseSchema(Schema):
    headers = fields.Dict(example={"value": "amount", "category": "date"})
    data = fields.Dict(
        keys=fields.Str(),
        values=fields.List(fields.Raw()),
        example={
            "value": [1000, 2000, 3000],
            "series": ["A", "B", "C"],
            "category": ["2024-01", "2024-02", "2024-03"],
            "additional": []
        }
    )

class ErrorSchema(Schema):
    error = fields.Str(example="invalid_request")
    message = fields.Str(example="Missing required fields")

# Configure Swagger UI
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger.json'

swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Chart Backend API",
        'deepLinking': True,
        'displayRequestDuration': True,
        'defaultModelsExpandDepth': 3,
        'defaultModelExpandDepth': 3,
        'docExpansion': 'list',
        'showExtensions': True,
        'showCommonExtensions': True
    }
)

# Register schemas
def register_schemas():
    spec.components.schema("Column", schema=ColumnSchema)
    spec.components.schema("DatasetUpdate", schema=DatasetUpdateSchema)
    spec.components.schema("ChartParameters", schema=ChartParametersSchema)
    spec.components.schema("ChartResponse", schema=ChartResponseSchema)
    spec.components.schema("ChartExecuteRequest", schema=ChartExecuteRequestSchema)
    spec.components.schema("ChartExecuteResponse", schema=ChartExecuteResponseSchema)
    spec.components.schema("Error", schema=ErrorSchema)

# Initialize schemas
register_schemas()