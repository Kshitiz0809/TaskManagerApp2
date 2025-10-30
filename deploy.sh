#!/bin/bash

# Quick Deployment Script for TaskManager App
# Run this after deploying backend to get your mobile app live

echo "🚀 TaskManager App - Quick Deploy"
echo "=================================="
echo ""

# Step 1: Check if backend URL is set
read -p "Enter your deployed backend URL (e.g., https://your-app.railway.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required!"
    exit 1
fi

# Step 2: Update API URL in frontend
echo "📝 Updating API URL in frontend..."
API_URL="${BACKEND_URL}/api"
sed -i "s|const API_BASE_URL = .*|const API_BASE_URL = '${API_URL}';|" ToDoApp/api/todoAPI.ts
echo "✅ Updated API URL to: $API_URL"

# Step 3: Install EAS CLI
echo ""
echo "📦 Installing EAS CLI..."
npm install -g eas-cli

# Step 4: Login to Expo
echo ""
echo "🔐 Please login to Expo..."
cd ToDoApp
eas login

# Step 5: Configure EAS
echo ""
echo "⚙️ Configuring EAS Build..."
eas build:configure

# Step 6: Build APK
echo ""
echo "🏗️ Building Android APK..."
eas build --platform android --profile preview

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📱 Next Steps:"
echo "1. Wait for EAS build to complete"
echo "2. Download APK from the provided link"
echo "3. Install on your Android device"
echo "4. Your app is now LIVE! 🎉"
echo ""
echo "📚 For more deployment options, see DEPLOYMENT_GUIDE.md"
