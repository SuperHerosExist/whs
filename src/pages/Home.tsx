import React from 'react';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Zap, Pin, Star } from 'lucide-react';

export const Home: React.FC = () => {
  const stats = [
    { icon: TrendingUp, label: 'Team Average', value: 202, emoji: '📊', gradient: 'from-willard-grey-800 to-willard-black' },
    { icon: Users, label: 'Team Members', value: 24, emoji: '👥', gradient: 'from-willard-grey-700 to-willard-grey-900' },
    { icon: Trophy, label: 'Season Wins', value: 15, emoji: '🏆', gradient: 'from-willard-grey-600 to-willard-grey-800' },
    { icon: Target, label: 'Championships', value: 3, emoji: '🥇', gradient: 'from-willard-black to-willard-grey-900' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">

      {/* 🔥 HERO SECTION - MASSIVE AND BOLD */}
      <section className="relative bg-gradient-to-br from-willard-black via-willard-grey-900 to-willard-grey-800 text-white overflow-hidden">
        {/* Animated bowling pins background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 text-9xl animate-bounce">🎳</div>
          <div className="absolute bottom-10 right-20 text-7xl animate-pulse">🎯</div>
          <div className="absolute top-1/2 right-10 text-8xl animate-spin-slow">⚡</div>
          <div className="absolute bottom-20 left-1/4 text-6xl animate-float">🎳</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <Pin className="w-20 h-20" />
            </div>
            <div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-none">
                WILLARD TIGERS
              </h1>
              <div className="text-3xl md:text-4xl font-bold opacity-90 mt-2 tracking-wide">
                BOWLING TEAM
              </div>
            </div>
          </div>

          <p className="text-4xl md:text-5xl mb-6 font-black leading-tight">
            🔥 Strike Your Way to Victory 🔥
          </p>

          <p className="text-xl md:text-2xl max-w-3xl mb-10 opacity-90 leading-relaxed font-medium">
            Join the most dynamic high school bowling program in the region. We're building champions, one frame at a time.
            Perfect your game, compete with the best, and leave your mark on the lanes!
          </p>

          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-white text-willard-black px-12 py-6 rounded-full font-black text-xl hover:bg-willard-grey-100 transition-all hover:scale-110 hover:shadow-tiger-2xl flex items-center gap-4 shadow-tiger-xl group"
          >
            <Zap className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            JOIN THE TEAM
            <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* 📊 STATS GRID - BOLD AND DYNAMIC */}
      <section className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-8 shadow-tiger-2xl hover:shadow-tiger-xl hover:-translate-y-4 hover:scale-105 transition-all text-white relative overflow-hidden group cursor-pointer`}
            >
              {/* Emoji background decoration */}
              <div className="absolute top-0 right-0 text-7xl opacity-20 group-hover:opacity-30 group-hover:scale-125 transition-all">
                {stat.emoji}
              </div>

              <stat.icon className="w-12 h-12 mb-4 relative z-10 group-hover:scale-110 transition-transform" />
              <div className="text-5xl md:text-6xl font-black relative z-10 mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-bold opacity-90 relative z-10 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏆 RECENT HIGHLIGHTS - DRAMATIC */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-3xl p-10 md:p-12 text-white shadow-tiger-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="text-[200px] absolute top-4 right-4 rotate-12">🎳</div>
            <div className="text-[200px] absolute bottom-4 left-4 -rotate-12">🎯</div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <Star className="w-12 h-12 animate-pulse" />
              <h2 className="text-5xl md:text-6xl font-black">
                RECENT HIGHLIGHTS
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 shadow-tiger-lg hover:shadow-tiger-xl hover:scale-105 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="text-8xl group-hover:scale-125 transition-transform">🏆</div>
                  <div>
                    <div className="font-black text-3xl md:text-4xl mb-2">
                      DISTRICT CHAMPIONS!
                    </div>
                    <div className="opacity-90 text-xl md:text-2xl font-semibold">
                      Team posted a season-high 4,012 pins 🔥
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 shadow-tiger-lg hover:shadow-tiger-xl hover:scale-105 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="text-8xl group-hover:scale-125 transition-transform">🎯</div>
                  <div>
                    <div className="font-black text-3xl md:text-4xl mb-2">
                      NEAR PERFECT GAME!
                    </div>
                    <div className="opacity-90 text-xl md:text-2xl font-semibold">
                      Alex Johnson bowled a 289 at Regionals ⚡
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ CALL TO ACTION - ELECTRIC */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 rounded-3xl p-12 md:p-16 text-center text-white shadow-tiger-2xl relative overflow-hidden group">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/4 text-9xl animate-float-slow">🎳</div>
            <div className="absolute top-1/4 right-1/4 text-9xl animate-float">⚡</div>
          </div>

          <div className="relative z-10">
            <h3 className="text-5xl md:text-6xl font-black mb-6">
              READY TO STRIKE? 🎳
            </h3>
            <p className="text-2xl md:text-3xl mb-10 opacity-90 font-bold max-w-3xl mx-auto">
              Practice starts every Monday & Wednesday at 3:30 PM
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-willard-black px-12 py-6 rounded-full font-black text-xl hover:bg-willard-grey-100 hover:scale-110 transition-all inline-flex items-center gap-4 shadow-tiger-xl"
            >
              Learn More
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
