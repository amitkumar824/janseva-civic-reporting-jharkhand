# 🚀 Quick Start - Get Your Project Running in 5 Minutes!

## ⚡ **IMMEDIATE ACTION REQUIRED:**

### **Step 1: Get Your Supabase Database Password**
1. Go to: https://bwipwzxjjnjhpaiiucrw.supabase.co
2. Sign in to your Supabase account
3. Go to **Settings** → **Database**
4. Copy your **database password** (not the API key)

### **Step 2: Update Your .env File**
1. Open `backend/env-supabase-template.txt`
2. Copy all content
3. Create a new file: `backend/.env`
4. Paste the content
5. Replace `[YOUR_DATABASE_PASSWORD]` with your actual password
6. Add your Cloudinary credentials (you already have these)

### **Step 3: Run the Complete Setup**
```bash
# Double-click this file:
setup-complete-project.bat
```

This will automatically:
- ✅ Install Python dependencies for your ML model
- ✅ Install Node.js backend dependencies
- ✅ Set up the database with Prisma
- ✅ Test your ML model integration
- ✅ Create all necessary directories

### **Step 4: Start Your System**
After setup completes, open **TWO terminal windows**:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 🎯 **What You'll Get:**

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Your ML Model**: Fully integrated and working
- **Database**: Supabase PostgreSQL with all tables
- **Authentication**: User login/register system
- **AI Analysis**: Image + text analysis with your model
- **Real-time**: Live notifications and updates

## 🔧 **If Something Goes Wrong:**

1. **Check the error messages** in the terminal
2. **Verify your .env file** has the correct password
3. **Ensure Python 3.7+** is installed
4. **Check if Node.js** is installed

## 📱 **Test Your System:**

1. **Register a new user** at http://localhost:5173
2. **Upload an image** of a civic issue
3. **Watch your ML model** analyze it automatically
4. **See real-time results** with category, priority, and department

## 🎉 **You're Done!**

Your Jan Seva Civic Reporting System is now fully functional with:
- ✅ Your custom ML model (`sih2k25.ipynb`)
- ✅ Supabase database integration
- ✅ Cloudinary image hosting
- ✅ Real-time AI analysis
- ✅ Hinglish language support
- ✅ Complete admin dashboard

**Run `setup-complete-project.bat` now and let's get this working!** 🚀
