import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Player, ScheduleEvent } from '@/types';
import {
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  Edit2,
  Plus,
  BarChart3,
  Shield,
} from 'lucide-react';
import { EditPlayerModal } from '@/components/modals/EditPlayerModal';

export const CoachDashboard: React.FC = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'schedule'>('overview');
  const [players, setPlayers] = useState<Player[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [teamStats, setTeamStats] = useState({
    totalPlayers: 0,
    teamAverage: 0,
    totalGames: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch players
      const playersRef = collection(db, 'players');
      const playersQuery = query(
        playersRef,
        where('programId', '==', 'willard-tigers'),
        where('isActive', '==', true)
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
      const totalPlayers = playersData.length;
      const totalGames = playersData.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0);
      const averages = playersData.filter(p => p.averageScore > 0).map(p => p.averageScore);
      const teamAverage = averages.length > 0
        ? Math.round(averages.reduce((sum, avg) => sum + avg, 0) / averages.length)
        : 0;

      setTeamStats({ totalPlayers, teamAverage, totalGames });

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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      await fetchDashboardData();
    } catch (error) {
      console.error('Error toggling player status:', error);
    }
  };

  const handleEditPlayer = (player: Player) => {
    if (userRole !== 'coach') {
      alert('Only coaches can edit player profiles');
      return;
    }
    setEditingPlayer(player);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPlayer(null);
  };

  const handleSavePlayer = async () => {
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary-black"></div>
      </div>
    );
  }

  // Permission check: Only coaches can access this dashboard
  if (userRole !== 'coach') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <Shield className="w-16 h-16 text-tiger-neutral-400 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-black text-tiger-primary-black mb-2">
            Access Restricted
          </h1>
          <p className="text-tiger-neutral-600">
            Only coaches can access this dashboard. Please contact your coach if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white">
      {/* Header */}
      <section className="bg-tiger-primary-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-black mb-2">
            Coach Dashboard
          </h1>
          <p className="text-tiger-neutral-300">
            Manage your team, track progress, and view analytics
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-tiger-primary-black text-white shadow-tiger'
                : 'bg-white text-tiger-neutral-700 hover:bg-tiger-neutral-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'roster'
                ? 'bg-tiger-primary-black text-white shadow-tiger'
                : 'bg-white text-tiger-neutral-700 hover:bg-tiger-neutral-100'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Roster Management
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-tiger-primary-black text-white shadow-tiger'
                : 'bg-white text-tiger-neutral-700 hover:bg-tiger-neutral-100'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Schedule
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Team Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard
                icon={Users}
                label="Active Players"
                value={teamStats.totalPlayers.toString()}
                color="from-blue-600 to-blue-800"
              />
              <StatCard
                icon={TrendingUp}
                label="Team Average"
                value={teamStats.teamAverage.toString()}
                color="from-tiger-tiger-darkRed to-red-700"
              />
              <StatCard
                icon={BarChart3}
                label="Total Games"
                value={teamStats.totalGames.toString()}
                color="from-tiger-neutral-700 to-tiger-neutral-900"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-tiger-lg p-6">
              <h2 className="text-xl font-display font-black text-tiger-primary-black mb-4">
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('roster')}
                  className="flex items-center justify-center px-6 py-4 bg-tiger-primary-black text-white font-semibold rounded-lg hover:bg-tiger-neutral-800 transition-colors"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add Player
                </button>
                <a
                  href={import.meta.env.VITE_STATS_APP_URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-4 bg-tiger-tiger-darkRed text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Advanced Stats
                </a>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="flex items-center justify-center px-6 py-4 bg-tiger-tiger-gold text-tiger-primary-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Manage Schedule
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-tiger-lg p-6">
              <h2 className="text-xl font-display font-black text-tiger-primary-black mb-4">
                Upcoming Events
              </h2>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-tiger-neutral-50 rounded-lg hover:bg-tiger-neutral-100 transition-colors"
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
                <p className="text-tiger-neutral-600 text-center py-8">
                  No upcoming events scheduled
                </p>
              )}
            </div>
          </div>
        )}

        {/* Roster Management Tab */}
        {activeTab === 'roster' && (
          <div className="bg-white rounded-2xl shadow-tiger-lg overflow-hidden">
            <div className="p-6 border-b border-tiger-neutral-200 flex items-center justify-between">
              <h2 className="text-xl font-display font-black text-tiger-primary-black">
                Team Roster
              </h2>
              <button
                onClick={() => alert('Add player functionality - integrate with your user management system')}
                className="px-4 py-2 bg-tiger-primary-black text-white font-semibold rounded-lg hover:bg-tiger-neutral-800 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-tiger-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                      Average
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                      High Game
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                      Games
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-tiger-neutral-200">
                  {players.map(player => (
                    <tr key={player.id} className="hover:bg-tiger-neutral-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center overflow-hidden">
                            {player.photoURL ? (
                              <img
                                src={player.photoURL}
                                alt={player.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold text-sm">
                                {player.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-tiger-primary-black">
                              {player.name}
                            </div>
                            <div className="text-sm text-tiger-neutral-500">
                              {player.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-tiger-neutral-100 text-tiger-neutral-700 rounded text-sm font-semibold">
                          {player.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-tiger-primary-black font-semibold">
                        {player.averageScore || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-tiger-primary-black font-semibold">
                        {player.highGame || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-tiger-neutral-700">
                        {player.gamesPlayed || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePlayerStatus(player.id, player.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            player.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {player.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditPlayer(player)}
                            className="p-2 text-tiger-neutral-600 hover:text-tiger-primary-black hover:bg-tiger-neutral-100 rounded transition-colors"
                            title="Edit player"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {players.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-tiger-neutral-300 mx-auto mb-4" />
                <p className="text-tiger-neutral-600">No players in roster yet</p>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-tiger-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-black text-tiger-primary-black">
                Schedule Management
              </h2>
              <button className="px-4 py-2 bg-tiger-primary-black text-white font-semibold rounded-lg hover:bg-tiger-neutral-800 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </button>
            </div>
            <p className="text-tiger-neutral-600 text-center py-12">
              Schedule management interface - Navigate to the public Schedule page to view all events
            </p>
          </div>
        )}
      </div>

      {/* Edit Player Modal */}
      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSavePlayer}
        />
      )}
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
    <div className="bg-white rounded-xl shadow-tiger-lg p-6">
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
