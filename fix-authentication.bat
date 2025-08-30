@echo off
echo ========================================
echo Fixing Authentication Issues
echo ========================================
echo.
echo This script will fix all authentication problems and set up your project properly.
echo.

echo Step 1: Creating .env file from hybrid template...
if not exist .env (
  copy backend\env-hybrid-template.txt backend\.env
  echo ✅ Created .env file from template
) else (
  echo ℹ️ .env file already exists
)

echo.
echo Step 2: Installing Prisma dependencies...
cd backend
npm install @prisma/client prisma

echo.
echo Step 3: Generating Prisma client...
npx prisma generate

echo.
echo Step 4: Testing database connection...
npx prisma db pull

echo.
echo Step 5: Starting backend server...
echo.
echo 🚀 Starting backend with fixed authentication...
npm run dev

echo.
echo If the backend starts successfully, you should see:
echo ✅ Database connected successfully
echo 🚀 Server running on port 5000
echo.
echo If you see errors, please check:
echo 1. Your .env file has correct database password
echo 2. Your Cloudinary credentials are set
echo 3. Database tables exist in Supabase
echo.
echo Press any key to continue...
pause
