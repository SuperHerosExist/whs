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
          {/* Logo with W and Tiger */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/assets/logos/W-logo.png" alt="Willard W" className="h-12 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xl font-black text-willard-black">
                WILLARD TIGERS
              </div>
              <div className="text-xs font-semibold text-willard-grey-600 uppercase tracking-wide">
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
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-gradient-to-r from-willard-black to-willard-grey-800 text-white shadow-md'
                      : 'text-willard-grey-700 hover:bg-willard-grey-100 hover:text-willard-black'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </Link>
              );
            })}

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-4 py-2 bg-willard-grey-800 text-white rounded-lg font-bold text-sm hover:bg-willard-black transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
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
                className="px-4 py-2 bg-willard-black text-white rounded-lg font-bold text-sm hover:bg-willard-grey-800 transition-all shadow-md"
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
