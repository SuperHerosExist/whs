import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { branding } from '@/config/branding';
import type { UserRole } from '@/types';

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'player' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.displayName, formData.role);
      navigate('/player/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
            Join {branding.school.teamName}
          </h1>
          <p className="text-tiger-neutral-600 font-medium">
            {branding.school.name} Bowling
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-tiger-lg p-8">
          <h2 className="text-2xl font-display font-bold text-tiger-primary-black mb-6">
            Create Account
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-tiger-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-tiger-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-tiger-neutral-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tiger-primary-black text-white py-3 rounded-lg font-semibold hover:bg-tiger-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-tiger-neutral-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-semibold text-tiger-primary-black hover:underline">
                Sign in
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
