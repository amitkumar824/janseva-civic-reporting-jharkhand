# Supabase Database Setup Guide

## What is Supabase?
Supabase is a free, open-source alternative to Firebase that provides:
- PostgreSQL database (free tier: 500MB)
- Real-time subscriptions
- Authentication
- Auto-generated APIs
- Dashboard interface

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new organization and project

## Step 2: Get Database Connection String
1. In your Supabase dashboard, go to **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. It looks like: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

## Step 3: Update Environment Variables
Update your `backend/.env` file with:

```env
# Database (Supabase)
DATABASE_URL="your-supabase-connection-string-here"

# JWT Secret (can be any random string)
JWT_SECRET="janseva-super-secret-jwt-key-2024"

# Cloudinary (you already have these)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=5000
NODE_ENV="development"

# ML Model API (optional for now)
HUGGINGFACE_API_KEY="your-huggingface-api-key"

# Email (optional for now)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

## Step 4: Run Database Setup
After updating the .env file, run these commands:

```bash
cd backend
npm run db:generate
npm run db:migrate
```

## Step 5: Test the Connection
Start the backend server:
```bash
npm run dev
```

## Troubleshooting Supabase Issues

### Common Issues:
1. **Connection timeout**: Check if your IP is allowed in Supabase
2. **Authentication failed**: Verify the connection string
3. **SSL required**: Add `?sslmode=require` to your connection string

### SSL Configuration:
If you get SSL errors, update your DATABASE_URL to include:
```
postgresql://...?sslmode=require
```

## Next Steps
1. Complete the Supabase setup above
2. Upload your .ipynb file to `backend/ml-models/`
3. I'll help integrate your ML model
4. Test the full system

## Need Help?
- Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Check the Supabase dashboard for connection details
- Verify your project is active and not paused
