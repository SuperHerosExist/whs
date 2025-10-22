import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import type { Player } from '@/types';
import { Trophy, Target, Zap, Award, BarChart3 } from 'lucide-react';

export const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teamStats, setTeamStats] = useState({
    teamAverage: 0,
    highGame: 0,
    totalGames: 0,
    activePlayers: 0,
  });
  const [topPerformers, setTopPerformers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // First, get the team document to access playerIds array
        const teamRef = doc(statsDb, 'teams', STATS_TEAM_ID);
        const teamSnap = await getDoc(teamRef);

        if (!teamSnap.exists()) {
          console.error('❌ Team not found');
          setLoading(false);
          return;
        }

        const teamData = teamSnap.data();
        const playerIds = teamData?.playerIds || [];

        // Fetch each player individually by ID
        const players: Player[] = [];
        for (const playerId of playerIds) {
          try {
            const playerRef = doc(statsDb, 'players', playerId);
            const playerSnap = await getDoc(playerRef);

            if (playerSnap.exists()) {
              const data = playerSnap.data();
              players.push({
                id: playerSnap.id,
                uid: data.uid || playerSnap.id,
                name: data.name || 'Unknown Player',
                email: data.email || '',
                grade: data.grade || '',
                graduationYear: data.graduationYear || new Date().getFullYear(),
                averageScore: data.average || 0,
                highGame: data.highGame || 0,
                gamesPlayed: data.gamesPlayed || 0,
                programId: 'willard-tigers',
                teamIds: data.teamIds || [STATS_TEAM_ID],
                isActive: data.isActive !== false,
                photoURL: data.photoURL || null,
                jerseyNumber: data.jerseyNumber || '',
                bio: data.bio || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              });
            }
          } catch (playerError) {
            console.warn(`⚠️  Could not fetch player ${playerId}:`, playerError);
          }
        }

        // Calculate team statistics
        const activePlayers = players.length;
        const totalGamesPlayed = players.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0);
        const averageScores = players.filter(p => p.averageScore > 0).map(p => p.averageScore);
        const teamAverage = averageScores.length > 0
          ? Math.round(averageScores.reduce((sum, avg) => sum + avg, 0) / averageScores.length)
          : 0;
        const highGame = Math.max(...players.map(p => p.highGame || 0), 0);

        setTeamStats({
          teamAverage,
          highGame,
          totalGames: totalGamesPlayed,
          activePlayers,
        });

        // Get top performers (sorted by average score)
        const topPerf = [...players]
          .filter(p => p.averageScore > 0 && p.gamesPlayed >= 3)
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 10);
        setTopPerformers(topPerf);

        console.log(`✅ Loaded stats for ${activePlayers} players from Stats app (Team: ${STATS_TEAM_ID})`);
        console.log(`   Team Average: ${teamAverage}, High Game: ${highGame}, Total Games: ${totalGamesPlayed}`);
      } catch (error) {
        console.error('❌ Error fetching stats from Stats app:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white">
      {/* Page Header */}
      <section className="bg-tiger-primary-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl md:text-6xl tracking-wider mb-6">TEAM STATISTICS
          </h1>
          <p className="text-xl text-tiger-neutral-300">
            2024-2025 Season Performance
          </p>
        </div>
      </section>

      {/* Team Stats Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={Target}
            label="Team Average"
            value={teamStats.teamAverage > 0 ? teamStats.teamAverage.toString() : 'Pre-Season'}
            color="from-tiger-tiger-darkRed to-red-700"
          />
          <StatCard
            icon={Trophy}
            label="High Game"
            value={teamStats.highGame > 0 ? teamStats.highGame.toString() : 'Pre-Season'}
            color="from-tiger-tiger-gold to-yellow-600"
          />
          <StatCard
            icon={BarChart3}
            label="Total Games"
            value={teamStats.totalGames.toString()}
            color="from-tiger-neutral-700 to-tiger-neutral-900"
          />
          <StatCard
            icon={Zap}
            label="Active Players"
            value={teamStats.activePlayers.toString()}
            color="from-blue-600 to-blue-800"
          />
        </div>
      </section>

      {/* Top Performers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-display font-black text-tiger-primary-black mb-8">
          Top Performers
        </h2>

        {topPerformers.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-tiger-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-tiger-primary-black text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                      Average
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                      High Game
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                      Games
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tiger-neutral-200">
                  {topPerformers.map((player, index) => (
                    <tr
                      key={player.id}
                      className="hover:bg-tiger-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && (
                            <Award className="w-5 h-5 text-tiger-tiger-gold mr-2" />
                          )}
                          {index === 1 && (
                            <Award className="w-5 h-5 text-tiger-neutral-400 mr-2" />
                          )}
                          {index === 2 && (
                            <Award className="w-5 h-5 text-amber-700 mr-2" />
                          )}
                          <span className="text-lg font-display font-black text-tiger-primary-black">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-tiger-primary-black">
                          {player.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-tiger-neutral-100 text-tiger-neutral-700 rounded-full text-xs font-bold">
                          {player.grade}th
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-lg font-display font-black text-tiger-tiger-darkRed">
                          {player.averageScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-lg font-semibold text-tiger-primary-black">
                          {player.highGame || '--'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-lg font-semibold text-tiger-neutral-600">
                          {player.gamesPlayed}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-tiger p-12 text-center">
            <div className="text-8xl mb-6">🎳</div>
            <h3 className="text-2xl font-black text-tiger-primary-black mb-4">
              Pre-Season Mode
            </h3>
            <p className="text-tiger-neutral-600 text-lg mb-6">
              Our team of {teamStats.activePlayers} bowlers is ready to compete! Statistics will appear once the season begins and games are recorded.
            </p>
            <p className="text-sm text-tiger-neutral-500">
              Coaches can track performance using the Stats App during practices and matches.
            </p>
          </div>
        )}
      </section>

      {/* Integration with Stats App */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-tiger-primary-black to-tiger-tiger-darkRed rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-display font-black mb-4">
            Detailed Statistics & Analytics
          </h2>
          <p className="text-lg text-tiger-neutral-300 mb-8 max-w-2xl mx-auto">
            Access comprehensive bowling statistics, frame-by-frame analysis, and AI-powered insights
            through our dedicated Stats application.
          </p>
          <a
            href={import.meta.env.VITE_STATS_APP_URL || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-tiger-tiger-gold text-tiger-primary-black font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-tiger-lg"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Advanced Stats
          </a>
          <p className="mt-4 text-sm text-tiger-neutral-400">
            Requires player or coach login
          </p>
        </div>
      </section>
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-tiger-lg p-6 hover:shadow-xl transition-shadow">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-display font-black text-tiger-primary-black mb-1">
        {value}
      </div>
      <div className="text-sm font-semibold text-tiger-neutral-600">
        {label}
      </div>
    </div>
  );
};
