import React, { useEffect, useState } from 'react';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Zap, Star, Calendar } from 'lucide-react';
import { calculateTeamStats } from '@/lib/statsCalculator';
import { practiceSchedule } from '@/config/practice-schedule';

export const Home: React.FC = () => {
  const [liveStats, setLiveStats] = useState({
    teamAverage: 0,
    totalMembers: 0,
    totalGames: 0,
    highIndividualGame: 0,
  });
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        // setLoading(true);
        const teamStats = await calculateTeamStats();

        setLiveStats({
          teamAverage: teamStats.teamAverage,
          totalMembers: teamStats.totalPlayers,
          totalGames: teamStats.totalGames,
          highIndividualGame: teamStats.highIndividualGame,
        });

        console.log(`✅ Home: ${teamStats.totalPlayers} players, ${teamStats.teamAverage} avg, ${teamStats.totalGames} games`);
      } catch (error) {
        console.error('❌ Error fetching home stats:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchLiveStats();
  }, []);

  const stats = [
    { icon: TrendingUp, label: 'Team Average', value: liveStats.teamAverage, emoji: '📊', gradient: 'from-willard-grey-800 to-willard-black' },
    { icon: Users, label: 'Active Athletes', value: liveStats.totalMembers, emoji: '👥', gradient: 'from-willard-grey-700 to-willard-grey-900' },
    { icon: Trophy, label: 'Total Games', value: liveStats.totalGames, emoji: '🎳', gradient: 'from-willard-grey-600 to-willard-grey-800' },
    { icon: Target, label: 'High Game', value: liveStats.highIndividualGame, emoji: '🎯', gradient: 'from-willard-black to-willard-grey-900' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">

      {/* 🔥 HERO SECTION - FULL WIDTH CENTERED */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* ESPN Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-90" />

        <div className="relative w-full px-6 py-20 md:py-28 text-center">
          {/* Tiger Logo with Glow */}
          <div className="mb-12 flex justify-center animate-scale-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <img
                src="/assets/logos/tiger-logo.jpg"
                alt="Willard Tigers"
                className="relative h-28 md:h-36 rounded-full shadow-2xl ring-4 ring-yellow-500/30 group-hover:ring-yellow-500/60 transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-heading text-7xl md:text-8xl lg:text-9xl tracking-wider leading-none mb-6 animate-slide-up">
            WILLARD TIGERS
          </h1>
          <div className="text-center mb-10 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest shadow-glow">
              Bowling Team
            </div>
          </div>

          {/* Tagline */}
          <div className="flex items-center justify-center gap-2 mb-16 text-sm opacity-75">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">Focused. Connected. Driven.</span>
          </div>

          {/* Subheading - WITH EXTRA SPACING */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-12 leading-tight max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.3s'}}>
            STRIKE YOUR WAY<br />TO VICTORY
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-10 opacity-85 leading-relaxed">
            Join the most dynamic high school bowling program in the region.
            We're building champions, one frame at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-willard-black px-8 py-3 rounded-full font-bold text-base hover:from-yellow-400 hover:to-yellow-500 transition-all hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
            >
              Join the Team
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.location.href = '/roster'}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold text-base hover:bg-white hover:text-willard-black transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Meet Our Athletes
            </button>
          </div>
        </div>
      </section>

      {/* 📊 STATS GRID - LIVE STATS */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-12 md:mb-16">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-2xl md:text-3xl font-black text-willard-grey-900 tracking-tight">LIVE STATS</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white relative overflow-hidden group"
              >
                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-10 group-hover:opacity-15 group-hover:scale-110 transition-all">
                  {stat.emoji}
                </div>

                <div className="text-center mb-4 relative z-10">
                  {stat.label === 'Team Average' && stat.value === 0 ? (
                    <div className="text-4xl font-bold">Pre-Season</div>
                  ) : stat.label === 'Season Wins' && stat.value === 0 ? (
                    <div className="text-4xl font-bold">TBD</div>
                  ) : stat.label === 'Championships' && stat.value === 0 ? (
                    <div className="text-4xl font-bold">TBD</div>
                  ) : (
                    <div className="text-4xl font-bold">{stat.value}</div>
                  )}
                </div>

                <div className="text-center relative z-10">
                  <div className="text-sm font-semibold uppercase tracking-wider text-white opacity-80">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏆 RECENT HIGHLIGHTS - NO TAGLINE */}
      <section className="w-full bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-willard-grey-900">
              Recent Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-7xl opacity-10 group-hover:opacity-15 transition-all">
                🏆
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wide opacity-75">Coming soon</span>
                </div>
                <h3 className="font-black text-xl md:text-2xl mb-2">
                  Season Starting Soon
                </h3>
                <p className="opacity-90 text-sm md:text-base">
                  Check back soon for recent highlights and achievements
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-7xl opacity-10 group-hover:opacity-15 transition-all">
                📅
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wide opacity-75">Next Match</span>
                </div>
                <h3 className="font-black text-xl md:text-2xl mb-2">
                  Friday, March 15th at 3:30 PM
                </h3>
                <p className="opacity-90 text-sm md:text-base mb-1">
                  vs. Springfield Central
                </p>
                <p className="opacity-75 text-xs md:text-sm">
                  Willard Lanes • Home Match
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ CALL TO ACTION */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 rounded-2xl p-12 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/4 text-8xl">🎳</div>
              <div className="absolute top-1/4 right-1/4 text-8xl">⚡</div>
            </div>

            <div className="relative z-10 w-full">
              <div className="flex justify-center mb-6 w-full">
                <div className="inline-block bg-yellow-500 text-willard-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide">
                  NEW MEMBERS WELCOME
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-center w-full">
                Ready to Join<br />The Tigers?
              </h3>
              <p className="text-xl md:text-2xl mb-3 font-bold max-w-3xl mx-auto text-center w-full">
                {practiceSchedule.getScheduleText()}
              </p>
              <p className="text-sm md:text-base mb-8 opacity-75 max-w-2xl mx-auto text-center w-full">
                {practiceSchedule.getDetailsText()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
