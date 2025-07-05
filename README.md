# 📘 IP Marketplace on Internet Computer (ICP)

## 🎯 Project Overview

A decentralized marketplace built on the Internet Computer (ICP) where users can register, buy, sell, license, and transfer ownership of intellectual property (IP) such as patents, copyrights, trademarks, and trade secrets. This system uses smart contracts (Rust-based canisters) and NFT standards to tokenize and track ownership of IP assets.

## 🚀 Quick Start

### Prerequisites
- [DFX](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/) (Internet Computer SDK)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://rustup.rs/) (for backend development)

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd ip_market

# Make scripts executable
chmod +x start-dev.sh start-frontend.sh

# Run the full setup (sets up environment, deploys canisters)
./start-dev.sh

# In a new terminal, start the frontend
./start-frontend.sh
```

### Option 2: Manual Setup
```bash
# 1. Clone and enter directory
git clone <your-repo-url>
cd ip_market

# 2. Copy environment template and configure
cp .env.example .env
# Edit .env file if needed

# 3. Start local IC network
dfx start --clean --background

# 4. Deploy canisters
dfx deploy --network local

# 5. Install frontend dependencies and start
cd src/ip_market_frontend
npm install
npm run dev
```

### Environment Configuration
The project includes a comprehensive environment setup. Key files:
- `.env.example` - Template with all required environment variables
- `CONFIGURATION_GUIDE.md` - Detailed configuration instructions
- `AUTHENTICATION_SETUP.md` - Internet Identity integration guide

### Access the Application
After setup, access the application at:
- **Frontend**: http://localhost:3000
- **Backend Candid UI**: Check terminal output for URLs after deployment

## ✨ Current Features (Implemented)

### 🔐 Authentication
- ✅ Internet Identity integration
- ✅ Secure user authentication and session management
- ✅ Local development bypass for testing

### 👤 User Management
- ✅ User profile creation and management
- ✅ Profile information (username, email, bio, avatar)
- ✅ User reputation system

### 📝 IP Registration
- ✅ Complete IP registration form with metadata
- ✅ Support for multiple IP types (Patent, Copyright, Trademark, etc.)
- ✅ Structured metadata (category, tags, jurisdiction, etc.)
- ✅ IP verification status tracking

### 📊 Dashboard
- ✅ User dashboard with IP assets overview
- ✅ Statistics (owned IPs, NFTs, sales, purchases)
- ✅ IP assets listing with status indicators

### 🛠 Developer Experience
- ✅ Environment-based configuration system
- ✅ Automated setup scripts
- ✅ Comprehensive documentation
- ✅ Error handling and debugging tools

## 📁 Project Structure

```
ip_market/
├── src/
│   ├── ip_market_backend/          # Rust canisters
│   │   ├── src/
│   │   │   ├── lib.rs              # Main canister entry
│   │   │   ├── types.rs            # Data structures
│   │   │   ├── user_management.rs  # User functions
│   │   │   ├── ip_registry.rs      # IP registration
│   │   │   ├── nft_management.rs   # NFT operations
│   │   │   └── marketplace.rs      # Trading logic
│   │   └── Cargo.toml
│   └── ip_market_frontend/         # React frontend
│       ├── src/
│       │   ├── components/         # UI components
│       │   ├── context/           # Auth & state
│       │   ├── pages/             # Route pages
│       │   └── utils/             # Helper functions
│       └── package.json
├── .env.example                    # Environment template
├── dfx.json                       # DFX configuration
├── start-dev.sh                   # Setup script
├── start-frontend.sh              # Frontend script
├── README.md                      # This file
├── CONFIGURATION_GUIDE.md         # Setup guide
├── AUTHENTICATION_SETUP.md        # Auth guide
├── backend.md                     # Backend docs
└── frontend.md                    # Frontend docs
```

---

## 🧱 Architecture Overview

### 1. **Frontend (React + Tailwind + Next.js)**

* User-facing UI for browsing, listing, licensing, and transferring IP NFTs
* Internet Identity login integration
* Plug Wallet integration for crypto transactions
* IP asset upload and registration forms

### 2. **Backend (Rust Canisters on ICP)**

* **IP Registry Canister**: Registers IP, mints DIP721 NFTs, stores metadata
* **License Engine Canister**: Issues licenses, tracks royalty terms, validates license actions
* **Payment Processor Canister**: Handles payments, escrow, royalty distribution

### 3. **Storage Layer**

* **Stable memory** for structured data (NFTs, users, licenses)
* **IPFS/ICP Asset Canisters** for storing legal documents and files

### 4. **Authentication**

* Internet Identity for secure, passwordless login and user identification

### 5. **Token Standard**

* DIP721 NFT for representing IP ownership
* Each token stores IP metadata and document hash

---

## 🔧 Backend Modules and Canisters

### 🔹 1. IP Registry Canister (Rust)

**Responsibilities:**

* Mint DIP721 NFTs
* Store and manage IP asset metadata
* Track IP ownership
* Allow asset transfer

**Important Functions:**

* `register_ip_asset(...)`
* `mint_nft_to(owner: Principal, metadata: IpAsset)`
* `transfer_ip_asset(token_id: u64, new_owner: Principal)`
* `get_ip_metadata(token_id: u64)`

**IP Metadata Schema:**

```rust
pub struct IpAsset {
    id: u64,
    owner: Principal,
    title: String,
    ip_type: IpType,
    jurisdiction: String,
    license_type: LicenseType,
    description: String,
    hash_of_docs: String,
    registered_at: u64,
    licenses: Vec<LicenseInfo>,
}
```

---

### 🔹 2. License Engine Canister (Rust)

**Responsibilities:**

* Smart contract–based IP licensing
* Create exclusive/non-exclusive licenses
* Time-bound or perpetual use rights

**Important Functions:**

* `create_license(token_id, licensee, terms)`
* `validate_license_usage(token_id, licensee)`
* `get_license_history(token_id)`

**LicenseInfo Struct:**

```rust
pub struct LicenseInfo {
    licensee: Principal,
    start_date: u64,
    end_date: Option<u64>,
    royalty_terms: String,
    terms_url: String,
}
```

---

### 🔹 3. Payment Processor Canister

**Responsibilities:**

* Handle ICP token transfers between buyer/seller
* Escrow management
* Royalty split and distribution

**Important Functions:**

* `initiate_payment(token_id, buyer)`
* `release_funds(token_id)`
* `get_escrow_balance(principal)`
* `get_royalty_info(token_id: u64)`

---

## 🖼 Frontend Modules

### Pages:

* `/` - Home with featured IP assets
* `/register` - IP registration form
* `/explore` - Browse/search IP assets
* `/asset/:id` - IP details, licensing options
* `/profile/:user` - User’s owned and licensed IPs

### Components:

* `AssetCard` - Display basic asset info
* `LicenseForm` - Create/select licensing options
* `UploadSection` - File upload for document hash
* `IdentityLogin` - Internet Identity integration
* `PlugWalletButton` - Connect and sign payments

### State Management:

* Use React Context or Zustand to manage user data and IP assets locally

---

## ✅ Required Features Checklist

| Feature               | Description                           |
| --------------------- | ------------------------------------- |
| 🔐 Internet Identity  | Secure auth and session tracking      |
| 🎨 DIP721 NFT Support | IP assets are minted as NFTs          |
| 🧾 IP Registration    | Submit metadata and legal proof       |
| 🛒 Marketplace        | Browse, filter, search IPs            |
| 🤝 License Engine     | On-chain license contracts with terms |
| 💸 Payments           | ICP token payments via Plug Wallet    |
| 🔁 Transfer & Resell  | Full ownership transfer system        |
| 📜 License History    | Transparent usage and rights history  |
| 📁 IPFS/Asset Storage | File storage for legal docs           |

---

## 🧠 Smart Licensing Logic (Inspired by Story Protocol)

* Modular license terms (CC-like)
* Support for remixable/derivative IP
* On-chain license and attribution graphs
* Time-limited or usage-based licenses
* Auto-revocation on expiration

---

## 📈 Roadmap (MVP to V2)

### 🔹 MVP

* IP registration + DIP721 minting
* Ownership transfer
* License creation & validation
* Basic ICP payments

### 🔹 Phase 2

* IP search & advanced filters
* Licensing templates
* Royalty engine
* License expiry & automation

### 🔹 Phase 3

* IP DAO governance
* Dispute resolution system
* Cross-chain IP bridging (Ethereum/EVM)
* AI-powered license suggestion

---

## 📚 External Dependencies

* [ICP Rust SDK](https://internetcomputer.org/docs/current/developer-docs/backend/rust/rust-intro)
* [DIP721 Standard](https://github.com/Psychedelic/dip721)
* [Plug Wallet](https://docs.plugwallet.ooo/)
* [Internet Identity](https://identity.ic0.app/)
* [IPFS](https://docs.ipfs.tech/) or ICP Asset Canisters

---

## 🛠 Troubleshooting

### Common Issues and Solutions

#### 1. DFX Network Issues
```bash
# If dfx start fails
dfx stop
dfx start --clean --background

# If canisters fail to deploy
dfx canister uninstall-code --all
dfx deploy --network local
```

#### 2. Frontend Issues
```bash
# If npm install fails
cd src/ip_market_frontend
rm -rf node_modules package-lock.json
npm install

# If environment variables aren't loading
# Make sure .env file is in project root (not in frontend folder)
cp .env.example .env
```

#### 3. Authentication Issues
- For local development, authentication bypasses Internet Identity automatically
- If you see signature errors, ensure you're using the local development flow
- Check browser console for detailed error messages

#### 4. Reset Everything
```bash
# Complete reset
dfx stop
dfx start --clean --background
dfx deploy --network local
```

### Getting Help

1. **Documentation**: Check the detailed guides:
   - `CONFIGURATION_GUIDE.md` - Environment setup
   - `AUTHENTICATION_SETUP.md` - Internet Identity integration
   - `backend.md` - Backend architecture
   - `frontend.md` - Frontend structure

2. **Logs**: Check terminal output for detailed error messages
3. **Browser Console**: Open developer tools to see frontend errors

## 🗂 What Works Currently

### ✅ Fully Implemented
- User authentication (Internet Identity + local dev bypass)
- User profile creation and management
- IP registration with comprehensive metadata
- Dashboard with user statistics and IP listing
- Environment-based configuration system
- Automated setup scripts

### 🚧 In Development
- NFT minting for registered IPs
- Marketplace functionality (buy/sell)
- IP licensing system
- Payment integration
- Advanced search and filtering

### 🔮 Planned Features
- IP verification system
- Royalty distribution
- Multi-chain support
- DAO governance


