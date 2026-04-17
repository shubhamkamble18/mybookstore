from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models here to ensure they are registered with the db instance
from .product import Product
from .order import Order, OrderItem
from .review import Review
