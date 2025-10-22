import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Calendar, Star, Pin, Zap, Award } from 'lucide-react';
import { Button, StatCard } from '@/components/ui';
import { useTeamStats } from '@/hooks/useTeamStats';
import { useRecentHighlights } from '@/hooks/useRecentHighlights';

const iconMap = {
  Trophy,
  Star,
  Award,
  Target
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const teamStats = useTeamStats();
  const { highlights, loading: highlightsLoading } = useRecentHighlights(4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">

      {/* Hero Section - Sleek, Futuristic, Cutting-Edge */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
        {/* Animated background elements - Electric greys & gold */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-tiger-tiger-gold to-yellow-600 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-white to-slate-300 rounded-full blur-3xl animate-pulse delay-500 opacity-30" />
        </div>

        {/* Subtle futuristic grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="relative flex-shrink-0">
              {/* Glowing gold effect behind icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-tiger-tiger-gold to-yellow-500 blur-2xl opacity-40 scale-150 animate-pulse" />
              {/* Glassmorphism effect */}
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl transform hover:scale-105 transition-all hover:bg-white/20">
                <Pin className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none mb-2 md:mb-3 bg-gradient-to-r from-white via-slate-200 to-tiger-tiger-gold bg-clip-text text-transparent animate-fade-in">
                WILLARD TIGERS
              </h1>
              <div className="text-xl md:text-3xl lg:text-4xl font-bold opacity-90 tracking-wide mb-3 md:mb-4 bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
                BOWLING TEAM
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-base md:text-lg lg:text-xl opacity-90 font-semibold">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-tiger-tiger-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                <span className="text-slate-200">Focused. Connected. Driven.</span>
              </div>
            </div>
          </div>

          <div className="mb-8 md:mb-12">
            <p className="text-2xl md:text-4xl lg:text-6xl mb-4 md:mb-6 font-black leading-tight max-w-4xl bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Strike Your Way to Victory
            </p>

            <p className="text-base md:text-xl lg:text-2xl max-w-3xl leading-relaxed text-slate-300 font-medium">
              Join the most dynamic high school bowling program in the region. We're building champions,
              one frame at a time. Perfect your game, compete with the best, and leave your mark on the lanes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center md:justify-start">
            <Button
              variant="primary"
              size="xl"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-black hover:from-yellow-400 hover:to-tiger-tiger-gold shadow-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all transform hover:scale-105 text-base md:text-lg font-black border border-yellow-400/30"
            >
              Join the Team
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => navigate('/roster')}
              className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white hover:text-black text-base md:text-lg font-bold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Meet Our Athletes
            </Button>
          </div>
        </div>
      </section>

      {/* Live Stats Grid - Sleek Glassmorphism Design */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 md:-mt-12 lg:-mt-16 relative z-10 mb-16 md:mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatCard
            icon={TrendingUp}
            label="Team Average"
            value={teamStats.loading ? '--' : teamStats.teamAverage.toString()}
            subtext="Season high"
            trend={teamStats.improvementRate > 0 ? 'up' : undefined}
            trendValue={teamStats.improvementRate > 0 ? `+${teamStats.improvementRate}%` : undefined}
            color="from-slate-700 to-slate-900"
          />
          <StatCard
            icon={Users}
            label="Active Athletes"
            value={teamStats.loading ? '--' : teamStats.activePlayers.toString()}
            subtext="Varsity roster"
            color="from-slate-600 to-slate-800"
          />
          <StatCard
            icon={Trophy}
            label="Season Wins"
            value={teamStats.loading ? '--' : teamStats.seasonWins.toString()}
            subtext={`${teamStats.seasonWins}-${Math.max(0, 20 - teamStats.seasonWins)} record`}
            trend={teamStats.seasonWins > 10 ? 'up' : undefined}
            trendValue={teamStats.seasonWins > 10 ? `+${teamStats.seasonWins - 10}` : undefined}
            color="from-slate-700 to-slate-900"
          />
          <StatCard
            icon={Target}
            label="Championships"
            value={teamStats.championships.toString()}
            subtext="District titles"
            color="from-tiger-tiger-gold to-yellow-600"
          />
        </div>

        {/* Live Stats Badge with glow effect */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-xl border-2 border-green-500 animate-glow-pulse">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-black text-tiger-primary-black tracking-wide">LIVE STATS</span>
          </div>
        </div>
      </section>

      {/* Recent Highlights - Sleek Glassmorphism Design */}
      <section className="relative max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-24 overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-tiger-tiger-gold to-yellow-600 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative mb-10 md:mb-14 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-tiger-tiger-gold to-transparent" />
            <Award className="w-10 h-10 md:w-12 md:h-12 text-tiger-tiger-gold animate-pulse drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-tiger-tiger-gold to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
            Recent Highlights
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-400 font-semibold max-w-2xl mx-auto">
            Celebrating our team's achievements and milestones
          </p>
        </div>

        {highlightsLoading ? (
          <div className="relative grid md:grid-cols-2 gap-4 md:gap-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-800 rounded w-full" />
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative grid md:grid-cols-2 gap-4 md:gap-6">
            {highlights.map((highlight) => {
              const IconComponent = iconMap[highlight.icon];
              return (
                <div
                  key={highlight.id}
                  className="relative group bg-white/5 backdrop-blur-xl border border-slate-700 hover:border-tiger-tiger-gold rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 md:p-8 cursor-pointer overflow-hidden hover:bg-white/10"
                >
                  {/* Background gradient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-tiger-tiger-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative flex items-start gap-4">
                    <div className={`flex-shrink-0 p-4 md:p-5 rounded-2xl bg-gradient-to-br ${highlight.color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-7 h-7 md:w-9 md:h-9 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-3 group-hover:text-tiger-tiger-gold transition-colors bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                        {highlight.title}
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed mb-3">
                        {highlight.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-tiger-tiger-gold rounded-full" />
                        <p className="text-xs md:text-sm text-slate-500 font-semibold">
                          {highlight.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative mt-8 md:mt-10 flex justify-center">
          <Button
            variant="ghost"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/schedule')}
            className="text-base md:text-lg font-bold text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-slate-700 hover:border-tiger-tiger-gold transition-all"
          >
            View Full Schedule
          </Button>
        </div>
      </section>

      {/* Upcoming Match - Sleek Glassmorphism Card */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16 lg:pb-24">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white shadow-2xl overflow-hidden border-2 border-slate-700 hover:border-tiger-tiger-gold transition-all duration-300 group">
          {/* Animated background blobs - sleek greys and gold */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-slate-500 to-slate-700 opacity-10 rounded-full blur-3xl animate-pulse group-hover:opacity-20 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-80 h-80 md:w-[32rem] md:h-[32rem] bg-gradient-to-br from-tiger-tiger-gold to-yellow-600 opacity-10 rounded-full blur-3xl animate-pulse delay-1000 group-hover:opacity-20 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="p-3 bg-gradient-to-br from-tiger-tiger-gold to-yellow-500 rounded-xl shadow-lg">
                <Calendar className="w-7 h-7 md:w-9 md:h-9 text-black" />
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Next Match
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
              <div>
                <div className="text-sm md:text-base lg:text-lg text-slate-300 mb-3 font-semibold">
                  Friday, March 15th at 3:30 PM
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-5 bg-gradient-to-r from-white via-slate-100 to-tiger-tiger-gold bg-clip-text text-transparent">
                  vs. Springfield Central
                </div>
                <div className="flex items-center gap-2 text-base md:text-lg lg:text-xl text-slate-200 font-semibold">
                  <Pin className="w-5 h-5 text-tiger-tiger-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  <span>Willard Lanes • Home Match</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                <Button
                  variant="primary"
                  size="xl"
                  fullWidth
                  icon={Users}
                  onClick={() => navigate('/roster')}
                  className="bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-black hover:from-yellow-400 hover:to-tiger-tiger-gold shadow-xl text-base md:text-lg font-black border border-yellow-400/30"
                >
                  View Team Roster
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  fullWidth
                  icon={Trophy}
                  onClick={() => navigate('/stats')}
                  className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white hover:text-black text-base md:text-lg font-bold transition-all"
                >
                  Check Team Stats
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN THE TEAM - Sleek Futuristic Glassmorphism CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16 md:pb-24">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-3xl md:rounded-[2.5rem] p-12 md:p-16 lg:p-28 text-center text-white shadow-2xl overflow-hidden border-2 border-slate-700 hover:border-tiger-tiger-gold hover:shadow-[0_0_80px_rgba(212,175,55,0.4)] transition-all duration-500 group">
          {/* Animated elements - sleek greys, whites and gold only */}
          <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity">
            <div className="absolute top-10 left-10 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-white to-slate-300 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-tiger-tiger-gold to-yellow-500 rounded-full blur-3xl animate-pulse delay-500" />
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full blur-3xl animate-pulse delay-1000 opacity-50" />
          </div>

          <div className="relative z-10">
            {/* Glassmorphism badge with pin icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full mb-8 md:mb-10 shadow-2xl animate-bounce group-hover:bg-white/20 transition-all">
              <Pin className="w-11 h-11 md:w-16 md:h-16 text-tiger-tiger-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            </div>

            <div className="mb-6 md:mb-8">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-black rounded-full font-black text-sm md:text-base mb-4 md:mb-6 shadow-xl border border-yellow-400/30">
                NEW MEMBERS WELCOME
              </div>
            </div>

            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Ready to Join
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-200 via-tiger-tiger-gold to-yellow-500 bg-clip-text text-transparent">
                The Tigers?
              </span>
            </h3>

            <p className="text-xl md:text-3xl lg:text-4xl mb-4 md:mb-6 max-w-4xl mx-auto font-bold leading-relaxed bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Practice starts every Monday & Wednesday at 3:30 PM
            </p>

            <p className="text-lg md:text-2xl mb-10 md:mb-12 max-w-2xl mx-auto font-semibold text-slate-300">
              All skill levels welcome • Equipment provided • No experience needed
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-2xl mx-auto">
              <Button
                variant="primary"
                size="xl"
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-black hover:from-yellow-400 hover:to-tiger-tiger-gold text-xl md:text-2xl font-black shadow-2xl transform hover:scale-110 transition-all py-6 md:py-8 px-8 md:px-12 border border-yellow-400/30"
              >
                Join the Team
              </Button>
              <Button
                variant="outline"
                size="xl"
                icon={Users}
                onClick={() => navigate('/roster')}
                className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white hover:text-black text-xl md:text-2xl font-black py-6 md:py-8 px-8 md:px-12 transition-all hover:scale-110"
              >
                Meet the Team
              </Button>
            </div>

            <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-slate-700">
              <p className="text-base md:text-lg text-slate-400 font-medium">
                Questions? Contact Coach at{' '}
                <a href="mailto:coach@willardtigers.com" className="text-tiger-tiger-gold hover:text-yellow-400 transition-colors font-bold underline">
                  coach@willardtigers.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
