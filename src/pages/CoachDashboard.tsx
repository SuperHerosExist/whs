import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Player, ScheduleEvent } from '@/types';
import {
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Trophy,
  Target
} from 'lucide-react';
import {
  Button,
  StatCard,
  Card,
  useToast,
  Tabs,
  ProgressChart,
  EmptyState,
  SyncIndicator,
  type DataPoint
} from '@/components/ui';
import { PlayerTable, QuickActions, type QuickAction } from '@/components/dashboard';

type TabId = 'overview' | 'roster' | 'schedule' | 'analytics';

export const CoachDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [players, setPlayers] = useState<Player[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error' | 'pending'>('synced');
  const [lastSyncDate, setLastSyncDate] = useState(new Date());

  const [teamStats, setTeamStats] = useState({
    totalPlayers: 0,
    teamAverage: 0,
    totalGames: 0,
    activePlayers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setSyncStatus('syncing');
    try {
      // Fetch players
      const playersRef = collection(db, 'players');
      const playersQuery = query(
        playersRef,
        where('programId', '==', 'willard-tigers')
      );
      const playersSnapshot = await getDocs(playersQuery);
      const playersData = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Player[];
      setPlayers(playersData);

      // Calculate team stats
      const activePlayers = playersData.filter(p => p.isActive);
      const totalPlayers = playersData.length;
      const totalGames = playersData.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0);
      const averages = activePlayers.filter(p => p.averageScore > 0).map(p => p.averageScore);
      const teamAverage = averages.length > 0
        ? Math.round(averages.reduce((sum, avg) => sum + avg, 0) / averages.length)
        : 0;

      setTeamStats({ totalPlayers, teamAverage, totalGames, activePlayers: activePlayers.length });

      // Fetch upcoming events
      const eventsRef = collection(db, 'schedules');
      const eventsQuery = query(
        eventsRef,
        where('programId', '==', 'willard-tigers')
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ScheduleEvent[];

      const upcoming = eventsData
        .filter(e => e.date >= new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5);
      setUpcomingEvents(upcoming);

      setSyncStatus('synced');
      setLastSyncDate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSyncStatus('error');
      showToast('error', 'Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlayerStatus = async (playerId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'players', playerId), {
        isActive: !currentStatus,
        updatedAt: serverTimestamp(),
      });
      showToast('success', `Player ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error toggling player status:', error);
      showToast('error', 'Failed to update player status');
    }
  };

  const handleEditPlayer = (player: Player) => {
    showToast('info', `Editing ${player.name} - Full edit modal coming soon!`);
  };

  // Mock performance data
  const teamPerformanceData: DataPoint[] = [
    { label: 'Week 1', value: 195 },
    { label: 'Week 2', value: 198 },
    { label: 'Week 3', value: 196 },
    { label: 'Week 4', value: 201 },
    { label: 'Week 5', value: 203 },
    { label: 'Week 6', value: 199 },
    { label: 'Week 7', value: 205 },
    { label: 'Week 8', value: 202 },
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'add-player',
      label: 'Add New Player',
      icon: UserPlus,
      onClick: () => showToast('info', 'Add player wizard coming soon!'),
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: 'add-event',
      label: 'Schedule Event',
      icon: Calendar,
      onClick: () => showToast('info', 'Event creation coming soon!'),
      color: 'from-tiger-tiger-darkRed to-red-700'
    },
    {
      id: 'view-stats',
      label: 'View Advanced Stats',
      icon: BarChart3,
      onClick: () => window.open(import.meta.env.VITE_STATS_APP_URL || '#', '_blank'),
      color: 'from-green-600 to-green-700'
    },
  ];

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: BarChart3 },
    { id: 'roster' as TabId, label: 'Roster', icon: Users, badge: teamStats.activePlayers.toString() },
    { id: 'schedule' as TabId, label: 'Schedule', icon: Calendar },
    { id: 'analytics' as TabId, label: 'Analytics', icon: TrendingUp },
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
      <section className="bg-tiger-primary-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                Coach Dashboard
              </h1>
              <p className="text-tiger-neutral-300">
                Manage your team, track progress, and drive performance
              </p>
            </div>
            <SyncIndicator
              status={syncStatus}
              lastSyncDate={lastSyncDate}
              compact={false}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
            variant="pills"
          />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Alert for action items */}
            {players.filter(p => !p.isActive).length > 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-bold text-amber-900">Action Required</h3>
                    <p className="text-amber-800 text-sm mt-1">
                      {players.filter(p => !p.isActive).length} inactive player(s) in your roster
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Active Players"
                value={teamStats.activePlayers}
                subtext={`of ${teamStats.totalPlayers} total`}
                color="from-blue-600 to-blue-800"
                onClick={() => setActiveTab('roster')}
              />
              <StatCard
                icon={TrendingUp}
                label="Team Average"
                value={teamStats.teamAverage}
                subtext="Current season"
                trend="up"
                trendValue="+8 pts"
                color="from-tiger-tiger-darkRed to-red-700"
              />
              <StatCard
                icon={Trophy}
                label="Total Games"
                value={teamStats.totalGames}
                subtext="All players"
                color="from-green-600 to-green-700"
              />
              <StatCard
                icon={Target}
                label="Season Record"
                value="15-3"
                subtext="Win percentage: 83%"
                color="from-tiger-tiger-gold to-yellow-600"
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-black text-tiger-primary-black mb-4">
                Quick Actions
              </h2>
              <QuickActions actions={quickActions} />
            </Card>

            {/* Upcoming Events and Team Performance */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-tiger-primary-black">
                    Upcoming Events
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Calendar}
                    onClick={() => setActiveTab('schedule')}
                  >
                    View All
                  </Button>
                </div>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 bg-tiger-neutral-50 rounded-lg hover:bg-tiger-neutral-100 transition-colors cursor-pointer"
                      >
                        <div>
                          <h3 className="font-semibold text-tiger-primary-black">
                            {event.title}
                          </h3>
                          <p className="text-sm text-tiger-neutral-600">
                            {event.date.toLocaleDateString()} at {event.time}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          event.type === 'tournament'
                            ? 'bg-tiger-tiger-gold text-tiger-primary-black'
                            : event.type === 'match'
                            ? 'bg-tiger-tiger-darkRed text-white'
                            : 'bg-tiger-neutral-300 text-tiger-neutral-800'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="No upcoming events"
                    description="Schedule your first event to get started"
                    actionLabel="Add Event"
                    onAction={() => showToast('info', 'Event creation coming soon!')}
                  />
                )}
              </Card>

              <Card>
                <h2 className="text-xl font-black text-tiger-primary-black mb-4">
                  Team Performance
                </h2>
                <ProgressChart
                  data={teamPerformanceData}
                  showTrend={true}
                  height={200}
                  color="tiger-primary-black"
                />
              </Card>
            </div>
          </div>
        )}

        {/* Roster Management Tab */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-tiger-primary-black">Team Roster</h2>
                <p className="text-tiger-neutral-600 mt-1">
                  Manage your athletes and track their performance
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                icon={UserPlus}
                onClick={() => showToast('info', 'Add player wizard coming soon!')}
              >
                Add Player
              </Button>
            </div>

            <PlayerTable
              players={players}
              onEditPlayer={handleEditPlayer}
              onToggleStatus={handleTogglePlayerStatus}
            />
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-tiger-primary-black">Schedule Management</h2>
                <p className="text-tiger-neutral-600 mt-1">
                  Create and manage practices, matches, and tournaments
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                icon={Calendar}
                onClick={() => showToast('info', 'Event creation coming soon!')}
              >
                Add Event
              </Button>
            </div>

            {upcomingEvents.length > 0 ? (
              <Card>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border border-tiger-neutral-200 rounded-lg hover:bg-tiger-neutral-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-tiger-primary-black text-lg">
                          {event.title}
                        </h3>
                        <p className="text-tiger-neutral-600">
                          {event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {event.time}
                        </p>
                        {event.location && (
                          <p className="text-sm text-tiger-neutral-500 mt-1">
                            {event.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                          event.type === 'tournament'
                            ? 'bg-tiger-tiger-gold text-tiger-primary-black'
                            : event.type === 'match'
                            ? 'bg-tiger-tiger-darkRed text-white'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.type}
                        </span>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No events scheduled"
                description="Create your first event to manage your team's schedule"
                actionLabel="Add Event"
                onAction={() => showToast('info', 'Event creation coming soon!')}
              />
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-black text-tiger-primary-black mb-6">
                Team Performance Analytics
              </h2>
              <ProgressChart
                data={teamPerformanceData}
                title="8-Week Trend"
                showTrend={true}
                height={300}
                color="tiger-primary-black"
              />
              <p className="text-sm text-tiger-neutral-600 mt-4">
                Team average has improved by 7 points over the last 8 weeks. Top performers are driving overall team success.
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <h3 className="font-bold text-tiger-primary-black mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {players
                    .filter(p => p.isActive && p.averageScore > 0)
                    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                    .slice(0, 5)
                    .map((player, idx) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-tiger-neutral-500">
                            #{idx + 1}
                          </span>
                          <span className="text-sm font-semibold text-tiger-primary-black">
                            {player.name}
                          </span>
                        </div>
                        <span className="text-lg font-black text-tiger-primary-black">
                          {player.averageScore}
                        </span>
                      </div>
                    ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-tiger-primary-black mb-4">Most Improved</h3>
                <p className="text-sm text-tiger-neutral-600">
                  Improvement tracking based on recent performance trends
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-tiger-neutral-700">Coming soon</span>
                    <span className="text-green-600 font-bold">+12 pts</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-tiger-primary-black mb-4">Team Insights</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-tiger-neutral-600">Avg Games/Player</span>
                    <span className="font-black text-tiger-primary-black">
                      {Math.round(teamStats.totalGames / (teamStats.activePlayers || 1))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tiger-neutral-600">High Team Game</span>
                    <span className="font-black text-tiger-primary-black">1,024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tiger-neutral-600">Season W-L</span>
                    <span className="font-black text-green-600">15-3</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-tiger-primary-black">
                  Advanced Analytics
                </h2>
                <Button
                  variant="primary"
                  size="md"
                  icon={BarChart3}
                  onClick={() => window.open(import.meta.env.VITE_STATS_APP_URL || '#', '_blank')}
                >
                  View Full Stats App
                </Button>
              </div>
              <p className="text-tiger-neutral-600">
                Access detailed analytics including frame-by-frame analysis, player comparisons, match history, and predictive modeling in the advanced stats application.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
