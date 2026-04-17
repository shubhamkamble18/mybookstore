from flask import Blueprint, request, jsonify
from models.order import Order
from models.product import Product
from models.user import User
from models import db
from sqlalchemy import func

bp = Blueprint('admin', __name__)

@bp.route('/stats', methods=['GET'])
def get_stats():
    # Only allow if the user is an admin
    if not request.user.get('admin'):
        return jsonify({"error": "Admin access required"}), 403
    
    total_orders = Order.query.count()
    # sum(total_amount) for 'paid' orders only to match Stripe
    total_revenue = db.session.query(func.sum(Order.total_amount)).filter(Order.status == 'paid').scalar() or 0
    total_products = Product.query.count()
    total_customers = User.query.filter_by(role='customer').count()
    
    # Calculate revenue for the last 7 days with zero-filling
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()
    seven_days_ago = today - timedelta(days=6)
    
    # Fetch real Revenue data
    daily_revenue_query = db.session.query(
        func.date(Order.created_at).label('date'),
        func.sum(Order.total_amount).label('revenue')
    ).filter(Order.created_at >= seven_days_ago, Order.status == 'paid')\
     .group_by(func.date(Order.created_at)).all()
    
    # Convert query results to a searchable dict: { 'YYYY-MM-DD': revenue }
    revenue_dict = {str(d.date): float(d.revenue) for d in daily_revenue_query}
    
    # Generate FULL 7-day range (filling zeros where data is missing)
    revenue_chart_data = []
    for i in range(7):
        current_date = seven_days_ago + timedelta(days=i)
        date_str = str(current_date)
        revenue_chart_data.append({
            "date": current_date.strftime("%b %d"), # Formatting for frontend: "Mar 30"
            "revenue": revenue_dict.get(date_str, 0.0)
        })
    
    # Top 5 most expensive books in inventory
    top_books = Product.query.order_by(Product.price.desc()).limit(5).all()
    
    return jsonify({
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "total_products": total_products,
        "total_customers": total_customers,
        "revenue_chart_data": revenue_chart_data,
        "top_books": [b.to_dict() for b in top_books]
    })

@bp.route('/orders', methods=['GET'])
def list_all_orders():
    if not request.user.get('admin'):
        return jsonify({"error": "Admin access required"}), 403
        
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders])

@bp.route('/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    if not request.user.get('admin'):
        return jsonify({"error": "Admin access required"}), 403
        
    data = request.json
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
        
    order = Order.query.get_or_404(order_id)
    order.status = new_status
    db.session.commit()
    
    return jsonify(order.to_dict())
