#!/bin/bash

# Debug script for IP Marketplace development issues

echo "🔍 IP Marketplace Debug Script"
echo "==============================="
echo

# Check if dfx is running
echo "1. Checking dfx status..."
if pgrep -f "dfx start" > /dev/null; then
    echo "   ✅ dfx is running"
else
    echo "   ❌ dfx is not running"
    echo "   💡 Try: dfx start --clean --background"
fi
echo

# Check canister status
echo "2. Checking canister status..."
if dfx canister status ip_market_backend --network local > /dev/null 2>&1; then
    echo "   ✅ Backend canister is deployed"
    BACKEND_ID=$(dfx canister id ip_market_backend --network local)
    echo "   📋 Backend ID: $BACKEND_ID"
else
    echo "   ❌ Backend canister is not deployed"
    echo "   💡 Try: dfx deploy ip_market_backend --network local"
fi
echo

# Check frontend canister
if dfx canister status ip_market_frontend --network local > /dev/null 2>&1; then
    echo "   ✅ Frontend canister is deployed"
    FRONTEND_ID=$(dfx canister id ip_market_frontend --network local)
    echo "   📋 Frontend ID: $FRONTEND_ID"
else
    echo "   ❌ Frontend canister is not deployed"
    echo "   💡 Try: dfx deploy ip_market_frontend --network local"
fi
echo

# Check environment variables
echo "3. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    if grep -q "VITE_CANISTER_ID_IP_MARKET_BACKEND" .env; then
        echo "   ✅ Backend canister ID is set in .env"
    else
        echo "   ⚠️  Backend canister ID not found in .env"
        echo "   💡 Try: echo 'VITE_CANISTER_ID_IP_MARKET_BACKEND=$(dfx canister id ip_market_backend --network local)' >> .env"
    fi
else
    echo "   ❌ .env file not found"
    echo "   💡 Try: cp .env.example .env"
fi
echo

# Check network connectivity
echo "4. Checking network connectivity..."
if curl -s http://localhost:4943 > /dev/null; then
    echo "   ✅ Local IC network is accessible"
else
    echo "   ❌ Cannot reach local IC network"
    echo "   💡 Try: dfx start --clean --background"
fi
echo

# Quick fix suggestions
echo "🚀 Quick Fix Commands:"
echo "======================"
echo "# If dfx is not running:"
echo "dfx start --clean --background"
echo
echo "# If canisters are not deployed:"
echo "dfx deploy --network local"
echo
echo "# If environment is not configured:"
echo "echo 'VITE_CANISTER_ID_IP_MARKET_BACKEND='$(dfx canister id ip_market_backend --network local) >> .env"
echo
echo "# If you have persistent issues:"
echo "dfx stop && dfx start --clean --background && dfx deploy --network local"
echo
echo "# To view logs:"
echo "dfx logs ip_market_backend"
echo

echo "📝 If issues persist, check the browser console for more details."
