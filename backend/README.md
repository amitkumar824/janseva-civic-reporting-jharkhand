# 🏛️ Jan Seva Civic Reporting System

A comprehensive civic engagement platform for Indian cities, built with modern web technologies and AI-powered features.

## 🌟 Features

### 🎯 Core Functionality
- **Multi-language Support**: Hindi and English interface
- **User Management**: Citizen, Admin, and Department roles
- **Issue Reporting**: Photo upload, location tracking, voice recording
- **Real-time Updates**: Live notifications and status tracking
- **AI Integration**: ML-powered issue classification and priority detection

### 🤖 AI & ML Features
- **Image Analysis**: Automatic issue categorization using Hugging Face models
- **Text Processing**: Sentiment analysis and urgency detection
- **Smart Routing**: Automatic department assignment
- **Priority Assessment**: ML-powered priority determination

### 🔐 Security & Performance
- **JWT Authentication**: Secure user sessions
- **Role-based Access**: Granular permissions
- **Rate Limiting**: API protection
- **Input Validation**: Comprehensive data sanitization

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** database with **Prisma ORM**
- **JWT** authentication
- **Socket.io** for real-time features

### AI & ML
- **Hugging Face API** (free alternative to paid services)
- **Cloudinary** for image hosting (free alternative to AWS S3)
- **Custom ML models** for civic issue classification

### Infrastructure
- **Docker** for containerization
- **PostgreSQL** for data persistence
- **Real-time WebSocket** communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker (optional)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd janseva-civic-reporting-jharkand
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Set up database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
# In the root directory
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/janseva_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Cloudinary (Free image hosting)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=5000
NODE_ENV="development"

# ML Model API (Free Hugging Face alternative)
HUGGINGFACE_API_KEY="your-huggingface-api-key"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Free Service Setup

#### 1. Cloudinary (Image Hosting)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get your cloud name, API key, and secret
4. Add to backend `.env` file

#### 2. Hugging Face (ML Models)
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for free account
3. Go to Settings → Access Tokens
4. Create new token
5. Add to backend `.env` file

#### 3. PostgreSQL Database
**Option A: Local Installation**
```bash
# Install PostgreSQL
# Create database
createdb janseva_db
```

**Option B: Free Cloud Hosting**
- [Supabase](https://supabase.com) - Free tier
- [Neon](https://neon.tech) - Free tier
- [Railway](https://railway.app) - Free tier

## 🐳 Docker Deployment

### Quick Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individually
docker build -t janseva-backend ./backend
docker build -t janseva-frontend .

docker run -p 5000:5000 janseva-backend
docker run -p 5173:5173 janseva-frontend
```

### Docker Compose
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: janseva_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/janseva_db
      JWT_SECRET: your-jwt-secret
      CLOUDINARY_CLOUD_NAME: your-cloud-name
      CLOUDINARY_API_KEY: your-api-key
      CLOUDINARY_API_SECRET: your-api-secret
    depends_on:
      - postgres

  frontend:
    build: .
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:5000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Issue Management
- `GET /api/issues` - Get all issues (with filtering)
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue by ID
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `POST /api/issues/:id/images` - Upload images
- `POST /api/issues/:id/comments` - Add comment

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `GET /api/users/issues` - Get user's issues

### Admin Functions
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/issues/:id/assign` - Assign issue
- `PUT /api/admin/issues/:id/status` - Update issue status
- `GET /api/admin/analytics` - Get analytics data

### Real-time Features
- WebSocket connection for live updates
- Real-time notifications
- Live issue status updates
- Instant comment notifications

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

### API Testing
```bash
# Health check
curl http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📊 Database Schema

The system uses the following main entities:
- **Users**: Citizens, admins, department staff
- **Issues**: Civic problems reported by citizens
- **Comments**: Discussion on issues
- **IssueUpdates**: Status change history
- **Notifications**: Real-time updates

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Security headers with helmet
- Role-based access control

## 🚀 Production Deployment

### Environment Setup
```bash
# Set production environment
export NODE_ENV=production
export PORT=5000

# Use environment-specific .env files
cp .env.production .env
```

### Database Migration
```bash
cd backend
npm run db:migrate
npm run db:generate
```

### Build and Start
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
npm run build
npm run preview
```

### PM2 Process Management
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start dist/index.js --name "janseva-backend"

# Start frontend
pm2 start npm --name "janseva-frontend" -- run preview
```

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

#### 2. Prisma Errors
```bash
cd backend
npm run db:generate
npm run db:migrate
```

#### 3. Image Upload Issues
- Verify Cloudinary credentials
- Check image file size and format
- Ensure CLOUDINARY_* env vars are set

#### 4. AI Service Errors
- Check Hugging Face API key
- Verify internet connection
- Check API rate limits

#### 5. Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Logs and Debugging
```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
npm run dev

# Check browser console for frontend errors
# Check terminal for backend errors
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication system
- [x] Issue reporting and management
- [x] Basic AI integration
- [x] Multi-language support

### Phase 2: Advanced Features 🚧
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] SMS/Email notifications

### Phase 3: Enterprise Features 📋
- [ ] Advanced ML models
- [ ] Performance monitoring
- [ ] Advanced security features
- [ ] API rate limiting and quotas

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs for errors
4. Verify environment configuration
5. Create an issue on GitHub

## 🙏 Acknowledgments

- **Hugging Face** for free ML model APIs
- **Cloudinary** for free image hosting
- **PostgreSQL** for robust database
- **React** and **Node.js** communities

---

**Built with ❤️ for Indian cities and civic engagement**
