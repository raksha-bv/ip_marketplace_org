use crate::types::*;
use crate::storage::*;
use crate::utils::*;
use ic_cdk::{caller, api::time, update};

#[update]
pub fn register_ip(request: RegisterIPRequest) -> Result<IntellectualProperty> {
    let caller = caller();
    let now = time();

    if let Some(ref url) = request.image_url {
        if !validate_image_url(url) {
            return Err(IPMarketplaceError::InvalidInput);
        }
    }

    let ip_id = generate_id("IP");

    let ip = IntellectualProperty {
        id: ip_id.clone(),
        title: request.title,
        description: request.description,
        ip_type: request.ip_type,
        owner: caller,
        creator: caller,
        creation_date: now,
        registration_date: now,
        metadata: request.metadata,
        verification_status: VerificationStatus::Pending,
        nft_id: None,
        image_url: request.image_url,
        additional_files: request.additional_files,
    };

    IP_REGISTRY.with(|registry| {
        registry.borrow_mut().insert(ip_id.clone(), ip.clone());
    });

    USER_REGISTRY.with(|registry| {
        let mut users = registry.borrow_mut();
        if let Some(mut user) = users.get(&caller) {
            user.owned_ips.push(ip_id);
            users.insert(caller, user);
        }
    });

    Ok(ip)
}

// Add other IP-related functions here...