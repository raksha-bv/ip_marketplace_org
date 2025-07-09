import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import {
  formatICP,
  formatNumber,
  extractOptionalValue,
} from "../utils/formatters";

const MarketplaceStats = () => {
  const { actor } = useAuth();
  const { getMarketplaceStats } = useIPService();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await getMarketplaceStats();
      setStats(result);
    } catch (error) {
      console.error("Error loading marketplace stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load marketplace statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total NFTs",
      value: formatNumber(stats.total_nfts),
      icon: "🎨",
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: formatNumber(stats.total_users),
      icon: "👥",
      color: "bg-green-500",
    },
    {
      title: "Active Listings",
      value: formatNumber(stats.active_listings),
      icon: "🏪",
      color: "bg-purple-500",
    },
    {
      title: "Live Auctions",
      value: formatNumber(stats.active_auctions),
      icon: "🔨",
      color: "bg-orange-500",
    },
    {
      title: "Total Volume",
      value: formatICP(stats.total_volume) + " ICP",
      icon: "💰",
      color: "bg-yellow-500",
    },
    {
      title: "Avg Sale Price",
      value: stats.average_sale_price
        ? formatICP(extractOptionalValue(stats.average_sale_price)) + " ICP"
        : "N/A",
      icon: "📊",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketplace Statistics</h2>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div
                className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Total Listings</p>
            <p className="text-xl font-bold">{stats.total_listings}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Success Rate</p>
            <p className="text-xl font-bold">
              {stats.total_listings > 0
                ? (
                    ((stats.total_listings - stats.active_listings) /
                      stats.total_listings) *
                    100
                  ).toFixed(1) + "%"
                : "N/A"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Auction Rate</p>
            <p className="text-xl font-bold">
              {stats.active_listings > 0
                ? (
                    (stats.active_auctions / stats.active_listings) *
                    100
                  ).toFixed(1) + "%"
                : "N/A"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">NFT per User</p>
            <p className="text-xl font-bold">
              {stats.total_users > 0
                ? (stats.total_nfts / stats.total_users).toFixed(1)
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceStats;
