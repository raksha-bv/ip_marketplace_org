import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";
import ImageUploadComponent from "../components/ImageUploadComponent";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile: updateAuthProfile } = useAuth();
  const { updateUserProfile } = useIPService();

  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    social_links: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" });

  useEffect(() => {
    if (userProfile) {
      setForm({
        username: userProfile.username || "",
        email: userProfile.email || "",
        bio: userProfile.bio || "",
        avatar_url: userProfile.avatar_url || "",
        banner_url: userProfile.banner_url || "",
        social_links: userProfile.social_links || [],
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setForm((prev) => ({
        ...prev,
        social_links: [...prev.social_links, { ...newSocialLink }],
      }));
      setNewSocialLink({ platform: "", url: "" });
    }
  };

  const handleRemoveSocialLink = (index) => {
    setForm((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the payload with optional fields
      const payload = {
        username: form.username !== userProfile.username ? [form.username] : [],
        email: form.email !== userProfile.email ? [form.email] : [],
        bio: form.bio !== userProfile.bio ? [form.bio] : [],
        avatar_url:
          form.avatar_url !== userProfile.avatar_url ? [form.avatar_url] : [],
        banner_url:
          form.banner_url !== userProfile.banner_url ? [form.banner_url] : [],
        social_links:
          form.social_links.length !== userProfile.social_links.length ||
          JSON.stringify(form.social_links) !==
            JSON.stringify(userProfile.social_links)
            ? [form.social_links]
            : [],
      };

      const result = await updateUserProfile(payload);

      if (result.Ok) {
        // Update the auth context with new profile
        await updateAuthProfile();
        alert("✅ Profile updated successfully!");
        navigate("/profile");
      } else {
        throw new Error(Object.keys(result.Err)[0]);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const socialPlatforms = [
    "Twitter",
    "LinkedIn",
    "GitHub",
    "Instagram",
    "Website",
    "Discord",
    "Telegram",
    "Other",
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar Image
            </label>
            <ImageUploadComponent
              onUpload={(url) =>
                setForm((prev) => ({ ...prev, avatar_url: url }))
              }
              currentImage={form.avatar_url}
              placeholder="Upload avatar"
            />
          </div>

          {/* Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <ImageUploadComponent
              onUpload={(url) =>
                setForm((prev) => ({ ...prev, banner_url: url }))
              }
              currentImage={form.banner_url}
              placeholder="Upload banner"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Links
            </label>

            {/* Existing Links */}
            {form.social_links.length > 0 && (
              <div className="space-y-2 mb-4">
                {form.social_links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded"
                  >
                    <span className="text-sm font-medium w-20">
                      {link.platform}:
                    </span>
                    <span className="flex-1 text-sm text-blue-600">
                      {link.url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Link */}
            <div className="flex space-x-2">
              <select
                value={newSocialLink.platform}
                onChange={(e) =>
                  setNewSocialLink((prev) => ({
                    ...prev,
                    platform: e.target.value,
                  }))
                }
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Enter URL"
                value={newSocialLink.url}
                onChange={(e) =>
                  setNewSocialLink((prev) => ({ ...prev, url: e.target.value }))
                }
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSocialLink}
                disabled={!newSocialLink.platform || !newSocialLink.url}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Current Profile Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Profile Preview</h3>
            <div className="flex items-center space-x-4">
              {form.avatar_url && (
                <img
                  src={form.avatar_url}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{form.username}</p>
                {form.bio && (
                  <p className="text-gray-600 text-sm">{form.bio}</p>
                )}
                {form.email && (
                  <p className="text-gray-500 text-sm">{form.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
