import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { getAllPlayerStats } from '@/lib/statsCalculator';

interface HighGameEntry {
  playerName: string;
  score: number;
  date?: string;
}

export const HighGameTicker: React.FC = () => {
  const [highGames, setHighGames] = useState<HighGameEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighGames = async () => {
      try {
        const playerStats = await getAllPlayerStats();

        // Get all players with high games, sorted by high game descending
        const gamesWithHighScores = playerStats
          .filter(stat => stat.highGame > 0)
          .sort((a, b) => b.highGame - a.highGame)
          .slice(0, 10) // Top 10 high games
          .map(stat => ({
            playerName: stat.playerName,
            score: stat.highGame,
          }));

        setHighGames(gamesWithHighScores);
        console.log(`🎯 Loaded ${gamesWithHighScores.length} high games for ticker`);
      } catch (error) {
        console.error('❌ Error fetching high games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighGames();
  }, []);

  // Rotate through high games every 4 seconds
  useEffect(() => {
    if (highGames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highGames.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [highGames]);

  if (loading || highGames.length === 0) {
    return null;
  }

  const currentGame = highGames[currentIndex];

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-4 overflow-hidden shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-6">
          {/* ESPN-style ticker header */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-white text-red-700 px-3 py-1 rounded font-black text-sm uppercase tracking-wider">
              High Games
            </div>
            <Trophy className="w-5 h-5 text-yellow-300" />
          </div>

          {/* Scrolling content */}
          <div className="flex-1 overflow-hidden">
            <div
              key={currentIndex}
              className="animate-slide-up flex items-center gap-4 text-lg font-bold"
            >
              <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <span className="truncate">
                <span className="text-yellow-300">{currentGame.playerName}</span>
                {' '}rolled a{' '}
                <span className="text-3xl font-black">{currentGame.score}</span>
              </span>
            </div>
          </div>

          {/* Position indicator */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {currentIndex + 1}/{highGames.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
