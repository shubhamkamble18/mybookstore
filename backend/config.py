import os
# Load environment variables from .env file in the same directory as this file
basedir = os.path.abspath(os.path.dirname(__file__))
from dotenv import load_dotenv
load_dotenv(os.path.join(basedir, '.env'))


class Config:
    # Database URL, e.g. postgres://user:pass@host:port/dbname
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL") or "sqlite:///mybookstore.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Stripe secret key for payments
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
    # Firebase service account details (JSON string components)
    FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
    FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL")
    FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
    
    # Development Bypass
    DEVELOPMENT_MODE = os.getenv("DEVELOPMENT_MODE", "False").lower() == "true"
