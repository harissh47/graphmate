from flask import Blueprint

from libs.external_api import ExternalApi

bp = Blueprint("chart_api", __name__, url_prefix="/api")
api = ExternalApi(bp)

from . import file, database, dataset