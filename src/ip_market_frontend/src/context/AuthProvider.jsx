import React, { createContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';

export const AuthContext = createContext({
  isAuthenticated: false,
  principal: null,
  login: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState('');
  const [authClient, setAuthClient] = useState(null);

  const init = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    const isAuth = await client.isAuthenticated();
    if (isAuth) {
      const identity = client.getIdentity();
      setPrincipal(identity.getPrincipal().toString());
      setIsAuthenticated(true);
    }
  };

  const login = async () => {
    if (!authClient) return;

    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal().toString());
        setIsAuthenticated(true);
      }
    });
  };

  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, principal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
