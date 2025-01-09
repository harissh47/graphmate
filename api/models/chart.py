from extensions.database import db
from datetime import datetime
import uuid

class GraphmatesChart(db.Model):
    __tablename__ = 'graphmates_charts'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chart_type = db.Column(db.String(100), nullable=False)
    parameters = db.Column(db.JSON)
    sql_query = db.Column(db.Text)
    llm_prompt = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    dataset_relation_id = db.Column(db.String(36), nullable=True)
    is_bookmarked = db.Column(db.Boolean, nullable=False, default=False)