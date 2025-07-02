use crate::types::*;
use crate::storage::*;
use ic_cdk::{update};

#[update]
pub fn verify_ip(ip_id: String, status: VerificationStatus) -> Result<bool> {
    IP_REGISTRY.with(|registry| {
        let mut ips = registry.borrow_mut();
        if let Some(mut ip) = ips.get(&ip_id) {
            ip.verification_status = status;
            ips.insert(ip_id, ip);
            Ok(true)
        } else {
            Err(IPMarketplaceError::NotFound)
        }
    })
}

#[update]
pub fn update_user_reputation(user: Principal, score_change: i32) -> Result<u32> {
    USER_REGISTRY.with(|registry| {
        let mut users = registry.borrow_mut();
        if let Some(mut user_profile) = users.get(&user) {
            if score_change < 0 && (-score_change) as u32 > user_profile.reputation_score {
                user_profile.reputation_score = 0;
            } else {
                user_profile.reputation_score = (user_profile.reputation_score as i32 + score_change) as u32;
            }
            let new_score = user_profile.reputation_score;
            users.insert(user, user_profile);
            Ok(new_score)
        } else {
            Err(IPMarketplaceError::NotFound)
        }
    })
}