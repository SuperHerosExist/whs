import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Player } from '@/types';
import { User, Camera, Save, Trophy, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlayerProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    hometown: '',
    favoriteQuote: '',
    bowlingGoals: '',
    jerseyNumber: '',
  });

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!currentUser) {
        navigate('/signin');
        return;
      }

      try {
        // Find player by UID
        const playerRef = doc(db, 'players', currentUser.uid);
        const playerSnap = await getDoc(playerRef);

        if (playerSnap.exists()) {
          const playerData = {
            id: playerSnap.id,
            ...playerSnap.data(),
            createdAt: playerSnap.data().createdAt?.toDate() || new Date(),
            updatedAt: playerSnap.data().updatedAt?.toDate() || new Date(),
          } as Player;

          setPlayer(playerData);
          setFormData({
            bio: playerData.bio || '',
            hometown: playerData.hometown || '',
            favoriteQuote: playerData.favoriteQuote || '',
            bowlingGoals: playerData.bowlingGoals || '',
            jerseyNumber: playerData.jerseyNumber || '',
          });
        }
      } catch (error) {
        console.error('Error fetching player:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [currentUser, navigate]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !player) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `players/${player.id}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      const playerRef = doc(db, 'players', player.id);
      await updateDoc(playerRef, {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      setPlayer({ ...player, photoURL });
      alert('Photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player) return;

    setSaving(true);
    try {
      const playerRef = doc(db, 'players', player.id);
      await updateDoc(playerRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });

      setPlayer({ ...player, ...formData });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 to-white flex items-center justify-center">
        <div className="text-7xl animate-spin">🎳</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">🎳</div>
          <h2 className="text-3xl font-black text-willard-grey-700 mb-4">
            No Player Profile Found
          </h2>
          <p className="text-xl text-willard-grey-500 mb-8">
            Please contact your coach to create your player profile.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-willard-black to-willard-grey-800 text-white px-8 py-4 rounded-2xl font-black text-xl hover:shadow-tiger-xl transition-all"
          >
            GO TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">
      {/* Header */}
      <section className="bg-gradient-to-br from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <User className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-6xl md:text-7xl font-black">
                MY PROFILE
              </h1>
              <p className="text-2xl md:text-3xl text-willard-grey-300 mt-2 font-bold">
                Manage your information 🎯
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-tiger-xl sticky top-8">
              {/* Photo */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {player.photoURL ? (
                    <img
                      src={player.photoURL}
                      alt={player.name}
                      className="w-40 h-40 rounded-full object-cover shadow-tiger-xl mx-auto"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gradient-to-br from-willard-grey-800 to-willard-black rounded-full flex items-center justify-center text-6xl shadow-tiger-xl mx-auto">
                      🎯
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 bg-willard-black text-white p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-tiger-lg"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
                {uploading && (
                  <p className="text-sm text-willard-grey-600 mt-2">
                    Uploading...
                  </p>
                )}
              </div>

              <h2 className="text-3xl font-black text-willard-black mb-2 text-center">
                {player.name}
              </h2>
              <div className="flex justify-center gap-2 mb-6">
                <div className="inline-block bg-gradient-to-r from-willard-grey-800 to-willard-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-tiger">
                  Grade {player.grade}
                </div>
                {player.jerseyNumber && (
                  <div className="inline-block bg-gradient-to-r from-willard-grey-600 to-willard-grey-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-tiger">
                    #{player.jerseyNumber}
                  </div>
                )}
              </div>

              {/* Stats - Read Only */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black text-white rounded-3xl p-6 shadow-tiger-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-bold opacity-90 uppercase tracking-wide">
                      Bowling Average
                    </span>
                  </div>
                  <div className="text-5xl font-black">
                    {player.averageScore || player.average || 0}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 text-white rounded-3xl p-4 shadow-tiger-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Trophy className="w-3 h-3" />
                      <span className="text-xs font-bold opacity-90 uppercase">
                        High Game
                      </span>
                    </div>
                    <div className="text-4xl font-black">
                      {player.highGame || 0}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-willard-grey-700 to-willard-grey-800 text-white rounded-3xl p-4 shadow-tiger-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-bold opacity-90 uppercase">
                        High Series
                      </span>
                    </div>
                    <div className="text-4xl font-black">
                      {player.highSeries || 0}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-willard-grey-100 to-willard-grey-200 rounded-3xl p-4 shadow-inner">
                  <div className="text-xs font-bold text-willard-grey-600 uppercase mb-1">
                    Games Played
                  </div>
                  <div className="text-3xl font-black text-willard-black">
                    {player.gamesPlayed || 0}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-willard-grey-50 rounded-2xl">
                <p className="text-xs text-willard-grey-600">
                  <strong>Note:</strong> Stats are automatically synced from the bowling stats app and cannot be edited here.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-tiger-xl">
                <h3 className="text-3xl font-black text-willard-black mb-6">
                  Profile Information
                </h3>

                {/* Jersey Number */}
                <div className="mb-6">
                  <label className="block text-sm font-black text-willard-grey-700 uppercase tracking-wide mb-2">
                    Jersey Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.jerseyNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, jerseyNumber: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl border-2 border-willard-grey-300 focus:border-willard-black focus:outline-none font-bold text-lg"
                    placeholder="12"
                  />
                </div>

                {/* Hometown */}
                <div className="mb-6">
                  <label className="block text-sm font-black text-willard-grey-700 uppercase tracking-wide mb-2">
                    Hometown (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.hometown}
                    onChange={(e) =>
                      setFormData({ ...formData, hometown: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl border-2 border-willard-grey-300 focus:border-willard-black focus:outline-none font-bold text-lg"
                    placeholder="Willard, MO"
                  />
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-black text-willard-grey-700 uppercase tracking-wide mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-willard-grey-300 focus:border-willard-black focus:outline-none font-bold text-lg resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Favorite Quote */}
                <div className="mb-6">
                  <label className="block text-sm font-black text-willard-grey-700 uppercase tracking-wide mb-2">
                    Favorite Quote (Optional)
                  </label>
                  <textarea
                    value={formData.favoriteQuote}
                    onChange={(e) =>
                      setFormData({ ...formData, favoriteQuote: e.target.value })
                    }
                    rows={2}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-willard-grey-300 focus:border-willard-black focus:outline-none font-bold text-lg resize-none"
                    placeholder="Your favorite motivational quote..."
                  />
                </div>

                {/* Bowling Goals */}
                <div className="mb-6">
                  <label className="block text-sm font-black text-willard-grey-700 uppercase tracking-wide mb-2">
                    Bowling Goals (Optional)
                  </label>
                  <textarea
                    value={formData.bowlingGoals}
                    onChange={(e) =>
                      setFormData({ ...formData, bowlingGoals: e.target.value })
                    }
                    rows={3}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-willard-grey-300 focus:border-willard-black focus:outline-none font-bold text-lg resize-none"
                    placeholder="What are your bowling goals for this season?"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-willard-black to-willard-grey-800 text-white py-5 rounded-2xl font-black text-xl hover:shadow-tiger-xl transition-all hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    'SAVING...'
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      SAVE PROFILE
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
