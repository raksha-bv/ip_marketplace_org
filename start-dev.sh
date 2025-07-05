#!/bin/bash

# IP Market Development Setup Script
echo "🚀 Starting IP Market with Internet Identity..."

# Check if .env file exists, if not create one from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file. You can customize it if needed."
    else
        echo "⚠️  No .env.example found. Creating basic .env file..."
        cat > .env << EOF
# Internet Identity Configuration
II_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai

# Frontend configuration
VITE_II_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai
VITE_DFX_NETWORK=local

# Local development URLs
VITE_LOCAL_II_URL=http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943
VITE_IC_HOST=http://localhost:4943
EOF
    fi
fi

# Start dfx in the background
echo "📡 Starting local Internet Computer network..."
dfx start --clean --background

# Wait for dfx to start
sleep 5

# Deploy canisters
echo "📦 Deploying canisters..."
dfx deploy --network local

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Canisters deployed successfully!"
    
    # Display canister URLs
    echo ""
    echo "📋 Canister Information:"
    echo "========================"
    
    # Get canister IDs
    BACKEND_ID=$(dfx canister id ip_market_backend --network local)
    FRONTEND_ID=$(dfx canister id ip_market_frontend --network local)
    
    echo "Backend Canister: http://${BACKEND_ID}.localhost:4943"
    echo "Frontend Canister: http://${FRONTEND_ID}.localhost:4943"
    echo "Internet Identity: http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"
    echo ""
    
    # Update .env with actual canister IDs
    echo "🔧 Updating .env with deployed canister IDs..."
    
    # Check if .env already has the canister IDs, if not add them
    if ! grep -q "CANISTER_ID_IP_MARKET_BACKEND" .env; then
        echo "CANISTER_ID_IP_MARKET_BACKEND=${BACKEND_ID}" >> .env
    fi
    
    if ! grep -q "CANISTER_ID_IP_MARKET_FRONTEND" .env; then
        echo "CANISTER_ID_IP_MARKET_FRONTEND=${FRONTEND_ID}" >> .env
    fi
    
    # Generate declarations
    echo "🔧 Generating declarations..."
    dfx generate
    
    # Display next steps
    echo ""
    echo "🎉 Setup complete! Next steps:"
    echo "=============================="
    echo "1. Open a new terminal and run:"
    echo "   ./start-frontend.sh"
    echo ""
    echo "   OR manually:"
    echo "   cd src/ip_market_frontend"
    echo "   npm install"
    echo "   npm run dev"
    echo ""
    echo "2. Open http://localhost:3000 in your browser"
    echo ""
    echo "� What you can do now:"
    echo "• Click 'Login' (uses local development mode - no Internet Identity needed)"
    echo "• Create your user profile"
    echo "• Register intellectual property assets"
    echo "• View your dashboard with statistics"
    echo ""
    echo "📚 Documentation:"
    echo "• README.md - Project overview and features"
    echo "• SETUP_CHECKLIST.md - Step-by-step verification"
    echo "• CONFIGURATION_GUIDE.md - Advanced configuration"
    echo ""
    echo "🛠 Troubleshooting:"
    echo "• If issues occur, check browser console and terminal output"
    echo "• See SETUP_CHECKLIST.md for common solutions"
    echo ""
    
else
    echo "❌ Deployment failed! Check the error messages above."
    exit 1
fi
