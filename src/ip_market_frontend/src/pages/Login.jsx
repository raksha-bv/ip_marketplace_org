import React from 'react';
import IdentityLogin from '../components/IdentityLogin';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to IP Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Secure authentication with Internet Identity
          </p>
        </div>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <IdentityLogin />
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About Internet Identity
            </h2>
            <div className="text-left space-y-4 text-gray-600">
              <p>
                Internet Identity is a revolutionary authentication system built on the Internet Computer blockchain. 
                It provides secure, anonymous authentication without requiring passwords or personal information.
              </p>
              <p>
                <strong>Key Benefits:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No passwords to remember or manage</li>
                <li>Complete privacy - no personal data required</li>
                <li>Cryptographically secure authentication</li>
                <li>Works across all dApps on the Internet Computer</li>
                <li>Your identity is controlled entirely by you</li>
              </ul>
              <p>
                <strong>How it works:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Create an Internet Identity using your device's secure authentication (Face ID, Touch ID, etc.)</li>
                <li>Your identity is linked to your device's cryptographic keys</li>
                <li>Use your Internet Identity to securely access the IP Marketplace</li>
                <li>No passwords, no personal data, maximum security</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
