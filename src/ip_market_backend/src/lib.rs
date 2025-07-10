// Module declarations
pub mod types;
pub mod storage;
pub mod utils;
pub mod ip_registry;
pub mod nft_management;
pub mod user_management;
pub mod marketplace;

// Re-export public types and functions
pub use types::*;
pub use ip_registry::*;
pub use nft_management::*;
pub use user_management::*;
pub use marketplace::*;

use ic_cdk::{init, post_upgrade, pre_upgrade};
use candid::Principal;

// Canister lifecycle functions
#[init]
fn init() {
    // Initialize the canister
    // The stable structures are automatically initialized
    ic_cdk::println!("IP Marketplace backend canister initialized");
}

#[pre_upgrade]
fn pre_upgrade() {
    // Called before canister upgrade
    // With ic-stable-structures, data is automatically persisted
    ic_cdk::println!("Starting canister upgrade - data will be preserved in stable memory");
}

#[post_upgrade]
fn post_upgrade() {
    // Called after canister upgrade
    // With ic-stable-structures, data is automatically restored
    ic_cdk::println!("Canister upgrade completed - data restored from stable memory");
}

// Export the candid interface
ic_cdk::export_candid!();