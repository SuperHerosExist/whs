import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-16 mt-20 relative overflow-hidden">
      {/* Decorative bowling pins */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-[200px] absolute top-4 left-10 rotate-12">🎳</div>
        <div className="text-[200px] absolute bottom-4 right-10 -rotate-12">🎯</div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="text-8xl mb-8 animate-pulse">🎳</div>
        <div className="text-4xl md:text-5xl font-black mb-4">
          WILLARD HIGH SCHOOL BOWLING
        </div>
        <div className="text-2xl md:text-3xl font-bold opacity-90 mb-6">
          Strike Your Way to Victory
        </div>
        <div className="text-lg font-semibold opacity-75 mb-4">
          Focused | Connected | Driven
        </div>
        <div className="text-sm opacity-60 font-medium">
          © {new Date().getFullYear()} Willard Tigers Bowling Team. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
