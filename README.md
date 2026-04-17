# MyBookstore

A modern, full-stack book e-commerce platform built with React, Flask, and Stripe payments. Ready for full commercial deployment with responsive UI, cart management, user authentication, and secure checkout flow.

## 📁 Project Structure

```
mybookstore/
├── frontend/                   # React + Vite application
│   ├── src/                    # Frontend source code
│   │   ├── api/                # Axios API helpers
│   │   ├── components/         # Reusable React components
│   │   ├── context/            # React Context providers (Cart, Auth)
│   │   ├── pages/              # Route views (Home, Cart, Checkout, etc)
│   │   └── utils/              # Helper functions (e.g. currency formatter)
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Python + Flask REST API
│   ├── instance/               # SQLite database (Development)
│   ├── models/                 # SQLAlchemy ORM models
│   ├── routes/                 # Flask blueprints (Auth, Orders, Products, Payments)
│   ├── app.py                  # Backend application entry point
│   ├── config.py               # Environment configuration
│   └── requirements.txt
│
├── docs/                       # Project documentation
│   └── PROJECT_STRUCTURE.md    # Detailed architectural guide
│
├── package.json                # Root workspace configuration
└── .env                        # Environment variables (Root)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Stripe Account (for payment processing)
- Firebase Account (for Google/Email authentication)

### Installation

1. **Clone the repository and install all dependencies:**
```bash
npm run install:all
```
*(This triggers `npm install` for the root workspace, the frontend, and runs `pip install` for the backend).*

2. **Environment Variables Config:**
Create `.env` inside the root and `backend/` directories referring to `.env.example`.

### Development & Bootstrapping
You can start both the frontend Vite server and the backend Flask API concurrently from the root directory:

```bash
npm start
```

*Alternatively, run them separately:*
```bash
npm run dev:frontend    # Starts React (Vite)
npm run dev:backend     # Starts Flask server
```

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Stripe Elements, Firebase Client SDK, Lucide React
- **Backend**: Python, Flask, Flask-SQLAlchemy, Stripe API, Firebase Admin SDK
- **Database**: SQLite (Local Dev) / PostgreSQL (Production ready)

## 📚 Documentation

For an in-depth understanding of the app architecture, logic patterns, and design choices, refer to:
- [📖 Project Architecture & Structure](docs/PROJECT_STRUCTURE.md)

## 📄 License
This project is licensed under the MIT License.
