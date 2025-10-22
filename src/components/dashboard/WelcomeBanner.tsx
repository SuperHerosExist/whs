import React from 'react';
import { Calendar, TrendingUp, Trophy } from 'lucide-react';

export interface WelcomeBannerProps {
  playerName: string;
  nextMatchDate?: Date;
  nextMatchOpponent?: string;
  recentImprovement?: number; // Points improved
  motivationalMessage?: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  playerName,
  nextMatchDate,
  nextMatchOpponent,
  recentImprovement,
  motivationalMessage
}) => {
  const getDaysUntilMatch = () => {
    if (!nextMatchDate) return null;
    const today = new Date();
    const diffTime = nextMatchDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilMatch();
  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;

  return (
    <div className="bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 rounded-2xl p-8 text-white shadow-tiger-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48" />

      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          Welcome back, {playerName}!
        </h1>

        {motivationalMessage ? (
          <p className="text-lg opacity-90 mb-4">
            {motivationalMessage}
          </p>
        ) : recentImprovement && recentImprovement > 0 ? (
          <div className="flex items-center gap-2 text-green-400 mb-4">
            <TrendingUp className="w-5 h-5" />
            <p className="text-lg font-semibold">
              You've improved {recentImprovement} points in your last 5 games!
            </p>
          </div>
        ) : (
          <p className="text-lg opacity-90 mb-4">
            Keep practicing and track your progress
          </p>
        )}

        {nextMatchDate && (
          <div className="flex items-start gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex-shrink-0 p-2 bg-tiger-tiger-gold bg-opacity-20 rounded-lg">
              {isToday ? (
                <Trophy className="w-6 h-6 text-tiger-tiger-gold" />
              ) : (
                <Calendar className="w-6 h-6 text-tiger-tiger-gold" />
              )}
            </div>
            <div>
              <div className="font-bold text-lg">
                {isToday ? 'Match Day!' : isTomorrow ? 'Match Tomorrow' : `Next Match in ${daysUntil} days`}
              </div>
              <div className="opacity-90">
                {nextMatchDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
                {nextMatchOpponent && ` • vs ${nextMatchOpponent}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
