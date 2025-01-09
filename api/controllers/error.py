from libs.exception import BaseHTTPException


class NoFileUploadedError(BaseHTTPException):
    error_code = "no_file_uploaded"
    description = "Please upload your file."
    code = 400


class FileTooLargeError(BaseHTTPException):
    error_code = "file_too_large"
    description = "File size exceeded. {message}"
    code = 413


class UnsupportedFileTypeError(BaseHTTPException):
    error_code = "unsupported_file_type"
    description = "File type not allowed."
    code = 415


class DatasetDescriptionNotFoundError(BaseHTTPException):
    error_code = "dataset_description_not_found"
    description = "Dataset description not found."
    code = 404
    
    
    
class DatabaseTransactionError(BaseHTTPException):
    error_code = "database_transaction_error"
    description = "A database transaction error occurred."
    code = 500


class ChartProcessingError(BaseHTTPException):
    error_code = "chart_processing_error"
    description = "Failed to process chart request."
    code = 500


class InvalidResponseFormatError(BaseHTTPException):
    error_code = "invalid_response_format"
    description = "The response from the API could not be parsed as JSON."
    code = 500
    
class InvalidRequestError(BaseHTTPException):
    error_code = "invalid_request"
    description = "Request must be a list of dataset descriptions"
    code = 400
    
    
class LLMAPIError(BaseHTTPException):
    error_code = "llm_api_error"
    description = "Error from LLM API"
    code = 500

class DatasetUpdateError(BaseHTTPException):
    error_code = "update_failed"
    description = "Failed to update dataset description: {message}"
    code = 500

class InvalidColumnsFormatError(BaseHTTPException):
    error_code = "invalid_description"
    description = "Invalid columns format. Each column must include columnName, columnDescription, and columnDataDescription."
    code = 400

class MissingFieldsError(BaseHTTPException):
    error_code = "invalid_request"
    description = "Missing required fields: datasetId and columns"
    code = 400

class ChartNotFoundError(BaseHTTPException):
    error_code = "chart_not_found"
    description = "Chart with specified ID not found."
    code = 404

class ChartExecutionError(BaseHTTPException):
    error_code = "chart_execution_error"
    description = "Error executing chart query: {message}"
    code = 500