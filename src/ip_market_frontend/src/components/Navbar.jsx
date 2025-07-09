// src/components/Navbar.jsx

import { Link } from "react-router";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const { isAuthenticated, principal, userProfile, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700"
            >
              ICP IP Marketplace
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Marketplace
            </Link>
            {isAuthenticated && (
              <Link
                to="/marketplace/list"
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
              >
                List NFT
              </Link>
            )}
            <Link
              to="/explore"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Explore
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Search IPs
            </Link>
            <Link
              to="/mint-nft"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Mint NFT
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Register IP
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {userProfile?.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900 font-medium">
                      {userProfile?.username || "User"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {principal
                        ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
                        : ""}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 font-medium transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
