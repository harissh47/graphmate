from . import StringUUID
from extensions.database import db
import uuid


class UploadFile(db.Model):
    __tablename__ = "graphmates_upload_files"
    __table_args__ = (db.PrimaryKeyConstraint("id", name="graphmates_upload_file_pkey"),)

    id = db.Column(StringUUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    storage_type = db.Column(db.String(255), nullable=False)
    key = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    extension = db.Column(db.String(255), nullable=False)
    mime_type = db.Column(db.String(255), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, server_default=db.text("CURRENT_TIMESTAMP")
    )
    hash = db.Column(db.String(255), nullable=True)