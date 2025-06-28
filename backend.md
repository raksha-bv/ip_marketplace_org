# 🛠 Backend Documentation: Decentralized IP Marketplace on ICP

## ⚙️ Tech Stack

* **Language**: Rust (Motoko optional)
* **Platform**: Internet Computer (ICP)
* **Token Standard**: DIP721 (NFT)
* **Storage**: Stable BTreeMaps for metadata, principals, license info

---

## 🧱 Canister Structure

### 📦 1. IP Registry Canister

Handles the registration and representation of intellectual property assets as NFTs.

#### 🔧 Core Responsibilities

* Register new IP assets
* Mint NFTs (DIP721 compliant)
* Store and return metadata
* Support ownership queries and transfers

#### 🔤 Key Structs

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

pub enum IpType {
    Patent,
    Copyright,
    Trademark,
    TradeSecret,
    Other(String),
}

pub enum LicenseType {
    Exclusive,
    NonExclusive,
    CreativeCommons,
    Custom(String),
}
```

#### 🔁 DIP721 Functions

* `mint_nft_to(owner: Principal, metadata: IpAsset)`
* `transfer_from(from: Principal, to: Principal, token_id: u64)`
* `get_metadata(token_id: u64)`
* `owner_of(token_id: u64)`
* `get_all_by_owner(owner: Principal)`

---

### 📦 2. License Engine Canister

Manages the creation, tracking, and enforcement of licensing contracts tied to NFTs.

#### 🔧 Core Responsibilities

* Create license agreement on-chain
* Record royalty terms and durations
* Validate license activity and attribution
* Show license history

#### 🔤 Key Structs

```rust
pub struct LicenseInfo {
    licensee: Principal,
    start_date: u64,
    end_date: Option<u64>,
    royalty_terms: String,
    terms_url: String,
    is_active: bool,
}
```

#### 🧠 Licensing Functions

* `create_license(token_id, licensee, terms)`
* `terminate_license(token_id, licensee)`
* `get_license_history(token_id: u64)`
* `get_active_licenses(owner: Principal)`

---

### 📦 3. Payment Processor Canister

Responsible for facilitating ICP-based payments related to IP purchases or license fees.

#### 🔧 Core Responsibilities

* Secure fund transfer between buyer and seller
* Hold escrow if needed
* Distribute royalties per license agreement

#### 🔁 Payment Flow

1. Buyer initiates `initiate_payment(token_id)`
2. Funds stored temporarily
3. On confirmation, `release_funds()` executes
4. Platform takes fee, then pays seller/licensor

---

## 🗃 Storage and Persistence

Use `StableBTreeMap` and `Vec` to store:

* IP asset metadata
* NFT ownership and registry
* License agreements
* Payment records

Use `#[pre_upgrade]` and `#[post_upgrade]` hooks for data persistence.

---

## 🔐 Security and Access Control

* Only owners can transfer or license their IP
* Canister checks principal before executing `transfer` or `create_license`
* Use cryptographic hash of documents for tamper-proof storage references

---

## 📜 Registration & Minting Flow

1. Frontend calls `register_ip_asset(...)`
2. Canister:

   * Stores metadata
   * Computes unique token ID
   * Mints DIP721 NFT and assigns to caller
3. Frontend receives token ID and confirmation

---

## 🧾 License Management Flow

1. Owner selects license terms
2. Buyer/Licensee accepts terms
3. Smart contract records agreement
4. NFT metadata updated with license info

---

## 📦 Directory Structure (Rust Backend)

```bash
/ip-backend
├── src
│   ├── lib.rs
│   ├── ip_registry.rs
│   ├── license_engine.rs
│   ├── payments.rs
│   └── types.rs
├── Cargo.toml
├── dfx.json
└── README.md
```

---

## ✅ Feature Summary

| Feature              | Canister          | Function              |
| -------------------- | ----------------- | --------------------- |
| IP Registration      | IP Registry       | `register_ip_asset()` |
| NFT Minting          | IP Registry       | `mint_nft_to()`       |
| Transfer Ownership   | IP Registry       | `transfer_from()`     |
| Create License       | License Engine    | `create_license()`    |
| End License          | License Engine    | `terminate_license()` |
| Payment Handling     | Payment Processor | `initiate_payment()`  |
| Royalty Distribution | Payment Processor | `release_funds()`     |

---

