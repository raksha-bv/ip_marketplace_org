import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import {
  formatICP,
  formatDate,
  formatPrincipal,
  getTimeRemaining,
  extractOptionalValue,
} from "../utils/formatters";
import MarketplaceStats from "../components/MarketplaceStats";

export default function MarketPlace() {
  const { actor, isAuthenticated } = useAuth();
  const { getMarketplaceListings } = useIPService();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'auctions', 'fixed'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'price_low', 'price_high'

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    try {
      setLoading(true);
      const result = await getMarketplaceListings();
      setListings(result);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAndSortedListings = () => {
    let filtered = listings;

    // Apply filter
    if (filter === "auctions") {
      filtered = listings.filter(
        (listing) => Object.keys(listing.status)[0] === "InAuction"
      );
    } else if (filter === "fixed") {
      filtered = listings.filter(
        (listing) =>
          Object.keys(listing.status)[0] === "Active" && !listing.auction_data
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return Number(a.listed_at) - Number(b.listed_at);
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "newest":
        default:
          return Number(b.listed_at) - Number(a.listed_at);
      }
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">
          Loading marketplace...
        </span>
      </div>
    );
  }

  const processedListings = filteredAndSortedListings();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">IP Marketplace</h1>
          {isAuthenticated && (
            <Link
              to="/marketplace/list"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Create Listing
            </Link>
          )}
        </div>

        {/* Marketplace Stats */}
        <MarketplaceStats />
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Listings</option>
              <option value="fixed">Fixed Price</option>
              <option value="auctions">Auctions</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <button
            onClick={fetchListings}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Listings */}
      {processedListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === "all"
              ? "No listings found"
              : `No ${filter} listings found`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === "all"
              ? "Be the first to create a listing in the marketplace!"
              : "Try changing your filter or browse all listings."}
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated && (
              <Link
                to="/marketplace/list"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Create Listing
              </Link>
            )}
            <Link
              to="/explore"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Explore NFTs
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      NFT: {listing.nft_id.substring(0, 8)}...
                    </h3>
                    <p className="text-sm text-gray-600">
                      By {formatPrincipal(listing.seller)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      Object.keys(listing.status)[0] === "Active"
                        ? "bg-green-100 text-green-800"
                        : Object.keys(listing.status)[0] === "InAuction"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {Object.keys(listing.status)[0] === "InAuction"
                      ? "Auction"
                      : "Fixed Price"}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      {listing.auction_data ? "Current Bid" : "Price"}:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {listing.auction_data
                        ? formatICP(listing.auction_data.current_bid)
                        : formatICP(listing.price)}{" "}
                      ICP
                    </span>
                  </div>

                  {listing.auction_data && (
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Time left:</span>
                        <span className="font-medium text-orange-600">
                          {getTimeRemaining(listing.auction_data.auction_end)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min increment:</span>
                        <span>
                          {formatICP(listing.auction_data.min_bid_increment)}{" "}
                          ICP
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Listed:</span>
                    <span>{formatDate(listing.listed_at)}</span>
                  </div>
                  {listing.expires_at &&
                    extractOptionalValue(listing.expires_at) && (
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span>
                          {formatDate(extractOptionalValue(listing.expires_at))}
                        </span>
                      </div>
                    )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/nft/${listing.nft_id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
                  >
                    View NFT
                  </Link>

                  {listing.auction_data ? (
                    <Link
                      to={`/listing/${listing.id}/bid`}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded text-center hover:bg-purple-700 transition-colors"
                    >
                      Place Bid
                    </Link>
                  ) : (
                    <Link
                      to={`/listing/${listing.id}/buy`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-center hover:bg-green-700 transition-colors"
                    >
                      Buy Now
                    </Link>
                  )}
                </div>

                {/* License Terms Preview */}
                {listing.license_terms && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Commercial:</span>
                        <span
                          className={
                            listing.license_terms.commercial_use
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {listing.license_terms.commercial_use ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exclusive:</span>
                        <span
                          className={
                            listing.license_terms.exclusivity
                              ? "text-purple-600"
                              : "text-blue-600"
                          }
                        >
                          {listing.license_terms.exclusivity ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
