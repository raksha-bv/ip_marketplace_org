// Configuration utility for environment variables
// This centralizes all environment variable access and provides defaults

export const getEnvironmentConfig = () => {
  const network = import.meta.env.VITE_DFX_NETWORK || import.meta.env.DFX_NETWORK || 'local';
  const isDevelopment = network === 'local';
  const isProduction = network === 'ic';

  // Internet Identity Configuration
  const iiCanisterId = import.meta.env.VITE_II_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
  const identityProvider = isProduction 
    ? 'https://identity.ic0.app' 
    : (import.meta.env.VITE_LOCAL_II_URL || `http://${iiCanisterId}.localhost:4943`);

  // IC Host Configuration
  const icHost = isProduction 
    ? (import.meta.env.VITE_IC_HOST || 'https://icp-api.io')
    : (import.meta.env.VITE_IC_HOST || 'http://localhost:4943');

  // Backend Canister ID
  const backendCanisterId = import.meta.env.VITE_CANISTER_ID_IP_MARKET_BACKEND;

  return {
    network,
    isDevelopment,
    isProduction,
    iiCanisterId,
    identityProvider,
    icHost,
    backendCanisterId,
  };
};

// Validation function to check if all required environment variables are set
export const validateEnvironment = () => {
  const config = getEnvironmentConfig();
  const errors = [];

  if (!config.backendCanisterId) {
    errors.push('VITE_CANISTER_ID_IP_MARKET_BACKEND is not set');
  }

  if (!config.iiCanisterId) {
    errors.push('VITE_II_CANISTER_ID is not set');
  }

  if (errors.length > 0) {
    console.error('Environment configuration errors:', errors);
    return false;
  }

  return true;
};

// Debug function to log current configuration
export const logEnvironmentConfig = () => {
  const config = getEnvironmentConfig();
  console.log('Environment Configuration:', {
    ...config,
    // Don't log sensitive information in production
    backendCanisterId: config.isDevelopment ? config.backendCanisterId : '[hidden]',
  });
};
