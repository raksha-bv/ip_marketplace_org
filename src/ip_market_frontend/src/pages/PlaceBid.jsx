import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";

const PlaceBid = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { actor } = useAuth();
  const { getListingById, placeBid } = useIPService();

  const [listing, setListing] = useState(null);
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    loadListing();
  }, [listingId]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const result = await getListingById(listingId);

      if (result.Ok) {
        setListing(result.Ok);

        // Also load NFT details
        const nftResult = await actor.get_nft_by_id(result.Ok.nft_id);
        if (nftResult.Ok) {
          setNft(nftResult.Ok);
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

  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

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

  if (error) {
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

  if (!listing || !listing.auction_data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Not an Auction</h2>
          <p className="mb-4 text-gray-600">This listing is not an auction.</p>
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

  const isAuctionActive = Object.keys(listing.status)[0] === "InAuction";
  const currentBid = formatICP(listing.auction_data.current_bid);
  const minBid = formatICP(
    listing.auction_data.current_bid + listing.auction_data.min_bid_increment
  );
  const timeRemaining = getTimeRemaining(listing.auction_data.auction_end);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Place Bid</h1>

        {/* NFT and Auction Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            {nft && (
              <div className="space-y-4">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-64 object-cover rounded"
                />
                <div>
                  <h3 className="text-xl font-semibold">{nft.name}</h3>
                  <p className="text-gray-600">{nft.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Auction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Bid:</span>
                  <span className="font-bold text-green-600">
                    {currentBid} ICP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Next Bid:</span>
                  <span className="font-bold">{minBid} ICP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Remaining:</span>
                  <span
                    className={`font-bold ${
                      timeRemaining === "Auction ended"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {timeRemaining}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auction Ends:</span>
                  <span className="text-sm">
                    {formatDate(listing.auction_data.auction_end)}
                  </span>
                </div>
                {listing.auction_data.highest_bidder && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highest Bidder:</span>
                    <span className="text-sm font-mono">
                      {listing.auction_data.highest_bidder
                        .toString()
                        .substring(0, 8)}
                      ...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bid Form */}
            {isAuctionActive && timeRemaining !== "Auction ended" ? (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount (ICP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={minBid}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Minimum ${minBid} ICP`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum bid: {minBid} ICP
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800">
                    Bidding Terms
                  </h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Bids are binding and cannot be withdrawn</li>
                    <li>• You will be notified if you are outbid</li>
                    <li>• Winner must complete payment within 24 hours</li>
                    <li>• All sales are final</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Placing Bid..." : "Place Bid"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/marketplace")}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">
                  {timeRemaining === "Auction ended"
                    ? "This auction has ended"
                    : "This auction is not active"}
                </p>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Back to Marketplace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
