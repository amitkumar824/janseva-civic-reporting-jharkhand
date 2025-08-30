@echo off
echo ========================================
echo Setting up Database Tables in Supabase
echo ========================================
echo.
echo Follow these steps to create your database tables:
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
echo After running the SQL, come back and run: fix-authentication.bat
echo.
echo Press any key to open the SQL file...
pause

echo.
echo Opening SQL file for you to copy...
notepad backend\supabase-setup.sql

echo.
echo After copying the SQL to Supabase and running it, press any key to continue...
pause

echo.
echo Now run: fix-authentication.bat
echo This will fix all authentication issues and start your backend!
