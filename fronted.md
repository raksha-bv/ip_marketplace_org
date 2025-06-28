# 🎨 Frontend Documentation: Decentralized IP Marketplace on ICP

## 🌐 Framework & Stack

* **Framework**: React js
* **Styling**: Tailwind CSS (utility-first CSS framework)
* **Auth**: Internet Identity (passwordless login)
* **Wallet**: Plug Wallet for ICP token transactions
* **API/Canister Interaction**: @dfinity/agent

---

## 🖼️ UI Pages and Routes

### `/` - **Homepage**

* Hero section with app intro
* Featured IP assets carousel/grid
* Call to action buttons (Register IP, Explore Marketplace)

### `/register` - **Register IP Asset**

* Form to submit metadata (title, jurisdiction, etc.)
* Document upload to IPFS/ICP asset canister
* Trigger smart contract registration (mint NFT)

### `/explore` - **Marketplace Explorer**

* Grid/List view of all IP assets
* Filters (type, jurisdiction, owner, license status)
* Search bar

### `/asset/[id]` - **Single IP Asset View**

* Display asset metadata & documents
* Show license terms / ownership history
* CTA to License or Buy/Transfer

### `/profile/[principal]` - **User Profile**

* Display owned/licensed IPs
* Transaction history
* Manage license actions

---

## 🧩 Frontend Components

### `AssetCard`

* Compact display for IP item
* Shows title, owner, jurisdiction, type
* Used on homepage and explore page

### `LicenseForm`

* Form to generate a new license
* Fields: licensee, terms, duration, royalty
* Calls backend licensing canister

### `UploadSection`

* File input (PDF, image)
* Uploads to IPFS or asset canister
* Computes SHA256 hash

### `IdentityLogin`

* Auth integration with Internet Identity
* Shows login/logout buttons and session status

### `PlugWalletButton`

* Connect Plug wallet
* Display current balance
* Trigger payments or signing for transactions

### `LicenseViewer`

* Visualize current license info
* Attribution + expiration + royalty info

### `NFTViewer`

* Renders token metadata from canister
* Shows ownership transfer history

---

## 📁 Recommended File Structure

```bash
*exmaple for thr file structure
/ip-frontend
├── components
│   ├── AssetCard.tsx
│   ├── LicenseForm.tsx
│   ├── UploadSection.tsx
│   ├── IdentityLogin.tsx
│   ├── PlugWalletButton.tsx
│   └── NFTViewer.tsx
├── pages
│   ├── index.tsx
│   ├── register.tsx
│   ├── explore.tsx
│   └── asset
│       └── [id].tsx
│   └── profile
│       └── [principal].tsx
├── hooks
│   ├── useAuth.ts
│   ├── useCanister.ts
│   └── useIPAssets.ts
├── lib
│   ├── ipfs.ts
│   ├── wallet.ts
│   └── utils.ts
├── state
│   ├── userStore.ts
│   └── assetStore.ts
├── styles
│   └── globals.css
├── public
│   └── logo.svg
└── next.config.js
```

---

## 🔐 Internet Identity Integration

* Use `@dfinity/auth-client`
* Store principal in Zustand or Context
* Auto-login and session recovery on refresh

---

## 💸 Plug Wallet Integration

* Use Plug’s JavaScript API
* `window.ic.plug.requestConnect()` to initiate
* Enable sending ICP or interacting with canisters

---

## 📦 Data Flow: Example - Register IP

1. User logs in with Internet Identity
2. Uploads legal docs → gets IPFS hash
3. Submits metadata → `register_ip_asset(...)`
4. Backend mints DIP721 NFT
5. Frontend confirms registration + shows NFT

---

## ✅ UI/UX Feature Checklist

| Feature             | Reason                                          |
| ------------------- | ----------------------------------------------- |
| Responsive UI       | Works on mobile, tablet, desktop                |
| Toast Notifications | Feedback on registration, transfer, payments    |
| Loading States      | While interacting with canisters/IPFS           |
| Error Boundaries    | Graceful handling of canister or network issues |
| Skeleton Loaders    | Improve perceived performance                   |

---

## 🔮 Suggestions for Enhancements

* Use **Shadcn/ui** for modern, accessible components
* Add **dark mode toggle**
* Enable **live IP NFT previews** using canister data
* Integrate **chart.js** for license or revenue analytics

---
