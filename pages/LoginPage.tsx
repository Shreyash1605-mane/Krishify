import React, { useState } from 'react';
import type { Page } from '../types';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onNavigate: (page: Page) => void;
  onForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Blurred static background image */}
      <div className="absolute inset-0">
  {/* Prefer the new file name; if it doesn't exist the browser will 404 but the fallback will still be present underneath */}
  <img src="./loginpage.png" alt="background" className="w-full h-full object-cover filter blur-sm brightness-75" />
        <img src="/loginpage.png" alt="background-fallback" className="w-full h-full object-cover filter blur-sm brightness-75 absolute inset-0" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      <div className="relative p-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl max-w-sm w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome krishify </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 disabled:bg-gray-400">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('register')} className="font-medium text-green-600 hover:text-green-500">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
