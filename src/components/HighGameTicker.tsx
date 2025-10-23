import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllPlayerStats } from '@/lib/statsCalculator';

interface TickerItem {
  id: string;
  playerId: string;
  playerName: string;
  type: 'highGame' | 'highSeries' | 'overAverage' | 'achievement' | 'streak';
  value: number;
  icon: string;
  message: string;
}

export const HighGameTicker: React.FC = () => {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const playerStats = await getAllPlayerStats();
        const items: TickerItem[] = [];

        playerStats.forEach(stat => {
          // High Games (200+)
          if (stat.highGame >= 200) {
            items.push({
              id: `highgame-${stat.playerId}`,
              playerId: stat.playerId,
              playerName: stat.playerName,
              type: 'highGame',
              value: stat.highGame,
              icon: '🎳',
              message: `rolled a ${stat.highGame}!`
            });
          }

          // High Series (500+)
          if (stat.highSeries >= 500) {
            items.push({
              id: `highseries-${stat.playerId}`,
              playerId: stat.playerId,
              playerName: stat.playerName,
              type: 'highSeries',
              value: stat.highSeries,
              icon: '🔥',
              message: `series of ${stat.highSeries}!`
            });
          }

          // USBC Gold Achievement (100+ over average)
          if (stat.gamesOver100 > 0) {
            items.push({
              id: `gold-${stat.playerId}`,
              playerId: stat.playerId,
              playerName: stat.playerName,
              type: 'achievement',
              value: stat.gamesOver100,
              icon: '🥇',
              message: `earned ${stat.gamesOver100} Gold medal${stat.gamesOver100 > 1 ? 's' : ''}!`
            });
          }

          // USBC Silver Achievement (50+ over average)
          if (stat.gamesOver50 > 0) {
            items.push({
              id: `silver-${stat.playerId}`,
              playerId: stat.playerId,
              playerName: stat.playerName,
              type: 'achievement',
              value: stat.gamesOver50,
              icon: '🥈',
              message: `earned ${stat.gamesOver50} Silver medal${stat.gamesOver50 > 1 ? 's' : ''}!`
            });
          }

          // USBC Bronze Achievement (25+ over average)
          if (stat.gamesOver25 > 0 && stat.gamesOver25 <= 10) {
            items.push({
              id: `bronze-${stat.playerId}`,
              playerId: stat.playerId,
              playerName: stat.playerName,
              type: 'achievement',
              value: stat.gamesOver25,
              icon: '🥉',
              message: `earned ${stat.gamesOver25} Bronze medal${stat.gamesOver25 > 1 ? 's' : ''}!`
            });
          }

          // Hot Streak (5+ games above average)
          if (stat.longestStreak >= 5) {
            items.push({
              id: `streak-${stat.playerId}`,
              playerId: stat.playerId,
              playerName: stat.playerName,
              type: 'streak',
              value: stat.longestStreak,
              icon: '🔥',
              message: `is on fire with a ${stat.longestStreak}-game hot streak!`
            });
          }

          // Pins Over Average highlights
          if (stat.gamesOver25 > 5) {
            items.push({
              id: `overavg-${stat.playerId}`,
              playerId: stat.playerId,
              playerName: stat.playerName,
              type: 'overAverage',
              value: stat.gamesOver25,
              icon: '📈',
              message: `scored 25+ pins over average ${stat.gamesOver25} times!`
            });
          }
        });

        // Shuffle items for variety
        const shuffled = items.sort(() => Math.random() - 0.5);
        setTickerItems(shuffled.slice(0, 20)); // Limit to 20 items
        console.log(`🎯 Loaded ${shuffled.length} ticker items`);
      } catch (error) {
        console.error('❌ Error fetching ticker data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerData();
  }, []);

  if (loading || tickerItems.length === 0) {
    return null;
  }

  const handleTickerClick = (playerId: string) => {
    navigate(`/roster?player=${playerId}`);
  };

  return (
    <div className="bg-black text-white py-3 md:py-4 overflow-hidden shadow-lg border-t-2 border-yellow-500 relative">
      <div className="flex items-center gap-4">
        {/* Continuous scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .ticker-scroll {
              animation: scroll-left 30s linear infinite;
            }
            .ticker-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="ticker-scroll flex items-center gap-8 whitespace-nowrap pl-4">
            {/* Duplicate the items for seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleTickerClick(item.playerId)}
                className="flex items-center gap-3 text-sm md:text-base font-bold cursor-pointer hover:text-yellow-400 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span>
                  <span className="text-yellow-500">{item.playerName}</span>
                  {' '}{item.message}
                </span>
                <span className="text-yellow-500 mx-2">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* ESPN-style ticker header - Fixed on right */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 bg-black pr-4 pl-6 py-1 z-10">
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
          <div className="bg-yellow-500 text-black px-3 md:px-4 py-1 md:py-1.5 rounded font-black text-xs md:text-sm uppercase tracking-wider shadow-lg">
            Live Highlights
          </div>
        </div>
      </div>
    </div>
  );
};
