from flask import Blueprint, request, jsonify
import stripe
from config import Config
from models.order import Order, db
from models.product import Product

bp = Blueprint('payments', __name__)
stripe.api_key = Config.STRIPE_SECRET_KEY

@bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    data = request.json
    amount = data.get('amount')
    order_id = data.get('order_id')
    
    if not amount or not order_id:
        return jsonify({'error': 'Amount and order_id are required'}), 400
    
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100), # Stripe expects smallest currency unit (paise for INR)
            currency='inr',
            automatic_payment_methods={'enabled': True},
            metadata={'order_id': order_id}
        )
        return jsonify({'clientSecret': intent.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = Config.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        order_id = intent.get('metadata', {}).get('order_id')
        
        if order_id:
            order = Order.query.get(order_id)
            if order and order.status != 'paid':
                order.status = 'paid'
                
                # Automated Stock Reduction
                for item in order.items:
                    try:
                        # Only reduce stock if product_id is a numeric local ID
                        product_id_int = int(item.product_id)
                        product = Product.query.get(product_id_int)
                        if product:
                            product.stock -= item.quantity
                    except (ValueError, TypeError):
                        # Skip external products (e.g. Google Books IDs)
                        continue
                
                db.session.commit()
                print(f"✅ Order {order_id} fulfilled and stock reduced.")

    return jsonify({'status': 'success'}), 200
