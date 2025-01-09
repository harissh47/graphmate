from controllers.swagger import (
    spec,
    DatasetUpdateSchema,
    ChartResponseSchema,
    ChartExecuteRequestSchema,
    ChartExecuteResponseSchema,
    ErrorSchema
)
from controllers.dataset import DatasetApi, DatasetChartApi, DatasetChartExecuteApi, DatasetChartBookmarkApi, DatasetChartUnbookmarkApi, ShowDetailsOfBookMark
from controllers.file import FileApi

def register_swagger_paths(spec):
    """Register all API paths with Swagger"""

    # Dataset Update endpoint
    
    
    # File Upload endpoint
    spec.path(
        path='/files/upload',
        operations={
            'post': {
                'tags': ['Files'],
                'summary': 'Upload a file',
                'description': 'Upload a file and process it to create a dataset',
                'requestBody': {
                    'content': {
                        'multipart/form-data': {
                            'schema': {
                                'type': 'object',
                                'properties': {
                                    'file': {
                                        'type': 'string',
                                        'format': 'binary'
                                    },
                                    'dataset_relation_id': {
                                        'type': 'string',
                                        'example': 'relation_123'
                                    }
                                },
                                'required': ['file']
                            }
                        }
                    }
                },
                'responses': {
                    '201': {
                        'description': 'File uploaded and processed successfully',
                        'content': {
                            'application/json': {
                                'example': {
                                    'dataset_relation_id': 'relation_123',
                                    'table_name': 'sales_20240101',
                                    'db_type': 'MYSQL+PYMYSQL'
                                }
                            }
                        }
                    },
                    '400': {
                        'description': 'No file uploaded',
                        'content': {
                            'application/json': {
                                'schema': ErrorSchema
                            }
                        }
                    }
                }
            }
        }
    )
    
    
    spec.path(
        path='/api/dataset/update',
        operations={
            'put': {
                'tags': ['Dataset'],
                'summary': 'Update dataset description',
                'description': 'Update dataset description and column metadata',
                'requestBody': {
                    'content': {
                        'application/json': {
                            'schema': DatasetUpdateSchema
                        }
                    }
                },
                'responses': {
                    '200': {
                        'description': 'Dataset updated successfully',
                        'content': {
                            'application/json': {
                                'example': {
                                    'message': 'Data Updated',
                                    'status': 'success'
                                }
                            }
                        }
                    },
                    '400': {
                        'description': 'Invalid request format',
                        'content': {
                            'application/json': {
                                'schema': ErrorSchema
                            }
                        }
                    }
                }
            }
        }
    )

    # Chart Generation endpoint
    spec.path(
        path='/api/dataset/chart',
        operations={
            'post': {
                'tags': ['Charts'],
                'summary': 'Generate chart suggestions',
                'description': 'Generate chart suggestions using LLM',
                'requestBody': {
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'array',
                                'items': DatasetUpdateSchema
                            }
                        }
                    }
                },
                'responses': {
                    '200': {
                        'description': 'Chart suggestions generated successfully',
                        'content': {
                            'application/json': {
                                'schema': ChartResponseSchema
                            }
                        }
                    }
                }
            }
        }
    )

    # Chart Data Generation endpoint
    spec.path(
        path='/api/dataset/generate-data',
        operations={
            'post': {
                'tags': ['Charts'],
                'summary': 'Execute chart query',
                'description': 'Execute chart query and get formatted data',
                'requestBody': {
                    'content': {
                        'application/json': {
                            'schema': ChartExecuteRequestSchema
                        }
                    }
                },
                'responses': {
                    '200': {
                        'description': 'Chart data generated successfully',
                        'content': {
                            'application/json': {
                                'schema': ChartExecuteResponseSchema
                            }
                        }
                    }
                }
            }
        }
    )

    

    # Bookmark Chart endpoint
    spec.path(
        path='/dataset/chart/bookmark',
        operations={
            'post': {
                'tags': ['Charts'],
                'summary': 'Bookmark a chart',
                'description': 'Bookmark a chart for easy access later',
                'requestBody': {
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'object',
                                'properties': {
                                    'id': {
                                        'type': 'string',
                                        'example': 'chart_456'
                                    }
                                },
                                'required': ['id']
                            }
                        }
                    }
                },
                'responses': {
                    '200': {
                        'description': 'Chart bookmarked successfully',
                        'content': {
                            'application/json': {
                                'example': {
                                    'message': 'Chart bookmarked successfully'
                                }
                            }
                        }
                    }
                }
            }
        }
    )

    # Unbookmark Chart endpoint
    spec.path(
        path='/dataset/chart/unbookmark',
        operations={
            'post': {
                'tags': ['Charts'],
                'summary': 'Unbookmark a chart',
                'description': 'Remove bookmark from a chart',
                'requestBody': {
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'object',
                                'properties': {
                                    'id': {
                                        'type': 'string',
                                        'example': 'chart_456'
                                    }
                                },
                                'required': ['id']
                            }
                        }
                    }
                },
                'responses': {
                    '200': {
                        'description': 'Chart unbookmarked successfully',
                        'content': {
                            'application/json': {
                                'example': {
                                    'message': 'Chart unbookmarked successfully'
                                }
                            }
                        }
                    }
                }
            }
        }
    )

    # Show Details of Bookmarked Charts endpoint
    spec.path(
        path='/dataset/chart/bookmark/details',
        operations={
            'post': {
                'tags': ['Charts'],
                'summary': 'Show details of bookmarked charts',
                'description': 'Retrieve details of all bookmarked charts for a user',
                'requestBody': {
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'object',
                                'properties': {
                                    'user_id': {
                                        'type': 'string',
                                        'example': 'user_123'
                                    }
                                },
                                'required': ['user_id']
                            }
                        }
                    }
                },
                'responses': {
                    '200': {
                        'description': 'Details of bookmarked charts retrieved successfully',
                        'content': {
                            'application/json': {
                                'example': [
                                    {
                                        "name": "Sales Analysis",
                                        "charts": [
                                            {
                                                "id": "chart_456",
                                                "chart_type": "bar",
                                                "sql_query": "SELECT amount, category, date FROM sales",
                                                "llm_prompt": "Generate a bar chart showing sales by category",
                                                "parameters": {
                                                    "value": ["amount"],
                                                    "series": ["category"],
                                                    "category": ["date"]
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    )