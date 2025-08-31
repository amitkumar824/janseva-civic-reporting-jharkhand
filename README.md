# 🏙️ Nagar Sahayak - AI-Powered Civic Issue Reporting System

A comprehensive civic issue reporting platform that uses advanced AI technology to automatically analyze, categorize, and prioritize civic problems. Built with React, Node.js, and Python AI models.

## ✨ Features

### 🤖 AI-Powered Analysis
- **Image Recognition**: Upload photos and AI automatically identifies civic issues
- **Smart Categorization**: Automatic problem classification (Road, Water, Sanitation, etc.)
- **Priority Assessment**: AI determines issue priority based on type and context
- **Department Mapping**: Automatically assigns issues to relevant departments

### 🎤 Voice Recognition
- **Multi-language Support**: Hindi and English voice input
- **Real-time Processing**: Instant speech-to-text conversion
- **Hinglish Support**: Natural language processing for mixed Hindi-English

### 📍 Location Services
- **GPS Integration**: Automatic location detection
- **Interactive Maps**: Click-to-select location functionality
- **Precise Tracking**: Accurate coordinates for issue resolution

### 📱 User-Friendly Interface
- **Bilingual UI**: Full Hindi and English support
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live status tracking and notifications

### 🔧 Admin Features
- **Issue Management**: View, filter, and manage all reported issues
- **Status Updates**: Track progress from submission to resolution
- **Resolution Photos**: Upload before/after photos for resolved issues
- **Analytics Dashboard**: Comprehensive statistics and insights

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nagarSahayak
   ```

2. **Install Python dependencies**
   ```bash
   cd backend/ml-models
   pip install -r requirements.txt
   cd ../..
   ```

3. **Install Node.js dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   cd ..

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

4. **Start the application**
   ```bash
   # Option 1: Use the batch script (Windows)
   start-project.bat

   # Option 2: Manual start
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

## 📁 Project Structure

```
nagarSahayak/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── context/         # React context providers
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                  # Node.js backend server
│   ├── src/
│   │   ├── services/        # Business logic services
│   │   └── index.ts         # Main server file
│   ├── ml-models/           # Python AI models
│   │   ├── enhanced_civic_analyzer.py
│   │   ├── sih2k25.ipynb
│   │   └── requirements.txt
│   └── package.json
└── README.md
```

## 🤖 AI Models

### Enhanced Civic Analyzer
- **BLIP Model**: Image captioning and analysis
- **Whisper Model**: Speech-to-text conversion
- **Custom Logic**: Problem identification and categorization
- **Hinglish Support**: Hindi-English mixed language processing

### Supported Issue Types
- 🛣️ **Road Issues**: Potholes, road damage, traffic problems
- 💡 **Street Light Issues**: Broken lights, electrical problems
- 💧 **Water Issues**: Leakage, supply problems, pipeline issues
- 🗑️ **Sanitation Issues**: Garbage, waste management
- 🚰 **Drainage Issues**: Blocked drains, water logging
- 🚦 **Traffic Issues**: Signal problems, congestion
- 🏞️ **Public Space Issues**: Parks, playgrounds, public areas
- 🚌 **Transport Issues**: Bus stops, public transport

## 🔧 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /api/issues/analyze` - AI analysis of civic issues
- `POST /api/issues` - Submit new issue
- `GET /api/issues` - Get all issues (with filters)
- `GET /api/issues/:id` - Get specific issue
- `PUT /api/issues/:id` - Update issue status
- `POST /api/issues/:id/comments` - Add comment to issue
- `GET /api/dashboard/stats` - Get dashboard statistics

### AI Analysis Request Format
```json
{
  "imageData": "base64_encoded_image",
  "text": "Optional text description",
  "audioData": "base64_encoded_audio",
  "location": "GPS coordinates or address"
}
```

### AI Analysis Response Format
```json
{
  "success": true,
  "data": {
    "title": "Generated title",
    "problemIdentified": "Issue type",
    "department": "Responsible department",
    "priority": "HIGH/MEDIUM/LOW",
    "category": "ROAD/WATER/SANITATION/etc",
    "imageCaption": "AI-generated description",
    "complaintText": "Processed complaint text",
    "location": "Issue location",
    "aiConfidence": "high/medium/low"
  }
}
```

## 🌐 Frontend Routes

- `/` - Homepage with features and quick access
- `/report` - Issue reporting form with AI analysis
- `/issues` - Current issues dashboard
- `/admin` - Admin panel for issue management
- `/citizen` - Citizen dashboard (legacy)
- `/issue/:id` - Individual issue details

## 🎨 UI Components

### Key Components
- **HomePage**: Landing page with features and navigation
- **ReportIssue**: AI-powered issue reporting form
- **CurrentIssues**: Dashboard for viewing all issues
- **AdminDashboard**: Admin interface for issue management
- **Header**: Navigation and language toggle
- **LanguageContext**: Bilingual support provider

### Features
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Automatic theme detection
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure image upload handling
- **CORS Protection**: Cross-origin request protection
- **Rate Limiting**: API request rate limiting
- **Error Handling**: Secure error responses

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm run build
npm start
# Deploy to your server or cloud platform
```

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000
```

**Backend (.env)**
```
PORT=3000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Transformers Library**: For AI model integration
- **React Team**: For the amazing frontend framework
- **Node.js Community**: For the robust backend runtime
- **OpenStreetMap**: For map data and services

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Made with ❤️ for better civic engagement and community development**
