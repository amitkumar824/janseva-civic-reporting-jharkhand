# Jan Seva Civic Reporting System - Development Setup Script
# This script helps set up both frontend and backend for development

Write-Host "🚀 Setting up Jan Seva Civic Reporting System..." -ForegroundColor Green

# Setup Frontend
Write-Host "📱 Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    Write-Host "Frontend dependencies already installed" -ForegroundColor Gray
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
}
Set-Location ..

# Setup Backend
Write-Host "🔧 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "node_modules") {
    Write-Host "Backend dependencies already installed" -ForegroundColor Gray
} else {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    npm install
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Please copy env.example to .env and configure your environment variables" -ForegroundColor Red
    Write-Host "   cp env.example .env" -ForegroundColor Cyan
} else {
    Write-Host "✅ Environment file found" -ForegroundColor Green
}

Set-Location ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start development:" -ForegroundColor Cyan
Write-Host "  Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "  Backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Make sure to configure your environment variables in backend/.env" -ForegroundColor Yellow
