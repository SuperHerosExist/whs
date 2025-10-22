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
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 via-white to-tiger-neutral-100">

      {/* Hero Section - Bold, Dynamic, Engaging */}
      <section className="relative bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-tiger-tiger-gold rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-tiger-tiger-darkRed rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="relative flex-shrink-0">
              {/* Glowing effect behind icon */}
              <div className="absolute inset-0 bg-tiger-tiger-gold blur-2xl opacity-50 scale-150 animate-pulse" />
              <div className="relative bg-gradient-to-br from-white to-tiger-neutral-100 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl transform hover:scale-105 transition-transform">
                <Pin className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-tiger-primary-black" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none mb-2 md:mb-3 bg-gradient-to-r from-white via-tiger-neutral-100 to-tiger-tiger-gold bg-clip-text text-transparent animate-fade-in">
                WILLARD TIGERS
              </h1>
              <div className="text-xl md:text-3xl lg:text-4xl font-bold opacity-90 tracking-wide mb-3 md:mb-4">
                BOWLING TEAM
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-base md:text-lg lg:text-xl opacity-90 font-semibold">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-tiger-tiger-gold" />
                <span>Focused. Connected. Driven.</span>
              </div>
            </div>
          </div>

          <div className="mb-8 md:mb-12">
            <p className="text-2xl md:text-4xl lg:text-6xl mb-4 md:mb-6 font-black leading-tight max-w-4xl bg-gradient-to-r from-white to-tiger-neutral-200 bg-clip-text text-transparent">
              Strike Your Way to Victory
            </p>

            <p className="text-base md:text-xl lg:text-2xl max-w-3xl opacity-90 leading-relaxed">
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
              className="bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-tiger-primary-black hover:from-tiger-tiger-gold hover:to-yellow-400 shadow-2xl hover:shadow-tiger-tiger-gold/50 transition-all transform hover:scale-105 text-base md:text-lg font-black"
            >
              Join the Team
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => navigate('/roster')}
              className="border-2 border-white text-white hover:bg-white hover:text-tiger-primary-black text-base md:text-lg font-bold backdrop-blur-sm"
            >
              Meet Our Athletes
            </Button>
          </div>
        </div>
      </section>

      {/* Live Stats Grid - Real Data with Enhanced Design */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 md:-mt-12 lg:-mt-16 relative z-10 mb-16 md:mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatCard
            icon={TrendingUp}
            label="Team Average"
            value={teamStats.loading ? '--' : teamStats.teamAverage.toString()}
            subtext="Season high"
            trend={teamStats.improvementRate > 0 ? 'up' : undefined}
            trendValue={teamStats.improvementRate > 0 ? `+${teamStats.improvementRate}%` : undefined}
            color="from-blue-600 to-blue-800"
          />
          <StatCard
            icon={Users}
            label="Active Athletes"
            value={teamStats.loading ? '--' : teamStats.activePlayers.toString()}
            subtext="Varsity roster"
            color="from-tiger-tiger-darkRed to-red-700"
          />
          <StatCard
            icon={Trophy}
            label="Season Wins"
            value={teamStats.loading ? '--' : teamStats.seasonWins.toString()}
            subtext={`${teamStats.seasonWins}-${Math.max(0, 20 - teamStats.seasonWins)} record`}
            trend={teamStats.seasonWins > 10 ? 'up' : undefined}
            trendValue={teamStats.seasonWins > 10 ? `+${teamStats.seasonWins - 10}` : undefined}
            color="from-green-600 to-green-700"
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

      {/* Recent Highlights - Enhanced Visual Design */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div className="mb-10 md:mb-14 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-tiger-tiger-gold to-transparent" />
            <Award className="w-10 h-10 md:w-12 md:h-12 text-tiger-tiger-gold animate-pulse" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-tiger-tiger-gold to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-tiger-primary-black mb-4 tracking-tight">
            Recent Highlights
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-tiger-neutral-600 font-semibold max-w-2xl mx-auto">
            Celebrating our team's achievements and milestones
          </p>
        </div>

        {highlightsLoading ? (
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-tiger-neutral-200 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-tiger-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-tiger-neutral-100 rounded w-full" />
                    <div className="h-4 bg-tiger-neutral-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {highlights.map((highlight) => {
              const IconComponent = iconMap[highlight.icon];
              return (
                <div
                  key={highlight.id}
                  className="relative group bg-white rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 md:p-8 cursor-pointer border-2 border-transparent hover:border-tiger-tiger-gold overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <div className="relative flex items-start gap-4">
                    <div className={`flex-shrink-0 p-4 md:p-5 rounded-2xl bg-gradient-to-br ${highlight.color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-7 h-7 md:w-9 md:h-9 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-tiger-primary-black mb-3 group-hover:text-tiger-tiger-darkRed transition-colors">
                        {highlight.title}
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg text-tiger-neutral-700 leading-relaxed mb-3">
                        {highlight.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-tiger-tiger-gold rounded-full" />
                        <p className="text-xs md:text-sm text-tiger-neutral-500 font-semibold">
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

        <div className="mt-8 md:mt-10 flex justify-center">
          <Button
            variant="ghost"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/schedule')}
            className="text-base md:text-lg font-bold"
          >
            View Full Schedule
          </Button>
        </div>
      </section>

      {/* Upcoming Match - Ultra Prominent Design */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16 lg:pb-24">
        <div className="relative bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white shadow-2xl overflow-hidden border-4 border-tiger-tiger-gold hover:border-yellow-400 transition-all duration-300 group">
          {/* Animated background blobs with enhanced effect */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-tiger-tiger-gold opacity-10 rounded-full blur-3xl animate-pulse group-hover:opacity-20 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-80 h-80 md:w-[32rem] md:h-[32rem] bg-tiger-tiger-darkRed opacity-10 rounded-full blur-3xl animate-pulse delay-1000 group-hover:opacity-20 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="p-3 bg-tiger-tiger-gold rounded-xl">
                <Calendar className="w-7 h-7 md:w-9 md:h-9 text-tiger-primary-black" />
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black">
                Next Match
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
              <div>
                <div className="text-sm md:text-base lg:text-lg opacity-90 mb-3 font-semibold">
                  Friday, March 15th at 3:30 PM
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-5 bg-gradient-to-r from-white to-tiger-tiger-gold bg-clip-text text-transparent">
                  vs. Springfield Central
                </div>
                <div className="flex items-center gap-2 text-base md:text-lg lg:text-xl opacity-90 font-semibold">
                  <Pin className="w-5 h-5 text-tiger-tiger-gold" />
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
                  className="bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-tiger-primary-black hover:from-tiger-tiger-gold hover:to-yellow-400 shadow-xl text-base md:text-lg font-black"
                >
                  View Team Roster
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  fullWidth
                  icon={Trophy}
                  onClick={() => navigate('/stats')}
                  className="border-2 border-tiger-tiger-gold text-tiger-tiger-gold hover:bg-tiger-tiger-gold hover:text-tiger-primary-black text-base md:text-lg font-bold"
                >
                  Check Team Stats
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN THE TEAM - Ultimate Conversion CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16 md:pb-24">
        <div className="relative bg-gradient-to-r from-tiger-tiger-darkRed via-red-600 to-tiger-tiger-darkRed rounded-3xl md:rounded-[2.5rem] p-12 md:p-16 lg:p-28 text-center text-white shadow-2xl overflow-hidden border-4 border-tiger-tiger-gold hover:shadow-[0_0_80px_rgba(212,175,55,0.6)] transition-all duration-500 group">
          {/* Animated elements with enhanced interactivity */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            <div className="absolute top-10 left-10 w-48 h-48 md:w-64 md:h-64 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-tiger-tiger-gold rounded-full blur-3xl animate-pulse delay-500" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-white rounded-full mb-8 md:mb-10 shadow-2xl animate-bounce">
              <Pin className="w-11 h-11 md:w-16 md:h-16 text-tiger-tiger-darkRed" />
            </div>

            <div className="mb-6 md:mb-8">
              <div className="inline-block px-6 py-2 bg-tiger-tiger-gold text-tiger-primary-black rounded-full font-black text-sm md:text-base mb-4 md:mb-6 shadow-xl">
                🎳 NEW MEMBERS WELCOME
              </div>
            </div>

            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight">
              Ready to Join<br />
              <span className="bg-gradient-to-r from-white to-tiger-tiger-gold bg-clip-text text-transparent">
                The Tigers?
              </span>
            </h3>

            <p className="text-xl md:text-3xl lg:text-4xl mb-4 md:mb-6 opacity-95 max-w-4xl mx-auto font-bold leading-relaxed">
              Practice starts every Monday & Wednesday at 3:30 PM
            </p>

            <p className="text-lg md:text-2xl mb-10 md:mb-12 opacity-90 max-w-2xl mx-auto font-semibold">
              All skill levels welcome • Equipment provided • No experience needed
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-2xl mx-auto">
              <Button
                variant="primary"
                size="xl"
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => navigate('/contact')}
                className="bg-white text-tiger-tiger-darkRed hover:bg-tiger-neutral-100 text-xl md:text-2xl font-black shadow-2xl transform hover:scale-110 transition-all py-6 md:py-8 px-8 md:px-12"
              >
                Join the Team
              </Button>
              <Button
                variant="outline"
                size="xl"
                icon={Users}
                onClick={() => navigate('/roster')}
                className="border-4 border-white text-white hover:bg-white hover:text-tiger-tiger-darkRed text-xl md:text-2xl font-black backdrop-blur-sm py-6 md:py-8 px-8 md:px-12"
              >
                Meet the Team
              </Button>
            </div>

            <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t-2 border-white border-opacity-30">
              <p className="text-base md:text-lg opacity-75 font-medium">
                Questions? Contact Coach at{' '}
                <a href="mailto:coach@willardtigers.com" className="underline hover:text-tiger-tiger-gold transition-colors font-bold">
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
