import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";

const PlaceBid = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { getListingById, placeBid } = useIPService();

  const [listing, setListing] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadListing();
  }, [listingId]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const result = await getListingById(listingId);

      if (result.Ok) {
        setListing(result.Ok);

        // Set minimum bid amount
        if (result.Ok.auction_data) {
          const currentBid =
            typeof result.Ok.auction_data.current_bid === "bigint"
              ? Number(result.Ok.auction_data.current_bid)
              : result.Ok.auction_data.current_bid;
          const minBidIncrement =
            typeof result.Ok.auction_data.min_bid_increment === "bigint"
              ? Number(result.Ok.auction_data.min_bid_increment)
              : result.Ok.auction_data.min_bid_increment;
          const minBid = (currentBid + minBidIncrement) / 1e8;
          setBidAmount(minBid.toFixed(2));
        }
      } else {
        throw new Error(Object.keys(result.Err)[0]);
      }
    } catch (err) {
      console.error("Error loading listing:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const bidAmountE8s = Math.floor(parseFloat(bidAmount) * 1e8);
      const result = await placeBid(listingId, bidAmountE8s);

      if (result.Ok) {
        alert("✅ Bid placed successfully!");
        navigate("/marketplace");
      } else {
        throw new Error(Object.keys(result.Err)[0]);
      }
    } catch (err) {
      console.error("Error placing bid:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleString();
  };

  const formatICP = (e8s) => {
    // Handle BigInt conversion
    const value = typeof e8s === "bigint" ? Number(e8s) : e8s;
    return (value / 1e8).toFixed(2);
  };

  const formatPrincipal = (principal) => {
    const principalStr = principal.toString();
    return `${principalStr.substring(0, 8)}...${principalStr.substring(
      principalStr.length - 8
    )}`;
  };

  const getTimeRemaining = (endTime) => {
    const now = Date.now() * 1_000_000;
    const remaining = Number(endTime) - now;

    if (remaining <= 0) return "Auction ended";

    const days = Math.floor(remaining / (24 * 60 * 60 * 1_000_000_000));
    const hours = Math.floor(
      (remaining % (24 * 60 * 60 * 1_000_000_000)) / (60 * 60 * 1_000_000_000)
    );
    const minutes = Math.floor(
      (remaining % (60 * 60 * 1_000_000_000)) / (60 * 1_000_000_000)
    );

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading auction...</span>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/marketplace")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!listing || Object.keys(listing.status)[0] !== "InAuction") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Not Available</h2>
          <p className="mb-4 text-gray-600">
            This auction is not available for bidding.
          </p>
          <button
            onClick={() => navigate("/marketplace")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const auction = listing.auction_data;
  const isAuctionEnded = Date.now() * 1_000_000 > Number(auction.auction_end);
  const currentBid =
    typeof auction.current_bid === "bigint"
      ? Number(auction.current_bid)
      : auction.current_bid;
  const minBidIncrement =
    typeof auction.min_bid_increment === "bigint"
      ? Number(auction.min_bid_increment)
      : auction.min_bid_increment;
  const minBidAmount = (currentBid + minBidIncrement) / 1e8;
  const isOwnBid =
    auction.highest_bidder && auction.highest_bidder.toString() === principal;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Place Bid</h1>

        {/* Auction Information */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Auction Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Bid:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatICP(auction.current_bid)} ICP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Bid:</span>
                  <span className="font-bold text-blue-600">
                    {minBidAmount.toFixed(2)} ICP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bid Increment:</span>
                  <span className="font-medium">
                    {formatICP(auction.min_bid_increment)} ICP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Highest Bidder:</span>
                  <span className="font-medium">
                    {auction.highest_bidder ? (
                      <>
                        {formatPrincipal(auction.highest_bidder)}
                        {isOwnBid && (
                          <span className="ml-2 text-green-600 font-bold">
                            (You)
                          </span>
                        )}
                      </>
                    ) : (
                      "None"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Time Remaining</h3>
              <div className="text-center">
                <div
                  className={`text-3xl font-bold mb-2 ${
                    isAuctionEnded ? "text-red-600" : "text-orange-600"
                  }`}
                >
                  {getTimeRemaining(auction.auction_end)}
                </div>
                <p className="text-sm text-gray-600">
                  Ends: {formatDate(auction.auction_end)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
          <div className="flex justify-between">
            <span className="text-gray-600">Seller:</span>
            <span className="font-medium">
              {formatPrincipal(listing.seller)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Listed:</span>
            <span className="text-sm">{formatDate(listing.listed_at)}</span>
          </div>
        </div>

        {/* Bid Form */}
        {!isAuctionEnded ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount (ICP)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min={minBidAmount}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder={`Minimum ${minBidAmount.toFixed(2)} ICP`}
                />
                <span className="absolute right-3 top-3 text-gray-500">
                  ICP
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                You must bid at least {minBidAmount.toFixed(2)} ICP
              </p>
            </div>

            {/* Bid Confirmation */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Bid Terms</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Your bid is binding and cannot be withdrawn</li>
                <li>• If you win, payment will be processed automatically</li>
                <li>• If outbid, your funds will be returned</li>
                <li>
                  • The auction may be extended if bids are placed near the end
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting || parseFloat(bidAmount) < minBidAmount}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Placing Bid..."
                  : `Place Bid for ${bidAmount} ICP`}
              </button>

              <button
                type="button"
                onClick={() => navigate("/marketplace")}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-2xl font-bold text-red-600 mb-4">
              Auction Ended
            </div>
            <p className="text-gray-600 mb-4">
              This auction has ended.
              {auction.highest_bidder && (
                <span className="font-semibold">
                  {" "}
                  Winner: {formatPrincipal(auction.highest_bidder)}
                </span>
              )}
            </p>
            <button
              onClick={() => navigate("/marketplace")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceBid;
