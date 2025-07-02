use crate::types::*;
use crate::storage::*;
use crate::utils::*;
use ic_cdk::{caller, api::time, update};

#[update]
pub fn list_nft_for_sale(request: ListNFTRequest) -> Result<MarketplaceListing> {
    let caller = caller();
    let now = time();

    let nft = NFT_REGISTRY.with(|registry| {
        registry.borrow().get(&request.nft_id)
    }).ok_or(IPMarketplaceError::NotFound)?;

    if nft.owner != caller {
        return Err(IPMarketplaceError::Unauthorized);
    }

    let listing_id = generate_id("LISTING");

    let auction_data = if request.is_auction {
        Some(AuctionData {
            starting_price: request.price,
            current_bid: request.price,
            highest_bidder: None,
            auction_end: now + request.auction_duration.unwrap_or(7 * 24 * 3600 * 1_000_000_000),
            min_bid_increment: request.min_bid_increment.unwrap_or(request.price / 100),
        })
    } else {
        None
    };

    let listing = MarketplaceListing {
        id: listing_id.clone(),
        nft_id: request.nft_id,
        seller: caller,
        price: request.price,
        currency: request.currency,
        listed_at: now,
        expires_at: request.expires_at,
        status: if request.is_auction { ListingStatus::InAuction } else { ListingStatus::Active },
        license_terms: request.license_terms,
        auction_data,
    };

    MARKETPLACE.with(|registry| {
        registry.borrow_mut().insert(listing_id, listing.clone());
    });

    Ok(listing)
}

// Add other marketplace-related functions here...