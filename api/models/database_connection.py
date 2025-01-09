from . import StringUUID
from extensions.database import db
import uuid

class DatabaseConnection(db.Model):
    __tablename__ = "graphmates_database_connections"
    __table_args__ = (db.PrimaryKeyConstraint("id", name="graphmates_database_connections_pkey"),)

    id = db.Column(StringUUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(255), nullable=False)
    db_type = db.Column(db.String(20), nullable=False)
    db_name = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    host = db.Column(db.String(255), nullable=False)
    port = db.Column(db.String(10), nullable=False)
    table_name = db.Column(db.String(255), nullable=False)
    connection_uri = db.Column(db.String(1024), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, server_default=db.text("CURRENT_TIMESTAMP")
    )