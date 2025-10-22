import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

export interface Highlight {
  id: string;
  type: 'high-game' | 'perfect-game' | 'milestone' | 'achievement';
  title: string;
  description: string;
  date: string;
  playerName?: string;
  score?: number;
  icon: 'Trophy' | 'Star' | 'Award' | 'Target';
  color: string;
}

export const useRecentHighlights = (limitCount: number = 4) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const highlightsArray: Highlight[] = [];

        // Fetch recent high games from the games collection (read-only from stats app)
        const gamesRef = collection(db, 'games');
        const gamesQuery = query(
          gamesRef,
          where('programId', '==', 'willard-tigers'),
          orderBy('date', 'desc'),
          limit(50) // Get recent games to find highlights
        );

        const gamesSnapshot = await getDocs(gamesQuery);
        const games = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        }));

        // Find high games (200+), near-perfect (280+), and perfect games (300)
        games.forEach((game: any) => {
          const score = game.score || 0;
          const playerName = game.playerName || 'Unknown Player';
          const gameDate = game.date;

          if (score === 300) {
            highlightsArray.push({
              id: game.id,
              type: 'perfect-game',
              title: 'Perfect Game!',
              description: `${playerName} bowled a perfect 300 game!`,
              date: formatDistanceToNow(gameDate, { addSuffix: true }),
              playerName,
              score,
              icon: 'Trophy',
              color: 'from-tiger-tiger-gold to-yellow-500',
            });
          } else if (score >= 280) {
            highlightsArray.push({
              id: game.id,
              type: 'high-game',
              title: 'Near Perfect Game',
              description: `${playerName} bowled a ${score}, missing perfection by just ${300 - score} pins`,
              date: formatDistanceToNow(gameDate, { addSuffix: true }),
              playerName,
              score,
              icon: 'Star',
              color: 'from-purple-600 to-purple-700',
            });
          } else if (score >= 250) {
            highlightsArray.push({
              id: game.id,
              type: 'high-game',
              title: 'Exceptional Performance',
              description: `${playerName} rolled a ${score} game`,
              date: formatDistanceToNow(gameDate, { addSuffix: true }),
              playerName,
              score,
              icon: 'Star',
              color: 'from-blue-600 to-blue-700',
            });
          }
        });

        // Check for team achievements (tournament wins, etc.) from schedules
        const schedulesRef = collection(db, 'schedules');
        const schedulesQuery = query(
          schedulesRef,
          where('programId', '==', 'willard-tigers'),
          where('type', '==', 'tournament'),
          orderBy('date', 'desc'),
          limit(10)
        );

        const schedulesSnapshot = await getDocs(schedulesQuery);
        schedulesSnapshot.docs.forEach(doc => {
          const event = doc.data();
          if (event.result && event.result.winner === 'home') {
            highlightsArray.push({
              id: doc.id,
              type: 'achievement',
              title: event.title || 'Tournament Victory',
              description: event.description || `Team won ${event.title}`,
              date: formatDistanceToNow(event.date?.toDate() || new Date(), { addSuffix: true }),
              icon: 'Trophy',
              color: 'from-tiger-tiger-gold to-yellow-500',
            });
          }
        });

        // Sort by most recent and limit
        highlightsArray.sort((a, b) => {
          // Prioritize perfect games, then by recency
          if (a.type === 'perfect-game' && b.type !== 'perfect-game') return -1;
          if (b.type === 'perfect-game' && a.type !== 'perfect-game') return 1;
          return 0;
        });

        setHighlights(highlightsArray.slice(0, limitCount));
      } catch (error) {
        console.error('Error fetching highlights:', error);
        // If no data yet, show placeholder highlights
        setHighlights([
          {
            id: '1',
            type: 'achievement',
            title: 'Season Starting Soon',
            description: 'Check back soon for recent highlights and achievements',
            date: 'Coming soon',
            icon: 'Trophy',
            color: 'from-tiger-neutral-600 to-tiger-neutral-800',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, [limitCount]);

  return { highlights, loading };
};
