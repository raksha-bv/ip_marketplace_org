import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useIPService } from "../hooks/useIPService";

const TestBackendConnection = () => {
  const { isAuthenticated, principal, actor } = useAuth();
  const { getUserNFTs, getMarketplaceStats } = useIPService();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = {};

    // Test 1: Basic Stats Call
    try {
      const stats = await getMarketplaceStats();
      results.stats = { success: true, data: stats };
    } catch (error) {
      results.stats = { success: false, error: error.message };
    }

    // Test 2: User NFTs Call
    try {
      const nfts = await getUserNFTs();
      results.nfts = { success: true, data: nfts };
    } catch (error) {
      results.nfts = { success: false, error: error.message };
    }

    // Test 3: Raw Actor Call
    try {
      const stats = await actor.get_marketplace_stats();
      results.rawStats = { success: true, data: stats };
    } catch (error) {
      results.rawStats = { success: false, error: error.message };
    }

    // Test 4: Raw NFT Call
    if (principal && actor) {
      try {
        const { Principal } = await import("@dfinity/principal");
        const principalObj = Principal.fromText(principal);
        const nfts = await actor.get_user_nfts(principalObj);
        results.rawNfts = { success: true, data: nfts };
      } catch (error) {
        results.rawNfts = { success: false, error: error.message };
      }
    }

    setTestResults(results);
    setTesting(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>Please log in to test backend connection</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-semibold mb-4">Backend Connection Test</h3>

      <div className="mb-4">
        <p>
          <strong>Principal:</strong> {principal}
        </p>
        <p>
          <strong>Actor:</strong> {actor ? "Available" : "Not available"}
        </p>
      </div>

      <button
        onClick={runTests}
        disabled={testing}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {testing ? "Testing..." : "Run Tests"}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className="p-2 border rounded">
              <p className="font-semibold">{test}:</p>
              <p className={result.success ? "text-green-600" : "text-red-600"}>
                {result.success ? "✅ Success" : "❌ Failed"}
              </p>
              {result.error && (
                <p className="text-red-600 text-sm">{result.error}</p>
              )}
              {result.data && (
                <pre className="text-xs bg-gray-200 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestBackendConnection;
