import React from 'react';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Zap, Pin, Star, Calendar } from 'lucide-react';

export const Home: React.FC = () => {
  const stats = [
    { icon: TrendingUp, label: 'Team Average', value: 202, emoji: '📊', gradient: 'from-willard-grey-800 to-willard-black' },
    { icon: Users, label: 'Active Athletes', value: 24, emoji: '👥', gradient: 'from-willard-grey-700 to-willard-grey-900' },
    { icon: Trophy, label: 'Season Wins', value: 15, emoji: '🏆', gradient: 'from-willard-grey-600 to-willard-grey-800' },
    { icon: Target, label: 'Championships', value: 3, emoji: '🥇', gradient: 'from-willard-black to-willard-grey-900' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">

      {/* 🔥 HERO SECTION */}
      <section className="relative bg-gradient-to-br from-willard-black via-willard-grey-900 to-willard-grey-800 text-white overflow-hidden">
        {/* Subtle animated bowling pins background */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-20 left-20 text-9xl animate-pulse">🎳</div>
          <div className="absolute bottom-20 right-32 text-8xl animate-bounce" style={{ animationDuration: '3s' }}>🎯</div>
          <div className="absolute top-1/2 right-20 text-7xl" style={{ animation: 'float 6s ease-in-out infinite' }}>⚡</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <Pin className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                WILLARD TIGERS
              </h1>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold opacity-90 mt-2 tracking-wide">
                BOWLING TEAM
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm md:text-base opacity-80 justify-center md:justify-start">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Focused. Connected. Driven.</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 font-black leading-tight text-center md:text-left max-w-4xl">
            Strike Your Way to Victory
          </h2>

          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mb-12 opacity-90 leading-relaxed text-center md:text-left">
            Join the most dynamic high school bowling program in the region.
            We're building champions, one frame at a time. Perfect your game,
            compete with the best, and leave your mark on the lanes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-willard-black px-10 py-5 rounded-full font-black text-lg hover:from-yellow-400 hover:to-yellow-500 transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 shadow-xl"
            >
              Join the Team
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => window.location.href = '/roster'}
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white hover:text-willard-black transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              Meet Our Athletes
            </button>
          </div>
        </div>
      </section>

      {/* 📊 STATS GRID - LIVE STATS */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-2xl md:text-3xl font-black text-willard-grey-800 tracking-wide text-center">LIVE STATS</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.gradient} rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-tiger-xl hover:shadow-tiger-2xl hover:-translate-y-2 transition-all text-white relative overflow-hidden group cursor-pointer`}
            >
              {/* Emoji background decoration */}
              <div className="absolute top-2 right-2 text-5xl md:text-7xl opacity-15 group-hover:opacity-25 group-hover:scale-110 transition-all">
                {stat.emoji}
              </div>

              <stat.icon className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 relative z-10 group-hover:scale-110 transition-transform" />
              <div className="text-4xl md:text-5xl lg:text-6xl font-black relative z-10 mb-1 md:mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm lg:text-base font-bold opacity-90 relative z-10 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏆 RECENT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-willard-grey-900 mb-4">
            Recent Highlights
          </h2>
          <p className="text-lg md:text-xl text-willard-grey-600 max-w-2xl mx-auto">
            Celebrating our team's achievements and milestones
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Season Starting Soon Card */}
          <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-3xl p-8 md:p-10 text-white shadow-tiger-2xl hover:shadow-tiger-xl hover:scale-105 transition-all relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-7xl md:text-8xl opacity-10 group-hover:opacity-20 transition-all">
              🏆
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wide opacity-75">Coming soon</span>
              </div>
              <h3 className="font-black text-2xl md:text-3xl mb-3">
                Season Starting Soon
              </h3>
              <p className="opacity-90 text-base md:text-lg font-medium">
                Check back soon for recent highlights and achievements
              </p>
            </div>
          </div>

          {/* Next Match Card */}
          <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 rounded-3xl p-8 md:p-10 text-white shadow-tiger-2xl hover:shadow-tiger-xl hover:scale-105 transition-all relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-7xl md:text-8xl opacity-10 group-hover:opacity-20 transition-all">
              📅
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wide opacity-75">Next Match</span>
              </div>
              <h3 className="font-black text-2xl md:text-3xl mb-3">
                Friday, March 15th at 3:30 PM
              </h3>
              <p className="opacity-90 text-base md:text-lg font-medium mb-1">
                vs. Springfield Central
              </p>
              <p className="opacity-75 text-sm md:text-base">
                Willard Lanes • Home Match
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ CALL TO ACTION - Ready to Join */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 pb-20">
        <div className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 rounded-3xl p-10 md:p-16 text-center text-white shadow-tiger-2xl relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/4 text-9xl animate-float-slow">🎳</div>
            <div className="absolute top-1/4 right-1/4 text-9xl animate-float">⚡</div>
          </div>

          <div className="relative z-10">
            <div className="inline-block bg-yellow-500 text-willard-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-wide mb-6">
              NEW MEMBERS WELCOME
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Ready to Join<br />The Tigers?
            </h3>
            <p className="text-xl md:text-2xl lg:text-3xl mb-4 font-bold max-w-3xl mx-auto">
              Practice starts every Monday & Wednesday at 3:30 PM
            </p>
            <p className="text-base md:text-lg mb-10 opacity-75 max-w-2xl mx-auto">
              All skill levels welcome • Equipment provided • No experience needed
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-willard-black px-12 py-6 rounded-full font-black text-xl hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl"
            >
              Join the Team
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
