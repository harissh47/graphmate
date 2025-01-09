from . import StringUUID
from extensions.database import db
import uuid

class GraphmatesDatasetDesc(db.Model):
    __tablename__ = "graphmates_dataset_desc"
    __table_args__ = (db.PrimaryKeyConstraint("id", name="graphmates_dataset_desc_pkey"),)

    id = db.Column(StringUUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    file_id = db.Column(StringUUID, db.ForeignKey('graphmates_upload_files.id'), nullable=False)
    user_id = db.Column(db.String(255), nullable=False)
    data = db.Column(db.JSON, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, server_default=db.text("CURRENT_TIMESTAMP")
    )
