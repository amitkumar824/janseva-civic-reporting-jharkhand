# Complete Setup Guide - Jan Seva Civic Reporting System

## 🚀 Quick Start (Recommended Order)

### 1. **Setup ML Model First** ⭐
```bash
# Run this first to set up your custom ML model
setup-ml-model.bat
```

### 2. **Setup Backend & Database**
```bash
# Run this to set up the backend
setup-backend.bat
```

### 3. **Configure Environment Variables**
- Update `backend/.env` file with your credentials
- See `SUPABASE_SETUP.md` for database setup

### 4. **Start the System**
```bash
# Terminal 1: Start Backend
cd backend
npm run db:generate
npm run db:migrate
npm run dev

# Terminal 2: Start Frontend
npm run dev
```

## 📋 What You Need to Provide

### **Cloudinary (Image Hosting) ✅**
- You already have this configured

### **Supabase Database (Free PostgreSQL)**
- Sign up at [supabase.com](https://supabase.com)
- Create new project
- Get connection string from Settings → Database
- Update `DATABASE_URL` in `backend/.env`

### **Your ML Model (.ipynb) ✅**
- Already uploaded to `backend/ml-models/`
- Converted to Python script: `civic_analyzer.py`

## 🔧 Detailed Setup Steps

### **Step 1: ML Model Setup**
1. Ensure Python 3.7+ is installed
2. Run `setup-ml-model.bat`
3. This will install all required Python packages:
   - transformers (Hugging Face)
   - torch (PyTorch)
   - Pillow (PIL)
   - Other dependencies

### **Step 2: Database Setup**
1. Follow `SUPABASE_SETUP.md`
2. Create Supabase account
3. Get database connection string
4. Update `backend/.env` file

### **Step 3: Backend Setup**
1. Run `setup-backend.bat`
2. This installs Node.js dependencies
3. Creates `.env` file template
4. Sets up database schema

### **Step 4: Environment Configuration**
Update `backend/.env` with:
```env
# Database (Supabase)
DATABASE_URL="your-supabase-connection-string"

# JWT Secret
JWT_SECRET="janseva-super-secret-jwt-key-2024"

# Cloudinary (you have these)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=5000
NODE_ENV="development"
```

### **Step 5: Database Migration**
```bash
cd backend
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Create database tables
```

### **Step 6: Start Services**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

## 🧪 Testing Your Setup

### **Test ML Model**
```bash
cd backend/ml-models
python civic_analyzer.py --help
```

### **Test Backend**
- Backend should start on `http://localhost:5000`
- Check console for any errors

### **Test Frontend**
- Frontend should start on `http://localhost:5173`
- Try to register/login
- Test issue reporting with image upload

## 🐛 Troubleshooting

### **Python/ML Model Issues**
- Ensure Python 3.7+ is installed
- Check if Visual C++ build tools are installed (Windows)
- Try: `pip install --upgrade pip`

### **Database Issues**
- Verify Supabase connection string
- Check if project is active (not paused)
- Add `?sslmode=require` to connection string if SSL errors

### **Backend Issues**
- Check if all dependencies are installed
- Verify `.env` file exists and has correct values
- Check console for specific error messages

### **Frontend Issues**
- Ensure backend is running first
- Check browser console for API errors
- Verify authentication is working

## 🔄 What Happens When You Report an Issue

1. **User uploads image** → Stored in Cloudinary
2. **Image sent to ML model** → Your custom `civic_analyzer.py`
3. **ML model analyzes** → BLIP for image captioning + Whisper for audio
4. **Results processed** → Category, priority, department assigned
5. **Issue stored** → Saved to Supabase database
6. **Real-time updates** → Socket.io notifications

## 📱 Features Available

- ✅ User authentication (citizen/admin)
- ✅ Image upload with AI analysis
- ✅ Speech-to-text support
- ✅ Hinglish text normalization
- ✅ Automatic issue categorization
- ✅ Real-time notifications
- ✅ Multi-language support
- ✅ Admin dashboard
- ✅ Issue tracking system

## 🆘 Need Help?

1. **Check error messages** in console/terminal
2. **Verify all setup steps** are completed
3. **Ensure Python and Node.js** are properly installed
4. **Check file paths** and permissions
5. **Verify environment variables** are set correctly

## 🎯 Next Steps After Setup

1. **Test the system** with sample issues
2. **Customize ML model** if needed
3. **Add more categories** to the system
4. **Deploy to production** using Docker
5. **Scale the system** as needed

---

**Your ML model is now fully integrated!** 🎉

The system will use your custom `civic_analyzer.py` for:
- Image analysis (BLIP model)
- Speech-to-text (Whisper model)
- Hinglish text processing
- Issue classification and routing
