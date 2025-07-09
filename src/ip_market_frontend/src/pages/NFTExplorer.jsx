import React, { useState, useEffect } from "react";
import NFTCard from "../components/NFTCard";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";

const NFTExplorer = () => {
  const { actor } = useAuth();
  const { searchNFTs, getTrendingNFTs } = useIPService();

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    collection_name: "",
    min_price: "",
    max_price: "",
    sort_by: "newest",
  });
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'trending'

  useEffect(() => {
    loadNFTs();
  }, [activeTab]);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      let result;

      if (activeTab === "trending") {
        result = await getTrendingNFTs(20);
        setNfts(result);
      } else {
        // Load all NFTs or search results
        const searchFilters = {
          collection_name: filters.collection_name
            ? [filters.collection_name]
            : [],
          min_price: filters.min_price
            ? [Math.floor(parseFloat(filters.min_price) * 1e8)]
            : [],
          max_price: filters.max_price
            ? [Math.floor(parseFloat(filters.max_price) * 1e8)]
            : [],
          creator: [],
          sort_by: filters.sort_by ? [filters.sort_by] : [],
        };

        result = await searchNFTs(searchQuery, searchFilters);
        setNfts(result);
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadNFTs();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      collection_name: "",
      min_price: "",
      max_price: "",
      sort_by: "newest",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore NFTs</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All NFTs
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "trending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🔥 Trending
          </button>
        </div>

        {/* Search and Filters */}
        {activeTab === "all" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div>
                <input
                  type="text"
                  placeholder="Search NFTs by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection
                  </label>
                  <input
                    type="text"
                    placeholder="Collection name"
                    value={filters.collection_name}
                    onChange={(e) =>
                      handleFilterChange("collection_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price (ICP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={filters.min_price}
                    onChange={(e) =>
                      handleFilterChange("min_price", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price (ICP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={filters.max_price}
                    onChange={(e) =>
                      handleFilterChange("max_price", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) =>
                      handleFilterChange("sort_by", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rarity">Rarity</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading NFTs...</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {activeTab === "trending" ? "Trending NFTs" : "All NFTs"}(
              {nfts.length})
            </h2>
          </div>

          {nfts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {activeTab === "trending"
                  ? "No trending NFTs found"
                  : "No NFTs found"}
              </div>
              <p className="text-gray-400">
                {activeTab === "trending"
                  ? "Check back later for trending content"
                  : "Try adjusting your search criteria"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onView={() => loadNFTs()}
                  onFavorite={() => loadNFTs()}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NFTExplorer;
