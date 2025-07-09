import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import { Link } from "react-router";
import { useLocation } from "react-router";

// Helper functions
const getVariantValue = (variant) => {
  if (typeof variant === "object" && variant !== null) {
    const keys = Object.keys(variant);
    if (keys.length > 0) {
      return keys[0];
    }
  }
  return variant;
};

export default function Dashboard() {
  const { isAuthenticated, userProfile, actor, loading } = useAuth();
  const { getUserNFTs } = useIPService();
  const [userIPs, setUserIPs] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const location = useLocation();
  const [filter, setFilter] = useState("all");
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && actor && userProfile) {
        try {
          const [ipResult, nftResult] = await Promise.all([
            actor.get_user_ips(userProfile.principal),
            getUserNFTs(),
          ]);
          setUserIPs(ipResult);
          setUserNFTs(nftResult);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoadingData(false);
    };

    if (location.state?.refetch) {
      fetchUserData();
      window.history.replaceState({}, document.title);
    } else {
      fetchUserData();
    }
  }, [isAuthenticated, actor, userProfile, getUserNFTs]);

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="mb-4 text-gray-600">
            Please login to access the dashboard.
          </p>
          <Link
            to="/login"
            className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Profile Setup Required</h2>
          <p className="mb-4 text-gray-600">
            Please complete your profile to continue.
          </p>
          <Link
            to="/login"
            className="text-white bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {userProfile.username}!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="IP Assets Owned" value={userIPs.length} icon="📄" />
          <StatCard label="NFTs Owned" value={userNFTs.length} icon="🖼️" />
          <StatCard
            label="Reputation Score"
            value={userProfile.reputation_score}
            icon="⭐"
          />
          <StatCard
            label="Verification Status"
            value={userProfile.verified ? "Verified" : "Pending"}
            icon="✅"
          />
        </div>

        {/* Filters */}
        <div className="flex justify-end mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="ip">IP Assets</option>
            <option value="nft">NFTs</option>
          </select>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm text-center"
            >
              ➕ Register New IP
            </Link>
            <Link
              to="/mint-nft"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm text-center"
            >
              🎨 Mint NFT
            </Link>
            <Link
              to="/marketplace/list"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm text-center"
            >
              🏪 List NFT for Sale
            </Link>
          </div>
        </div>

        {/* IP/NFT Listing */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Your Assets</h3>

          {filter === "ip" || filter === "all" ? (
            userIPs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {userIPs.map((ip) => (
                  <div key={ip.id} className="border p-4 rounded-lg">
                    <h4 className="font-medium">{ip.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {ip.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {getVariantValue(ip.ip_type)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          getVariantValue(ip.verification_status) === "Verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getVariantValue(ip.verification_status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-6">
                You don't own any IP assets yet.
              </p>
            )
          ) : null}

          {filter === "nft" || filter === "all" ? (
            userNFTs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userNFTs.map((nft) => {
                  // Handle different image URL formats
                  let displayImageUrl = nft.image;

                  // If it's an IPFS URL, use it as-is
                  if (
                    nft.image.includes("ipfs/") ||
                    nft.image.includes("pinata.cloud")
                  ) {
                    displayImageUrl = nft.image;
                  }
                  // Handle Unsplash URLs
                  else if (nft.image.includes("unsplash.com/photos/")) {
                    const urlParts = nft.image.split("/");
                    const lastPart = urlParts[urlParts.length - 1];
                    const photoId = lastPart.split("-").pop();
                    displayImageUrl = `https://images.unsplash.com/photo-${photoId}?w=400&h=300&fit=crop&auto=format`;
                  }

                  return (
                    <div
                      key={nft.id}
                      className="cursor-pointer border p-4 rounded-lg hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedNFT(nft)}
                    >
                      <div className="mb-3 relative">
                        <img
                          src={displayImageUrl}
                          alt={nft.name}
                          className="w-full h-48 object-cover rounded-md"
                          onError={(e) => {
                            console.log(
                              "Image failed to load:",
                              displayImageUrl
                            );
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                          onLoad={() => {
                            console.log(
                              "Image loaded successfully:",
                              displayImageUrl
                            );
                          }}
                        />
                        {/* Fallback placeholder */}
                        <div
                          className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500"
                          style={{ display: "none" }}
                        >
                          🖼️ NFT Image
                        </div>
                      </div>
                      <h4 className="font-medium text-purple-800">
                        {nft.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {nft.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          Token #{nft.token_id.toString()}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">
                          {nft.royalty_percentage}% royalty
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                You don't own any NFTs yet.{" "}
                <Link to="/mint" className="text-blue-600 hover:underline">
                  Create your first NFT
                </Link>
              </p>
            )
          ) : null}
        </div>

        {/* NFT Details Modal */}
        {selectedNFT && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full relative">
              <button
                onClick={() => setSelectedNFT(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-purple-600 mb-2">
                {selectedNFT.name}
              </h2>
              <div className="mb-4">
                {(() => {
                  let modalImageUrl = selectedNFT.image;

                  // Handle different image URL formats for modal
                  if (
                    selectedNFT.image.includes("ipfs/") ||
                    selectedNFT.image.includes("pinata.cloud")
                  ) {
                    modalImageUrl = selectedNFT.image;
                  } else if (
                    selectedNFT.image.includes("unsplash.com/photos/")
                  ) {
                    const urlParts = selectedNFT.image.split("/");
                    const lastPart = urlParts[urlParts.length - 1];
                    const photoId = lastPart.split("-").pop();
                    modalImageUrl = `https://images.unsplash.com/photo-${photoId}?w=500&h=400&fit=crop&auto=format`;
                  }

                  return (
                    <>
                      <img
                        src={modalImageUrl}
                        alt={selectedNFT.name}
                        className="w-full h-64 object-cover rounded-md"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500"
                        style={{ display: "none" }}
                      >
                        🖼️ Image not available
                      </div>
                    </>
                  );
                })()}
              </div>
              <p className="text-sm mb-2">
                <strong>Description:</strong> {selectedNFT.description}
              </p>
              <p className="text-sm mb-2">
                <strong>Token ID:</strong> {selectedNFT.token_id.toString()}
              </p>
              <p className="text-sm mb-2">
                <strong>Royalty:</strong> {selectedNFT.royalty_percentage}%
              </p>
              <p className="text-sm mb-2">
                <strong>Creator:</strong> {selectedNFT.creator.toString()}
              </p>
              <p className="text-sm mb-2">
                <strong>Transferable:</strong>{" "}
                {selectedNFT.is_transferable ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Image URL:</strong>
                <a
                  href={selectedNFT.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  View Original
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable stat card
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white shadow rounded-lg p-5 flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
