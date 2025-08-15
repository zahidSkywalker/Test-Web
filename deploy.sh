#!/bin/bash

# Lech-Fita E-Commerce Deployment Script
# This script helps deploy the application to production

echo "🚀 Starting Lech-Fita E-Commerce deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your production environment variables."
    echo "   You can copy from .env.example and update the values."
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd client
npm run build
cd ..

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "❌ Error: Frontend build failed. Please check for errors."
    exit 1
fi

echo "✅ Frontend built successfully!"

# Start the application
echo "🚀 Starting the application..."
echo "   The application will be available at: http://localhost:5000"
echo "   Frontend will be served from the backend at: http://localhost:5000"
echo ""
echo "   To run in production mode, use: npm start"
echo "   To run in development mode, use: npm run dev"
echo ""
echo "🎉 Deployment completed successfully!"

# Optional: Start the application
read -p "Would you like to start the application now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting application..."
    npm start
fi