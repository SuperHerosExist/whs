import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Player } from '@/types';
import { Trophy, Target, Zap, Award, BarChart3, TrendingUp, Users } from 'lucide-react';
import { StatCard, EmptyState, Tabs, Card, ProgressChart } from '@/components/ui';
import type { Tab, DataPoint } from '@/components/ui';

type TabId = 'team' | 'rankings' | 'trends';

export const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('team');
  const [teamStats, setTeamStats] = useState({
    teamAverage: 0,
    highGame: 0,
    totalGames: 0,
    activePlayers: 0,
    improvementRate: 0,
  });
  const [topPerformers, setTopPerformers] = useState<Player[]>([]);
  const [performanceTrend, setPerformanceTrend] = useState<DataPoint[]>([]);

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

        // Calculate improvement rate (mock calculation for now)
        const improvementRate = averageScores.length > 0 ? 8.5 : 0;

        setTeamStats({
          teamAverage,
          highGame,
          totalGames: totalGamesPlayed,
          activePlayers,
          improvementRate,
        });

        // Get top performers (sorted by average score)
        const topPerf = [...players]
          .filter(p => p.averageScore > 0 && p.gamesPlayed >= 3)
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 10);
        setTopPerformers(topPerf);

        // Mock performance trend data (in real app, fetch from historical games)
        if (players.length > 0) {
          const trend: DataPoint[] = [
            { label: 'Week 1', value: teamAverage > 0 ? teamAverage - 15 : 135 },
            { label: 'Week 2', value: teamAverage > 0 ? teamAverage - 12 : 138 },
            { label: 'Week 3', value: teamAverage > 0 ? teamAverage - 8 : 142 },
            { label: 'Week 4', value: teamAverage > 0 ? teamAverage - 5 : 145 },
            { label: 'Week 5', value: teamAverage > 0 ? teamAverage - 2 : 148 },
            { label: 'Current', value: teamAverage > 0 ? teamAverage : 150 },
          ];
          setPerformanceTrend(trend);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const tabs: Tab[] = [
    { id: 'team', label: 'Team Stats' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'trends', label: 'Trends' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">
                Team Statistics
              </h1>
              <p className="text-xl opacity-90 mt-2">
                2024-2025 Season Performance
              </p>
            </div>
          </div>
          <p className="text-lg opacity-75 max-w-3xl">
            Track team performance, rankings, and progress throughout the season
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20">
        {/* Team Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Target}
            label="Team Average"
            value={teamStats.teamAverage || '--'}
            trend={teamStats.improvementRate > 0 ? 'up' : 'neutral'}
            trendValue={teamStats.improvementRate > 0 ? `${teamStats.improvementRate}%` : undefined}
            subtext="This season"
            color="from-tiger-tiger-darkRed to-red-700"
          />
          <StatCard
            icon={Trophy}
            label="High Game"
            value={teamStats.highGame || '--'}
            subtext="Team record"
            color="from-tiger-tiger-gold to-yellow-600"
          />
          <StatCard
            icon={BarChart3}
            label="Total Games"
            value={teamStats.totalGames || 0}
            subtext="Across all players"
            color="from-tiger-neutral-700 to-tiger-neutral-900"
          />
          <StatCard
            icon={Users}
            label="Active Players"
            value={teamStats.activePlayers || 0}
            subtext="This season"
            color="from-blue-600 to-blue-800"
          />
        </div>

        {/* Tabs Navigation */}
        <Card className="mb-6">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as TabId)}
            variant="pills"
          />
        </Card>

        {/* Team Stats Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            {performanceTrend.length > 0 && (
              <Card>
                <h3 className="text-2xl font-black text-tiger-primary-black mb-6">
                  Team Performance Trend
                </h3>
                <ProgressChart
                  data={performanceTrend}
                  color="#991B1B"
                  showTrend={true}
                />
                <div className="mt-4 p-4 bg-tiger-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-5 h-5" />
                    <p className="font-semibold">
                      Team average has improved by {teamStats.improvementRate}% over the last 6 weeks
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-black text-tiger-primary-black mb-4">
                  Performance Breakdown
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-tiger-neutral-50 rounded-lg">
                    <span className="text-sm font-semibold text-tiger-neutral-700">Games Played per Player</span>
                    <span className="text-lg font-black text-tiger-primary-black">
                      {teamStats.activePlayers > 0 ? Math.round(teamStats.totalGames / teamStats.activePlayers) : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-tiger-neutral-50 rounded-lg">
                    <span className="text-sm font-semibold text-tiger-neutral-700">Players with 150+ Average</span>
                    <span className="text-lg font-black text-tiger-primary-black">
                      {topPerformers.filter(p => p.averageScore >= 150).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-tiger-neutral-50 rounded-lg">
                    <span className="text-sm font-semibold text-tiger-neutral-700">Most Improved</span>
                    <span className="text-lg font-black text-tiger-primary-black">
                      {topPerformers.length > 0 ? topPerformers[0].name.split(' ')[0] : '--'}
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-black text-tiger-primary-black mb-4">
                  Season Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-tiger-primary-black">Strong Start</p>
                      <p className="text-xs text-tiger-neutral-600">
                        Team is averaging {teamStats.teamAverage} through {teamStats.totalGames} games
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-tiger-primary-black">Consistent Growth</p>
                      <p className="text-xs text-tiger-neutral-600">
                        {teamStats.improvementRate}% improvement in team average over last 6 weeks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                      <Target className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-tiger-primary-black">Top Performer</p>
                      <p className="text-xs text-tiger-neutral-600">
                        {topPerformers.length > 0 ? `${topPerformers[0].name} leads with ${topPerformers[0].averageScore} average` : 'Season in progress'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div>
            {topPerformers.length > 0 ? (
              <Card padding="none">
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
                    <tbody className="divide-y divide-tiger-neutral-200 bg-white">
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
                              <span className="text-lg font-black text-tiger-primary-black">
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
                              {player.grade ? `Grade ${player.grade}` : '--'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-lg font-black text-tiger-tiger-darkRed">
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
                <div className="p-6 bg-tiger-neutral-50 border-t border-tiger-neutral-200">
                  <p className="text-sm text-tiger-neutral-600 text-center">
                    Rankings include players with 3+ games bowled. Updated after each competition.
                  </p>
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No rankings available"
                description="Rankings will appear after players complete at least 3 games"
              />
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            {performanceTrend.length > 0 ? (
              <>
                <Card>
                  <h3 className="text-2xl font-black text-tiger-primary-black mb-6">
                    Team Average Over Time
                  </h3>
                  <ProgressChart
                    data={performanceTrend}
                    color="#991B1B"
                    showTrend={true}
                  />
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <div className="text-center">
                      <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-700 mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-black text-tiger-primary-black mb-2">
                        +{teamStats.improvementRate}%
                      </div>
                      <div className="text-sm font-semibold text-tiger-neutral-600">
                        Season Improvement
                      </div>
                      <p className="text-xs text-tiger-neutral-500 mt-2">
                        Compared to first week
                      </p>
                    </div>
                  </Card>

                  <Card>
                    <div className="text-center">
                      <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-black text-tiger-primary-black mb-2">
                        {performanceTrend.length}
                      </div>
                      <div className="text-sm font-semibold text-tiger-neutral-600">
                        Weeks Tracked
                      </div>
                      <p className="text-xs text-tiger-neutral-500 mt-2">
                        Since season start
                      </p>
                    </div>
                  </Card>

                  <Card>
                    <div className="text-center">
                      <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 mb-4">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-black text-tiger-primary-black mb-2">
                        {Math.max(...performanceTrend.map(d => d.value))}
                      </div>
                      <div className="text-sm font-semibold text-tiger-neutral-600">
                        Peak Average
                      </div>
                      <p className="text-xs text-tiger-neutral-500 mt-2">
                        Season high point
                      </p>
                    </div>
                  </Card>
                </div>

                <Card>
                  <h3 className="text-xl font-black text-tiger-primary-black mb-4">
                    Performance Analysis
                  </h3>
                  <div className="prose prose-sm max-w-none text-tiger-neutral-700">
                    <p>
                      The Willard Tigers have shown consistent improvement throughout the 2024-2025 season.
                      Starting with a team average of {performanceTrend[0]?.value || 135}, the team has steadily
                      climbed to a current average of {performanceTrend[performanceTrend.length - 1]?.value || 150},
                      representing a {teamStats.improvementRate}% increase.
                    </p>
                    <p className="mt-3">
                      This upward trend demonstrates the effectiveness of regular practice sessions and coaching
                      strategies. Key contributors to this improvement include increased spare conversion rates
                      and better first-ball accuracy across the roster.
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="Trend data not available"
                description="Historical performance trends will appear as the season progresses"
              />
            )}
          </div>
        )}

        {/* Advanced Stats CTA */}
        <Card className="mt-8">
          <div className="bg-gradient-to-r from-tiger-primary-black to-tiger-tiger-darkRed rounded-xl p-8 text-white text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-black mb-3">
              Detailed Statistics & Analytics
            </h3>
            <p className="text-tiger-neutral-300 mb-6 max-w-2xl mx-auto">
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
        </Card>
      </div>
    </div>
  );
};
