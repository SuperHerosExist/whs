import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pin, Users, Trophy, Mail, User, LogOut, Menu, X, BarChart3, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';

export const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userRole, signOut } = useAuth();
  const location = useLocation();

  const publicNav = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'roster', label: 'Roster', href: '/roster', icon: Users },
    { id: 'stats', label: 'Stats', href: '/stats', icon: Trophy },
    { id: 'contact', label: 'Join', href: '/contact', icon: Mail },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-40 border-b border-tiger-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <Pin className="w-7 h-7 lg:w-10 lg:h-10 text-tiger-primary-black group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm lg:text-xl font-black text-tiger-primary-black leading-tight">
                  WILLARD TIGERS
                </div>
                <div className="text-[9px] lg:text-xs font-bold text-tiger-neutral-600 tracking-wide leading-tight">
                  BOWLING
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {publicNav.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    className="relative px-5 py-3 font-bold transition-all flex items-center gap-2 group text-base"
                  >
                    <tab.icon className={`w-5 h-5 transition-all group-hover:scale-110 ${
                      active ? 'text-tiger-tiger-gold' : 'text-tiger-neutral-600 group-hover:text-tiger-primary-black'
                    }`} />
                    <span className={`transition-colors ${
                      active ? 'text-tiger-primary-black' : 'text-tiger-neutral-700 group-hover:text-tiger-primary-black'
                    }`}>
                      {tab.label}
                    </span>
                    {/* Animated underline */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tiger-tiger-gold to-tiger-tiger-darkRed rounded-full transition-all duration-300 ${
                      active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`} />
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
                <Link to="/signin" className="ml-3">
                  <Button
                    variant="primary"
                    size="md"
                    className="bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-tiger-primary-black hover:from-tiger-tiger-gold hover:to-yellow-400 font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button - Larger touch target */}
            <div className="lg:hidden flex items-center gap-2">
              {currentUser && !mobileMenuOpen && (
                <Link to={userRole === 'coach' ? '/coach/dashboard' : '/player/dashboard'}>
                  <button className="p-2 rounded-lg bg-tiger-neutral-100 hover:bg-tiger-neutral-200 transition-colors">
                    <User className="w-5 h-5 text-tiger-primary-black" />
                  </button>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-tiger-neutral-100 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-tiger-primary-black" />
                ) : (
                  <Menu className="w-6 h-6 text-tiger-primary-black" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Full screen, native feel */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 bottom-0 bg-white z-50 lg:hidden overflow-y-auto">
            <div className="px-4 py-6 space-y-2">
              {publicNav.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.id}
                    to={tab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all text-base ${
                      active
                        ? 'bg-tiger-primary-black text-white shadow-lg'
                        : 'text-tiger-neutral-700 hover:bg-tiger-neutral-100 active:bg-tiger-neutral-200'
                    }`}
                  >
                    <tab.icon className="w-6 h-6" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}

              <div className="pt-6 mt-6 border-t-2 border-tiger-neutral-200">
                {currentUser ? (
                  <>
                    <div className="px-5 py-3 mb-2 bg-tiger-neutral-50 rounded-xl">
                      <div className="text-xs text-tiger-neutral-600 mb-1">Signed in as</div>
                      <div className="font-bold text-tiger-primary-black">{currentUser.displayName}</div>
                    </div>
                    <Link
                      to={userRole === 'coach' ? '/coach/dashboard' : '/player/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 rounded-xl font-semibold text-tiger-neutral-700 hover:bg-tiger-neutral-100 active:bg-tiger-neutral-200 transition-all text-base mb-2"
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-all text-base"
                    >
                      <LogOut className="w-6 h-6" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="block">
                    <Button variant="primary" size="xl" fullWidth className="text-base">
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
