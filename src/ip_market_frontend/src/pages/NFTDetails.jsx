import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import {
  formatICP,
  formatDate,
  formatPrincipal,
  getTimeRemaining,
  formatRarityScore,
  extractOptionalValue,
} from "../utils/formatters";

const NFTDetails = () => {
  const { nftId } = useParams();
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { getNFTFullDetails, getNFTHistory, getNFTListing } = useIPService();

  const [nft, setNft] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [ip, setIp] = useState(null);
  const [listing, setListing] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTDetails = async () => {
      try {
        setLoading(true);
        const [detailsResult, historyResult, listingData] = await Promise.all([
          getNFTFullDetails(nftId),
          getNFTHistory(nftId),
          getNFTListing(nftId),
        ]);

        if (detailsResult.Ok) {
          const [nftData, metadataData, ipData] = detailsResult.Ok;
          setNft(nftData);
          setMetadata(metadataData);
          setIp(ipData);

          // Debug logging
          console.log("NFT Data:", nftData);
          console.log("Metadata Data:", metadataData);
          console.log("IP Data:", ipData);
        } else {
          throw new Error(Object.keys(detailsResult.Err)[0]);
        }

        if (historyResult.Ok) {
          setHistory(historyResult.Ok);
        }

        setListing(listingData);

        // Debug logging
        console.log("Listing Data:", listingData);
        if (listingData && listingData.auction_data) {
          console.log("Auction Data:", listingData.auction_data);
        }
      } catch (err) {
        console.error("Error fetching NFT details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (nftId) {
      fetchNFTDetails();
    }
  }, [nftId]);

  const isOwner = principal === nft?.owner.toString();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">
          Loading NFT details...
        </span>
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

  if (!nft || !metadata || !ip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">NFT Not Found</h2>
          <p className="mb-4 text-gray-600">
            The requested NFT could not be found.
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NFT Image and Basic Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              {isOwner ? (
                <>
                  {!listing && (
                    <button
                      onClick={() => navigate(`/nft/${nftId}/list`)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                    >
                      List for Sale
                    </button>
                  )}
                  {listing && (
                    <button
                      onClick={() => navigate(`/listing/${listing.id}/cancel`)}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                    >
                      Cancel Listing
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/nft/${nftId}/transfer`)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    Transfer NFT
                  </button>
                </>
              ) : (
                <>
                  {listing && (
                    <>
                      {listing.auction_data ? (
                        <button
                          onClick={() => navigate(`/listing/${listing.id}/bid`)}
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                        >
                          Place Bid
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/listing/${listing.id}/buy`)}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                        >
                          Buy Now
                        </button>
                      )}
                    </>
                  )}
                  {!listing && (
                    <div className="text-center text-gray-500 py-4">
                      This NFT is not currently listed for sale
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* NFT Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">{nft.name}</h1>
            <p className="text-gray-600 mb-4">{nft.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Collection:</span>
                <p className="font-medium">
                  {nft.collection_name || "No Collection"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Edition:</span>
                <p className="font-medium">
                  {nft.edition_number && nft.total_editions
                    ? `#${nft.edition_number} of ${nft.total_editions}`
                    : "Unique"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Token Number:</span>
                <p className="font-medium">{nft.token_id || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Views:</span>
                <p className="font-medium">{nft.view_count || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Favorites:</span>
                <p className="font-medium">{nft.favorite_count || 0}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Transferable:</span>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      nft.is_transferable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {nft.is_transferable ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Royalty:</span>
                <p className="font-medium">{nft.royalty_percentage}%</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Rarity Score:</span>
                <p className="font-medium">
                  {formatRarityScore(nft.rarity_score)}
                </p>
              </div>
            </div>
          </div>

          {/* Ownership Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Ownership</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Owner:</span>
                <p className="font-medium">{formatPrincipal(nft.owner)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Creator:</span>
                <p className="font-medium">{formatPrincipal(nft.creator)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Minted:</span>
                <p className="font-medium">{formatDate(nft.minted_at)}</p>
              </div>
            </div>
          </div>

          {/* Listing Information */}
          {listing && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                {listing.auction_data ? "Auction Details" : "Listing Details"}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      Object.keys(listing.status)[0] === "Active"
                        ? "bg-green-100 text-green-800"
                        : Object.keys(listing.status)[0] === "InAuction"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {Object.keys(listing.status)[0]}
                  </span>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    {listing.auction_data ? "Current Bid:" : "Price:"}
                  </span>
                  <p className="font-medium text-lg text-green-600">
                    {listing.auction_data
                      ? formatICP(listing.auction_data.current_bid)
                      : formatICP(listing.price)}{" "}
                    ICP
                  </p>
                </div>

                {listing.auction_data && (
                  <>
                    <div>
                      <span className="text-sm text-gray-500">Time left:</span>
                      <p className="font-medium text-orange-600">
                        {getTimeRemaining(listing.auction_data.auction_end)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Min increment:
                      </span>
                      <p className="font-medium">
                        {formatICP(listing.auction_data.min_bid_increment)} ICP
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Starting price:
                      </span>
                      <p className="font-medium">
                        {formatICP(listing.auction_data.starting_price)} ICP
                      </p>
                    </div>
                    {listing.auction_data.highest_bidder &&
                      extractOptionalValue(
                        listing.auction_data.highest_bidder
                      ) && (
                        <div>
                          <span className="text-sm text-gray-500">
                            Highest bidder:
                          </span>
                          <p className="font-medium">
                            {formatPrincipal(
                              extractOptionalValue(
                                listing.auction_data.highest_bidder
                              )
                            )}
                          </p>
                        </div>
                      )}
                  </>
                )}

                <div>
                  <span className="text-sm text-gray-500">Listed:</span>
                  <p className="font-medium">{formatDate(listing.listed_at)}</p>
                </div>

                {listing.expires_at &&
                  extractOptionalValue(listing.expires_at) && (
                    <div>
                      <span className="text-sm text-gray-500">Expires:</span>
                      <p className="font-medium">
                        {formatDate(extractOptionalValue(listing.expires_at))}
                      </p>
                    </div>
                  )}

                <div>
                  <span className="text-sm text-gray-500">Seller:</span>
                  <p className="font-medium">
                    {formatPrincipal(listing.seller)}
                  </p>
                </div>
              </div>

              {/* License Terms */}
              {listing.license_terms && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">License Terms</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Commercial:</span>
                      <span
                        className={`ml-1 ${
                          listing.license_terms.commercial_use
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {listing.license_terms.commercial_use ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Exclusive:</span>
                      <span
                        className={`ml-1 ${
                          listing.license_terms.exclusivity
                            ? "text-purple-600"
                            : "text-blue-600"
                        }`}
                      >
                        {listing.license_terms.exclusivity ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Attribution:</span>
                      <span
                        className={`ml-1 ${
                          listing.license_terms.attribution_required
                            ? "text-orange-600"
                            : "text-gray-600"
                        }`}
                      >
                        {listing.license_terms.attribution_required
                          ? "Required"
                          : "Not Required"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Modifications:</span>
                      <span
                        className={`ml-1 ${
                          listing.license_terms.modification_rights
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {listing.license_terms.modification_rights
                          ? "Allowed"
                          : "Not Allowed"}
                      </span>
                    </div>
                  </div>
                  {listing.license_terms.territory && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Territory:</span>
                      <span className="ml-1">
                        {listing.license_terms.territory}
                      </span>
                    </div>
                  )}
                  {listing.license_terms.duration && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-1">
                        {listing.license_terms.duration}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* IP Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Intellectual Property
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Title:</span>
                <p className="font-medium">{ip.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Type:</span>
                <p className="font-medium">{Object.keys(ip.ip_type)[0]}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Jurisdiction:</span>
                <p className="font-medium">{ip.metadata.jurisdiction}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Verification:</span>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      Object.keys(ip.verification_status)[0] === "Verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {Object.keys(ip.verification_status)[0]}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Attributes */}
          {metadata.attributes && metadata.attributes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Attributes</h3>
              <div className="grid grid-cols-2 gap-3">
                {metadata.attributes.map((attr, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500">
                      {attr.trait_type}
                    </div>
                    <div className="font-medium">
                      {typeof attr.value === "object"
                        ? Object.values(attr.value)[0]
                        : attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer History */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Transfer History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">From</th>
                <th className="px-4 py-2 text-left">To</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {history.map((transfer, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    {transfer.from.toString() === "aaaaa-aa"
                      ? "Mint"
                      : formatPrincipal(transfer.from)}
                  </td>
                  <td className="px-4 py-2">{formatPrincipal(transfer.to)}</td>
                  <td className="px-4 py-2">
                    {formatDate(transfer.timestamp)}
                  </td>
                  <td className="px-4 py-2">
                    {transfer.price && extractOptionalValue(transfer.price)
                      ? `${formatICP(extractOptionalValue(transfer.price))} ICP`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;
