// src/components/Navbar.jsx

import { Link } from "react-router";


const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">ICP IP Marketplace</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-600">IP Register</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
