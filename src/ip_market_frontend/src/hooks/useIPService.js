import { useAuth } from "../context/AuthProvider";
import { Principal } from "@dfinity/principal";
import { useCallback } from "react";

export const useIPService = () => {
  const { actor, principal } = useAuth(); // ✅ use context

  // IP Management
  const getUserIPs = async () => {
    if (!principal) throw new Error("Principal is undefined");
    const principalObj = Principal.fromText(principal); // ✅ safe now
    return await actor.get_user_ips(principalObj);
  };

  const searchIPs = async (query, ipType = null) => {
    return await actor.search_ips(query, ipType ? [ipType] : []);
  };

  const getIPById = async (ipId) => {
    return await actor.get_ip_by_id(ipId);
  };

  // NFT Management
  const getUserNFTs = useCallback(async () => {
    if (!principal) throw new Error("Principal is undefined");
    if (!actor) throw new Error("Actor is not initialized");

    try {
      const principalObj = Principal.fromText(principal);
      console.log(
        "Calling get_user_nfts with principal:",
        principalObj.toString()
      );

      const result = await actor.get_user_nfts(principalObj);
      console.log("get_user_nfts result:", result);

      return result;
    } catch (error) {
      console.error("Error in getUserNFTs:", error);
      throw error;
    }
  }, [principal, actor]);

  const mintNFT = async (payload) => {
    return await actor.mint_ip_nft(payload);
  };

  const getNFTById = async (nftId) => {
    return await actor.get_nft_by_id(nftId);
  };

  const getNFTMetadata = async (nftId) => {
    if (!nftId) throw new Error("NFT ID is required");
    return await actor.get_nft_metadata(nftId);
  };

  const getNFTFullDetails = async (nftId) => {
    return await actor.get_nft_full_details(nftId);
  };

  const getNFTHistory = async (nftId) => {
    return await actor.get_nft_history(nftId);
  };

  const getTrendingNFTs = async (limit = 10) => {
    return await actor.get_trending_nfts(limit);
  };

  const searchNFTs = async (query, filters) => {
    return await actor.search_nfts(query, filters);
  };

  const incrementNFTView = async (nftId) => {
    return await actor.increment_nft_view(nftId);
  };

  const toggleNFTFavorite = async (nftId) => {
    return await actor.toggle_nft_favorite(nftId);
  };

  const transferNFT = async (nftId, to) => {
    const toPrincipal = Principal.fromText(to);
    return await actor.transfer_nft(nftId, toPrincipal);
  };

  // Marketplace Functions
  const listNFTForSale = async (payload) => {
    return await actor.list_nft_for_sale(payload);
  };

  const buyNFT = async (listingId) => {
    return await actor.buy_nft(listingId);
  };

  const placeBid = async (listingId, bidAmount) => {
    return await actor.place_bid(listingId, bidAmount);
  };

  const cancelListing = async (listingId) => {
    return await actor.cancel_listing(listingId);
  };

  const getMarketplaceListings = async () => {
    return await actor.get_marketplace_listings();
  };

  const getNFTListing = async (nftId) => {
    try {
      const allListings = await actor.get_marketplace_listings();
      return allListings.find((listing) => listing.nft_id === nftId);
    } catch (error) {
      console.error("Error fetching NFT listing:", error);
      return null;
    }
  };

  const getListingById = async (listingId) => {
    return await actor.get_listing_by_id(listingId);
  };

  const getListingsBySeller = async (seller) => {
    const sellerPrincipal = Principal.fromText(seller);
    return await actor.get_listings_by_seller(sellerPrincipal);
  };

  const getMarketplaceStats = useCallback(async () => {
    if (!actor) throw new Error("Actor is not initialized");
    return await actor.get_marketplace_stats();
  }, [actor]);

  const getNFTCollectionStats = async (collectionName) => {
    return await actor.get_nft_collection_stats(collectionName);
  };

  // User Management
  const getUserProfile = async (user) => {
    const userPrincipal = Principal.fromText(user);
    return await actor.get_user_profile(userPrincipal);
  };

  const updateUserProfile = async (payload) => {
    return await actor.update_user_profile(payload);
  };

  return {
    // IP Management
    getUserIPs,
    searchIPs,
    getIPById,

    // NFT Management
    getUserNFTs,
    mintNFT,
    getNFTById,
    getNFTMetadata,
    getNFTFullDetails,
    getNFTHistory,
    getTrendingNFTs,
    searchNFTs,
    incrementNFTView,
    toggleNFTFavorite,
    transferNFT,

    // Marketplace
    listNFTForSale,
    buyNFT,
    placeBid,
    cancelListing,
    getMarketplaceListings,
    getNFTListing,
    getListingById,
    getListingsBySeller,
    getMarketplaceStats,
    getNFTCollectionStats,

    // User Management
    getUserProfile,
    updateUserProfile,
  };
};
