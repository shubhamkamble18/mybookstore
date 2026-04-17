from app import app
from models import db
from models.product import Product

def seed():
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()

        # Check if products already exist
        if Product.query.first():
            print("Database already has products.")
            return

        books = [
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "description": "A classic novel set in the 1920s.",
                "price": 15.99,
                "image_url": "https://covers.openlibrary.org/b/id/8225266-L.jpg",
                "stock": 10
            },
            {
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "description": "A powerful story of racial injustice.",
                "price": 12.50,
                "image_url": "https://covers.openlibrary.org/b/id/8226191-L.jpg",
                "stock": 5
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "description": "A dystopian vision of the future.",
                "price": 10.99,
                "image_url": "https://covers.openlibrary.org/b/id/7222246-L.jpg",
                "stock": 20
            },
            {
                "title": "Dune",
                "author": "Frank Herbert",
                "description": "An epic sci-fi adventure on a desert planet.",
                "price": 18.25,
                "image_url": "https://covers.openlibrary.org/b/id/8107412-L.jpg",
                "stock": 15
            },
            {
                "title": "Foundation",
                "author": "Isaac Asimov",
                "description": "The start of a galactic empire saga.",
                "price": 14.75,
                "image_url": "https://covers.openlibrary.org/b/id/8108427-L.jpg",
                "stock": 12
            }
        ]

        for b in books:
            p = Product(**b)
            db.session.add(p)
        
        db.session.commit()
        print("Database seeded successfully with 5 books!")

if __name__ == "__main__":
    seed()
