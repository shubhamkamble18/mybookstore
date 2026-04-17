from app import app
from models import db
from models.product import Product
from models.order import Order, OrderItem
from models.user import User

def rebuild():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        
        books = [
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "description": "A classic novel set in the 1920s.",
                "price": 15.99,
                "image_url": "https://covers.openlibrary.org/b/id/8225266-L.jpg",
                "category": "Classic",
                "stock": 10
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "description": "A dystopian vision of the future.",
                "price": 10.99,
                "image_url": "https://covers.openlibrary.org/b/id/7222246-L.jpg",
                "category": "Dystopian",
                "stock": 20
            },
            {
                "title": "Dune",
                "author": "Frank Herbert",
                "description": "An epic sci-fi adventure on a desert planet.",
                "price": 18.25,
                "image_url": "https://covers.openlibrary.org/b/id/8107412-L.jpg",
                "category": "Sci-Fi",
                "stock": 15
            }
        ]

        print("Seeding books...")
        for b in books:
            p = Product(**b)
            db.session.add(p)
        
        db.session.commit()
        print(f"Database rebuilt and seeded successfully with {len(books)} books!")

if __name__ == "__main__":
    rebuild()
