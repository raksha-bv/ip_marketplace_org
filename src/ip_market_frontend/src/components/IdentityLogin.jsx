import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

const IdentityLogin = () => {
  const { 
    isAuthenticated, 
    principal, 
    login, 
    logout, 
    loading, 
    userProfile, 
    createUserProfile 
  } = useAuth();
  
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    bio: '',
    avatar_url: '',
    banner_url: '',
    social_links: []
  });

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileForm(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      await createUserProfile({
        username: profileForm.username,
        email: profileForm.email.length > 0 ? [profileForm.email] : [],
        bio: profileForm.bio.length > 0 ? [profileForm.bio] : [],
        avatar_url: profileForm.avatar_url.length > 0 ? [profileForm.avatar_url] : [],
        banner_url: profileForm.banner_url.length > 0 ? [profileForm.banner_url] : [],
        social_links: profileForm.social_links
      });
      setShowProfileForm(false);
    } catch (error) {
      console.error('Profile creation failed:', error);
      alert('Failed to create profile: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isAuthenticated ? 'Welcome!' : 'Login Required'}
        </h2>
        <p className="text-gray-600">
          {isAuthenticated 
            ? 'You are successfully authenticated with Internet Identity' 
            : 'Please login with Internet Identity to access the IP Marketplace'
          }
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Login with Internet Identity
          </button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What is Internet Identity?</h3>
            <p className="text-sm text-blue-800">
              Internet Identity is a secure, anonymous blockchain authentication system that doesn't require passwords or personal information. 
              Your identity is cryptographically secured and controlled entirely by you.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-green-900">Authenticated</span>
            </div>
            <p className="text-sm text-green-800 font-mono break-all">
              Principal ID: {principal}
            </p>
          </div>

          {userProfile ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Your Profile</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Username:</strong> {userProfile.username}</p>
                {userProfile.email && userProfile.email.length > 0 && (
                  <p><strong>Email:</strong> {userProfile.email[0]}</p>
                )}
                {userProfile.bio && userProfile.bio.length > 0 && (
                  <p><strong>Bio:</strong> {userProfile.bio[0]}</p>
                )}
                <p><strong>Reputation Score:</strong> {userProfile.reputation_score}</p>
                <p><strong>Verified:</strong> {userProfile.verified ? 'Yes' : 'No'}</p>
                <p><strong>IPs Owned:</strong> {userProfile.owned_ips.length}</p>
                <p><strong>NFTs Owned:</strong> {userProfile.owned_nfts.length}</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Complete Your Profile</h3>
              <p className="text-sm text-yellow-800 mb-3">
                Create your user profile to start using the IP Marketplace.
              </p>
              
              {!showProfileForm ? (
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Create Profile
                </button>
              ) : (
                <form onSubmit={handleCreateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profileForm.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio (Optional)
                    </label>
                    <textarea
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="avatar_url"
                      value={profileForm.avatar_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Create Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProfileForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default IdentityLogin;
