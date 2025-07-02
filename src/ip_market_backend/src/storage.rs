use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use std::cell::RefCell;
use crate::types::*;

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    pub static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    pub static IP_REGISTRY: RefCell<StableBTreeMap<String, IntellectualProperty, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    pub static NFT_REGISTRY: RefCell<StableBTreeMap<String, IPNft, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );

    pub static USER_REGISTRY: RefCell<StableBTreeMap<Principal, UserProfile, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );

    pub static MARKETPLACE: RefCell<StableBTreeMap<String, MarketplaceListing, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
        )
    );

    pub static NFT_METADATA: RefCell<StableBTreeMap<String, NFTMetadata, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4))),
        )
    );

    pub static COUNTER: RefCell<u64> = RefCell::new(0);
}