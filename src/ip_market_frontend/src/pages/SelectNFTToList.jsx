import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import NFTCard from "../components/NFTCard";

const SelectNFTToList = () => {
  const { isAuthenticated, principal, actor } = useAuth();
  const { getUserNFTs } = useIPService();
  const [userNFTs, setUserNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!isAuthenticated || !principal) {
        setError("Please login to access this page");
        setLoading(false);
        return;
      }

      if (!actor) {
        setError(
          "Backend connection not available. Please try refreshing the page."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getUserNFTs();
        setUserNFTs(result);
      } catch (err) {
        console.error("Error fetching user NFTs:", err);

        // Better error handling
        if (err.message.includes("Failed to fetch")) {
          setError(
            "Network error: Unable to connect to the backend canister. Please ensure the local dfx network is running and try again."
          );
        } else if (err.message.includes("Principal is undefined")) {
          setError("Authentication error: Please log out and log back in.");
        } else if (err.message.includes("Actor is not initialized")) {
          setError(
            "Backend connection error: Please refresh the page and try again."
          );
        } else {
          setError(`Failed to load your NFTs: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserNFTs();
  }, [isAuthenticated, principal, actor]); // Removed getUserNFTs from dependencies

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading your NFTs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md max-w-md">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
            <Link
              to="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="mb-4 text-gray-600">
            Please login to list your NFTs for sale.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Select NFT to List</h1>
          <Link
            to="/marketplace"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Marketplace
          </Link>
        </div>
        <p className="text-gray-600">
          Choose an NFT from your collection to list for sale in the
          marketplace.
        </p>
      </div>

      {userNFTs.length === 0 ? (
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
            No NFTs Found
          </h3>
          <p className="text-gray-600 mb-4">
            You don't have any NFTs in your collection yet.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/mint-nft"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Mint Your First NFT
            </Link>
            <Link
              to="/explore"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
            >
              Explore NFTs
            </Link>
          </div>
        </div>
      ) : (
        <>
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
                  Click on the "List" button on any NFT to create a marketplace
                  listing.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} showActions={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SelectNFTToList;
