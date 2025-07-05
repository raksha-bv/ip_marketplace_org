import React, { useState } from 'react';
import { getEnvironmentConfig } from '../utils/config';

const ConfigurationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const config = getEnvironmentConfig();

  const handleUpdateEnv = () => {
    const envContent = `# Internet Identity Configuration
# For local development, use the default local II canister ID
II_CANISTER_ID=${config.iiCanisterId}

# Frontend configuration
VITE_II_CANISTER_ID=${config.iiCanisterId}
VITE_DFX_NETWORK=${config.network}

# Local development URLs
VITE_LOCAL_II_URL=${config.identityProvider}
VITE_IC_HOST=${config.icHost}

# Production URLs (for mainnet)
# VITE_LOCAL_II_URL=https://identity.ic0.app
# VITE_IC_HOST=https://icp-api.io`;

    // Create a downloadable file
    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!config.isDevelopment) {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
        title="Configuration"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-96 max-w-screen-sm">
          <h3 className="text-lg font-semibold mb-3">Development Configuration</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Network</label>
              <p className="text-sm text-gray-600">{config.network}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Internet Identity Canister ID</label>
              <p className="text-sm text-gray-600 font-mono break-all">{config.iiCanisterId}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Identity Provider URL</label>
              <p className="text-sm text-gray-600 break-all">{config.identityProvider}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">IC Host</label>
              <p className="text-sm text-gray-600">{config.icHost}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Backend Canister ID</label>
              <p className="text-sm text-gray-600 font-mono break-all">{config.backendCanisterId}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              To use your own Internet Identity canister, update the values in your .env file:
            </p>
            <button
              onClick={handleUpdateEnv}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
            >
              Download .env Template
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            <p>
              <strong>Note:</strong> After updating your .env file, restart the development server for changes to take effect.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;
