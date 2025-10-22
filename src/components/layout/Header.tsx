import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pin, Users, Trophy, Mail, User, LogOut, Menu, X, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';

export const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userRole, signOut } = useAuth();
  const location = useLocation();

  const publicNav = [
    { id: 'home', label: 'Home', href: '/', icon: Pin },
    { id: 'roster', label: 'Roster', href: '/roster', icon: Users },
    { id: 'stats', label: 'Stats', href: '/stats', icon: Trophy },
    { id: 'contact', label: 'Join Team', href: '/contact', icon: Mail },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-tiger-lg sticky top-0 z-40 border-b-2 border-tiger-primary-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="text-4xl group-hover:scale-110 transition-transform">
                <Pin className="w-10 h-10 text-tiger-primary-black" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-black bg-gradient-to-r from-tiger-primary-black to-tiger-neutral-700 bg-clip-text text-transparent leading-tight">
                  WILLARD TIGERS
                </div>
                <div className="text-xs font-bold text-tiger-neutral-600 tracking-wide">
                  BOWLING TEAM
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {publicNav.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      active
                        ? 'bg-tiger-primary-black text-white shadow-tiger'
                        : 'text-tiger-neutral-700 hover:bg-tiger-neutral-100 hover:text-tiger-primary-black'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}

              {/* Desktop User Menu */}
              {currentUser ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="px-4 py-2.5 bg-tiger-neutral-800 text-white rounded-xl font-semibold hover:bg-tiger-primary-black transition-all flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{currentUser.displayName || 'Menu'}</span>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-tiger-2xl py-2 border-2 border-tiger-neutral-200 z-40">
                        <Link
                          to={userRole === 'coach' ? '/coach/dashboard' : '/player/dashboard'}
                          className="block px-4 py-3 font-semibold text-tiger-neutral-700 hover:bg-tiger-neutral-100 transition-colors flex items-center gap-2"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <BarChart3 className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="ml-2">
                  <Button variant="primary" size="md">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              {currentUser && !mobileMenuOpen && (
                <Link to={userRole === 'coach' ? '/coach/dashboard' : '/player/dashboard'}>
                  <Button variant="secondary" size="sm" icon={User}>
                    <span className="sr-only">Dashboard</span>
                  </Button>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-tiger-neutral-700 hover:bg-tiger-neutral-100 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-0 right-0 bg-white shadow-tiger-2xl z-50 lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              {publicNav.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                      active
                        ? 'bg-tiger-primary-black text-white'
                        : 'text-tiger-neutral-700 hover:bg-tiger-neutral-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-tiger-neutral-200">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 text-sm text-tiger-neutral-600">
                      Signed in as <span className="font-semibold text-tiger-primary-black">{currentUser.displayName}</span>
                    </div>
                    <Link
                      to={userRole === 'coach' ? '/coach/dashboard' : '/player/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-tiger-neutral-700 hover:bg-tiger-neutral-100 transition-all"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="lg" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
