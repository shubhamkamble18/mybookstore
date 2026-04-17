from app import app
from models import db
from models.product import Product
from models.order import Order, OrderItem

with app.app_context():
    db.create_all()
    print("Database initialized successfully!")
