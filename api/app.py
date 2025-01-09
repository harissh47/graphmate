import json
import logging

from flask import Flask, Response, request, jsonify
from flask_cors import CORS


from controllers import bp as chart_api_bp

from extensions import database, storage
from extensions.database import db

from models.dataset import GraphmatesDatasetDesc
from models.files import UploadFile
from models.database_connection import DatabaseConnection
from models.dataset_relations import GraphmatesDatasetRelations
from models.chart import GraphmatesChart

# from utils.error import NoAuthCookieError, InvalidAuthCookieError
# from utils.superset_auth import validate_superset_cookie

from config import Config
from controllers.swagger import swagger_ui_blueprint, spec
from controllers.swagger_paths import register_swagger_paths


class ChartBackend(Flask):
    pass


def create_app() -> Flask:
    app = ChartBackend(__name__)
    app.config.from_object(Config())

    app.secret_key = app.config["SECRET_KEY"]

    logging.basicConfig(
        level=app.config.get("LOG_LEVEL"),
        format=app.config.get("LOG_FORMAT"),
        datefmt=app.config.get("LOG_DATEFORMAT"),
    )
    
    database.init_app(app)
    # ext_migrate.init_app(app)
    storage.init_app(app)

    CORS(
        chart_api_bp,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-App-Code"],
        methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
        expose_headers=["X-Version", "X-Env"],
    )

    app.register_blueprint(chart_api_bp)
    
    # Add Swagger UI blueprint
    app.register_blueprint(swagger_ui_blueprint)
    
    # Add endpoint to serve OpenAPI spec
    @app.route('/static/swagger.json')
    def create_swagger_spec():
        return jsonify(spec.to_dict())
    
    # Register API routes with Swagger
    with app.test_request_context():
        register_swagger_paths(spec)
    
    
    
    # @app.before_request
    # def authenticate_request():
    #     # Skip authentication for health check endpoint
    #     if request.endpoint == 'health':
    #         return
            
    #     cookie = request.cookies.get('session')
    #     if not cookie:
    #         raise NoAuthCookieError()
            
    #     try:
    #         user_data = validate_superset_cookie(cookie)
    #         request.user = user_data
    #     except Exception as e:
    #         raise InvalidAuthCookieError()

    return app


app = create_app()


@app.after_request
def after_request(response):
    """Add Version headers to the response."""
    response.set_cookie("remember_token", "", expires=0)
    response.headers.add("X-Version", app.config["CURRENT_VERSION"])
    response.headers.add("X-Env", app.config["DEPLOY_ENV"])
    return response


@app.route("/health")
def health():
    return Response(
        json.dumps({"status": "ok", "version": app.config["CURRENT_VERSION"]}),
        status=200,
        content_type="application/json",
    )


if __name__ == "__main__":
    # with app.app_context():
    #     print("Creating tables...")
    #     db.create_all()
    app.run(host="0.0.0.0", port=8321, debug=True)
