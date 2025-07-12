# 📘 IP Marketplace on Internet Computer (ICP)

## 🎯 Project Overview

A decentralized marketplace for intellectual property (IP) registration, trading, and licensing built on the Internet Computer. Users can securely register patents, copyrights, trademarks, and trade secrets as NFTs, then buy, sell, or license them in a transparent marketplace.

## 🚀 Quick Start

### Prerequisites

- [DFX](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/), [Node.js](https://nodejs.org/), [Rust](https://rustup.rs/)

### Setup (2 commands)

```bash
# 1. Clone and setup everything
git clone https://github.com/IP-Market-Place/ICPProject.git
cd ICPProject
chmod +x *.sh && ./start-dev.sh

# 2. Start frontend (in new terminal)
./start-frontend.sh
```

### Access

- **Frontend**: http://localhost:3000
- **Backend Testing**: Check terminal output for your unique URLs

## ✨ Key Features

### 🔐 Authentication & Security

- **Internet Identity**: Secure, passwordless login system
- **Data Persistence**: All user data and IP registrations persist across sessions
- **Principal-based Access**: Each user has a unique identity on the blockchain

### 📝 IP Registration System

- **Multiple IP Types**: Patents, Copyrights, Trademarks, Trade Secrets
- **Rich Metadata**: Category, tags, jurisdiction, descriptions, file attachments
- **Verification Status**: Track registration and verification progress
- **IPFS Storage**: Secure document storage via Pinata integration

### 👤 User Management

- **Complete Profiles**: Username, email, bio, avatar, social links
- **Reputation System**: Track user activity and trustworthiness
- **Dashboard**: View owned IPs, statistics, and account overview
- **Profile Persistence**: Data saves automatically across sessions

### 🛠 Developer Experience

- **One-Command Setup**: Automated deployment and configuration
- **Hot Reload**: Frontend changes reflect instantly
- **Environment Auto-Config**: All URLs and IDs generated automatically
- **Comprehensive Logging**: Easy debugging and monitoring

## 📁 Project Structure

```
ip_marketplace_org/
├── src/
│   ├── ip_market_backend/          # Rust canisters
│   │   ├── src/
│   │   │   ├── lib.rs              # Main canister entry
│   │   │   ├── types.rs            # Data structures
│   │   │   ├── user_management.rs  # User functions
│   │   │   ├── ip_registry.rs      # IP registration
│   │   │   ├── nft_management.rs   # NFT operations
│   │   │   ├── marketplace.rs      # Trading logic
│   │   │   ├── storage.rs          # Stable memory management
│   │   │   └── utils.rs            # Helper functions
│   │   └── Cargo.toml
│   └── ip_market_frontend/         # React frontend
│       ├── src/
│       │   ├── components/         # UI components
│       │   ├── context/           # Auth & state management
│       │   ├── pages/             # Route pages
│       │   ├── hooks/             # Custom React hooks
│       │   └── utils/             # Helper functions
│       └── package.json
├── .env.example                    # Environment template
├── .env                           # Auto-generated environment variables
├── dfx.json                       # DFX configuration
├── start-dev.sh                   # Complete development setup
├── start-frontend.sh              # Frontend development server
├── README.md                      # This file
├── CONFIGURATION_GUIDE.md         # Setup guide
├── AUTHENTICATION_SETUP.md        # Auth guide
├── SETUP_CHECKLIST.md            # Verification steps
├── backend.md                     # Backend docs
└── frontend.md                    # Frontend docs
```

## � Environment Check

Want to verify everything is working? Run:

```bash
./check-env.sh
```

This will show you:

- ✅ Prerequisites installed (DFX, Node.js, npm)
- ✅ Your unique canister IDs and URLs
- ✅ Current deployment status
- 🎯 Next steps to get started

## 🏗 Architecture

### 1. **Frontend (React + Tailwind + Next.js)**

- User-facing UI for browsing, listing, licensing, and transferring IP NFTs
- Internet Identity login integration
- Plug Wallet integration for crypto transactions
- IP asset upload and registration forms

### 2. **Backend (Rust Canisters on ICP)**

- **IP Registry Canister**: Registers IP, mints DIP721 NFTs, stores metadata
- **License Engine Canister**: Issues licenses, tracks royalty terms, validates license actions
- **Payment Processor Canister**: Handles payments, escrow, royalty distribution

### 3. **Storage Layer**

- **Stable memory** for structured data (NFTs, users, licenses)
- **IPFS/ICP Asset Canisters** for storing legal documents and files

### 4. **Authentication**

- Internet Identity for secure, passwordless login and user identification

### 5. **Token Standard**

- DIP721 NFT for representing IP ownership
- Each token stores IP metadata and document hash

---

## 🔧 Backend Modules and Canisters

### 🔹 1. IP Registry Canister (Rust)

**Responsibilities:**

- Mint DIP721 NFTs
- Store and manage IP asset metadata
- Track IP ownership
- Allow asset transfer

**Important Functions:**

- `register_ip_asset(...)`
- `mint_nft_to(owner: Principal, metadata: IpAsset)`
- `transfer_ip_asset(token_id: u64, new_owner: Principal)`
- `get_ip_metadata(token_id: u64)`

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

- Smart contract–based IP licensing
- Create exclusive/non-exclusive licenses
- Time-bound or perpetual use rights

**Important Functions:**

- `create_license(token_id, licensee, terms)`
- `validate_license_usage(token_id, licensee)`
- `get_license_history(token_id)`

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

- Handle ICP token transfers between buyer/seller
- Escrow management
- Royalty split and distribution

**Important Functions:**

- `initiate_payment(token_id, buyer)`
- `release_funds(token_id)`
- `get_escrow_balance(principal)`
- `get_royalty_info(token_id: u64)`

---

## 🖼 Frontend Modules

### Pages:

- `/` - Home with featured IP assets
- `/register` - IP registration form
- `/explore` - Browse/search IP assets
- `/asset/:id` - IP details, licensing options
- `/profile/:user` - User’s owned and licensed IPs

### Components:

- `AssetCard` - Display basic asset info
- `LicenseForm` - Create/select licensing options
- `UploadSection` - File upload for document hash
- `IdentityLogin` - Internet Identity integration
- `PlugWalletButton` - Connect and sign payments

### State Management:

- Use React Context or Zustand to manage user data and IP assets locally

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

- Modular license terms (CC-like)
- Support for remixable/derivative IP
- On-chain license and attribution graphs
- Time-limited or usage-based licenses
- Auto-revocation on expiration

---

## 📈 Roadmap (MVP to V2)

### 🔹 MVP

- IP registration + DIP721 minting
- Ownership transfer
- License creation & validation
- Basic ICP payments

### 🔹 Phase 2

- IP search & advanced filters
- Licensing templates
- Royalty engine
- License expiry & automation

### 🔹 Phase 3

- IP DAO governance
- Dispute resolution system
- Cross-chain IP bridging (Ethereum/EVM)
- AI-powered license suggestion

---

## 📚 External Dependencies

- [ICP Rust SDK](https://internetcomputer.org/docs/current/developer-docs/backend/rust/rust-intro)
- [DIP721 Standard](https://github.com/Psychedelic/dip721)
- [Plug Wallet](https://docs.plugwallet.ooo/)
- [Internet Identity](https://identity.ic0.app/)
- [IPFS](https://docs.ipfs.tech/) or ICP Asset Canisters

---

## 🛠 Troubleshooting

**Common Issues:**

```bash
# If setup fails, reset everything:
dfx stop && dfx start --clean --background && ./start-dev.sh

# If frontend won't start:
cd src/ip_market_frontend && rm -rf node_modules && npm install
```

**Need Help?**

- Check terminal output for your unique canister URLs
- Browser console shows frontend errors
- All data persists automatically - no manual saves needed

---

_Built with ❤️ on the Internet Computer_
