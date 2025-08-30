@echo off
echo Setting up ML Model for Jan Seva...
echo.

echo Step 1: Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3.7+ from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Python dependencies...
cd backend\ml-models
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies!
    echo This might be due to missing Visual C++ build tools
    echo Try: pip install --upgrade pip
    echo Then: pip install -r requirements.txt
    pause
    exit /b 1
)

echo.
echo Step 3: Testing ML model...
python civic_analyzer.py --help
if %errorlevel% neq 0 (
    echo ERROR: ML model test failed!
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo Step 4: Creating temp directory...
cd ..
if not exist temp mkdir temp

echo.
echo ML Model setup completed successfully!
echo.
echo Next steps:
echo 1. Complete Supabase database setup (see SUPABASE_SETUP.md)
echo 2. Update backend\.env file with your credentials
echo 3. Run: cd backend ^&^& npm run db:generate ^&^& npm run db:migrate
echo 4. Start backend: npm run dev
echo 5. Start frontend: npm run dev
echo.
pause
