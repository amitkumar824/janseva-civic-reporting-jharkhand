# Jan Seva Backend API

A comprehensive backend API for the Jan Seva Civic Reporting System built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Issue Management**: Full CRUD operations for civic issues
- **AI Integration**: ML-powered image analysis and text classification
- **Real-time Updates**: WebSocket integration for live notifications
- **File Upload**: Cloudinary integration for free image hosting
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Rate limiting, input validation, and security headers

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary (free alternative to AWS S3)
- **ML Models**: Hugging Face API (free alternative to paid services)
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Security**: helmet, cors, rate limiting

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🔧 Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
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

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb janseva_db
   
   # Run migrations
   npm run db:migrate
   
   # Generate Prisma client
   npm run db:generate
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Issues
- `GET /api/issues` - Get all issues (with filtering)
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue by ID
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `POST /api/issues/:id/images` - Upload images
- `POST /api/issues/:id/comments` - Add comment

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `GET /api/users/issues` - Get user's issues
- `GET /api/users/assigned-issues` - Get assigned issues

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/issues/:id/assign` - Assign issue
- `PUT /api/admin/issues/:id/status` - Update issue status
- `GET /api/admin/analytics` - Get analytics data

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

## 🔐 Free Service Setup

### 1. Cloudinary (Image Hosting)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get your cloud name, API key, and secret
4. Add to `.env` file

### 2. Hugging Face (ML Models)
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for free account
3. Go to Settings → Access Tokens
4. Create new token
5. Add to `.env` file

### 3. PostgreSQL
1. Install PostgreSQL locally or use free hosting:
   - [Supabase](https://supabase.com) - Free tier
   - [Neon](https://neon.tech) - Free tier
   - [Railway](https://railway.app) - Free tier

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build image
docker build -t janseva-backend .

# Run container
docker run -p 5000:5000 janseva-backend
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

## 📱 Real-time Features

- WebSocket integration for live updates
- Instant notifications for issue status changes
- Real-time issue assignment updates
- Live comment notifications

## 🤖 AI Features

- **Image Analysis**: Automatic issue classification
- **Text Analysis**: Sentiment and urgency detection
- **Smart Routing**: Automatic department assignment
- **Priority Detection**: ML-powered priority assessment

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Health check
curl http://localhost:5000/health
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | No |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Prisma Errors**
   - Run `npm run db:generate`
   - Run `npm run db:migrate`
   - Check Prisma schema

3. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check image file size and format
   - Ensure CLOUDINARY_* env vars are set

4. **AI Service Errors**
   - Check Hugging Face API key
   - Verify internet connection
   - Check API rate limits

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs for errors
4. Verify environment configuration

## 🎯 Next Steps

- [ ] Add comprehensive testing
- [ ] Implement email notifications
- [ ] Add SMS integration
- [ ] Implement advanced analytics
- [ ] Add mobile app API endpoints
- [ ] Implement caching layer
- [ ] Add monitoring and logging
