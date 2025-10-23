import React, { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Player } from '@/types';
import { X, Save, User } from 'lucide-react';

interface EditPlayerModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  player,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: player.name,
    grade: player.grade,
    graduationYear: player.graduationYear,
    jerseyNumber: player.jerseyNumber || '',
    bio: player.bio || '',
    isActive: player.isActive,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Update form data when player prop changes
  useEffect(() => {
    setFormData({
      name: player.name,
      grade: player.grade,
      graduationYear: player.graduationYear,
      jerseyNumber: player.jerseyNumber || '',
      bio: player.bio || '',
      isActive: player.isActive,
    });
  }, [player]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const playerRef = doc(db, 'players', player.id);

      await updateDoc(playerRef, {
        name: formData.name,
        grade: formData.grade,
        graduationYear: parseInt(formData.graduationYear.toString()),
        jerseyNumber: formData.jerseyNumber || null,
        bio: formData.bio,
        isActive: formData.isActive,
        updatedAt: serverTimestamp(),
      });

      onSave();
      onClose();
    } catch (err) {
      console.error('Error updating player:', err);
      setError('Failed to update player. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-tiger-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tiger-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center">
              {player.photoURL ? (
                <img
                  src={player.photoURL}
                  alt={player.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-display font-black text-tiger-primary-black">
              Edit Player Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-tiger-neutral-600 hover:text-tiger-primary-black hover:bg-tiger-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Player Info */}
          <div className="bg-tiger-neutral-50 rounded-lg p-4">
            <p className="text-sm text-tiger-neutral-600">
              <strong>Email:</strong> {player.email}
            </p>
            <p className="text-sm text-tiger-neutral-600 mt-1">
              <strong>Player ID:</strong> {player.id}
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
            />
          </div>

          {/* Grade and Graduation Year */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                Current Grade *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
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
                value={formData.graduationYear}
                onChange={handleChange}
                required
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 10}
                className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Jersey Number */}
          <div>
            <label htmlFor="jerseyNumber" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Jersey Number (Optional)
            </label>
            <input
              type="text"
              id="jerseyNumber"
              name="jerseyNumber"
              value={formData.jerseyNumber}
              onChange={handleChange}
              maxLength={3}
              className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              placeholder="e.g., 42"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
              Bio (Optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition resize-none"
              placeholder="About this player..."
            />
            <p className="mt-1 text-sm text-tiger-neutral-500">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-4 bg-tiger-neutral-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-tiger-primary-black focus:ring-tiger-primary-black rounded"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-tiger-neutral-700 cursor-pointer">
              Player is Active (unchecking will hide player from public roster)
            </label>
          </div>

          {/* Stats Display (Read-only) */}
          <div className="border-t border-tiger-neutral-200 pt-6">
            <h3 className="text-lg font-bold text-tiger-primary-black mb-4">
              Player Statistics (Read-only)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-tiger-neutral-50 rounded-lg p-4 text-center">
                <p className="text-sm text-tiger-neutral-600 mb-1">Average</p>
                <p className="text-2xl font-display font-black text-tiger-primary-black">
                  {player.averageScore || '--'}
                </p>
              </div>
              <div className="bg-tiger-neutral-50 rounded-lg p-4 text-center">
                <p className="text-sm text-tiger-neutral-600 mb-1">High Game</p>
                <p className="text-2xl font-display font-black text-tiger-primary-black">
                  {player.highGame || '--'}
                </p>
              </div>
              <div className="bg-tiger-neutral-50 rounded-lg p-4 text-center">
                <p className="text-sm text-tiger-neutral-600 mb-1">Games</p>
                <p className="text-2xl font-display font-black text-tiger-primary-black">
                  {player.gamesPlayed || 0}
                </p>
              </div>
            </div>
            <p className="text-xs text-tiger-neutral-500 mt-3 text-center">
              Stats are synced from the Stats app and cannot be edited here
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-tiger-neutral-300 text-tiger-neutral-700 font-bold rounded-lg hover:bg-tiger-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-tiger-primary-black text-white font-bold rounded-lg hover:bg-tiger-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
