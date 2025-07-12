#!/bin/bash

# Environment Verification Script
echo "🔍 Verifying IP Marketplace Environment..."
echo "================================================"

# Check if dfx is installed
if command -v dfx &> /dev/null; then
    echo "✅ DFX is installed: $(dfx --version)"
else
    echo "❌ DFX is not installed. Please install DFX first."
    echo "   Visit: https://internetcomputer.org/docs/current/developer-docs/getting-started/install/"
    exit 1
fi

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed: $(node --version)"
else
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✅ npm is installed: $(npm --version)"
else
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    # Check key environment variables
    if grep -q "CANISTER_ID_IP_MARKET_BACKEND" .env; then
        echo "✅ Backend canister ID is configured"
    else
        echo "⚠️  Backend canister ID not found in .env"
    fi
    
    if grep -q "CANISTER_ID_IP_MARKET_FRONTEND" .env; then
        echo "✅ Frontend canister ID is configured"
    else
        echo "⚠️  Frontend canister ID not found in .env"
    fi
    
    if grep -q "CANISTER_ID_INTERNET_IDENTITY" .env; then
        echo "✅ Internet Identity canister ID is configured"
    else
        echo "⚠️  Internet Identity canister ID not found in .env"
    fi
else
    echo "❌ .env file not found. Run ./start-dev.sh first or copy .env.example to .env"
fi

# Check if dfx is running
if dfx ping &> /dev/null; then
    echo "✅ Local dfx replica is running"
    
    # Check canister status
    echo ""
    echo "📊 Checking canister status..."
    dfx canister status --all 2>/dev/null | grep -E "(Status|Memory Size|Balance)" | head -9
    
else
    echo "❌ Local dfx replica is not running. Run 'dfx start --background' first."
fi

# Check if frontend dependencies are installed
if [ -d "src/ip_market_frontend/node_modules" ]; then
    echo "✅ Frontend dependencies are installed"
else
    echo "⚠️  Frontend dependencies not installed. Run 'cd src/ip_market_frontend && npm install'"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
if [ -f ".env" ] && dfx ping &> /dev/null; then
    echo "✅ Environment is ready!"
    echo "   Run './start-frontend.sh' to start the frontend development server"
    echo "   Then visit: http://localhost:3000"
else
    echo "❌ Environment setup needed:"
    echo "   1. Run './start-dev.sh' to set up the complete environment"
    echo "   2. Then run './start-frontend.sh' to start the frontend"
fi

echo ""
echo "🔗 Useful URLs:"
echo "==============="
if [ -f ".env" ]; then
    BACKEND_ID=$(grep "CANISTER_ID_IP_MARKET_BACKEND" .env | cut -d'=' -f2 | tr -d "'" | tr -d '"')
    FRONTEND_ID=$(grep "CANISTER_ID_IP_MARKET_FRONTEND" .env | cut -d'=' -f2 | tr -d "'" | tr -d '"')
    II_ID=$(grep "CANISTER_ID_INTERNET_IDENTITY" .env | cut -d'=' -f2 | tr -d "'" | tr -d '"')
    
    echo "Frontend: http://localhost:3000"
    echo "Backend Canister: http://$BACKEND_ID.localhost:4943"
    echo "Frontend Canister: http://$FRONTEND_ID.localhost:4943"
    echo "Internet Identity: http://$II_ID.localhost:4943"
    echo "Backend Candid UI: http://127.0.0.1:4943/?canisterId=uzt4z-lp777-77774-qaabq-cai&id=$BACKEND_ID"
fi
