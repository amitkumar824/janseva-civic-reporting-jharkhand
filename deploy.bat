@echo off
setlocal enabledelayedexpansion

REM Jan Seva Civic Reporting System - Deployment Script for Windows
REM This script helps you deploy the entire system

echo 🏛️  Jan Seva Civic Reporting System - Deployment Script
echo ========================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [SUCCESS] Docker and Docker Compose are installed

REM Check if required ports are available
netstat -an | findstr ":5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 5000 is already in use. Please free up this port.
) else (
    echo [SUCCESS] Port 5000 is available
)

netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 5173 is already in use. Please free up this port.
) else (
    echo [SUCCESS] Port 5173 is available
)

netstat -an | findstr ":5432" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 5432 is already in use. Please free up this port.
) else (
    echo [SUCCESS] Port 5432 is available
)

REM Setup environment variables
echo [INFO] Setting up environment variables...
if not exist .env (
    copy backend\env.example .env
    echo [WARNING] Created .env file. Please edit it with your configuration.
    echo [INFO] Required variables:
    echo   - CLOUDINARY_CLOUD_NAME
    echo   - CLOUDINARY_API_KEY
    echo   - CLOUDINARY_API_SECRET
    echo   - HUGGINGFACE_API_KEY (optional)
    echo.
    echo Please edit .env file and press any key to continue...
    pause >nul
) else (
    echo [SUCCESS] .env file already exists
)

REM Build and start services
echo [INFO] Building and starting services...

REM Stop existing services
docker-compose down --remove-orphans

REM Build and start
docker-compose up --build -d

echo [SUCCESS] Services started successfully!

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...

REM Wait for PostgreSQL
echo [INFO] Waiting for PostgreSQL...
:wait_postgres
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)
echo [SUCCESS] PostgreSQL is ready

REM Wait for Backend
echo [INFO] Waiting for Backend API...
:wait_backend
curl -f http://localhost:5000/health >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 5 /nobreak >nul
    goto wait_backend
)
echo [SUCCESS] Backend API is ready

REM Wait for Frontend
echo [INFO] Waiting for Frontend...
:wait_frontend
curl -f http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 5 /nobreak >nul
    goto wait_frontend
)
echo [SUCCESS] Frontend is ready

REM Setup database
echo [INFO] Setting up database...
docker-compose exec backend npm run db:generate
docker-compose exec backend npm run db:migrate
echo [SUCCESS] Database setup completed

REM Show service status
echo.
echo [INFO] Service Status:
docker-compose ps

echo.
echo [INFO] Access URLs:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo   Health Check: http://localhost:5000/health
echo   Database: localhost:5432

echo.
echo [SUCCESS] Deployment completed successfully!
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo To cleanup everything: docker-compose down -v --remove-orphans

pause
