use crate::types::*;
use crate::storage::*;
use ic_cdk::{caller, api::time, update};

#[update]
pub fn create_user_profile(request: CreateUserRequest) -> Result<UserProfile> {
    let caller = caller();
    let now = time();

    let exists = USER_REGISTRY.with(|registry| {
        registry.borrow().contains_key(&caller)
    });

    if exists {
        return Err(IPMarketplaceError::AlreadyExists);
    }

    let user = UserProfile {
        principal: caller,
        username: request.username,
        email: request.email,
        bio: request.bio,
        reputation_score: 0,
        verified: false,
        created_at: now,
        owned_ips: Vec::new(),
        owned_nfts: Vec::new(),
        avatar_url: request.avatar_url,
        banner_url: request.banner_url,
        social_links: request.social_links,
        total_sales: 0,
        total_purchases: 0,
    };

    USER_REGISTRY.with(|registry| {
        registry.borrow_mut().insert(caller, user.clone());
    });

    Ok(user)
}

// Add other user-related functions here...