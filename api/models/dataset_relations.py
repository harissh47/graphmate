from . import StringUUID
from extensions.database import db
import uuid
from sqlalchemy.dialects.postgresql import ARRAY
import json
from datetime import datetime, UTC

class GraphmatesDatasetRelations(db.Model):
    __tablename__ = "graphmates_dataset_relations"
    __table_args__ = (db.PrimaryKeyConstraint("id", name="graphmates_dataset_relations_pkey"),)

    id = db.Column(StringUUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=True)
    dataset_ids = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    @property
    def dataset_ids_list(self):
        return json.loads(self.dataset_ids)

    @dataset_ids_list.setter
    def dataset_ids_list(self, value):
        self.dataset_ids = json.dumps(value)