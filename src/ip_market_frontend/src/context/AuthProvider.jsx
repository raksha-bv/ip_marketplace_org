import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../declarations/ip_market_backend';
import { getEnvironmentConfig, validateEnvironment, logEnvironmentConfig } from '../utils/config';

export const AuthContext = createContext({
  isAuthenticated: false,
  principal: null,
  authClient: null,
  actor: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
  userProfile: null,
  createUserProfile: async () => {},
  updateUserProfile: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Get environment configuration
  const config = getEnvironmentConfig();

  // Validate environment on startup
  useEffect(() => {
    console.log('AuthProvider environment config:', config);
    if (!validateEnvironment()) {
      console.error('Environment validation failed. Please check your .env file.');
    }
    if (config.isDevelopment) {
      logEnvironmentConfig();
    }
  }, []);

  const initAuth = async () => {
    try {
      setLoading(true);
      const client = await AuthClient.create();
      setAuthClient(client);

      const isAuth = await client.isAuthenticated();
      if (isAuth) {
        const identity = client.getIdentity();
        const principalId = identity.getPrincipal().toString();
        setPrincipal(principalId);
        setIsAuthenticated(true);
        
        // Create actor with authenticated identity
        const authenticatedActor = createActor(config.backendCanisterId, {
          agentOptions: {
            identity,
            host: config.icHost,
          }
        });
        setActor(authenticatedActor);
        
        // Try to get user profile
        try {
          const profile = await authenticatedActor.get_my_profile();
          if (profile.Ok) {
            setUserProfile(profile.Ok);
          }
        } catch (error) {
          console.log('No user profile found:', error);
        }
      } else {
        // Create anonymous actor
        const anonymousActor = createActor(config.backendCanisterId, {
          agentOptions: {
            host: config.icHost,
          }
        });
        setActor(anonymousActor);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      
      // For local development, bypass Internet Identity
      if (config.dfxNetwork === 'local') {
        console.log('Using local development mode - bypassing Internet Identity');
        
        // Create actor without specific identity for local development
        const localActor = createActor(config.backendCanisterId, {
          agentOptions: {
            host: config.icHost,
          }
        });
        
        // Fetch root key for local development
        try {
          await localActor._agent.fetchRootKey();
          console.log('Root key fetched successfully for local development');
        } catch (rootKeyError) {
          console.warn('Could not fetch root key:', rootKeyError);
        }
        
        setActor(localActor);
        setIsAuthenticated(true);
        setPrincipal('local-development-user');
        
        console.log('Local development actor created:', localActor);
        setLoading(false);
        return;
      }
      
      // For production, use Internet Identity
      await authClient.login({
        identityProvider: config.identityProvider,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principalId = identity.getPrincipal().toString();
          setPrincipal(principalId);
          setIsAuthenticated(true);
          
          console.log('Login successful! Creating authenticated actor...');
          console.log('Principal:', principalId);
          console.log('Backend Canister ID:', config.backendCanisterId);
          console.log('IC Host:', config.icHost);
          console.log('Identity details:', identity);
          
          // Create authenticated actor
          const authenticatedActor = createActor(config.backendCanisterId, {
            agentOptions: {
              identity,
              host: config.icHost,
            }
          });
          
          // For local development, we need to fetch the root key manually
          if (config.dfxNetwork === 'local') {
            try {
              await authenticatedActor._agent.fetchRootKey();
              console.log('Root key fetched successfully for local development');
            } catch (rootKeyError) {
              console.warn('Could not fetch root key:', rootKeyError);
            }
          }
          setActor(authenticatedActor);
          
          console.log('Actor created:', authenticatedActor);
          console.log('Actor agent:', authenticatedActor._agent);
          
          // Try to get user profile
          try {
            const profile = await authenticatedActor.get_my_profile();
            if (profile.Ok) {
              setUserProfile(profile.Ok);
            }
          } catch (error) {
            console.log('No user profile found:', error);
          }
        },
        onError: (error) => {
          console.error('Login failed:', error);
        }
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setUserProfile(null);
      
      // Create anonymous actor
      const anonymousActor = createActor(config.backendCanisterId, {
        agentOptions: {
          host: config.icHost,
        }
      });
      setActor(anonymousActor);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const createUserProfile = async (profileData) => {
    if (!actor || !isAuthenticated) {
      console.error('Profile creation failed - Authentication check:', {
        actorExists: !!actor,
        isAuthenticated,
        principal,
        backendCanisterId: config.backendCanisterId
      });
      throw new Error('Must be authenticated to create profile');
    }

    try {
      console.log('Creating user profile with data:', profileData);
      console.log('Using actor:', actor);
      
      const createUserRequest = {
        username: profileData.username,
        email: profileData.email || [],
        bio: profileData.bio || [],
        avatar_url: profileData.avatar_url || [],
        banner_url: profileData.banner_url || [],
        social_links: profileData.social_links || [],
      };

      console.log('Sending create user request:', createUserRequest);
      
      const result = await actor.create_user_profile(createUserRequest);
      console.log('Profile creation result:', result);
      
      if (result.Ok) {
        setUserProfile(result.Ok);
        return result.Ok;
      } else {
        throw new Error(`Profile creation failed: ${result.Err}`);
      }
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData) => {
    if (!actor || !isAuthenticated) {
      throw new Error('Must be authenticated to update profile');
    }

    try {
      const result = await actor.update_user_profile(profileData);
      if (result.Ok) {
        setUserProfile(result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const value = {
    isAuthenticated,
    principal,
    authClient,
    actor,
    login,
    logout,
    loading,
    userProfile,
    createUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
