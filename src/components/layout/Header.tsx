import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pin, Users, Trophy, Mail, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, userRole, signOut } = useAuth();
  const location = useLocation();

  const publicNav = [
    { id: 'home', label: 'Home', href: '/', icon: Pin },
    { id: 'roster', label: 'Roster', href: '/roster', icon: Users },
    { id: 'stats', label: 'Stats', href: '/stats', icon: Trophy },
    { id: 'contact', label: 'Join', href: '/contact', icon: Mail },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="bg-white shadow-tiger-xl sticky top-0 z-40 border-b-4 border-willard-black">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 🎳 BOLD LOGO */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="text-6xl animate-pulse group-hover:scale-125 transition-transform">
              🎳
            </div>
            <div>
              <div className="text-3xl font-black bg-gradient-to-r from-willard-black to-willard-grey-700 bg-clip-text text-transparent">
                WILLARD TIGERS
              </div>
              <div className="text-sm font-bold text-willard-grey-600 tracking-wide">
                BOWLING TEAM
              </div>
            </div>
          </Link>

          {/* ⚡ NAVIGATION BUTTONS */}
          <div className="hidden md:flex gap-2">
            {publicNav.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.id}
                  to={tab.href}
                  className={`px-6 py-3 rounded-2xl font-black transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-gradient-to-r from-willard-black to-willard-grey-800 text-white shadow-tiger-lg scale-110'
                      : 'text-willard-grey-600 hover:bg-willard-grey-100 hover:text-willard-black hover:scale-105'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </Link>
              );
            })}

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-6 py-3 bg-willard-grey-800 text-white rounded-2xl font-black hover:bg-willard-black transition-all hover:scale-105 flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">{currentUser.displayName || 'Menu'}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-tiger-2xl py-2 border-2 border-willard-grey-200">
                    <Link
                      to={userRole === 'coach' ? '/coach/dashboard' : '/player/dashboard'}
                      className="block px-6 py-3 font-bold text-willard-grey-700 hover:bg-willard-grey-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-6 py-3 font-bold text-willard-grey-700 hover:bg-willard-grey-100 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="px-6 py-3 bg-willard-black text-white rounded-2xl font-black hover:bg-willard-grey-800 transition-all hover:scale-105 shadow-tiger-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* 📱 MOBILE MENU - Show Sign In */}
          <div className="md:hidden">
            {currentUser ? (
              <Link
                to={userRole === 'coach' ? '/coach/dashboard' : '/player/dashboard'}
                className="px-4 py-2 bg-willard-grey-900 text-white rounded-xl font-bold flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Menu
              </Link>
            ) : (
              <Link
                to="/signin"
                className="px-6 py-3 bg-willard-black text-white rounded-2xl font-black hover:bg-willard-grey-800 transition-all shadow-tiger-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
