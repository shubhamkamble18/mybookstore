from flask import Blueprint, request, jsonify
from models.review import Review, db

bp = Blueprint('reviews', __name__)

@bp.route('/', methods=['GET'])
def list_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])

@bp.route('/', methods=['POST'])
def create_review():
    data = request.json
    
    if not data or not data.get('name') or not data.get('text'):
        return jsonify({"error": "Name and text are required"}), 400
        
    review = Review(
        name=data.get('name'),
        rating=data.get('rating', 5),
        text=data.get('text'),
        role=data.get('role', 'Reader')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201
