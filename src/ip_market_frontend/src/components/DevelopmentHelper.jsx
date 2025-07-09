import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { getEnvironmentConfig } from "../utils/config";

const DevelopmentHelper = () => {
  const { isAuthenticated, principal, actor } = useAuth();
  const [canisterStatus, setCanisterStatus] = useState("checking");
  const [environmentInfo, setEnvironmentInfo] = useState(null);

  useEffect(() => {
    const config = getEnvironmentConfig();
    setEnvironmentInfo(config);

    // Check if the backend canister is accessible
    const checkCanisterStatus = async () => {
      if (!actor) {
        setCanisterStatus("not_connected");
        return;
      }

      try {
        // Try a simple call to check if the canister is responding
        await actor.get_marketplace_stats();
        setCanisterStatus("connected");
      } catch (error) {
        console.error("Canister check failed:", error);
        setCanisterStatus("failed");
      }
    };

    checkCanisterStatus();
  }, [actor]);

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "checking":
        return "text-yellow-600";
      case "not_connected":
        return "text-orange-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected":
        return "✅ Connected";
      case "checking":
        return "⏳ Checking...";
      case "not_connected":
        return "⚠️ Not Connected";
      case "failed":
        return "❌ Failed";
      default:
        return "❓ Unknown";
    }
  };

  if (!environmentInfo?.isDevelopment) {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">🔧 Development Info</h3>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Network:</span>
          <span className="font-mono">{environmentInfo.network}</span>
        </div>

        <div className="flex justify-between">
          <span>Authenticated:</span>
          <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
            {isAuthenticated ? "✅" : "❌"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Principal:</span>
          <span className="font-mono text-gray-600">
            {principal ? `${principal.slice(0, 8)}...` : "None"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Backend:</span>
          <span className={getStatusColor(canisterStatus)}>
            {getStatusText(canisterStatus)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Canister ID:</span>
          <span className="font-mono text-gray-600">
            {environmentInfo.backendCanisterId
              ? `${environmentInfo.backendCanisterId.slice(0, 8)}...`
              : "Not set"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>IC Host:</span>
          <span className="font-mono text-gray-600">
            {environmentInfo.icHost
              ? environmentInfo.icHost
                  .replace("http://", "")
                  .replace("https://", "")
              : "Not set"}
          </span>
        </div>
      </div>

      {canisterStatus === "failed" && (
        <div className="mt-2 text-xs text-red-600">
          <p>💡 Try running:</p>
          <code className="block bg-gray-100 p-1 rounded mt-1">
            dfx start --clean --background && dfx deploy
          </code>
        </div>
      )}
    </div>
  );
};

export default DevelopmentHelper;
