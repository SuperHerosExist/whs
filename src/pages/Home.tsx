import React, { useEffect, useState } from 'react';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Zap, Star, Calendar } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import { practiceSchedule } from '@/config/practice-schedule';

export const Home: React.FC = () => {
  const [liveStats, setLiveStats] = useState({
    teamAverage: 0,
    totalMembers: 0,
    seasonsWins: 0,
    championships: 0,
  });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const teamRef = doc(statsDb, 'teams', STATS_TEAM_ID);
        const teamSnap = await getDoc(teamRef);

        if (!teamSnap.exists()) {
          console.error('❌ Team not found');
          return;
        }

        const teamData = teamSnap.data();
        const playerIds = teamData?.playerIds || [];

        const players = [];
        for (const playerId of playerIds) {
          try {
            const playerRef = doc(statsDb, 'players', playerId);
            const playerSnap = await getDoc(playerRef);
            if (playerSnap.exists()) {
              players.push(playerSnap.data());
            }
          } catch (playerError) {
            console.warn(`⚠️  Could not fetch player ${playerId}:`, playerError);
          }
        }

        const totalMembers = players.length;
        const averages = players.filter((p: any) => p.average > 0).map((p: any) => p.average);
        const teamAverage = averages.length > 0
          ? Math.round(averages.reduce((sum: number, avg: number) => sum + avg, 0) / averages.length)
          : 0;

        setLiveStats(prev => ({
          ...prev,
          teamAverage,
          totalMembers,
        }));

        console.log(`✅ Home page: ${totalMembers} players, ${teamAverage} avg`);
      } catch (error) {
        console.error('❌ Error fetching home stats:', error);
      }
    };

    fetchLiveStats();
  }, []);

  const stats = [
    { icon: TrendingUp, label: 'Team Average', value: liveStats.teamAverage, emoji: '📊', gradient: 'from-willard-grey-800 to-willard-black' },
    { icon: Users, label: 'Active Athletes', value: liveStats.totalMembers, emoji: '👥', gradient: 'from-willard-grey-700 to-willard-grey-900' },
    { icon: Trophy, label: 'Season Wins', value: liveStats.seasonsWins, emoji: '🏆', gradient: 'from-willard-grey-600 to-willard-grey-800' },
    { icon: Target, label: 'Championships', value: liveStats.championships, emoji: '🥇', gradient: 'from-willard-black to-willard-grey-900' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">

      {/* 🔥 HERO SECTION - FULL WIDTH CENTERED */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-7xl">🎳</div>
          <div className="absolute bottom-20 right-10 text-7xl">🎯</div>
        </div>

        <div className="relative w-full px-6 py-20 md:py-28 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src="/assets/logos/tiger-logo.jpg" alt="Willard Tigers" className="h-24 md:h-32 rounded-full shadow-2xl ring-4 ring-yellow-500 ring-opacity-50" />
          </div>

          {/* Title */}
          <h1 className="font-heading text-7xl md:text-8xl lg:text-9xl tracking-wider leading-none mb-6 animate-slide-up">
            WILLARD TIGERS
          </h1>
          <div className="text-xl md:text-2xl font-bold opacity-90 mb-12">
            BOWLING TEAM
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

            <div className="relative z-10">
              <div className="inline-block bg-yellow-500 text-willard-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide mb-6">
                NEW MEMBERS WELCOME
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-6">
                Ready to Join<br />The Tigers?
              </h3>
              <p className="text-xl md:text-2xl mb-3 font-bold max-w-3xl mx-auto">
                {practiceSchedule.getScheduleText()}
              </p>
              <p className="text-sm md:text-base mb-8 opacity-75 max-w-2xl mx-auto">
                {practiceSchedule.getDetailsText()}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-willard-black px-10 py-4 rounded-full font-black text-lg hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 transition-all inline-flex items-center gap-3 shadow-xl"
                >
                  Join the Team
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
