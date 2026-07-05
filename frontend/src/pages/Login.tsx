import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [username, setUsernameInput] = useState('');
  const [password, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.username);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Network error. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#fafafa]">
      
      {/* Back to Home Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition-colors font-medium">
          <ArrowLeft className="h-3 w-3" />
          <span>Back to public site</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl rounded-3xl border border-neutral-100 sm:px-10 text-left"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-extrabold text-neutral-900">
              Admin Login
            </h2>
            <p className="mt-1.5 text-xs text-neutral-500">
              Enter your credentials to access the management interface
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="pl-10 w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </div>
  );
};
