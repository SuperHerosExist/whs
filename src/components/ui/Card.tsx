import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-tiger-lg ${hover ? 'hover:shadow-tiger-xl hover:-translate-y-1 transition-all duration-200' : ''} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  trendValue,
  color = 'from-tiger-neutral-700 to-tiger-neutral-900',
  onClick
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-tiger-neutral-500'
  };

  return (
    <Card
      hover={!!onClick}
      className={onClick ? 'cursor-pointer' : ''}
      padding="md"
    >
      <div onClick={onClick}>
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-3xl font-display font-black text-tiger-primary-black mb-1">
          {value}
        </div>
        <div className="text-sm font-semibold text-tiger-neutral-600 mb-2">
          {label}
        </div>
        {(subtext || trend) && (
          <div className="flex items-center gap-2 text-xs">
            {trend && trendValue && (
              <span className={`font-semibold ${trendColors[trend]}`}>
                {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
              </span>
            )}
            {subtext && (
              <span className="text-tiger-neutral-500">{subtext}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
