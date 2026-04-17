from flask import Blueprint, request, jsonify
from models.product import Product, db

bp = Blueprint('products', __name__)

@bp.route('/', methods=['GET'])
def list_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@bp.route('/', methods=['POST'])
def create_product():
    if not request.user.get('admin'):
        return jsonify({"error": "Admin access required"}), 403
        
    data = request.json
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    if not request.user.get('admin'):
        return jsonify({"error": "Admin access required"}), 403
        
    data = request.json
    product = Product.query.get_or_404(product_id)
    for key, value in data.items():
        setattr(product, key, value)
    db.session.commit()
    return jsonify(product.to_dict())

@bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    if not request.user.get('admin'):
        return jsonify({"error": "Admin access required"}), 403
        
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return '', 204
