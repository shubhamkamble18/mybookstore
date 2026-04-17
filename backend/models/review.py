from datetime import datetime
from . import db

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=5)
    text = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(50), default="Reader")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "rating": self.rating,
            "text": self.text,
            "role": self.role,
            "created_at": self.created_at.isoformat()
        }
