# Jan Seva Backend - SQLite Development Setup Script
# This script sets up the backend with SQLite for easier development

Write-Host "Setting up Jan Seva Backend with SQLite..." -ForegroundColor Green

# Create SQLite environment file
$envContent = @"
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

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

# Copy SQLite schema to main schema
Copy-Item "prisma/schema.sqlite.prisma" "prisma/schema.prisma" -Force

Write-Host "Environment file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Update the following values in .env:" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET" -ForegroundColor Cyan
Write-Host "   - HUGGINGFACE_API_KEY (optional for AI features)" -ForegroundColor Cyan
Write-Host "   - EMAIL_USER, EMAIL_PASS (optional for email notifications)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "   1. Generate Prisma client: npm run db:generate" -ForegroundColor White
Write-Host "   2. Run migrations: npm run db:migrate" -ForegroundColor White
Write-Host "   3. Start server: npm run dev" -ForegroundColor White
