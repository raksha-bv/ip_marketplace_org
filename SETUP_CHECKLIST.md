# 🚀 Setup Checklist for New Developers

## Prerequisites Check
- [ ] **DFX installed**: Run `dfx --version` (should show v0.15.0 or higher)
- [ ] **Node.js installed**: Run `node --version` (should show v16+ or v18+)
- [ ] **Rust installed**: Run `rustc --version` (for backend development)

## Quick Setup (5 minutes)
- [ ] **Clone repository**: `git clone <repo-url> && cd ip_market`
- [ ] **Make scripts executable**: `chmod +x start-dev.sh start-frontend.sh`
- [ ] **Run setup script**: `./start-dev.sh`
- [ ] **Start frontend**: `./start-frontend.sh` (in new terminal)
- [ ] **Access application**: Open http://localhost:3000

## Verification Steps
- [ ] **Backend deployed**: Check terminal for "Deployed canisters" message
- [ ] **Frontend running**: See "Local: http://localhost:3000" in terminal
- [ ] **Can access app**: Browser loads the IP Marketplace homepage
- [ ] **Can authenticate**: Click "Login" button (uses local dev mode)
- [ ] **Can create profile**: Fill out profile form after login
- [ ] **Can register IP**: Access registration form and submit IP asset
- [ ] **Can view dashboard**: See registered IP in user dashboard

## If Something Goes Wrong

### DFX Issues
```bash
dfx stop
dfx start --clean --background
dfx deploy --network local
```

### Frontend Issues
```bash
cd src/ip_market_frontend
rm -rf node_modules
npm install
npm run dev
```

### Environment Issues
```bash
# Reset environment file
cp .env.example .env
# Then restart both backend and frontend
```

## Expected Behavior

### After Setup You Should See:
1. **Terminal 1**: DFX network running, canisters deployed
2. **Terminal 2**: Frontend dev server running on port 3000
3. **Browser**: IP Marketplace app with login functionality

### You Should Be Able To:
1. **Login**: Click login button (no Internet Identity needed for local dev)
2. **Create Profile**: Fill out username, email, bio
3. **Register IP**: Submit IP registration form with metadata
4. **View Dashboard**: See statistics and registered IP assets

## Next Steps
- Read `README.md` for complete project overview
- Check `CONFIGURATION_GUIDE.md` for advanced configuration
- Review `backend.md` and `frontend.md` for architecture details
- Explore the codebase in `src/` directory

## Need Help?
- Check browser console for frontend errors
- Check terminal output for backend errors
- Verify all prerequisite tools are installed
- Try the "Reset Everything" commands above
