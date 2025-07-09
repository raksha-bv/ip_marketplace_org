import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import {
  formatICP,
  formatDateOnly,
  formatRarityScore,
} from "../utils/formatters";

const NFTCard = ({ nft, listing, onFavorite, onView, showActions = true }) => {
  const { principal } = useAuth();
  const { incrementNFTView, toggleNFTFavorite } = useIPService();
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    try {
      setLoading(true);
      await incrementNFTView(nft.id);
      if (onView) onView(nft.id);
    } catch (error) {
      console.error("Error incrementing view:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      setLoading(true);
      await toggleNFTFavorite(nft.id);
      if (onFavorite) onFavorite(nft.id);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = principal === nft.owner.toString();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={handleView}
        />
        {nft.collection_name && (
          <div className="absolute top-2 left-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
            {nft.collection_name}
          </div>
        )}
        {nft.edition_number && nft.total_editions && (
          <div className="absolute top-2 right-2 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
            #{nft.edition_number}/{nft.total_editions}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{nft.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {nft.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">
            Creator: {nft.creator.toString().substring(0, 8)}...
          </span>
          <span className="text-sm text-gray-500">
            Royalty: {nft.royalty_percentage}%
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-3">👁️ {nft.view_count}</span>
            <span>❤️ {nft.favorite_count}</span>
          </div>
          {nft.rarity_score && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Rarity: {formatRarityScore(nft.rarity_score)}
            </span>
          )}
        </div>

        {/* Price Display */}
        {listing && (
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {listing.auction_data ? "Current Bid" : "Price"}:
              </span>
              <span className="text-lg font-bold text-green-600">
                {listing.auction_data
                  ? formatICP(listing.auction_data.current_bid)
                  : formatICP(listing.price)}{" "}
                ICP
              </span>
            </div>
            {listing.auction_data && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Status:</span>
                <span className="text-xs text-purple-600">
                  {Object.keys(listing.status)[0]}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 mb-3">
          Minted: {formatDateOnly(nft.minted_at)}
        </div>

        {listing && (
          <div className="bg-green-50 text-green-800 text-sm p-2 rounded mb-3">
            Listed for: {formatICP(listing.price)} ICP
          </div>
        )}

        {showActions && (
          <div className="flex gap-2">
            <Link
              to={`/nft/${nft.id}`}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>

            {!isOwner && (
              <button
                onClick={handleFavorite}
                disabled={loading}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                {loading ? "⏳" : "❤️"}
              </button>
            )}

            {isOwner && (
              <Link
                to={`/nft/${nft.id}/list`}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                List
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
