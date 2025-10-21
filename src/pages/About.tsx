import React from 'react';
import { Trophy, Heart, Target, Users } from 'lucide-react';
import { branding } from '@/config/branding';

export const About: React.FC = () => {
  const values = [
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'We strive for excellence in every frame, pursuing continuous improvement and competitive success.',
    },
    {
      icon: Heart,
      title: 'Character',
      description: 'Building integrity, sportsmanship, and respect both on and off the lanes.',
    },
    {
      icon: Target,
      title: 'Focus',
      description: 'Developing concentration, discipline, and mental toughness through dedicated practice.',
    },
    {
      icon: Users,
      title: 'Teamwork',
      description: 'Supporting each other, celebrating successes, and growing together as a family.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white">
      {/* Page Header */}
      <section className="bg-tiger-primary-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
            About {branding.school.teamName} Bowling
          </h1>
          <p className="text-xl text-tiger-neutral-300 max-w-3xl">
            Building champions on and off the lanes
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-tiger-lg p-8 md:p-12">
            <h2 className="text-3xl font-display font-black text-tiger-primary-black mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-tiger-neutral-700 leading-relaxed mb-6">
              The Willard Tigers Bowling program is dedicated to developing student-athletes who excel in competition
              while embodying the core values of {branding.school.motto}. We provide a supportive environment where
              athletes of all skill levels can grow their talents, build lasting friendships, and learn life lessons
              that extend far beyond the bowling alley.
            </p>
            <p className="text-lg text-tiger-neutral-700 leading-relaxed">
              Our program emphasizes technical skill development, mental toughness, sportsmanship, and academic excellence.
              We compete at the highest levels while maintaining the integrity and character that define Willard Tigers athletics.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-display font-black text-tiger-primary-black text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-tiger p-6 hover:shadow-tiger-lg transition-all hover:-translate-y-1"
            >
              <div className="inline-flex p-4 rounded-lg bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed mb-4">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-tiger-primary-black mb-3">
                {value.title}
              </h3>
              <p className="text-tiger-neutral-700 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Program History */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-black text-tiger-primary-black mb-8 text-center">
            Program History
          </h2>
          <div className="bg-gradient-to-r from-tiger-primary-black to-tiger-tiger-darkRed rounded-2xl p-8 md:p-12 text-white">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                The Willard High School bowling program has a proud tradition of competitive excellence and character
                development. Over the years, our Tigers have consistently competed at the highest levels of Missouri
                high school bowling.
              </p>
              <p className="text-lg leading-relaxed">
                Our program has produced numerous individual champions, all-conference performers, and most importantly,
                young adults who carry the lessons learned on the lanes throughout their lives.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white border-opacity-20">
                <div className="text-center">
                  <div className="text-4xl font-display font-black text-tiger-tiger-gold mb-2">
                    3
                  </div>
                  <div className="text-sm font-semibold text-tiger-neutral-300">
                    Championships
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-display font-black text-tiger-tiger-gold mb-2">
                    15
                  </div>
                  <div className="text-sm font-semibold text-tiger-neutral-300">
                    Season Wins
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-display font-black text-tiger-tiger-gold mb-2">
                    100+
                  </div>
                  <div className="text-sm font-semibold text-tiger-neutral-300">
                    Alumni
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Motto */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-display font-black text-tiger-primary-black mb-4">
            {branding.school.motto}
          </h2>
          <p className="text-lg text-tiger-neutral-600 italic">
            {branding.school.tagline}
          </p>
        </div>
      </section>
    </div>
  );
};
