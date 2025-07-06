import React, { useEffect, useState } from "react";

export default function MarketPlace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const result = await actor.get_all_listings();
        setListings(result);
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  if (loading) return <div className="p-4">Loading listings...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Marketplace Listings</h1>
      {listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, idx) => (
            <div key={idx} className="bg-white shadow rounded p-4">
              <p className="text-xl font-semibold mb-2">🧾 {listing.nft_id}</p>
              <p className="text-sm mb-1">💰 Price: {Number(listing.price) / 1e8} {listing.currency}</p>
              <p className="text-sm mb-1">📜 License: {listing.license_terms}</p>
              <p className="text-sm mb-1">📅 Listed At: {new Date(Number(listing.listed_at) / 1_000_000).toLocaleString()}</p>
              <p className="text-sm mb-1">📅 Expires: {new Date(Number(listing.expires_at) / 1_000_000).toLocaleString()}</p>
              <p className="text-sm mb-1">👤 Seller: {listing.seller.toText?.() || listing.seller}</p>
              <p className="text-sm mb-1">📦 Status: {Object.keys(listing.status)[0]}</p>

              {listing.auction_data && (
                <div className="mt-2 p-2 border-t text-sm text-gray-700">
                  <p>🔨 Auction ends: {new Date(Number(listing.auction_data.auction_end) / 1_000_000).toLocaleString()}</p>
                  <p>💸 Current Bid: {Number(listing.auction_data.current_bid) / 1e8}</p>
                  <p>⬆️ Min Increment: {Number(listing.auction_data.min_bid_increment) / 1e8}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
