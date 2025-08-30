@echo off
echo ========================================
echo Setting up Supabase Database
echo ========================================
echo.
echo Follow these steps to set up your Supabase database:
echo.
echo 1. Go to: https://bwipwzxjjnjhpaiiucrw.supabase.co
echo 2. Sign in to your Supabase account
echo 3. Go to SQL Editor in the left sidebar
echo 4. Click "New Query"
echo 5. Copy the contents of: backend\supabase-setup.sql
echo 6. Paste it into the SQL editor
echo 7. Click "Run" to execute the SQL
echo.
echo This will create all the necessary tables for your system.
echo.
echo After running the SQL, press any key to test the backend...
pause

echo.
echo Testing backend connection to Supabase...
cd backend
npm run dev
