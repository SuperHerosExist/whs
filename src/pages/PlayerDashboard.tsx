import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Player } from '@/types';
import { User, Camera, Save, TrendingUp, Trophy, BarChart3 } from 'lucide-react';

export const PlayerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Photo must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file');
      return;
    }

    setUploadingPhoto(true);
    setErrorMessage('');

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `player-profiles/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Update Firestore
      await updateDoc(doc(db, 'players', currentUser.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      if (player) {
        setPlayer({ ...player, photoURL });
      }

      setSuccessMessage('Photo uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMessage('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setErrorMessage('');

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

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh player data
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
      setErrorMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

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
      <section className="bg-tiger-primary-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-black mb-2">
            Player Dashboard
          </h1>
          <p className="text-tiger-neutral-300">
            Welcome back, {player?.name || currentUser?.displayName}!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-tiger-lg p-6 sticky top-24">
              {/* Profile Photo */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
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
                  <p className="mt-2 text-sm text-tiger-neutral-600">Uploading...</p>
                )}
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-display font-black text-tiger-primary-black mb-1">
                  {player?.name || currentUser?.displayName}
                </h2>
                <p className="text-sm text-tiger-neutral-600">
                  {player?.grade ? `Grade ${player.grade}` : 'Player'}
                </p>
              </div>

              {/* Stats Summary */}
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-tiger-neutral-50 to-white rounded-lg p-4 border border-tiger-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-tiger-neutral-600 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-tiger-tiger-darkRed" />
                      Average
                    </span>
                    <span className="text-2xl font-display font-black text-tiger-primary-black">
                      {player?.averageScore || '--'}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-tiger-neutral-50 to-white rounded-lg p-4 border border-tiger-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-tiger-neutral-600 flex items-center">
                      <Trophy className="w-4 h-4 mr-2 text-tiger-tiger-gold" />
                      High Game
                    </span>
                    <span className="text-2xl font-display font-black text-tiger-primary-black">
                      {player?.highGame || '--'}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-tiger-neutral-50 to-white rounded-lg p-4 border border-tiger-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-tiger-neutral-600 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                      Games Played
                    </span>
                    <span className="text-2xl font-display font-black text-tiger-primary-black">
                      {player?.gamesPlayed || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Advanced Stats Link */}
              <div className="mt-6 pt-6 border-t border-tiger-neutral-200">
                <a
                  href={import.meta.env.VITE_STATS_APP_URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-3 bg-tiger-primary-black text-white font-semibold rounded-lg hover:bg-tiger-neutral-800 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 inline mr-2" />
                  View Advanced Stats
                </a>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-tiger-lg p-8">
              <h2 className="text-2xl font-display font-black text-tiger-primary-black mb-6">
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
                    className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition bg-tiger-neutral-50"
                    disabled
                  />
                  <p className="mt-1 text-sm text-tiger-neutral-500">
                    Email cannot be changed. Contact your coach if you need to update this.
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

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-tiger-primary-black text-white py-4 rounded-lg font-bold hover:bg-tiger-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
