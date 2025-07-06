import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Link } from 'react-router';
import { useLocation } from 'react-router';

// Helper functions
const getVariantValue = (variant) => {
  if (typeof variant === 'object' && variant !== null) {
    const keys = Object.keys(variant);
    if (keys.length > 0) {
      return keys[0];
    }
  }
  return variant;
};

export default function Dashboard() {
  const { isAuthenticated, userProfile, actor, loading } = useAuth();
  const [userIPs, setUserIPs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const location = useLocation();
  const [filter, setFilter] = useState("all");
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && actor && userProfile) {
        try {
          const result = await actor.get_user_ips(userProfile.principal);
          setUserIPs(result);
        } catch (error) {
          console.error('Error fetching user data:', error);
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
  }, [isAuthenticated, actor, userProfile]);

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
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="mb-4 text-gray-600">Please login to access the dashboard.</p>
          <Link to="/login" className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
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
          <p className="mb-4 text-gray-600">Please complete your profile to continue.</p>
          <Link to="/login" className="text-white bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700">
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
          <p className="mt-2 text-gray-600">Welcome back, {userProfile.username}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="IP Assets Owned" value={userProfile.owned_ips.length} icon="📄" />
          <StatCard label="NFTs Owned" value={userProfile.owned_nfts.length} icon="🖼️" />
          <StatCard label="Reputation Score" value={userProfile.reputation_score} icon="⭐" />
          <StatCard label="Verification Status" value={userProfile.verified ? "Verified" : "Pending"} icon="✅" />
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
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              ➕ Register New IP
            </Link>
            <Link to="/marketplace" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
              🔍 Browse Marketplace
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
                    <p className="text-sm text-gray-500 mt-1">{ip.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {getVariantValue(ip.ip_type)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getVariantValue(ip.verification_status) === "Verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {getVariantValue(ip.verification_status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-6">You don't own any IP assets yet.</p>
            )
          ) : null}

          {filter === "nft" || filter === "all" ? (
            userProfile.owned_nfts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile.owned_nfts.map((nft, index) => (
                  <div
                    key={index}
                    className="cursor-pointer border p-4 rounded-lg hover:shadow"
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <h4 className="font-medium text-purple-800">NFT #{index + 1}</h4>
                    <p className="text-sm text-gray-600 mt-1">Token ID: {nft.token_id || 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">You don’t own any NFTs.</p>
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
              <h2 className="text-xl font-semibold text-purple-600 mb-2">NFT Details</h2>
              <p className="text-sm"><strong>Token ID:</strong> {selectedNFT.token_id || "N/A"}</p>
              <p className="text-sm"><strong>Owner:</strong> {selectedNFT.owner || "You"}</p>
              {/* You can add more NFT metadata here */}
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
        <dt className="text-sm text-gray-500">{label}</dt>
        <dd className="text-lg font-semibold text-gray-900">{value}</dd>
      </div>
    </div>
  );
}
