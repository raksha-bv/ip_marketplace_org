#!/bin/bash

# Quick start script for frontend development
echo "🌐 Starting IP Market frontend development server..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./start-dev.sh first to set up the environment."
    exit 1
fi

# Check if canisters are deployed
if [ ! -f .dfx/local/canister_ids.json ]; then
    echo "❌ Canisters not deployed. Please run ./start-dev.sh first."
    exit 1
fi

# Navigate to frontend directory
cd src/ip_market_frontend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start the frontend development server
echo "🚀 Starting Vite development server..."
echo ""
echo "🌍 Access your application at:"
echo "   http://localhost:3000"
echo ""
echo "✨ Features available:"
echo "• User authentication (local development mode)"
echo "• Profile creation and management"
echo "• IP asset registration"
echo "• Dashboard with statistics"
echo ""
echo "💡 Press Ctrl+C to stop the server"
echo ""

npm start
