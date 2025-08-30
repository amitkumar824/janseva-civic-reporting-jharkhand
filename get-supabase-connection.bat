@echo off
echo Getting Supabase Database Connection String...
echo.
echo Please follow these steps:
echo.
echo 1. Go to: https://bwipwzxjjnjhpaiiucrw.supabase.co
echo 2. Sign in to your Supabase account
echo 3. Go to Settings ^> Database
echo 4. Copy the "Connection string" (URI format)
echo 5. It should look like:
echo    postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
echo.
echo 6. You'll also need your database password from the same page
echo.
echo Once you have the connection string, I'll help you create the .env file.
echo.
pause
