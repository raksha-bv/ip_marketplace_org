# IP Market - Environment Configuration Guide

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Make scripts executable
chmod +x start-dev.sh start-frontend.sh

# Run the full setup (sets up environment, deploys canisters, shows next steps)
./start-dev.sh

# In a new terminal, start the frontend
./start-frontend.sh
```

### Option 2: Manual Setup

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your preferred settings (optional)
# 3. Start dfx
dfx start --clean --background

# 4. Deploy canisters
dfx deploy --network local

# 5. Start frontend
cd src/ip_market_frontend
npm start
```

### Using Your Own Internet Identity Canister

1. **Deploy your own Internet Identity:**

```bash
# Clone the Internet Identity repository
git clone https://github.com/dfinity/internet-identity.git
cd internet-identity

# Deploy to your local network
dfx deploy --network local
```

2. **Update your .env file:**

```bash
# Get your II canister ID
dfx canister id internet_identity --network local

# Update .env with your canister ID
VITE_II_CANISTER_ID=your-ii-canister-id
VITE_LOCAL_II_URL=http://your-ii-canister-id.localhost:4943
```

3. **Restart the development server:**

```bash
./start-frontend.sh
```

### Using Different Networks

## Development Tools

### Configuration Panel

- Available only in development mode
- Click the ⚙️ button in the bottom-right corner
- View current configuration
- Download .env template

### Debugging Environment

The app automatically logs environment configuration in development mode. Check the browser console for:

- Current network settings
- Canister IDs
- Identity provider URLs

## Common Issues & Solutions

### 1. "Internet Identity doesn't work"

**Solution:**

1. Check your .env file has the correct canister IDs
2. Verify dfx is running: `dfx ping`
3. Check the configuration panel for correct URLs
4. Try clearing browser cache

### 2. "Authentication fails"

**Solution:**

1. Restart dfx: `dfx stop && dfx start --clean --background`
2. Redeploy: `dfx deploy --network local`
3. Check environment variables are loaded correctly
4. Clear browser cookies for localhost

### 3. "Profile creation fails"

**Solution:**

1. Check browser console for error messages
2. Verify backend canister is running
3. Check that you're properly authenticated
4. Restart the development server

### 4. "Cannot find canister ID"

**Solution:**

1. Run `dfx deploy --network local` to deploy canisters
2. Check that .env has the correct canister IDs
3. Run `dfx canister id ip_market_backend --network local` to verify

## Security Considerations

### Environment Variables

- Never commit sensitive canister IDs to version control
- Use different .env files for different environments
- Keep production environment variables secure

### Internet Identity

- Use the official Internet Identity canister for production
- Test thoroughly with your own II canister in development
- Ensure proper CORS configuration for your domain

## Scripts Reference

| Script                | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `./start-dev.sh`      | Complete setup: environment, deploy, generate declarations |
| `./start-frontend.sh` | Quick start frontend development server                    |
| `chmod +x *.sh`       | Make scripts executable                                    |

## Support

For issues with:

- **Environment configuration**: Check the configuration panel
- **Internet Identity**: Verify canister IDs and URLs
- **Authentication**: Check browser console for errors
- **Development setup**: Run `./start-dev.sh` for fresh setup

The configuration system is designed to be flexible and accommodate different development and deployment scenarios. Use the configuration panel for easy debugging and the environment variables for customization.
