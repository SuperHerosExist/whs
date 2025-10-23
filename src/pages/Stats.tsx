import React, { useEffect, useState } from 'react';
import { calculateTeamStats, getAllPlayerStats, type PlayerGameStats } from '@/lib/statsCalculator';
import { generateTeamInsights, type AIInsight, type TeamStatsForAI } from '@/lib/gemini';
import type { Player } from '@/types';
import { Trophy, Target, Zap, Award, BarChart3, Sparkles, TrendingUp, AlertCircle, Lightbulb, Flame, Medal } from 'lucide-react';

export const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [teamStats, setTeamStats] = useState({
    teamAverage: 0,
    highGame: 0,
    highGamePlayer: '',
    highSeries: 0,
    totalGames: 0,
    activePlayers: 0,
    totalAchievements: 0,
  });
  const [topPerformers, setTopPerformers] = useState<Player[]>([]);
  const [allPlayerStats, setAllPlayerStats] = useState<PlayerGameStats[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get calculated team stats
        const teamStatsData = await calculateTeamStats();

        setTeamStats({
          teamAverage: teamStatsData.teamAverage,
          highGame: teamStatsData.highIndividualGame,
          highGamePlayer: teamStatsData.highIndividualGamePlayer,
          highSeries: teamStatsData.highTeamSeries,
          totalGames: teamStatsData.totalGames,
          activePlayers: teamStatsData.totalPlayers,
          totalAchievements: teamStatsData.totalAchievements,
        });

        // Get all player stats and extract top performers
        const allPlayerStats = await getAllPlayerStats();
        setAllPlayerStats(allPlayerStats);

        // Convert to Player type for display (top 5 by average)
        const topPerformersData: Player[] = allPlayerStats
          .slice(0, 5)
          .map(stat => ({
            id: stat.playerId,
            uid: stat.playerId,
            name: stat.playerName,
            email: '',
            grade: '',
            graduationYear: new Date().getFullYear(),
            averageScore: stat.average,
            highGame: stat.highGame,
            gamesPlayed: stat.games,
            programId: 'willard-tigers',
            teamIds: [],
            isActive: true,
            photoURL: undefined,
            jerseyNumber: '',
            bio: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

        setTopPerformers(topPerformersData);
        console.log(`✅ Stats page loaded: ${teamStatsData.totalPlayers} players, ${teamStatsData.teamAverage} avg`);

        // Generate AI insights if we have stats
        if (teamStatsData.totalGames > 0) {
          setLoadingInsights(true);
          const statsForAI: TeamStatsForAI = {
            teamAverage: teamStatsData.teamAverage,
            totalPlayers: teamStatsData.totalPlayers,
            totalGames: teamStatsData.totalGames,
            highGame: teamStatsData.highIndividualGame,
            highGamePlayer: teamStatsData.highIndividualGamePlayer,
            topPerformers: allPlayerStats.slice(0, 5).map(s => ({
              name: s.playerName,
              average: s.average,
              highGame: s.highGame,
              games: s.games,
            })),
          };

          const insights = await generateTeamInsights(statsForAI);
          setAiInsights(insights);
          setLoadingInsights(false);
        }
      } catch (error) {
        console.error('❌ Error fetching stats:', error);
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

  const getInsightIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'strengths':
        return Trophy;
      case 'improvements':
        return Target;
      case 'trends':
        return TrendingUp;
      case 'recommendations':
        return Lightbulb;
      default:
        return AlertCircle;
    }
  };

  const getInsightColor = (category: AIInsight['category']) => {
    switch (category) {
      case 'strengths':
        return 'from-green-600 to-green-800';
      case 'improvements':
        return 'from-orange-600 to-orange-800';
      case 'trends':
        return 'from-blue-600 to-blue-800';
      case 'recommendations':
        return 'from-purple-600 to-purple-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

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

      {/* 🔥 HYPE ZONE - Achievements & Records */}
      {teamStats.totalGames > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-display font-black text-tiger-primary-black">
              HYPE ZONE
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* High Series Record */}
            <div className="bg-gradient-to-br from-tiger-tiger-gold to-yellow-600 rounded-2xl shadow-tiger-lg p-6 text-tiger-primary-black">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8" />
                <h3 className="text-2xl font-display font-black">HIGH SERIES</h3>
              </div>
              <div className="text-5xl font-display font-black mb-1">
                {teamStats.highSeries > 0 ? teamStats.highSeries : '--'}
              </div>
              <p className="text-sm font-bold opacity-90">Best 3-Game Series</p>
            </div>

            {/* Total Achievements */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-tiger-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Medal className="w-8 h-8" />
                <h3 className="text-2xl font-display font-black">ACHIEVEMENTS</h3>
              </div>
              <div className="text-5xl font-display font-black mb-1">
                {teamStats.totalAchievements}
              </div>
              <p className="text-sm font-bold opacity-90">USBC Youth Goals Crushed</p>
            </div>

            {/* Hot Streaks */}
            {allPlayerStats.length > 0 && (() => {
              const hotPlayers = allPlayerStats.filter(p => p.currentStreak >= 3);
              const longestStreaker = allPlayerStats.reduce((max, p) =>
                p.longestStreak > max.longestStreak ? p : max
              , allPlayerStats[0]);

              return (
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-tiger-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-8 h-8" />
                    <h3 className="text-2xl font-display font-black">ON FIRE</h3>
                  </div>
                  <div className="text-5xl font-display font-black mb-1">
                    {hotPlayers.length}
                  </div>
                  <p className="text-sm font-bold opacity-90">
                    {hotPlayers.length === 1 ? 'Bowler' : 'Bowlers'} on Hot Streaks
                  </p>
                  {longestStreaker.longestStreak > 0 && (
                    <p className="text-xs mt-2 opacity-75">
                      Record: {longestStreaker.longestStreak} games ({longestStreaker.playerName})
                    </p>
                  )}
                </div>
              );
            })()}
          </div>

          {/* USBC Youth Achievement Breakdown */}
          <div className="bg-white rounded-2xl shadow-tiger-lg p-8">
            <h3 className="text-2xl font-display font-black text-tiger-primary-black mb-6">
              USBC YOUTH ACHIEVEMENTS
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {(() => {
                const bronze = allPlayerStats.reduce((sum, p) => sum + p.gamesOver25 + p.seriesOver25, 0);
                const silver = allPlayerStats.reduce((sum, p) => sum + p.gamesOver50 + p.seriesOver50, 0);
                const gold = allPlayerStats.reduce((sum, p) => sum + p.gamesOver100 + p.seriesOver100, 0);

                return (
                  <>
                    <AchievementCard
                      icon="🥉"
                      title="Bronze Goals"
                      subtitle="+25 Pins Over Average"
                      count={bronze}
                      color="from-amber-700 to-amber-900"
                    />
                    <AchievementCard
                      icon="🥈"
                      title="Silver Goals"
                      subtitle="+50 Pins Over Average"
                      count={silver}
                      color="from-gray-400 to-gray-600"
                    />
                    <AchievementCard
                      icon="🥇"
                      title="Gold Goals"
                      subtitle="+100 Pins Over Average"
                      count={gold}
                      color="from-tiger-tiger-gold to-yellow-600"
                    />
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* AI-Powered Insights */}
      {teamStats.totalGames > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-display font-black text-tiger-primary-black">
              AI-Powered Insights
            </h2>
          </div>

          {loadingInsights ? (
            <div className="bg-white rounded-2xl shadow-tiger-lg p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-tiger-neutral-600">Analyzing team performance...</p>
            </div>
          ) : aiInsights.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {aiInsights.map((insight, index) => {
                const Icon = getInsightIcon(insight.category);
                const color = getInsightColor(insight.category);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-tiger-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display font-black text-tiger-primary-black">
                            {insight.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            insight.confidence === 'high'
                              ? 'bg-green-100 text-green-800'
                              : insight.confidence === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {insight.confidence}
                          </span>
                        </div>
                        <p className="text-tiger-neutral-700 leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      )}

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
                          {player.grade || '--'}
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
            Access comprehensive bowling statistics, frame-by-frame analysis, and advanced performance metrics
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

interface AchievementCardProps {
  icon: string;
  title: string;
  subtitle: string;
  count: number;
  color: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ icon, title, subtitle, count, color }) => {
  return (
    <div className="relative overflow-hidden">
      <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-tiger`}>
        <div className="text-5xl mb-3">{icon}</div>
        <div className="text-4xl font-display font-black mb-2">{count}</div>
        <div className="text-lg font-bold mb-1">{title}</div>
        <div className="text-sm opacity-90">{subtitle}</div>
      </div>
    </div>
  );
};
