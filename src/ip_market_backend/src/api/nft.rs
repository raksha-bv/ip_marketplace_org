use crate::types::*;
use crate::storage::*;
use crate::utils::*;
use ic_cdk::{caller, api::time, update};

#[update]
pub fn mint_ip_nft(request: MintNFTRequest) -> Result<IPNft> {
    let caller = caller();
    let now = time();

    let ip = IP_REGISTRY.with(|registry| {
        registry.borrow().get(&request.ip_id)
    }).ok_or(IPMarketplaceError::NotFound)?;

    if ip.owner != caller {
        return Err(IPMarketplaceError::Unauthorized);
    }
    if ip.nft_id.is_some() {
        return Err(IPMarketplaceError::AlreadyExists);
    }
    if !validate_image_url(&request.image) {
        return Err(IPMarketplaceError::InvalidInput);
    }

    let nft_id = generate_id("NFT");
    let token_id = COUNTER.with(|counter| {
        let current = *counter.borrow();
        *counter.borrow_mut() = current + 1;
        current
    });

    let rarity_score = calculate_rarity_score(&request.attributes);

    let metadata = NFTMetadata {
        token_id: nft_id.clone(),
        name: request.name.clone(),
        description: request.description.clone(),
        image: request.image.clone(),
        external_url: request.external_url,
        animation_url: request.animation_url,
        background_color: request.background_color,
        attributes: request.attributes,
        ip_category: ip.metadata.category.clone(),
        ip_type: format!("{:?}", ip.ip_type),
        creator: caller.to_string(),
        creation_date: format_timestamp(ip.creation_date),
        jurisdiction: Some(ip.metadata.jurisdiction.clone()),
        license_type: None,
        file_type: Some("image/png".to_string()),
        file_size: None,
        resolution: None,
        duration: None,
        minted_date: format_timestamp(now),
        blockchain: "Internet Computer".to_string(),
        token_standard: "ICRC-7".to_string(),
    };

    NFT_METADATA.with(|registry| {
        registry.borrow_mut().insert(nft_id.clone(), metadata);
    });

    let nft = IPNft {
        id: nft_id.clone(),
        ip_id: request.ip_id.clone(),
        token_id,
        owner: caller,
        creator: caller,
        metadata_uri: format!("ic://{}/metadata/{}", ic_cdk::id(), nft_id),
        minted_at: now,
        royalty_percentage: request.royalty_percentage.unwrap_or(10),
        is_transferable: true,
        name: request.name,
        description: request.description,
        image: request.image,
        collection_name: request.collection_name,
        edition_number: request.edition_number,
        total_editions: request.total_editions,
        rarity_rank: None,
        rarity_score: Some(rarity_score),
        transfer_history: vec![TransferRecord {
            from: Principal::anonymous(),
            to: caller,
            timestamp: now,
            transaction_hash: None,
            price: None,
        }],
        view_count: 0,
        favorite_count: 0,
    };

    NFT_REGISTRY.with(|registry| {
        registry.borrow_mut().insert(nft_id.clone(), nft.clone());
    });

    IP_REGISTRY.with(|registry| {
        let mut ips = registry.borrow_mut();
        let mut updated_ip = ip;
        updated_ip.nft_id = Some(nft_id.clone());
        ips.insert(request.ip_id, updated_ip);
    });

    USER_REGISTRY.with(|registry| {
        let mut users = registry.borrow_mut();
        if let Some(mut user) = users.get(&caller) {
            user.owned_nfts.push(nft_id);
            users.insert(caller, user);
        }
    });

    Ok(nft)
}

// Add other NFT-related functions here...