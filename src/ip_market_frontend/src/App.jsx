// src/App.jsx

import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import ConfigurationPanel from "./components/ConfigurationPanel";
import DevelopmentHelper from "./components/DevelopmentHelper";
import { AuthProvider } from "./context/AuthProvider";
import "./env-test.js"; // Test environment loading

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
        <ConfigurationPanel />
        <DevelopmentHelper />
      </div>
    </AuthProvider>
  );
}

export default App;
