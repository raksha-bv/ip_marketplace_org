// pages/MintNFT.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import ImageUploadComponent from "../components/ImageUploadComponent";

const MintNFT = () => {
  const { principal } = useAuth();
  const { getUserIPs, mintNFT } = useIPService();
  const navigate = useNavigate();
  const [ips, setIps] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    ip_id: "",
    royalty_percentage: 5,
    attributes: [],
  });

  useEffect(() => {
    if (principal) {
      getUserIPs().then(setIps).catch(console.error); // ✅ now safe
    }
  }, [principal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const opt = (v) => (v !== undefined && v !== null ? [v] : []);

    const payload = {
      name: form.name,
      description: form.description,
      image: form.image,
      ip_id: form.ip_id,
      royalty_percentage: opt(form.royalty_percentage),
      external_url: [],
      animation_url: [],
      total_editions: [],
      edition_number: [],
      collection_name: [],
      background_color: [],
      attributes: [],
    };

    try {
      const result = await mintNFT(payload);
      if (result.Ok) {
        alert("✅ NFT Minted Successfully!");
        navigate("/dashboard", { state: { refetch: true } });
      } else {
        alert("❌ Error: " + Object.keys(result.Err)[0]);
        console.error(result.Err);
      }
    } catch (err) {
      alert("❌ Failed to mint NFT. See console.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Mint New NFT
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NFT Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            NFT Name
          </label>
          <input
            type="text"
            placeholder="Enter NFT name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Enter description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <ImageUploadComponent
          onImageUpload={(url) => setForm({ ...form, image: url })}
        />

        {/* Image URL (Optional manual input) */}
        {form.image && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL (Preview)
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Image URL will appear here after upload"
            />
          </div>
        )}

        {/* Select IP */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Registered IP
          </label>
          <select
            value={form.ip_id}
            onChange={(e) => setForm({ ...form, ip_id: e.target.value })}
            required
            className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Choose IP --</option>
            {ips.map((ip) => (
              <option key={ip.id} value={ip.id}>
                {ip.title}
              </option>
            ))}
          </select>
        </div>

        {/* Royalty Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Royalty (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.royalty_percentage}
            onChange={(e) =>
              setForm({ ...form, royalty_percentage: parseInt(e.target.value) })
            }
            className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-200"
          >
            Mint NFT
          </button>
        </div>
      </form>
    </div>
  );
};

export default MintNFT;
