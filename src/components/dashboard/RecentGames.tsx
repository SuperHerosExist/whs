import React from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { Card } from '@/components/ui';

export interface Game {
  id: string;
  date: Date;
  opponent?: string;
  score: number;
  isPersonalBest?: boolean;
  vsAverage?: number; // Difference from player's average
}

export interface RecentGamesProps {
  games: Game[];
  playerAverage?: number;
}

export const RecentGames: React.FC<RecentGamesProps> = ({ games, playerAverage }) => {
  if (games.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-tiger-neutral-300 mx-auto mb-3" />
          <p className="text-tiger-neutral-600">No games recorded yet</p>
          <p className="text-sm text-tiger-neutral-500 mt-1">
            Your scores will appear here after your first match
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {games.map((game) => {
        const vsAvg = game.vsAverage || (playerAverage ? game.score - playerAverage : 0);
        const trend = vsAvg > 0 ? 'up' : vsAvg < 0 ? 'down' : 'neutral';

        return (
          <Card key={game.id} hover padding="md" className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-tiger-neutral-600 font-medium">
                    {game.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  {game.isPersonalBest && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-tiger-tiger-gold to-yellow-500 text-tiger-primary-black text-xs font-bold rounded-full">
                      Personal Best!
                    </span>
                  )}
                </div>
                {game.opponent && (
                  <p className="text-sm text-tiger-neutral-700 font-medium">
                    vs {game.opponent}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-black text-tiger-primary-black">
                    {game.score}
                  </div>
                  {playerAverage && Math.abs(vsAvg) > 0 && (
                    <div className={`flex items-center gap-1 text-xs font-semibold justify-end ${
                      trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-tiger-neutral-500'
                    }`}>
                      {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {trend === 'neutral' && <Minus className="w-3 h-3" />}
                      <span>{Math.abs(vsAvg)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
