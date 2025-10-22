import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Player } from '@/types';
import {
  User,
  Camera,
  Save,
  TrendingUp,
  Trophy,
  BarChart3,
  Home,
  Award,
  Target,
  Calendar,
  MessageSquare
} from 'lucide-react';
import {
  Button,
  StatCard,
  Card,
  useToast,
  Tabs,
  ProgressChart,
  Achievement,
  type DataPoint,
  type AchievementData
} from '@/components/ui';
import { WelcomeBanner, RecentGames, QuickActions, type Game, type QuickAction } from '@/components/dashboard';

type TabId = 'overview' | 'profile' | 'stats' | 'achievements';

export const PlayerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    graduationYear: new Date().getFullYear(),
    jerseyNumber: '',
    bio: '',
  });

  useEffect(() => {
    fetchPlayerProfile();
  }, [currentUser]);

  const fetchPlayerProfile = async () => {
    if (!currentUser) return;

    try {
      const playerDoc = await getDoc(doc(db, 'players', currentUser.uid));

      if (playerDoc.exists()) {
        const playerData = {
          id: playerDoc.id,
          ...playerDoc.data(),
          createdAt: playerDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: playerDoc.data().updatedAt?.toDate() || new Date(),
        } as Player;

        setPlayer(playerData);
        setProfileData({
          name: playerData.name || '',
          email: playerData.email || '',
          phone: currentUser.phone || '',
          grade: playerData.grade || '',
          graduationYear: playerData.graduationYear || new Date().getFullYear(),
          jerseyNumber: playerData.jerseyNumber || '',
          bio: playerData.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching player profile:', error);
      showToast('error', 'Failed to load your profile. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Photo must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload an image file');
      return;
    }

    setUploadingPhoto(true);

    try {
      const storageRef = ref(storage, `player-profiles/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'players', currentUser.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      if (player) {
        setPlayer({ ...player, photoURL });
      }

      showToast('success', 'Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('error', 'Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, 'players', currentUser.uid), {
        name: profileData.name,
        email: profileData.email,
        grade: profileData.grade,
        graduationYear: parseInt(profileData.graduationYear.toString()),
        jerseyNumber: profileData.jerseyNumber,
        bio: profileData.bio,
        updatedAt: serverTimestamp(),
      });

      showToast('success', 'Profile updated successfully!');

      const updatedDoc = await getDoc(doc(db, 'players', currentUser.uid));
      if (updatedDoc.exists()) {
        setPlayer({
          id: updatedDoc.id,
          ...updatedDoc.data(),
          createdAt: updatedDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: updatedDoc.data().updatedAt?.toDate() || new Date(),
        } as Player);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Mock data for demonstration - replace with real data from Firestore
  const recentGames: Game[] = [
    { id: '1', date: new Date(2024, 2, 10), opponent: 'Springfield Central', score: 215, isPersonalBest: true, vsAverage: 13 },
    { id: '2', date: new Date(2024, 2, 8), opponent: 'Republic', score: 198, vsAverage: -4 },
    { id: '3', date: new Date(2024, 2, 5), score: 205, vsAverage: 3 },
    { id: '4', date: new Date(2024, 2, 3), opponent: 'Ozark', score: 189, vsAverage: -13 },
    { id: '5', date: new Date(2024, 1, 28), score: 207, vsAverage: 5 },
  ];

  const performanceData: DataPoint[] = [
    { label: 'Week 1', value: 185 },
    { label: 'Week 2', value: 192 },
    { label: 'Week 3', value: 189 },
    { label: 'Week 4', value: 198 },
    { label: 'Week 5', value: 205 },
    { label: 'Week 6', value: 202 },
    { label: 'Week 7', value: 210 },
    { label: 'Week 8', value: 215 },
  ];

  const achievements: AchievementData[] = [
    {
      id: '1',
      title: 'First Strike',
      description: 'Bowled your first strike in competition',
      type: 'milestone',
      isUnlocked: true,
      earnedDate: new Date(2024, 1, 15)
    },
    {
      id: '2',
      title: '200 Club',
      description: 'Bowled a game of 200 or higher',
      type: 'record',
      isUnlocked: true,
      earnedDate: new Date(2024, 2, 5)
    },
    {
      id: '3',
      title: 'Consistency King',
      description: 'Bowl 5 games within 10 pins of your average',
      type: 'streak',
      isUnlocked: false,
      progress: 60
    },
    {
      id: '4',
      title: 'Perfect Game',
      description: 'Bowl a score of 300',
      type: 'special',
      isUnlocked: false,
      progress: 0
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'stats',
      label: 'View Advanced Stats',
      icon: BarChart3,
      onClick: () => window.open(import.meta.env.VITE_STATS_APP_URL || '#', '_blank'),
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: 'schedule',
      label: 'Check Schedule',
      icon: Calendar,
      onClick: () => window.location.href = '/schedule',
      color: 'from-tiger-tiger-darkRed to-red-700'
    },
    {
      id: 'roster',
      label: 'Team Roster',
      icon: Trophy,
      onClick: () => window.location.href = '/roster',
      color: 'from-green-600 to-green-700'
    },
  ];

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: Home },
    { id: 'profile' as TabId, label: 'Profile', icon: User },
    { id: 'stats' as TabId, label: 'My Stats', icon: TrendingUp },
    { id: 'achievements' as TabId, label: 'Achievements', icon: Award, badge: achievements.filter(a => a.isUnlocked).length.toString() },
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
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Your Performance Hub
          </h1>
          <p className="text-tiger-neutral-300">
            Track progress, celebrate achievements, and keep improving
          </p>
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
            <WelcomeBanner
              playerName={player?.name || currentUser?.displayName || 'Athlete'}
              nextMatchDate={new Date(2024, 2, 15, 15, 30)}
              nextMatchOpponent="Springfield Central"
              recentImprovement={12}
            />

            <div className="grid lg:grid-cols-3 gap-6">
              <StatCard
                icon={TrendingUp}
                label="Current Average"
                value={player?.averageScore || '--'}
                subtext="Last 10 games"
                trend="up"
                trendValue="+8 pts"
                color="from-blue-600 to-blue-800"
              />
              <StatCard
                icon={Trophy}
                label="High Game"
                value={player?.highGame || '--'}
                subtext="Season best"
                color="from-tiger-tiger-gold to-yellow-600"
              />
              <StatCard
                icon={Target}
                label="Games Played"
                value={player?.gamesPlayed || 0}
                subtext="This season"
                color="from-green-600 to-green-700"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <h2 className="text-xl font-black text-tiger-primary-black mb-4">
                  Recent Games
                </h2>
                <RecentGames games={recentGames} playerAverage={player?.averageScore} />
              </Card>

              <Card>
                <h2 className="text-xl font-black text-tiger-primary-black mb-4">
                  Quick Actions
                </h2>
                <QuickActions actions={quickActions} />

                <div className="mt-6 pt-6 border-t border-tiger-neutral-200">
                  <h3 className="font-bold text-tiger-primary-black mb-3">
                    Need Help?
                  </h3>
                  <Button
                    variant="ghost"
                    size="md"
                    icon={MessageSquare}
                    fullWidth
                    onClick={() => showToast('info', 'Coach messaging coming soon!')}
                  >
                    Message Coach
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center overflow-hidden">
                    {player?.photoURL ? (
                      <img
                        src={player.photoURL}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 bg-tiger-tiger-gold text-tiger-primary-black p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-all shadow-tiger"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </div>
                {uploadingPhoto && (
                  <p className="text-sm text-tiger-neutral-600 mb-4">Uploading...</p>
                )}

                <h2 className="text-xl font-black text-tiger-primary-black mb-1">
                  {player?.name || currentUser?.displayName}
                </h2>
                <p className="text-sm text-tiger-neutral-600 mb-6">
                  {player?.grade ? `Grade ${player.grade}` : 'Athlete'}
                </p>

                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-tiger-neutral-50 to-white rounded-lg p-4 border border-tiger-neutral-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-tiger-neutral-600">Average</span>
                      <span className="text-2xl font-black text-tiger-primary-black">
                        {player?.averageScore || '--'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-tiger-neutral-50 to-white rounded-lg p-4 border border-tiger-neutral-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-tiger-neutral-600">High Game</span>
                      <span className="text-2xl font-black text-tiger-primary-black">
                        {player?.highGame || '--'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h2 className="text-2xl font-black text-tiger-primary-black mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    required
                    disabled
                    className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg bg-tiger-neutral-50 text-tiger-neutral-600"
                  />
                  <p className="mt-1 text-sm text-tiger-neutral-500">
                    Contact your coach to update your email
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                      Current Grade *
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={profileData.grade}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                    >
                      <option value="">Select grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      id="graduationYear"
                      name="graduationYear"
                      value={profileData.graduationYear}
                      onChange={handleChange}
                      required
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 4}
                      className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="jerseyNumber" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                    Jersey Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="jerseyNumber"
                    name="jerseyNumber"
                    value={profileData.jerseyNumber}
                    onChange={handleChange}
                    maxLength={3}
                    className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                    placeholder="e.g., 23"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition resize-none"
                    placeholder="Tell us about yourself, your bowling journey, or your goals..."
                  />
                  <p className="mt-1 text-sm text-tiger-neutral-500">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={saving}
                  icon={Save}
                  fullWidth
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-black text-tiger-primary-black mb-6">
                Performance Timeline
              </h2>
              <ProgressChart
                data={performanceData}
                showTrend={true}
                height={300}
                color="tiger-primary-black"
              />
              <p className="text-sm text-tiger-neutral-600 mt-4">
                Your average has improved by 30 points over the last 8 weeks. Keep up the great work!
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <h3 className="font-bold text-tiger-primary-black mb-3">
                  vs Team Average
                </h3>
                <div className="flex items-end gap-4 mb-4">
                  <div>
                    <div className="text-sm text-tiger-neutral-600 mb-1">You</div>
                    <div className="text-4xl font-black text-green-600">{player?.averageScore || '--'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-tiger-neutral-600 mb-1">Team</div>
                    <div className="text-4xl font-black text-tiger-neutral-400">202</div>
                  </div>
                </div>
                <p className="text-sm text-green-600 font-semibold">
                  +{(player?.averageScore || 202) - 202} above team average
                </p>
              </Card>

              <Card>
                <h3 className="font-bold text-tiger-primary-black mb-3">
                  Personal Bests
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tiger-neutral-600">High Game</span>
                    <span className="font-black text-tiger-primary-black">{player?.highGame || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tiger-neutral-600">High Series</span>
                    <span className="font-black text-tiger-primary-black">645</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tiger-neutral-600">Most Strikes</span>
                    <span className="font-black text-tiger-primary-black">9</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-tiger-primary-black mb-3">
                  Season Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tiger-neutral-600">Games Played</span>
                    <span className="font-black text-tiger-primary-black">{player?.gamesPlayed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tiger-neutral-600">Avg Improvement</span>
                    <span className="font-black text-green-600">+30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-tiger-neutral-600">200+ Games</span>
                    <span className="font-black text-tiger-primary-black">12</span>
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
                  View Full Stats
                </Button>
              </div>
              <p className="text-tiger-neutral-600">
                Access detailed frame-by-frame analysis, strike percentage, spare conversion rate, and more in the advanced stats application.
              </p>
            </Card>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-black text-tiger-primary-black mb-2">
                Your Achievements
              </h2>
              <p className="text-tiger-neutral-600 mb-6">
                Unlock badges and milestones by improving your game and reaching new goals
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Achievement
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                    showProgress={true}
                  />
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <StatCard
                icon={Award}
                label="Total Unlocked"
                value={achievements.filter(a => a.isUnlocked).length.toString()}
                subtext={`of ${achievements.length} total`}
                color="from-tiger-tiger-gold to-yellow-600"
              />
              <StatCard
                icon={Trophy}
                label="In Progress"
                value={achievements.filter(a => !a.isUnlocked && (a.progress || 0) > 0).length.toString()}
                subtext="Almost there!"
                color="from-blue-600 to-blue-800"
              />
              <StatCard
                icon={Target}
                label="Latest Achievement"
                value="200 Club"
                subtext="2 days ago"
                color="from-purple-600 to-purple-700"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
