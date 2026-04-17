from app import app
from models import db
from models.product import Product
from models.order import Order, OrderItem
from models.user import User
from datetime import datetime, timedelta
import random

def populate():
    with app.app_context():
        print("🚀 Starting Professional Data Seeding...")
        print("⚠️  WARNING: This script generates SIMULATED data for demonstration.")
        print("⚠️  To match Stripe exactly, clear this data and use real checkout flow.")
        
        # 1. Clear existing data for a clean professional look
        db.session.query(OrderItem).delete()
        db.session.query(Order).delete()
        db.session.query(Product).delete()
        db.session.commit()
        print("🧹 Database cleared.")

        # 2. Seed Products (25 Books)
        categories = ["Fiction", "Technology", "History", "Science", "Business", "Self-Help"]
        book_templates = [
            {"title": "The Art of Code", "author": "Julia Syntax", "category": "Technology", "price": 45.99},
            {"title": "Mindful Productivity", "author": "Leo Focus", "category": "Self-Help", "price": 19.50},
            {"title": "Galactic Empires", "author": "Stellar Void", "category": "Fiction", "price": 12.99},
            {"title": "Ancient Echoes", "author": "Dorian Past", "category": "History", "price": 28.00},
            {"title": "Quantum Realms", "author": "Alice Wave", "category": "Science", "price": 32.75},
            {"title": "The Lean Audit", "author": "Mark Ledger", "category": "Business", "price": 55.00},
            {"title": "Pythonic Mastery", "author": "Guido Jr.", "category": "Technology", "price": 39.99},
            {"title": "Silent Valleys", "author": "Emma Green", "category": "Fiction", "price": 14.25},
            {"title": "Robot Ethics", "author": "Isaac Logic", "category": "Science", "price": 24.99},
            {"title": "Wall Street Secrets", "author": "Gordon Cash", "category": "Business", "price": 49.99}
        ]
        
        products = []
        for i in range(25):
            template = random.choice(book_templates)
            p = Product(
                title=f"{template['title']} Vol. {i+1}",
                author=template['author'],
                category=template['category'],
                price=template['price'] + random.uniform(-5, 15),
                description="A high-quality addition to your professional library.",
                stock=random.randint(2, 50),
                image_url=f"https://picsum.photos/seed/{random.randint(1,1000)}/300/450"
            )
            db.session.add(p)
            products.append(p)
        
        db.session.commit()
        print(f"📚 Seeded {len(products)} products.")

        # 3. Seed Orders (50 Orders over 14 days)
        statuses = ["paid", "shipped", "delivered", "pending", "cancelled"]
        
        # Try to get real user IDs from the database if they exist
        existing_users = User.query.all()
        if existing_users:
            uids = [u.firebase_uid for u in existing_users]
            print(f"👤 Using {len(uids)} real user IDs from database.")
        else:
            uids = [f"user_{random.randint(1000, 9999)}_demo" for _ in range(5)]
            print("👤 No real users found. Using realistic mock UIDs.")
        
        now = datetime.utcnow()
        order_count = 0
        
        for i in range(50):
            # Distribute orders over the last 14 days
            days_ago = random.randint(0, 14)
            order_date = now - timedelta(days=days_ago, hours=random.randint(0, 23))
            
            # Weighted statuses (more 'paid' and 'delivered' for better charts)
            status = random.choices(statuses, weights=[40, 20, 20, 15, 5], k=1)[0]
            
            # Create Order
            order = Order(
                user_id=random.choice(uids),
                total_amount=0, # Will calculate
                status=status,
                created_at=order_date
            )
            db.session.add(order)
            db.session.flush() # Get order ID
            
            # Add 1-3 items per order
            total = 0
            for _ in range(random.randint(1, 3)):
                prod = random.choice(products)
                qty = random.randint(1, 2)
                item_price = float(prod.price)
                
                item = OrderItem(
                    order_id=order.id,
                    product_id=str(prod.id),
                    quantity=qty,
                    price=item_price
                )
                db.session.add(item)
                total += item_price * qty
            
            order.total_amount = total
            order_count += 1

        db.session.commit()
        print(f"💳 Seeded {order_count} historical orders.")
        print("✅ Dashboard fully populated with dynamic data!")

if __name__ == "__main__":
    populate()
