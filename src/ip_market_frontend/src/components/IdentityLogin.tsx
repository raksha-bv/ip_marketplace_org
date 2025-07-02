import React, { useState, useEffect, createContext } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const IdentityLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);

  
  const login = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principalId = identity.getPrincipal().toString();
        setPrincipal(principalId);
        setIsAuthenticated(true);
      }
    });
  };

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
  };

  useEffect(() => {
    AuthClient.create().then(async (authClient) => {
      const isAuth = await authClient.isAuthenticated();
      if (isAuth) {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal().toString());
        setIsAuthenticated(true);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {isAuthenticated ? (
        <>
          <p className="text-green-500">Logged in as: {principal}</p>
          <button
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            onClick={logout}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={login}
        >
          Login with Internet Identity
        </button>
      )}
    </div>
  );
};
export const AuthContext = createContext({
  isAuthenticated: false,
  principal: null,
  login: () => {},
  logout: () => {}
});

export default IdentityLogin;
