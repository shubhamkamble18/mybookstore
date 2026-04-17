from flask import Blueprint, request, jsonify
from models.order import Order, OrderItem, db


bp = Blueprint('orders', __name__)

@bp.route('/', methods=['POST'])
def create_order():
    data = request.json or {}
    total_amount = data.get('total_amount', 0)
    items_data = data.get('items', [])

    try:
        # Create the main order
        order = Order(
            user_id=request.user['uid'], 
            total_amount=total_amount
        )
        db.session.add(order)
        db.session.flush() # Get the order ID before committing

        # Create individual items
        for item in items_data:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.get('product_id'),
                quantity=item.get('quantity'),
                price=item.get('price')
            )
            db.session.add(order_item)

        db.session.commit()
        return jsonify(order.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route('/', methods=['GET'])
def list_user_orders():
    user_id = request.user['uid']
    orders = Order.query.filter_by(user_id=user_id).all()
    return jsonify([o.to_dict() for o in orders])
