import React from 'react';
import { Trophy, Star, TrendingUp, Zap, Award } from 'lucide-react';
import { Badge } from './Badge';

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'improvement' | 'record' | 'streak' | 'special';
  earnedDate?: Date;
  progress?: number; // 0-100
  isUnlocked?: boolean;
}

export interface AchievementProps {
  achievement: AchievementData;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export const Achievement: React.FC<AchievementProps> = ({
  achievement,
  size = 'md',
  showProgress = true
}) => {
  const icons = {
    milestone: Trophy,
    improvement: TrendingUp,
    record: Star,
    streak: Zap,
    special: Award
  };

  const colors = {
    milestone: 'from-tiger-tiger-gold to-yellow-500',
    improvement: 'from-green-600 to-green-700',
    record: 'from-purple-600 to-purple-700',
    streak: 'from-orange-600 to-orange-700',
    special: 'from-blue-600 to-blue-700'
  };

  const Icon = icons[achievement.type];
  const isLocked = !achievement.isUnlocked && achievement.progress !== undefined && achievement.progress < 100;

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`bg-white rounded-xl shadow-tiger border-2 ${isLocked ? 'border-tiger-neutral-200 opacity-60' : 'border-transparent'} ${sizeClasses[size]} ${achievement.isUnlocked ? 'hover:shadow-tiger-lg transition-all' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${colors[achievement.type]} ${isLocked ? 'opacity-50' : ''}`}>
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold text-tiger-primary-black ${size === 'lg' ? 'text-lg' : 'text-base'}`}>
              {achievement.title}
            </h4>
            {achievement.isUnlocked && (
              <Badge variant="gold" size="sm">Unlocked</Badge>
            )}
          </div>
          <p className={`text-tiger-neutral-600 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
            {achievement.description}
          </p>
          {achievement.earnedDate && (
            <p className="text-xs text-tiger-neutral-500 mt-2">
              Earned {achievement.earnedDate.toLocaleDateString()}
            </p>
          )}
          {showProgress && achievement.progress !== undefined && !achievement.isUnlocked && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-tiger-neutral-600 mb-1">
                <span>Progress</span>
                <span className="font-semibold">{achievement.progress}%</span>
              </div>
              <div className="w-full bg-tiger-neutral-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colors[achievement.type]} transition-all duration-500`}
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export interface AchievementCelebrationProps {
  achievement: AchievementData;
  onClose: () => void;
}

export const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  achievement,
  onClose
}) => {
  const icons = {
    milestone: Trophy,
    improvement: TrendingUp,
    record: Star,
    streak: Zap,
    special: Award
  };

  const Icon = icons[achievement.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-tiger-2xl max-w-md w-full p-8 text-center animate-in zoom-in duration-300">
        <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-tiger-tiger-gold to-yellow-500 mb-6 animate-pulse">
          <Icon className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-3xl font-black text-tiger-primary-black mb-3">
          Achievement Unlocked!
        </h2>
        <h3 className="text-xl font-bold text-tiger-neutral-700 mb-2">
          {achievement.title}
        </h3>
        <p className="text-tiger-neutral-600 mb-8">
          {achievement.description}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-tiger-primary-black text-white py-4 rounded-lg font-bold hover:bg-tiger-neutral-800 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};
