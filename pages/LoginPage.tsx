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

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image from public folder */}
      <div className="absolute inset-0 -z-10">
        <img
          url="https://media.istockphoto.com/id/1284378353/photo/young-indian-farmer-using-smartphone-in-cotton-field.jpg?s=2048x2048&w=is&k=20&c=PAsTawGLMowiyu_p6EaZzlnfS4QegF5C51MluvSPRKA="
          alt="background"
          className="h-full w-full object-cover blur-[25px] scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Welcome Krishify</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-o[...]
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
