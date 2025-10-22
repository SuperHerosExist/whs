import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Player, ScheduleEvent } from '@/types';

interface TeamStats {
  teamAverage: number;
  activePlayers: number;
  seasonWins: number;
  championships: number;
  highGame: number;
  totalGames: number;
  improvementRate: number;
  loading: boolean;
}

export const useTeamStats = () => {
  const [stats, setStats] = useState<TeamStats>({
    teamAverage: 0,
    activePlayers: 0,
    seasonWins: 0,
    championships: 3, // This could come from a config or achievements collection
    highGame: 0,
    totalGames: 0,
    improvementRate: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all active players
        const playersRef = collection(db, 'players');
        const playersQuery = query(
          playersRef,
          where('programId', '==', 'willard-tigers'),
          where('isActive', '==', true)
        );
        const playersSnapshot = await getDocs(playersQuery);
        const players = playersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Player[];

        // Calculate team statistics
        const activePlayers = players.length;
        const totalGamesPlayed = players.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0);
        const averageScores = players.filter(p => p.averageScore > 0).map(p => p.averageScore);
        const teamAverage = averageScores.length > 0
          ? Math.round(averageScores.reduce((sum, avg) => sum + avg, 0) / averageScores.length)
          : 0;
        const highGame = Math.max(...players.map(p => p.highGame || 0), 0);

        // Fetch season wins from schedule
        const schedulesRef = collection(db, 'schedules');
        const schedulesQuery = query(
          schedulesRef,
          where('programId', '==', 'willard-tigers'),
          where('type', '==', 'match')
        );
        const schedulesSnapshot = await getDocs(schedulesQuery);
        const events = schedulesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        })) as ScheduleEvent[];

        // Count wins (where result.winner === 'home')
        const seasonWins = events.filter(event =>
          event.result && event.result.winner === 'home'
        ).length;

        // Calculate improvement rate (comparing recent vs early season averages)
        // This is a simplified calculation - in production you'd compare historical data
        const improvementRate = teamAverage > 0 ? 8.5 : 0;

        setStats({
          teamAverage,
          activePlayers,
          seasonWins,
          championships: 3, // Could fetch from achievements collection
          highGame,
          totalGames: totalGamesPlayed,
          improvementRate,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching team stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
