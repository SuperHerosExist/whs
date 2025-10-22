import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-12 mt-auto relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-9xl absolute top-4 left-10">🎳</div>
        <div className="text-9xl absolute bottom-4 right-10">🎯</div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Logo */}
        <div className="text-6xl mb-6">🎳</div>

        {/* Title */}
        <div className="text-2xl md:text-3xl font-black mb-3">
          WILLARD HIGH SCHOOL BOWLING
        </div>

        {/* Tagline */}
        <div className="text-base md:text-lg font-semibold opacity-80 mb-4">
          Strike Your Way to Victory
        </div>

        {/* Values */}
        <div className="text-sm font-medium opacity-60 mb-6">
          Focused | Connected | Driven
        </div>

        {/* Copyright */}
        <div className="text-xs opacity-50">
          © {new Date().getFullYear()} Willard Tigers Bowling Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
