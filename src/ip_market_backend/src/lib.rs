mod types;
mod storage;
mod utils;
pub mod api {
    pub mod ip;
    pub mod nft;
    pub mod user;
    pub mod marketplace;
    pub mod admin;
}

// Optionally, re-export for use in Candid or tests
pub use types::*;
pub use storage::*;
pub use utils::*;
pub use api::*;