@echo off
echo ========================================
echo Setting up Complete Jan Seva Project
echo ========================================
echo.

echo Step 1: Creating .env file...
if not exist backend\.env (
    echo Copying template to .env...
    copy backend\env-supabase-template.txt backend\.env
    echo.
    echo IMPORTANT: Please edit backend\.env and replace:
    echo - [YOUR_DATABASE_PASSWORD] with your Supabase database password
    echo - Cloudinary credentials with your actual values
    echo.
    echo Press any key after you've updated the .env file...
    pause
) else (
    echo .env file already exists!
)

echo.
echo Step 2: Setting up ML Model...
call setup-ml-model.bat
if %errorlevel% neq 0 (
    echo ERROR: ML model setup failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Setting up Backend...
call setup-backend.bat
if %errorlevel% neq 0 (
    echo ERROR: Backend setup failed!
    pause
    exit /b 1
)

echo.
echo Step 4: Setting up Database...
cd backend
echo Generating Prisma client...
npm run db:generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client!
    pause
    exit /b 1
)

echo Running database migrations...
npm run db:migrate
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed!
    echo Please check your .env file and Supabase connection
    pause
    exit /b 1
)

echo.
echo Step 5: Testing the system...
echo Testing ML model...
cd ml-models
python civic_analyzer.py --text "Sadak mein gaddha hai" --output json
if %errorlevel% neq 0 (
    echo WARNING: ML model test failed, but continuing...
)

cd ..
echo.
echo ========================================
echo SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your Jan Seva Civic Reporting System is ready!
echo.
echo To start the system:
echo.
echo Terminal 1 (Backend):
echo cd backend
echo npm run dev
echo.
echo Terminal 2 (Frontend):
echo npm run dev
echo.
echo The system will be available at:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5000
echo.
echo Features available:
echo - User authentication (citizen/admin)
echo - Image upload with AI analysis (your custom ML model)
echo - Speech-to-text support
echo - Hinglish text processing
echo - Real-time notifications
echo - Admin dashboard
echo.
echo Press any key to exit...
pause
