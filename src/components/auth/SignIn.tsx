import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { branding } from '@/config/branding';

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-tiger-neutral-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-tiger-primary-black mb-2">
            {branding.school.teamName}
          </h1>
          <p className="text-tiger-neutral-600 font-medium">
            {branding.school.name} Bowling
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-tiger-lg p-8">
          <h2 className="text-2xl font-display font-bold text-tiger-primary-black mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-In Button - MASSIVE AND PROMINENT */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-black text-white py-6 px-8 rounded-2xl font-black text-xl hover:shadow-tiger-2xl transition-all hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <svg className="w-8 h-8 relative z-10" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="relative z-10 tracking-wide">
              {loading ? 'SIGNING IN...' : 'SIGN IN WITH GOOGLE'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-willard-grey-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-willard-grey-600 font-bold tracking-wider">
                OR SIGN IN WITH EMAIL
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-tiger-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-tiger-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tiger-primary-black text-white py-3 rounded-lg font-semibold hover:bg-tiger-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-tiger-neutral-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-tiger-primary-black hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-tiger-neutral-600 hover:text-tiger-primary-black transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
