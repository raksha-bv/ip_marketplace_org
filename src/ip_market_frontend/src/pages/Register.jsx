import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router';

export default function Register() {
  const { isAuthenticated, userProfile, actor } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ip_type: 'Patent',
    category: '',
    tags: '',
    jurisdiction: '',
    genre: '',
    medium: '',
    dimensions: '',
    image_url: '',
    additional_files: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !actor) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      const metadata = {
        category: formData.category || 'General',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        file_hash: [],
        file_url: [],
        jurisdiction: formData.jurisdiction || 'Global',
        expiry_date: [],
        priority_date: [],
        application_number: [],
        registration_number: [],
        genre: formData.genre ? [formData.genre] : [],
        medium: formData.medium ? [formData.medium] : [],
        dimensions: formData.dimensions ? [formData.dimensions] : [],
        color_palette: [],
        software_used: []
      };

      const request = {
        title: formData.title,
        description: formData.description,
        ip_type: { [formData.ip_type]: null },
        metadata: metadata,
        image_url: formData.image_url ? [formData.image_url] : [],
        additional_files: formData.additional_files
      };

      console.log('Submitting registration request:', request);

      const result = await actor.register_ip(request);
      
      if (result.Ok) {
        alert('IP successfully registered!');
        navigate('/dashboard');
      } else {
        throw new Error(result.Err || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register IP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 4v2m0 4v2M8 21l4-4 4 4m0 14l-4-4-4 4" />
              </svg>
              <h2 className="mt-2 text-lg font-medium text-gray-900">Authentication Required</h2>
              <p className="mt-1 text-sm text-gray-500">
                Please log in to register intellectual property.
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="mt-2 text-lg font-medium text-gray-900">Profile Setup Required</h2>
              <p className="mt-1 text-sm text-gray-500">
                Please complete your profile setup before registering IP.
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Complete Profile Setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Register Intellectual Property</h2>
          <p className="mt-2 text-sm text-gray-600">
            Securely register your intellectual property on the blockchain
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <div className="mt-1">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter the title of your IP"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Provide a detailed description of your intellectual property"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ip_type" className="block text-sm font-medium text-gray-700">
                  IP Type *
                </label>
                <div className="mt-1">
                  <select
                    id="ip_type"
                    name="ip_type"
                    required
                    value={formData.ip_type}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Patent">Patent</option>
                    <option value="Copyright">Copyright</option>
                    <option value="Trademark">Trademark</option>
                    <option value="TradeSecret">Trade Secret</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <div className="mt-1">
                  <input
                    id="category"
                    name="category"
                    type="text"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Technology, Art, Music"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (comma-separated)
                </label>
                <div className="mt-1">
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., blockchain, innovation, software"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">
                  Jurisdiction *
                </label>
                <div className="mt-1">
                  <input
                    id="jurisdiction"
                    name="jurisdiction"
                    type="text"
                    required
                    value={formData.jurisdiction}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., United States, Global, European Union"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  Genre (Optional)
                </label>
                <div className="mt-1">
                  <input
                    id="genre"
                    name="genre"
                    type="text"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Pop, Rock, Abstract"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="medium" className="block text-sm font-medium text-gray-700">
                  Medium (Optional)
                </label>
                <div className="mt-1">
                  <input
                    id="medium"
                    name="medium"
                    type="text"
                    value={formData.medium}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Digital, Oil on Canvas, 3D Model"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                  Dimensions (Optional)
                </label>
                <div className="mt-1">
                  <input
                    id="dimensions"
                    name="dimensions"
                    type="text"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 1920x1080, 24x36 inches"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                  Image URL (Optional)
                </label>
                <div className="mt-1">
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Register IP'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Registration Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your IP will be registered on the blockchain</li>
              <li>• A unique NFT will be created for your IP</li>
              <li>• Registration is immutable and permanent</li>
              <li>• You maintain full ownership rights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
