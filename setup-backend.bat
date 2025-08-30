@echo off
echo Setting up Jan Seva Backend...
echo.

echo Step 1: Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo Step 2: Creating .env file...
if not exist .env (
    echo Creating .env file with default values...
    (
        echo # Database
        echo DATABASE_URL="postgresql://postgres:password@localhost:5432/janseva_db"
        echo.
        echo # JWT Secret
        echo JWT_SECRET="janseva-super-secret-jwt-key-2024"
        echo.
        echo # Cloudinary ^(Free alternative to AWS S3^)
        echo CLOUDINARY_CLOUD_NAME="your-cloud-name"
        echo CLOUDINARY_API_KEY="your-api-key"
        echo CLOUDINARY_API_SECRET="your-api-secret"
        echo.
        echo # Server
        echo PORT=5000
        echo NODE_ENV="development"
        echo.
        echo # ML Model API ^(Free Hugging Face alternative^)
        echo HUGGINGFACE_API_KEY="your-huggingface-api-key"
        echo.
        echo # Email ^(Free alternative - Gmail SMTP^)
        echo EMAIL_USER="your-email@gmail.com"
        echo EMAIL_PASS="your-app-password"
    ) > .env
    echo .env file created successfully!
) else (
    echo .env file already exists!
)

echo.
echo Step 3: Database setup instructions...
echo.
echo IMPORTANT: You need to set up PostgreSQL database:
echo 1. Install PostgreSQL from: https://www.postgresql.org/download/windows/
echo 2. Create a database named 'janseva_db'
echo 3. Update the DATABASE_URL in .env file with your credentials
echo.
echo OR use Docker to run PostgreSQL:
echo docker run --name postgres-janseva -e POSTGRES_PASSWORD=password -e POSTGRES_DB=janseva_db -p 5432:5432 -d postgres:15
echo.

echo Step 4: After database setup, run these commands:
echo cd backend
echo npm run db:generate
echo npm run db:migrate
echo npm run dev
echo.

echo Setup complete! Please configure your .env file and database before running.
pause
