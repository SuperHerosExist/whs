import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Target, TrendingUp, ChevronRight, Calendar, Star, Pin } from 'lucide-react';
import { Button, StatCard } from '@/components/ui';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: TrendingUp,
      label: 'Team Average',
      value: '202',
      subtext: 'Season high',
      trend: 'up' as const,
      trendValue: '+8 pts',
      color: 'from-blue-600 to-blue-800'
    },
    {
      icon: Users,
      label: 'Active Athletes',
      value: '24',
      subtext: 'Varsity roster',
      color: 'from-tiger-tiger-darkRed to-red-700'
    },
    {
      icon: Trophy,
      label: 'Season Wins',
      value: '15',
      subtext: '15-3 record',
      trend: 'up' as const,
      trendValue: '+5',
      color: 'from-green-600 to-green-700'
    },
    {
      icon: Target,
      label: 'Championships',
      value: '3',
      subtext: 'District titles',
      color: 'from-tiger-tiger-gold to-yellow-600'
    }
  ];

  const highlights = [
    {
      icon: Trophy,
      title: 'District Champions',
      description: 'Team posted a season-high 4,012 total pins to claim the district title',
      date: '2 days ago',
      color: 'from-tiger-tiger-gold to-yellow-500'
    },
    {
      icon: Star,
      title: 'Near Perfect Game',
      description: 'Alex Johnson bowled a 289 at Regional Tournament, missing perfection by just 11 pins',
      date: '1 week ago',
      color: 'from-purple-600 to-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 via-white to-tiger-neutral-100">

      {/* Hero Section - Mobile-first, native app feel */}
      <section className="relative bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 text-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="flex-shrink-0 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-tiger-2xl">
              <Pin className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight leading-none mb-1 md:mb-2">
                WILLARD TIGERS
              </h1>
              <div className="text-lg md:text-2xl lg:text-3xl font-bold opacity-90 tracking-wide">
                BOWLING TEAM
              </div>
              <div className="text-sm md:text-lg lg:text-xl opacity-75 mt-2 md:mt-3 font-medium">
                Focused. Connected. Driven.
              </div>
            </div>
          </div>

          <p className="text-2xl md:text-3xl lg:text-5xl mb-3 md:mb-4 font-black leading-tight max-w-4xl">
            Strike Your Way to Victory
          </p>

          <p className="text-base md:text-lg lg:text-xl max-w-3xl mb-6 md:mb-8 opacity-90 leading-relaxed">
            Join the most dynamic high school bowling program in the region. We're building champions,
            one frame at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => navigate('/contact')}
              className="bg-white text-tiger-primary-black hover:bg-tiger-neutral-100 text-base md:text-lg"
            >
              Join the Team
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/roster')}
              className="border-2 border-white text-white hover:bg-white hover:text-tiger-primary-black text-base md:text-lg"
            >
              Meet Our Athletes
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Grid - Clean, Professional */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 md:-mt-12 lg:-mt-16 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              subtext={stat.subtext}
              trend={stat.trend}
              trendValue={stat.trendValue}
              color={stat.color}
            />
          ))}
        </div>
      </section>

      {/* Recent Highlights */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-tiger-primary-black mb-2 md:mb-3">
            Recent Highlights
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-tiger-neutral-600">
            Celebrating our team's achievements
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl md:rounded-2xl shadow-tiger-lg hover:shadow-tiger-xl transition-all p-5 md:p-6 lg:p-8 group cursor-pointer border-2 border-transparent hover:border-tiger-neutral-200"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className={`flex-shrink-0 p-3 md:p-4 rounded-xl bg-gradient-to-br ${highlight.color} group-hover:scale-110 transition-transform`}>
                  <highlight.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-black text-tiger-primary-black mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg text-tiger-neutral-700 leading-relaxed mb-2 md:mb-3">
                    {highlight.description}
                  </p>
                  <p className="text-xs md:text-sm text-tiger-neutral-500 font-medium">
                    {highlight.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <Button
            variant="ghost"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/schedule')}
            className="text-base"
          >
            View Full Schedule
          </Button>
        </div>
      </section>

      {/* Upcoming Match */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16 lg:pb-20">
        <div className="bg-gradient-to-br from-tiger-neutral-900 to-tiger-primary-black rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-white shadow-tiger-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white opacity-5 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32" />
          <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-white opacity-5 rounded-full -ml-36 md:-ml-48 -mb-36 md:-mb-48" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Calendar className="w-6 h-6 md:w-8 md:h-8" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black">
                Next Match
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <div className="text-sm md:text-base lg:text-lg opacity-90 mb-2">Friday, March 15th at 3:30 PM</div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4">
                  vs. Springfield Central
                </div>
                <div className="text-sm md:text-base lg:text-lg opacity-90">
                  Willard Lanes • Home Match
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={Star}
                  onClick={() => navigate('/roster')}
                  className="bg-white text-tiger-primary-black hover:bg-tiger-neutral-100 text-base"
                >
                  View Team Roster
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/stats')}
                  className="border-2 border-white text-white hover:bg-white hover:text-tiger-primary-black text-base"
                >
                  Check Team Stats
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 pb-16 md:pb-20">
        <div className="bg-gradient-to-r from-tiger-tiger-darkRed to-red-700 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white shadow-tiger-2xl">
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
            Ready to Roll?
          </h3>
          <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
            Practice starts every Monday & Wednesday at 3:30 PM.
            New members are always welcome!
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/contact')}
            className="bg-white text-tiger-tiger-darkRed hover:bg-tiger-neutral-100 text-base md:text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};
