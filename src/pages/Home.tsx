import React from 'react';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Zap, Pin, Calendar } from 'lucide-react';

export const Home: React.FC = () => {
  const stats = [
    { icon: TrendingUp, label: 'Team Average', value: 202, emoji: '📊', gradient: 'from-willard-grey-800 to-willard-black' },
    { icon: Users, label: 'Active Athletes', value: 24, emoji: '👥', gradient: 'from-willard-grey-700 to-willard-grey-900' },
    { icon: Trophy, label: 'Season Wins', value: 15, emoji: '🏆', gradient: 'from-willard-grey-600 to-willard-grey-800' },
    { icon: Target, label: 'Championships', value: 3, emoji: '🥇', gradient: 'from-willard-black to-willard-grey-900' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">

      {/* 🔥 HERO SECTION - Clean and Professional */}
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
              className="bg-white text-willard-black px-10 py-5 rounded-full font-black text-lg hover:bg-willard-grey-100 transition-all hover:scale-105 hover:shadow-tiger-2xl flex items-center justify-center gap-3 shadow-tiger-xl group"
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              JOIN THE TEAM
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => window.location.href = '/roster'}
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white hover:text-willard-black transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <Users className="w-6 h-6" />
              MEET THE TEAM
            </button>
          </div>
        </div>
      </section>

      {/* 📊 STATS GRID - LIVE STATS Label */}
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

      {/* 🏆 RECENT HIGHLIGHTS - Cleaner Layout */}
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
          {/* District Champions Card */}
          <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-3xl p-8 md:p-10 text-white shadow-tiger-2xl hover:shadow-tiger-xl hover:scale-105 transition-all relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-7xl md:text-8xl opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all">
              🏆
            </div>
            <div className="relative z-10">
              <div className="text-6xl md:text-7xl mb-4">🏆</div>
              <h3 className="font-black text-2xl md:text-3xl mb-3">
                District Champions!
              </h3>
              <p className="opacity-90 text-base md:text-lg font-medium mb-4">
                Team posted a season-high 4,012 pins
              </p>
              <div className="inline-block bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold">
                Coming soon
              </div>
            </div>
          </div>

          {/* Perfect Game Card */}
          <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 rounded-3xl p-8 md:p-10 text-white shadow-tiger-2xl hover:shadow-tiger-xl hover:scale-105 transition-all relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-7xl md:text-8xl opacity-10 group-hover:opacity-20 group-hover:-rotate-12 transition-all">
              🎯
            </div>
            <div className="relative z-10">
              <div className="text-6xl md:text-7xl mb-4">🎯</div>
              <h3 className="font-black text-2xl md:text-3xl mb-3">
                Season Starting Soon
              </h3>
              <p className="opacity-90 text-base md:text-lg font-medium mb-4">
                Check back soon for recent highlights and achievements
              </p>
              <div className="inline-block bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold">
                Coming soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📅 NEXT MATCH - NEW SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 rounded-3xl p-8 md:p-12 shadow-tiger-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="text-[200px] absolute -top-10 -right-10 rotate-12">🎳</div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div className="text-center md:text-left flex-1">
              <div className="inline-block bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
                <div className="flex items-center gap-2 justify-center">
                  <Calendar className="w-4 h-4" />
                  <span>NEXT MATCH</span>
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2">
                Friday, March 15th at 3:30 PM
              </h3>
              <p className="text-xl md:text-2xl opacity-90 font-bold mb-1">
                vs. Springfield Central
              </p>
              <p className="text-base md:text-lg opacity-75">
                Willard Lanes • Home Match
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.href = '/roster'}
                className="bg-white text-willard-black px-8 py-4 rounded-full font-black text-base hover:bg-willard-grey-100 hover:scale-105 transition-all shadow-tiger-lg whitespace-nowrap"
              >
                View Team Roster
              </button>
              <button
                onClick={() => window.location.href = '/stats'}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-black text-base hover:bg-white hover:text-willard-black hover:scale-105 transition-all whitespace-nowrap"
              >
                Check Team Stats
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ PRACTICE INFO - Simplified */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 pb-20">
        <div className="bg-white rounded-3xl p-10 md:p-16 text-center shadow-tiger-2xl border-4 border-willard-grey-200">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-willard-grey-900">
            Ready to Strike?
          </h3>
          <p className="text-xl md:text-2xl mb-8 text-willard-grey-700 font-semibold max-w-3xl mx-auto">
            Practice starts every Monday & Wednesday at 3:30 PM
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-gradient-to-r from-willard-black to-willard-grey-800 text-white px-12 py-6 rounded-full font-black text-xl hover:shadow-tiger-2xl hover:scale-105 transition-all inline-flex items-center gap-4"
          >
            Get Started Today
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </section>
    </div>
  );
};
