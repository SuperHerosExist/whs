import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Player } from '@/types';
import { Users, ChevronRight } from 'lucide-react';

export const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersRef = collection(db, 'players');
        const q = query(
          playersRef,
          where('programId', '==', 'willard-tigers'),
          where('isActive', '==', true),
          orderBy('averageScore', 'desc')
        );

        const snapshot = await getDocs(q);
        const playersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Player[];

        setPlayers(playersData);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 to-white flex items-center justify-center">
        <div className="text-7xl animate-spin">🎳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100">
      {/* 🏆 BOLD HEADER */}
      <section className="bg-gradient-to-br from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <Users className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-6xl md:text-7xl font-black">
                TEAM ROSTER
              </h1>
              <p className="text-2xl md:text-3xl text-willard-grey-300 mt-2 font-bold">
                Meet our amazing bowlers 🎳
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 DYNAMIC PLAYER CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {players.map((player) => (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className="bg-white rounded-3xl p-8 shadow-tiger-lg hover:shadow-tiger-2xl hover:-translate-y-4 transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Bowling pin decoration */}
              <div className="absolute top-2 right-2 text-6xl opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
                🎳
              </div>

              <div className="flex items-start gap-6 mb-6">
                {/* Player Photo/Emoji */}
                <div className="text-8xl group-hover:scale-125 transition-transform">
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
                  <h3 className="text-3xl font-black text-willard-black mb-2 group-hover:scale-105 transition-transform">
                    {player.name}
                  </h3>
                  <div className="inline-block bg-gradient-to-r from-willard-grey-800 to-willard-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-tiger">
                    Grade {player.grade}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-willard-grey-100 to-willard-grey-200 rounded-2xl p-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-willard-grey-600 uppercase tracking-wide">
                      Average
                    </span>
                    <span className="font-black text-willard-black text-3xl">
                      {player.averageScore || 0}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-2xl p-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-willard-grey-600 uppercase tracking-wide">
                      High Game
                    </span>
                    <span className="font-black text-willard-grey-800 text-3xl">
                      {player.highGame || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Button */}
              <div className="mt-6 pt-6 border-t-2 border-willard-grey-200">
                <button className="text-willard-black text-sm font-black hover:text-willard-grey-700 flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-wide">
                  View Full Stats
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {players.length === 0 && (
          <div className="text-center py-20">
            <div className="text-9xl mb-6">🎳</div>
            <h3 className="text-3xl font-black text-willard-grey-700 mb-4">
              No Players Yet
            </h3>
            <p className="text-xl text-willard-grey-500">
              Check back soon to meet our team!
            </p>
          </div>
        )}
      </section>

      {/* 🔥 PLAYER DETAIL MODAL */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6 z-50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-tiger-2xl transform scale-100 animate-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player Info */}
            <div className="text-center mb-8">
              <div className="text-9xl mb-6">
                {selectedPlayer.photoURL ? (
                  <img
                    src={selectedPlayer.photoURL}
                    alt={selectedPlayer.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto shadow-tiger-xl"
                  />
                ) : (
                  '🎯'
                )}
              </div>
              <h3 className="text-5xl font-black text-willard-black mb-4">
                {selectedPlayer.name}
              </h3>
              <div className="inline-block bg-gradient-to-r from-willard-grey-900 to-willard-black text-white px-6 py-3 rounded-full font-black text-lg shadow-tiger-lg">
                Grade {selectedPlayer.grade}
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black text-white rounded-3xl p-8 shadow-tiger-xl">
                <div className="text-sm font-bold mb-2 opacity-90 uppercase tracking-wide">
                  🎯 Bowling Average
                </div>
                <div className="text-6xl font-black">
                  {selectedPlayer.averageScore || 0}
                </div>
              </div>

              <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 text-white rounded-3xl p-8 shadow-tiger-xl">
                <div className="text-sm font-bold mb-2 opacity-90 uppercase tracking-wide">
                  🔥 High Game
                </div>
                <div className="text-6xl font-black">
                  {selectedPlayer.highGame || 0}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-willard-grey-700 to-willard-grey-800 text-white rounded-3xl p-6 shadow-tiger-lg">
                  <div className="text-xs font-bold mb-1 opacity-90 uppercase tracking-wide">
                    Games
                  </div>
                  <div className="text-4xl font-black">
                    {selectedPlayer.gamesPlayed || 0}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-willard-grey-600 to-willard-grey-700 text-white rounded-3xl p-6 shadow-tiger-lg">
                  <div className="text-xs font-bold mb-1 opacity-90 uppercase tracking-wide">
                    Year
                  </div>
                  <div className="text-4xl font-black">
                    {selectedPlayer.grade}th
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPlayer(null)}
              className="mt-8 w-full bg-gradient-to-r from-willard-black to-willard-grey-800 text-white py-5 rounded-2xl font-black text-xl hover:shadow-tiger-xl transition-all hover:scale-105"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
