import React, { useState } from "react";
import { useIPService } from "../hooks/useIPService";

const IPSearch = () => {
  const { searchIPs } = useIPService();
  const [searchQuery, setSearchQuery] = useState("");
  const [ipType, setIpType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const ipTypes = [
    { key: "Patent", label: "Patent" },
    { key: "Trademark", label: "Trademark" },
    { key: "Copyright", label: "Copyright" },
    { key: "TradeSecret", label: "Trade Secret" },
    { key: "Design", label: "Design" },
    { key: "DigitalArt", label: "Digital Art" },
    { key: "Music", label: "Music" },
    { key: "Literature", label: "Literature" },
    { key: "Software", label: "Software" },
    { key: "Photography", label: "Photography" },
    { key: "Video", label: "Video" },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const ipTypeFilter = ipType ? { [ipType]: null } : null;
      const searchResults = await searchIPs(searchQuery, ipTypeFilter);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
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

  const getStatusColor = (status) => {
    const statusKey = Object.keys(status)[0];
    switch (statusKey) {
      case "Verified":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "UnderReview":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">Search IP Assets</h1>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Type
              </label>
              <select
                value={ipType}
                onChange={(e) => setIpType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {ipTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIpType("");
                setResults([]);
                setSearched(false);
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Search Results ({results.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No IP assets found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((ip) => (
                <div
                  key={ip.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold truncate">
                      {ip.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        ip.verification_status
                      )}`}
                    >
                      {Object.keys(ip.verification_status)[0]}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {ip.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">
                        {Object.keys(ip.ip_type)[0]}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Owner:</span>
                      <span className="font-mono text-xs">
                        {formatPrincipal(ip.owner)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span>{formatDate(ip.creation_date)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Jurisdiction:</span>
                      <span>{ip.metadata.jurisdiction}</span>
                    </div>
                  </div>

                  {ip.metadata.tags && ip.metadata.tags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {ip.metadata.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {ip.metadata.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{ip.metadata.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    {ip.nft_id && (
                      <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                        View NFT
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IPSearch;
