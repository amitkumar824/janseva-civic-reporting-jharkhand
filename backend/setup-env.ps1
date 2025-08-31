# Jan Seva Backend - Environment Setup Script
# This script sets up the .env file with development configuration

Write-Host "Setting up Jan Seva Backend Environment..." -ForegroundColor Green

$envContent = @"
# Database
DATABASE_URL="postgresql://janseva_user:janseva_password@localhost:5432/janseva_db"

# JWT Secret
JWT_SECRET="janseva-super-secret-jwt-key-2024-development"

# Cloudinary (Free alternative to AWS S3)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# ML Model API (Free Hugging Face alternative)
HUGGINGFACE_API_KEY="your-huggingface-api-key"

# Email (Free alternative - Gmail SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
"@

# Write the content to .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "Environment file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Update the following values in .env:" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET" -ForegroundColor Cyan
Write-Host "   - HUGGINGFACE_API_KEY (optional for AI features)" -ForegroundColor Cyan
Write-Host "   - EMAIL_USER, EMAIL_PASS (optional for email notifications)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "   1. Start database: docker-compose up -d" -ForegroundColor White
Write-Host "   2. Run migrations: npm run db:migrate" -ForegroundColor White
Write-Host "   3. Start server: npm run dev" -ForegroundColor White

