@echo off
REM Quick Start Script for MyBookstore Monorepo (Windows)

echo.
echo ========================================
echo  MyBookstore - Monorepo Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

echo [OK] Node.js and Python found
echo.

REM Install dependencies
echo Installing dependencies...
echo.

echo 1/3 Root packages...
call npm install

echo.
echo 2/3 Frontend packages...
call npm install --workspace=frontend

echo.
echo 3/3 Backend packages...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo.
echo [OK] All dependencies installed!
echo.
echo Next steps:
echo.
echo   Option 1: Start everything
echo   ^> npm start
echo.
echo   Option 2: Start frontend only
echo   ^> npm run dev:frontend
echo.
echo   Option 3: Start backend only
echo   ^> npm run dev:backend
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
echo Happy coding!
echo.
pause
