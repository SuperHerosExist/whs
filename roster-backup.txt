import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import type { Player } from '@/types';
import { Users, ChevronRight } from 'lucide-react';
import { WillardLogo } from '@/components/WillardLogo';

export const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // First, get the team document to access playerIds array
        const teamRef = doc(statsDb, 'teams', STATS_TEAM_ID);
        const teamSnap = await getDoc(teamRef);

        if (!teamSnap.exists()) {
          console.error('❌ Team not found');
          setLoading(false);
          return;
        }

        const teamData = teamSnap.data();
        const playerIds = teamData?.playerIds || [];

        // Fetch each player individually by ID
        const playersData: Player[] = [];
        for (const playerId of playerIds) {
          try {
            const playerRef = doc(statsDb, 'players', playerId);
            const playerSnap = await getDoc(playerRef);

            if (playerSnap.exists()) {
              const data = playerSnap.data();
              playersData.push({
                id: playerSnap.id,
                uid: data.uid || playerSnap.id,
                name: data.name || 'Unknown Player',
                email: data.email || '',
                grade: data.grade || '',
                graduationYear: data.graduationYear || new Date().getFullYear(),
                averageScore: data.average || 0,
                highGame: data.highGame || 0,
                gamesPlayed: data.gamesPlayed || 0,
                programId: 'willard-tigers',
                teamIds: data.teamIds || [STATS_TEAM_ID],
                isActive: data.isActive !== false,
                photoURL: data.photoURL || null,
                jerseyNumber: data.jerseyNumber || '',
                bio: data.bio || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              });
            }
          } catch (playerError) {
            console.warn(`⚠️  Could not fetch player ${playerId}:`, playerError);
          }
        }

        // Sort by average score descending
        playersData.sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));

        setPlayers(playersData);
        console.log(`✅ Loaded ${playersData.length} players from Stats app (Team: ${STATS_TEAM_ID})`);
      } catch (error) {
        console.error('❌ Error fetching players from Stats app:', error);
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
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-wider mb-8">TEAM ROSTER
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
                {/* Player Photo or Willard Logo */}
                <div className="group-hover:scale-110 transition-transform">
                  {player.photoURL ? (
                    <img
                      src={player.photoURL}
                      alt={player.name}
                      className="w-20 h-20 rounded-full object-cover shadow-tiger-lg"
                    />
                  ) : (
                    <WillardLogo size={80} className="shadow-tiger-lg" />
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
                      {player.averageScore > 0 ? player.averageScore : (
                        <span className="text-lg text-willard-grey-400">Pre-Season</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-2xl p-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-willard-grey-600 uppercase tracking-wide">
                      High Game
                    </span>
                    <span className="font-black text-willard-grey-800 text-3xl">
                      {player.highGame > 0 ? player.highGame : (
                        <span className="text-lg text-willard-grey-400">Pre-Season</span>
                      )}
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
              <div className="mb-6 flex justify-center">
                {selectedPlayer.photoURL ? (
                  <img
                    src={selectedPlayer.photoURL}
                    alt={selectedPlayer.name}
                    className="w-32 h-32 rounded-full object-cover shadow-tiger-xl"
                  />
                ) : (
                  <WillardLogo size={128} className="shadow-tiger-xl" />
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
                  {selectedPlayer.averageScore > 0 ? selectedPlayer.averageScore : (
                    <span className="text-3xl opacity-60">Pre-Season</span>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 text-white rounded-3xl p-8 shadow-tiger-xl">
                <div className="text-sm font-bold mb-2 opacity-90 uppercase tracking-wide">
                  🔥 High Game
                </div>
                <div className="text-6xl font-black">
                  {selectedPlayer.highGame > 0 ? selectedPlayer.highGame : (
                    <span className="text-3xl opacity-60">Pre-Season</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-willard-grey-700 to-willard-grey-800 text-white rounded-3xl p-6 shadow-tiger-lg">
                  <div className="text-xs font-bold mb-1 opacity-90 uppercase tracking-wide">
                    Games
                  </div>
                  <div className="text-4xl font-black">
                    {selectedPlayer.gamesPlayed > 0 ? selectedPlayer.gamesPlayed : (
                      <span className="text-2xl opacity-60">0</span>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-willard-grey-600 to-willard-grey-700 text-white rounded-3xl p-6 shadow-tiger-lg">
                  <div className="text-xs font-bold mb-1 opacity-90 uppercase tracking-wide">
                    Grade
                  </div>
                  <div className="text-4xl font-black">
                    {selectedPlayer.grade ? `${selectedPlayer.grade}` : 'N/A'}
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
