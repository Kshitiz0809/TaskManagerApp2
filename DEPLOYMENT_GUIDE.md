# Deployment Guide - TaskManager App

## Backend Deployment Options

### Option 1: Railway (Recommended - Free Tier Available)

1. **Sign up at [Railway.app](https://railway.app/)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select `Kshitiz0809/TaskManagerApp`

3. **Configure Backend**
   - Railway will auto-detect Node.js
   - Add these environment variables in Railway dashboard:
     ```
     DB_USER=postgres
     DB_HOST=<railway-postgres-host>
     DB_NAME=todoapp
     DB_PASSWORD=<railway-postgres-password>
     DB_PORT=5432
     PORT=3000
     NODE_ENV=production
     ```

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will provide connection details
   - Copy them to your environment variables

5. **Deploy**
   - Railway will auto-deploy
   - Get your backend URL (e.g., `https://your-app.railway.app`)

### Option 2: Render (Free Tier Available)

1. **Sign up at [Render.com](https://render.com/)**

2. **Create PostgreSQL Database**
   - Dashboard → "New" → "PostgreSQL"
   - Name: `todoapp-db`
   - Free tier is sufficient
   - Copy the Internal Database URL

3. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect GitHub repo: `Kshitiz0809/TaskManagerApp`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables**
   ```
   DB_USER=<from-render-db>
   DB_HOST=<from-render-db>
   DB_NAME=<from-render-db>
   DB_PASSWORD=<from-render-db>
   DB_PORT=5432
   PORT=3000
   NODE_ENV=production
   ```

5. **Initialize Database**
   - After deployment, run: `npm run init-db` in Render shell

### Option 3: Vercel + Supabase

1. **Backend on Vercel**
   - Sign up at [Vercel.com](https://vercel.com/)
   - Import GitHub repo
   - Root Directory: `backend`
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: `.`

2. **Database on Supabase**
   - Sign up at [Supabase.com](https://supabase.com/)
   - Create new project
   - Copy connection string
   - Update environment variables in Vercel

---

## Frontend Deployment (Mobile App)

### Option 1: Expo EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   cd ToDoApp
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Update API URL**
   Edit `api/todoAPI.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-backend-url.railway.app/api';
   ```

5. **Build for Android**
   ```bash
   eas build --platform android
   ```

6. **Build for iOS** (Mac required)
   ```bash
   eas build --platform ios
   ```

7. **Download and Install**
   - EAS will provide a download link
   - Install on your device

### Option 2: Expo Go (Quick Testing)

1. **Publish to Expo**
   ```bash
   cd ToDoApp
   npx expo publish
   ```

2. **Share QR Code**
   - Anyone with Expo Go app can scan and use

### Option 3: Google Play Store

1. **Build APK with EAS**
   ```bash
   eas build --platform android --profile production
   ```

2. **Create Google Play Developer Account**
   - Cost: $25 one-time fee
   - Go to [Google Play Console](https://play.google.com/console)

3. **Upload APK**
   - Create new app
   - Upload APK from EAS
   - Fill app details
   - Submit for review

---

## Quick Start - Deploy in 15 Minutes

### Step 1: Deploy Backend to Railway
```bash
# 1. Go to railway.app and sign up
# 2. Click "New Project" → "Deploy from GitHub"
# 3. Select your repo
# 4. Add PostgreSQL database
# 5. Copy your backend URL
```

### Step 2: Update Frontend API URL
```bash
cd /c/Users/kshit/Desktop/app/ToDoApp/ToDoApp
# Edit api/todoAPI.ts and change API_BASE_URL to your Railway URL
```

### Step 3: Build and Share
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Step 4: Download and Install
- EAS will give you a download link
- Install on your Android phone
- Your app is now live! 🚀

---

## Environment Variables Summary

### Backend (.env - Production)
```env
DB_USER=<your-db-user>
DB_HOST=<your-db-host>
DB_NAME=todoapp
DB_PASSWORD=<your-db-password>
DB_PORT=5432
PORT=3000
NODE_ENV=production
```

### Frontend (api/todoAPI.ts)
```typescript
const API_BASE_URL = 'https://your-backend.railway.app/api';
```

---

## Cost Breakdown

### Free Tier (Recommended for Portfolio)
- **Railway**: 500 hours/month free
- **Supabase**: 500MB database free
- **Expo EAS**: 30 builds/month free
- **Total**: $0/month ✅

### Paid Options
- **Google Play**: $25 one-time
- **Apple App Store**: $99/year
- **Railway Pro**: $5/month (if free tier not enough)

---

## Monitoring & Maintenance

### Health Checks
- Railway provides automatic health monitoring
- Set up uptime monitoring with [UptimeRobot](https://uptimerobot.com/) (free)

### Database Backups
- Railway: Automatic daily backups
- Supabase: Point-in-time recovery

### Logs
- View logs in Railway/Render dashboard
- Monitor API errors and performance

---

## Next Steps

1. Choose your deployment platform (Railway recommended)
2. Deploy backend first
3. Update frontend API URL
4. Build mobile app with EAS
5. Share with users!

**Need help? Let me know which platform you want to use!**
