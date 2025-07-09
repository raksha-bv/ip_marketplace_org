import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";

const BuyNFT = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { actor } = useAuth();
  const { getListingById, buyNFT } = useIPService();

  const [listing, setListing] = useState(null);
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

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

  const handlePurchase = async () => {
    if (!confirmed) {
      setError("Please confirm the purchase terms");
      return;
    }

    setPurchasing(true);
    setError(null);

    try {
      const result = await buyNFT(listingId);

      if (result.Ok) {
        alert("✅ NFT purchased successfully!");
        navigate("/dashboard");
      } else {
        throw new Error(Object.keys(result.Err)[0]);
      }
    } catch (err) {
      console.error("Error purchasing NFT:", err);
      setError(err.message);
    } finally {
      setPurchasing(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading listing...</span>
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

  if (!listing || Object.keys(listing.status)[0] !== "Active") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Not Available</h2>
          <p className="mb-4 text-gray-600">
            This NFT is not available for purchase.
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

  const isExpired =
    listing.expires_at &&
    Date.now() * 1_000_000 > Number(listing.expires_at[0]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Purchase NFT</h1>

        {/* NFT and Purchase Info */}
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
              <h3 className="text-lg font-semibold mb-4">Purchase Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-green-600 text-xl">
                    {formatICP(listing.price)} ICP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-mono text-sm">
                    {formatPrincipal(listing.seller)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="text-sm">
                    {formatDate(listing.listed_at)}
                  </span>
                </div>
                {listing.expires_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span
                      className={`text-sm ${isExpired ? "text-red-600" : ""}`}
                    >
                      {formatDate(listing.expires_at[0])}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Royalty:</span>
                  <span className="text-sm">
                    {nft?.royalty_percentage || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* License Terms */}
            {listing.license_terms && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">License Terms</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Commercial Use:</span>
                    <span
                      className={
                        listing.license_terms.commercial_use
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {listing.license_terms.commercial_use
                        ? "Allowed"
                        : "Not Allowed"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modifications:</span>
                    <span
                      className={
                        listing.license_terms.modification_rights
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {listing.license_terms.modification_rights
                        ? "Allowed"
                        : "Not Allowed"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attribution:</span>
                    <span
                      className={
                        listing.license_terms.attribution_required
                          ? "text-orange-600"
                          : "text-green-600"
                      }
                    >
                      {listing.license_terms.attribution_required
                        ? "Required"
                        : "Not Required"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>License Type:</span>
                    <span
                      className={
                        listing.license_terms.exclusivity
                          ? "text-purple-600"
                          : "text-blue-600"
                      }
                    >
                      {listing.license_terms.exclusivity
                        ? "Exclusive"
                        : "Non-Exclusive"}
                    </span>
                  </div>
                  {listing.license_terms.territory && (
                    <div className="flex justify-between">
                      <span>Territory:</span>
                      <span>{listing.license_terms.territory}</span>
                    </div>
                  )}
                  {listing.license_terms.usage_rights &&
                    listing.license_terms.usage_rights.length > 0 && (
                      <div>
                        <span className="font-medium">Usage Rights:</span>
                        <ul className="list-disc list-inside mt-1 text-xs">
                          {listing.license_terms.usage_rights.map(
                            (right, index) => (
                              <li key={index}>{right}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Purchase Form */}
            {!isExpired ? (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800">
                    Purchase Terms
                  </h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• This purchase is final and non-refundable</li>
                    <li>• You will receive full ownership of the NFT</li>
                    <li>• The license terms above will apply to your usage</li>
                    <li>• Payment will be processed immediately</li>
                  </ul>
                </div>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">
                    I have read and agree to the purchase terms and license
                    conditions
                  </span>
                </label>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || !confirmed}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchasing
                      ? "Processing..."
                      : `Purchase for ${formatICP(listing.price)} ICP`}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/marketplace")}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-red-600 mb-4">
                  This listing has expired
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
      </div>
    </div>
  );
};

export default BuyNFT;
