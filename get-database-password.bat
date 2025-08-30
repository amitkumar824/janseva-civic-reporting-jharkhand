@echo off
echo ========================================
echo Getting Your Supabase Database Password
echo ========================================
echo.
echo Follow these steps to get your database password:
echo.
echo 1. Click the link below to open your Supabase project:
echo    https://bwipwzxjjnjhpaiiucrw.supabase.co
echo.
echo 2. Sign in to your Supabase account
echo.
echo 3. In the left sidebar, click "Settings"
echo.
echo 4. Click "Database" in the settings menu
echo.
echo 5. Look for "Database password" field
echo    (This is different from your API key)
echo.
echo 6. Copy the password (it might be hidden, click "Show" to reveal)
echo.
echo 7. Use this password in your .env file
echo.
echo IMPORTANT: This is your DATABASE password, not the API key!
echo.
echo Press any key to continue...
pause

echo.
echo Now let's create your .env file:
echo.
echo 1. Open: backend\env-supabase-template.txt
echo 2. Copy all the content
echo 3. Create a new file: backend\.env
echo 4. Paste the content
echo 5. Replace [YOUR_DATABASE_PASSWORD] with your actual password
echo 6. Add your Cloudinary credentials
echo.
echo After you've done this, run: setup-complete-project.bat
echo.
pause
