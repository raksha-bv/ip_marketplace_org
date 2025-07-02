// src/App.jsx

import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
