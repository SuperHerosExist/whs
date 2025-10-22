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

      {/* Hero Section - Professional, Bold, Inspiring */}
      <section className="relative bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 text-white overflow-hidden">
        {/* Subtle background pattern instead of emoji clutter */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="flex-shrink-0 bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <Pin className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-2">
                WILLARD TIGERS
              </h1>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold opacity-90 tracking-wide">
                BOWLING TEAM
              </div>
              <div className="text-lg md:text-xl opacity-75 mt-3 font-medium">
                Focused. Connected. Driven.
              </div>
            </div>
          </div>

          <p className="text-3xl md:text-4xl lg:text-5xl mb-4 font-black leading-tight max-w-4xl">
            Strike Your Way to Victory
          </p>

          <p className="text-lg md:text-xl max-w-3xl mb-8 opacity-90 leading-relaxed">
            Join the most dynamic high school bowling program in the region. We're building champions,
            one frame at a time. Perfect your game, compete with the best, and leave your mark on the lanes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="xl"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => navigate('/contact')}
              className="bg-white text-tiger-primary-black hover:bg-tiger-neutral-100"
            >
              Join the Team
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => navigate('/roster')}
              className="border-white text-white hover:bg-white hover:text-tiger-primary-black"
            >
              Meet Our Athletes
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Grid - Clean, Professional, Data-Focused */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 md:-mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Recent Highlights - Storytelling, Emotional Connection */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-tiger-primary-black mb-3">
            Recent Highlights
          </h2>
          <p className="text-lg text-tiger-neutral-600">
            Celebrating our team's achievements and milestones
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-tiger-lg hover:shadow-tiger-xl transition-all p-6 md:p-8 group cursor-pointer border-2 border-transparent hover:border-tiger-neutral-200"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${highlight.color} group-hover:scale-110 transition-transform`}>
                  <highlight.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl md:text-3xl font-black text-tiger-primary-black">
                      {highlight.title}
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-tiger-neutral-700 leading-relaxed mb-3">
                    {highlight.description}
                  </p>
                  <p className="text-sm text-tiger-neutral-500 font-medium">
                    {highlight.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="lg"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/schedule')}
          >
            View Full Schedule
          </Button>
        </div>
      </section>

      {/* Upcoming Match - Creates Urgency and Community */}
      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-20">
        <div className="bg-gradient-to-br from-tiger-neutral-900 to-tiger-primary-black rounded-3xl p-8 md:p-12 text-white shadow-tiger-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8" />
              <h2 className="text-3xl md:text-4xl font-black">
                Next Match
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-lg opacity-90 mb-2">Friday, March 15th at 3:30 PM</div>
                <div className="text-3xl md:text-4xl font-black mb-4">
                  vs. Springfield Central
                </div>
                <div className="text-lg opacity-90">
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
                  className="bg-white text-tiger-primary-black hover:bg-tiger-neutral-100"
                >
                  View Team Roster
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/stats')}
                  className="border-white text-white hover:bg-white hover:text-tiger-primary-black"
                >
                  Check Team Stats
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Final Conversion Push */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-tiger-tiger-darkRed to-red-700 rounded-3xl p-12 md:p-16 text-center text-white shadow-tiger-2xl">
          <h3 className="text-4xl md:text-5xl font-black mb-4">
            Ready to Roll?
          </h3>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Practice starts every Monday & Wednesday at 3:30 PM.
            New members are always welcome!
          </p>
          <Button
            variant="primary"
            size="xl"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/contact')}
            className="bg-white text-tiger-tiger-darkRed hover:bg-tiger-neutral-100"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};
