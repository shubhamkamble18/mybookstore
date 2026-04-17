# mybookstore Flask Backend

This backend provides RESTful APIs for the bookstore application. It is built with Flask, SQLAlchemy, and integrates with Firebase for authentication and Stripe for payments.

## Quick Start (local)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run  # runs on http://127.0.0.1:5000
```

## Folder Structure
```
backend/
├─ app.py
├─ config.py
├─ requirements.txt
├─ .env.example
├─ routes/
│   ├─ __init__.py
│   ├─ products.py
│   ├─ orders.py
│   ├─ payments.py
│   └─ auth.py
└─ models/
    ├─ __init__.py
    ├─ product.py
    ├─ order.py
    └─ user.py
```
"
