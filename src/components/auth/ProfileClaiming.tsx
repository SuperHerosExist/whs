import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Player } from '@/types';
import { UserPlus, Check, X } from 'lucide-react';

interface ProfileClaimingProps {
  onProfileClaimed: () => void;
}

export const ProfileClaiming: React.FC<ProfileClaimingProps> = ({ onProfileClaimed }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [unclaimedPlayers, setUnclaimedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchUnclaimedPlayers = async () => {
      try {
        const playersRef = collection(db, 'players');
        const q = query(
          playersRef,
          where('programId', '==', 'willard-tigers'),
          where('isActive', '==', true),
          where('isClaimed', '==', false)
        );

        const snapshot = await getDocs(q);
        const players = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Player[];

        setUnclaimedPlayers(players);
      } catch (error) {
        console.error('Error fetching unclaimed players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnclaimedPlayers();
  }, []);

  const handleClaimProfile = async (player: Player) => {
    if (!currentUser) return;

    setClaiming(true);
    try {
      // Update player document
      const playerRef = doc(db, 'players', player.id);
      await updateDoc(playerRef, {
        uid: currentUser.uid,
        isClaimed: true,
        email: currentUser.email,
        updatedAt: serverTimestamp(),
      });

      // Update user role to player
      await updateUserProfile({ role: 'player' });

      onProfileClaimed();
    } catch (error) {
      console.error('Error claiming profile:', error);
      alert('Failed to claim profile. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 to-white flex items-center justify-center">
        <div className="text-7xl animate-spin">🎳</div>
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
              <UserPlus className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-6xl md:text-7xl font-black">
                CLAIM YOUR PROFILE
              </h1>
              <p className="text-2xl md:text-3xl text-willard-grey-300 mt-2 font-bold">
                Find yourself and join the team! 🎳
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Player Selection */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 shadow-tiger-xl mb-8">
          <h2 className="text-3xl font-black text-willard-black mb-4">
            Welcome, {currentUser?.displayName}!
          </h2>
          <p className="text-xl text-willard-grey-700">
            Select your player profile below to link it to your account. This will give you access to your stats, achievements, and more!
          </p>
        </div>

        {unclaimedPlayers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-9xl mb-6">🎳</div>
            <h3 className="text-3xl font-black text-willard-grey-700 mb-4">
              No Unclaimed Profiles
            </h3>
            <p className="text-xl text-willard-grey-500 mb-8">
              All player profiles have been claimed. If you're a new player,
              please contact your coach to create your profile.
            </p>
            <button
              onClick={onProfileClaimed}
              className="bg-gradient-to-r from-willard-black to-willard-grey-800 text-white px-8 py-4 rounded-2xl font-black text-xl hover:shadow-tiger-xl transition-all"
            >
              CONTINUE
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {unclaimedPlayers.map((player) => (
              <div
                key={player.id}
                className={`bg-white rounded-3xl p-8 shadow-tiger-lg hover:shadow-tiger-2xl transition-all cursor-pointer border-4 ${
                  selectedPlayer?.id === player.id
                    ? 'border-willard-black'
                    : 'border-transparent'
                }`}
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="text-8xl">
                    {player.photoURL ? (
                      <img
                        src={player.photoURL}
                        alt={player.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-willard-grey-800 to-willard-black rounded-full flex items-center justify-center text-4xl">
                        🎯
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-willard-black mb-2">
                      {player.name}
                    </h3>
                    <div className="inline-block bg-gradient-to-r from-willard-grey-800 to-willard-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-tiger">
                      Grade {player.grade}
                    </div>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-willard-grey-100 to-willard-grey-200 rounded-2xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-willard-grey-600 uppercase">
                        Average
                      </span>
                      <span className="font-black text-willard-black text-2xl">
                        {player.averageScore || player.average || 0}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-2xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-willard-grey-600 uppercase">
                        High Game
                      </span>
                      <span className="font-black text-willard-grey-800 text-2xl">
                        {player.highGame || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                {selectedPlayer?.id === player.id && (
                  <div className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-2xl font-black text-center flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    SELECTED
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Claim Button */}
        {selectedPlayer && (
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => handleClaimProfile(selectedPlayer)}
              disabled={claiming}
              className="bg-gradient-to-r from-willard-black to-willard-grey-800 text-white px-12 py-6 rounded-2xl font-black text-2xl hover:shadow-tiger-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {claiming ? 'CLAIMING...' : `CLAIM ${selectedPlayer.name.toUpperCase()}'S PROFILE`}
            </button>
            <button
              onClick={() => setSelectedPlayer(null)}
              className="bg-gradient-to-r from-willard-grey-300 to-willard-grey-400 text-willard-black px-8 py-6 rounded-2xl font-black text-2xl hover:shadow-tiger-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Skip Option */}
        <div className="mt-8 text-center">
          <button
            onClick={onProfileClaimed}
            className="text-willard-grey-600 hover:text-willard-black font-bold text-lg underline"
          >
            Skip for now
          </button>
        </div>
      </section>
    </div>
  );
};
