@echo off
echo ========================================
echo Updating Your .env File
echo ========================================
echo.
echo You need to update your .env file with real credentials.
echo.
echo Current .env file location: backend\.env
echo.
echo You need to replace these values:
echo.
echo 1. DATABASE_URL: Replace [YOUR_DATABASE_PASSWORD] with your Supabase database password
echo 2. CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
echo 3. CLOUDINARY_API_KEY: Your Cloudinary API key  
echo 4. CLOUDINARY_API_SECRET: Your Cloudinary API secret
echo.
echo To get your Supabase database password:
echo 1. Go to: https://bwipwzxjjnjhpaiiucrw.supabase.co
echo 2. Sign in and go to Settings ^> Database
echo 3. Copy the database password (not the API key)
echo.
echo After updating the .env file, run:
echo setup-complete-project.bat
echo.
echo Press any key to open the .env file for editing...
pause

echo.
echo Opening .env file for editing...
notepad backend\.env

echo.
echo After you've updated the .env file, press any key to continue...
pause

echo.
echo Now let's test if the backend can start:
echo.
echo Testing backend startup...
cd backend
npm run dev
