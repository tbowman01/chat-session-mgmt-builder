import React from 'react';
import { useAuth } from './AuthProvider';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chat Session Manager
          </h1>
          <p className="text-gray-600">
            Build amazing chat experiences across multiple platforms
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              🚀 What you can build:
            </h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <span className="text-purple-500 mr-2">💬</span>
                Discord bots with slash commands
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">📱</span>
                Telegram automation bots
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">💬</span>
                WhatsApp business integrations
              </li>
              <li className="flex items-center">
                <span className="text-indigo-500 mr-2">🏢</span>
                Slack workspace applications
              </li>
              <li className="flex items-center">
                <span className="text-blue-400 mr-2">🐦</span>
                Twitter engagement bots
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-2">🌐</span>
                Real-time web chat widgets
              </li>
              <li className="flex items-center">
                <span className="text-gray-600 mr-2">⌨️</span>
                Command-line chat tools
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Sign in with GitHub to access your chat session history and configurations
            </p>
            
            <button
              onClick={login}
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              )}
              <span>Continue with GitHub</span>
            </button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our terms of service and privacy policy.
                Your GitHub information is used only for authentication and session management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};