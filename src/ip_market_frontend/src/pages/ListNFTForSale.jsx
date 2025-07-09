import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";

const ListNFTForSale = () => {
  const { nftId } = useParams();
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { getNFTById, listNFTForSale } = useIPService();

  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    price: "",
    currency: "ICP",
    isAuction: false,
    auctionDuration: 7, // days
    minBidIncrement: "",
    expiresIn: 30, // days
    licenseTerms: {
      usage_rights: [],
      commercial_use: true,
      modification_rights: true,
      attribution_required: true,
      exclusivity: false,
      territory: "", // Will be converted to [] if empty
      duration: null, // Will be converted to [] if null
    },
  });

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        setLoading(true);
        const result = await getNFTById(nftId);

        if (result.Ok) {
          setNft(result.Ok);

          // Check if user owns this NFT
          if (principal !== result.Ok.owner.toString()) {
            setError("You do not own this NFT");
          }
        } else {
          throw new Error(Object.keys(result.Err)[0]);
        }
      } catch (err) {
        console.error("Error fetching NFT:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (nftId) {
      fetchNFT();
    }
  }, [nftId, principal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const priceInE8s = Math.floor(parseFloat(form.price) * 1e8);
      const auctionDurationNs = form.isAuction
        ? form.auctionDuration * 24 * 60 * 60 * 1_000_000_000
        : null;
      const minBidIncrementE8s =
        form.isAuction && form.minBidIncrement
          ? Math.floor(parseFloat(form.minBidIncrement) * 1e8)
          : null;
      const expiresAtNs =
        Date.now() * 1_000_000 + form.expiresIn * 24 * 60 * 60 * 1_000_000_000;

      // Format license terms for Candid interface
      const licenseTerms = {
        usage_rights: form.licenseTerms.usage_rights,
        commercial_use: form.licenseTerms.commercial_use,
        modification_rights: form.licenseTerms.modification_rights,
        attribution_required: form.licenseTerms.attribution_required,
        exclusivity: form.licenseTerms.exclusivity,
        territory:
          form.licenseTerms.territory && form.licenseTerms.territory.trim()
            ? [form.licenseTerms.territory.trim()]
            : [],
        duration: form.licenseTerms.duration
          ? [form.licenseTerms.duration]
          : [],
      };

      const payload = {
        nft_id: nftId,
        price: priceInE8s,
        currency: form.currency,
        is_auction: form.isAuction,
        auction_duration: auctionDurationNs ? [auctionDurationNs] : [],
        min_bid_increment: minBidIncrementE8s ? [minBidIncrementE8s] : [],
        expires_at: [expiresAtNs],
        license_terms: [licenseTerms],
      };

      console.log("Listing payload:", JSON.stringify(payload, null, 2));

      const result = await listNFTForSale(payload);

      if (result.Ok) {
        alert("✅ NFT listed successfully!");
        navigate("/marketplace");
      } else {
        throw new Error(Object.keys(result.Err)[0]);
      }
    } catch (err) {
      console.error("Error listing NFT:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUsageRightChange = (right, checked) => {
    setForm((prev) => ({
      ...prev,
      licenseTerms: {
        ...prev.licenseTerms,
        usage_rights: checked
          ? [...prev.licenseTerms.usage_rights, right]
          : prev.licenseTerms.usage_rights.filter((r) => r !== right),
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading NFT...</span>
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
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">List NFT for Sale</h1>
          <Link
            to="/marketplace"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Marketplace
          </Link>
        </div>

        {/* Info Box */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-800">
                Set your price, auction settings, and license terms to list your
                NFT in the marketplace.
              </span>
            </div>
          </div>
        </div>

        {/* NFT Preview */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <img
              src={nft?.image}
              alt={nft?.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="text-xl font-semibold">{nft?.name}</h3>
              <p className="text-gray-600">{nft?.description}</p>
              <p className="text-sm text-gray-500">Token ID: {nft?.token_id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sale Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sale Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="saleType"
                  value="fixed"
                  checked={!form.isAuction}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, isAuction: false }))
                  }
                  className="mr-2"
                />
                Fixed Price
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="saleType"
                  value="auction"
                  checked={form.isAuction}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, isAuction: true }))
                  }
                  className="mr-2"
                />
                Auction
              </label>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {form.isAuction ? "Starting Price" : "Price"} (ICP)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Auction Settings */}
          {form.isAuction && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auction Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={form.auctionDuration}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      auctionDuration: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Bid Increment (ICP)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.minBidIncrement}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minBidIncrement: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty for auto-calculated increment (1% of current
                  price)
                </p>
              </div>
            </div>
          )}

          {/* Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Expires In (days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={form.expiresIn}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  expiresIn: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* License Terms */}
          <div>
            <h3 className="text-lg font-semibold mb-4">License Terms</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Rights
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Personal Use",
                    "Commercial Use",
                    "Modification",
                    "Distribution",
                    "Public Display",
                    "Resale",
                  ].map((right) => (
                    <label key={right} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.licenseTerms.usage_rights.includes(right)}
                        onChange={(e) =>
                          handleUsageRightChange(right, e.target.checked)
                        }
                        className="mr-2"
                      />
                      {right}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.licenseTerms.commercial_use}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        licenseTerms: {
                          ...prev.licenseTerms,
                          commercial_use: e.target.checked,
                        },
                      }))
                    }
                    className="mr-2"
                  />
                  Commercial Use Allowed
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.licenseTerms.modification_rights}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        licenseTerms: {
                          ...prev.licenseTerms,
                          modification_rights: e.target.checked,
                        },
                      }))
                    }
                    className="mr-2"
                  />
                  Modification Rights
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.licenseTerms.attribution_required}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        licenseTerms: {
                          ...prev.licenseTerms,
                          attribution_required: e.target.checked,
                        },
                      }))
                    }
                    className="mr-2"
                  />
                  Attribution Required
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.licenseTerms.exclusivity}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        licenseTerms: {
                          ...prev.licenseTerms,
                          exclusivity: e.target.checked,
                        },
                      }))
                    }
                    className="mr-2"
                  />
                  Exclusive License
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Territory (optional)
                </label>
                <input
                  type="text"
                  value={form.licenseTerms.territory}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      licenseTerms: {
                        ...prev.licenseTerms,
                        territory: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., Worldwide, USA, Europe"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Listing..."
                : form.isAuction
                ? "Start Auction"
                : "List for Sale"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListNFTForSale;
