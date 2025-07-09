import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import NFTCard from "../components/NFTCard";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { principal, userProfile: currentUserProfile } = useAuth();
  const { getUserProfile, getUserIPs, getUserNFTs, getListingsBySeller } =
    useIPService();

  const [profile, setProfile] = useState(null);
  const [userIPs, setUserIPs] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("nfts");

  const isOwnProfile = !userId || userId === principal;

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      let targetProfile;
      if (isOwnProfile) {
        targetProfile = currentUserProfile;
      } else {
        const profileResult = await getUserProfile(userId);
        if (profileResult.Ok) {
          targetProfile = profileResult.Ok;
        } else {
          throw new Error("User not found");
        }
      }

      setProfile(targetProfile);

      // Load user's content
      const [ipsResult, nftsResult, listingsResult] = await Promise.all([
        getUserIPs(),
        getUserNFTs(),
        getListingsBySeller(targetProfile.principal.toString()),
      ]);

      setUserIPs(ipsResult);
      setUserNFTs(nftsResult);
      setUserListings(listingsResult);
    } catch (err) {
      console.error("Error loading user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString();
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
        <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="mb-4 text-gray-600">
            The requested user profile could not be found.
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
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <img
              src={profile.avatar_url || "/default-avatar.png"}
              alt={profile.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">NFTs Owned</p>
                <p className="text-xl font-bold">{userNFTs.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IPs Registered</p>
                <p className="text-xl font-bold">{userIPs.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-xl font-bold">{profile.total_sales}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reputation</p>
                <p className="text-xl font-bold flex items-center">
                  {profile.reputation_score}
                  {profile.verified && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </p>
              </div>
            </div>

            {profile.bio && <p className="text-gray-600 mb-4">{profile.bio}</p>}

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Principal: {formatPrincipal(profile.principal)}</span>
              <span>Joined: {formatDate(profile.created_at)}</span>
            </div>

            {profile.social_links && profile.social_links.length > 0 && (
              <div className="flex space-x-4 mt-4">
                {profile.social_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("nfts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "nfts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              NFTs ({userNFTs.length})
            </button>
            <button
              onClick={() => setActiveTab("ips")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ips"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              IP Assets ({userIPs.length})
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "listings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Listings ({userListings.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "nfts" && (
            <div>
              {userNFTs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No NFTs found</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate("/mint")}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Mint Your First NFT
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userNFTs.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "ips" && (
            <div>
              {userIPs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No IP assets found</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate("/register")}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Register Your First IP
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userIPs.map((ip) => (
                    <div key={ip.id} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">{ip.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {ip.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {Object.keys(ip.ip_type)[0]}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            Object.keys(ip.verification_status)[0] ===
                            "Verified"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {Object.keys(ip.verification_status)[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "listings" && (
            <div>
              {userListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No listings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            NFT: {listing.nft_id}
                          </h3>
                          <p className="text-gray-600">
                            Price:{" "}
                            {(
                              (typeof listing.price === "bigint"
                                ? Number(listing.price)
                                : listing.price) / 1e8
                            ).toFixed(2)}{" "}
                            {listing.currency}
                          </p>
                          <p className="text-sm text-gray-500">
                            Listed: {formatDate(listing.listed_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              Object.keys(listing.status)[0] === "Active"
                                ? "bg-green-100 text-green-800"
                                : Object.keys(listing.status)[0] === "Sold"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {Object.keys(listing.status)[0]}
                          </span>
                          {isOwnProfile &&
                            Object.keys(listing.status)[0] === "Active" && (
                              <button
                                onClick={() =>
                                  navigate(`/listing/${listing.id}/cancel`)
                                }
                                className="ml-2 text-red-600 hover:text-red-800 text-sm"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
