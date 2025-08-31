@echo off
echo Starting Nagar Sahayak Civic Issue Reporting System...
echo.

echo Installing Python dependencies...
cd backend\ml-models
pip install -r requirements.txt
cd ..\..

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm install && npm start"

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:3000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
