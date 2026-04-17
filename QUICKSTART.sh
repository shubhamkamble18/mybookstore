#!/bin/bash
# Quick Start Script for MyBookstore Monorepo

echo "🚀 MyBookstore - Monorepo Quick Start"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi

echo "✅ Node.js and Python found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

echo "1️⃣  Root packages..."
npm install

echo ""
echo "2️⃣  Frontend packages..."
npm install --workspace=frontend

echo ""
echo "3️⃣  Backend packages..."
cd backend
python -m venv venv

# Activate venv based on OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

pip install -r requirements.txt
cd ..

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "📝 Next steps:"
echo ""
echo "   Option 1: Start everything"
echo "   $ npm start"
echo ""
echo "   Option 2: Start frontend only"
echo "   $ npm run dev:frontend"
echo ""
echo "   Option 3: Start backend only"
echo "   $ npm run dev:backend"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend: http://localhost:5000"
echo ""
echo "Happy coding! 🎉"
