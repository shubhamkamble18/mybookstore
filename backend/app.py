from flask import Flask
from flask_cors import CORS
from config import Config
from routes import products, orders, payments, auth, admin, reviews
from models import db
from middleware import verify_firebase_token


app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)

# Check for Firebase configuration and log status
if not Config.FIREBASE_PRIVATE_KEY.strip() or not Config.FIREBASE_CLIENT_EMAIL.strip():
    print("AUTH: Firebase keys missing. Backend is running in [DEVELOPMENT BYPASS] mode.")
else:
    print("AUTH: Firebase keys found. Backend is running in [SECURE] mode.")

# Initialize extensions
db.init_app(app)

# Ensure tables are created (especially important for deployment)
with app.app_context():
    db.create_all()
    print("Database tables verified/created.")

# Apply global authentication middleware
@app.before_request
def global_auth():
    return verify_firebase_token()

# Register blueprints
app.register_blueprint(products.bp, url_prefix="/api/products")
app.register_blueprint(orders.bp, url_prefix="/api/orders")
app.register_blueprint(payments.bp, url_prefix="/api/payments")
app.register_blueprint(auth.bp, url_prefix="/api/auth")
app.register_blueprint(admin.bp, url_prefix="/api/admin")
app.register_blueprint(reviews.bp, url_prefix="/api/reviews")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
