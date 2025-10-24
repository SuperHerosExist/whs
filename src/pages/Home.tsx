import React, { useEffect, useState } from "react";
import {
  Trophy,
  Users,
  Target,
  TrendingUp,
  ChevronRight,
  Zap,
  Star,
  Calendar,
} from "lucide-react";
import { calculateTeamStats } from "@/lib/statsCalculator";
import { practiceSchedule } from "@/config/practice-schedule";
import { HighGameTicker } from "@/components/HighGameTicker";

export const Home: React.FC = () => {
  const [liveStats, setLiveStats] = useState({
    teamAverage: 0,
    totalMembers: 0,
    totalGames: 0,
    highIndividualGame: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        setLoading(true);
        const teamStats = await calculateTeamStats();
        setLiveStats({
          teamAverage: teamStats.teamAverage,
          totalMembers: teamStats.totalPlayers,
          totalGames: teamStats.totalGames,
          highIndividualGame: teamStats.highIndividualGame,
        });
      } catch (error) {
        console.error("❌ Error fetching home stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveStats();
  }, []);

  const stats = [
    { icon: TrendingUp, label: "Team Average", value: liveStats.teamAverage, emoji: "📊" },
    { icon: Users, label: "Active Athletes", value: liveStats.totalMembers, emoji: "👥" },
    { icon: Trophy, label: "Total Games", value: liveStats.totalGames, emoji: "🎳" },
    { icon: Target, label: "High Game", value: liveStats.highIndividualGame, emoji: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100 overflow-x-hidden">

      {/* 🦁 HERO SECTION */}
      <section className="relative bg-black text-white overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-85 z-0" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-8 sm:px-12 py-20 md:py-28 max-w-[90rem] mx-auto">

          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <img
                src="/assets/logos/tiger-logo.jpg"
                alt="Willard Tigers"
                className="relative h-28 md:h-36 rounded-full shadow-2xl ring-4 ring-yellow-500/40 group-hover:ring-yellow-500/60 transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-heading text-6xl md:text-8xl lg:text-[8rem] tracking-tight leading-none mb-6 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
            WILLARD TIGERS
          </h1>

          {/* Badge */}
          <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 md:px-10 py-2 md:py-2.5 rounded-full font-bold text-sm md:text-base uppercase tracking-wide shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-6">
            Bowling Team
          </div>

          {/* Motto */}
          <div className="flex items-center justify-center gap-2 mb-8 text-sm md:text-base opacity-90">
            <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="font-semibold">Focused. Connected. Driven.</span>
          </div>

          {/* Tagline */}
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight text-white mb-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            STRIKE YOUR WAY<br />TO VICTORY
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg max-w-3xl mx-auto opacity-95 leading-relaxed mb-10 text-center">
            Join the most dynamic high school bowling program in SW Missouri.
            We're building champions, one frame at a time.
          </p>

          {/* Single CTA Button */}
          <div className="pb-10 pt-4">
            <button
              onClick={() => (window.location.href = "/roster")}
              className="border-2 border-white text-white px-10 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-white hover:text-black transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
            >
              Meet Our Athletes
            </button>
          </div>
        </div>
      </section>

      {/* ⚡ ESPN-STYLE TICKER */}
      <HighGameTicker />

      {/* 📊 LIVE STATS */}
      <section className="bg-white py-14 md:py-20">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[90rem] px-8 sm:px-12 text-center">

            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <h3 className="text-2xl md:text-3xl font-black text-willard-grey-900 tracking-tight">
                LIVE STATS
              </h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 justify-items-center">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-xl p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all text-white relative overflow-hidden group w-full max-w-[280px]"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10">
                    {stat.emoji}
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-3xl sm:text-4xl font-bold mb-2">
                      {loading ? "..." : stat.value === 0 ? "TBD" : stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-80">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 RECENT HIGHLIGHTS */}
      <section className="bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100 py-20 md:py-24">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[90rem] px-8 sm:px-12">
            <h2 className="text-3xl md:text-4xl font-black text-center text-willard-grey-900 mb-14">
              Recent Highlights
            </h2>

            {/* Responsive vertical spacing fix */}
            <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 justify-items-center mb-10 sm:mb-14 md:mb-20">
              <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black rounded-xl p-10 text-white shadow-md hover:shadow-xl transition-all relative overflow-hidden group w-full">
                <div className="absolute top-6 right-6 text-8xl opacity-10">🏆</div>
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide opacity-75">
                      Coming soon
                    </span>
                  </div>
                  <h3 className="font-black text-xl md:text-2xl mb-3">
                    Season Starting Soon
                  </h3>
                  <p className="opacity-90 text-sm md:text-base leading-relaxed">
                    Check back soon for recent highlights and achievements.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 rounded-xl p-10 text-white shadow-md hover:shadow-xl transition-all relative overflow-hidden group w-full">
                <div className="absolute top-6 right-6 text-8xl opacity-10">📅</div>
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide opacity-75">
                      Next Match
                    </span>
                  </div>
                  <h3 className="font-black text-xl md:text-2xl mb-3">
                    Friday, March 15th at 3:30 PM
                  </h3>
                  <p className="opacity-90 text-sm md:text-base mb-1 leading-relaxed">
                    vs. Springfield Central
                  </p>
                  <p className="opacity-70 text-sm md:text-base leading-relaxed">
                    Willard Lanes • Home Match
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ CTA SECTION - FULL CLICKABLE */}
      <section
        className="w-full bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-20 md:py-24 mt-10 sm:mt-16 md:mt-20 relative overflow-hidden text-center cursor-pointer hover:brightness-110 transition-all duration-300"
        onClick={() => (window.location.href = "/contact")}
      >
        <div className="absolute -top-4 left-0 w-full h-4 bg-white" />

        <div className="w-full flex justify-center">
          <div className="w-full max-w-[90rem] px-8 sm:px-12 relative z-10">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 text-8xl">🎳</div>
              <div className="absolute top-1/4 right-1/4 text-8xl">⚡</div>
            </div>

            <div className="relative z-10">
              <div className="inline-block bg-yellow-500 text-willard-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-wide shadow-lg mb-8">
                New Members Welcome
              </div>

              <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight hover:text-yellow-400 transition-all duration-300">
                Ready to Join
                <br />
                The Tigers?
              </h3>

              <p className="text-lg md:text-2xl mb-4 font-semibold max-w-3xl mx-auto opacity-90 leading-normal">
                {practiceSchedule.getScheduleText()}
              </p>

              <p className="text-sm md:text-base opacity-75 max-w-2xl mx-auto leading-relaxed">
                {practiceSchedule.getDetailsText()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
