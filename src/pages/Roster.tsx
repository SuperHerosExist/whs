import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import { getAllPlayerStats } from '@/lib/statsCalculator';
import type { Player } from '@/types';
import { Users, ChevronRight } from 'lucide-react';
// import { WillardLogo } from '@/components/WillardLogo';

export const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Fetch calculated stats to supplement player data
        const calculatedStats = await getAllPlayerStats();
        console.log('📊 Calculated stats received:', calculatedStats);
        const statsMap = new Map();
        calculatedStats.forEach(stat => {
          console.log(`   Player ${stat.playerName}: avg=${stat.average}, high=${stat.highGame}, games=${stat.games}`);
          statsMap.set(stat.playerId, stat);
        });

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
              const calculatedStat = statsMap.get(playerId);

              // Use calculated stats if available, otherwise fall back to stored data
              const playerObj = {
                id: playerSnap.id,
                uid: data.uid || playerSnap.id,
                name: data.name || 'Unknown Player',
                email: data.email || '',
                grade: data.grade || '',
                graduationYear: data.graduationYear || new Date().getFullYear(),
                averageScore: calculatedStat?.average || data.average || 0,
                highGame: calculatedStat?.highGame || data.highGame || 0,
                gamesPlayed: calculatedStat?.games || data.gamesPlayed || 0,
                programId: 'willard-tigers',
                teamIds: data.teamIds || [STATS_TEAM_ID],
                isActive: data.isActive !== false,
                photoURL: data.photoURL || null,
                jerseyNumber: data.jerseyNumber || '',
                bio: data.bio || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              };
              console.log(`   👤 Player ${playerObj.name}: avg=${playerObj.averageScore}, high=${playerObj.highGame}, games=${playerObj.gamesPlayed}`);
              playersData.push(playerObj);
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

      {/* 👥 PLAYERS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {players.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎳</div>
            <p className="text-2xl text-willard-grey-600 font-bold">No players found</p>
            <p className="text-willard-grey-500 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-2xl shadow-tiger-lg hover:shadow-tiger-2xl transition-all hover:scale-105 overflow-hidden cursor-pointer"
                onClick={() => setSelectedPlayer(player)}
              >
                {/* Player Header */}
                <div className="bg-gradient-to-br from-willard-black to-willard-grey-900 text-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
                      {player.jerseyNumber || player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{player.name}</h3>
                      {player.grade && (
                        <p className="text-willard-grey-300 text-sm font-semibold">
                          Grade {player.grade}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-black text-willard-black">
                        {player.averageScore || '-'}
                      </div>
                      <div className="text-xs text-willard-grey-600 font-semibold uppercase">
                        Average
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-willard-black">
                        {player.highGame || '-'}
                      </div>
                      <div className="text-xs text-willard-grey-600 font-semibold uppercase">
                        High Game
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-willard-black">
                        {player.gamesPlayed || 0}
                      </div>
                      <div className="text-xs text-willard-grey-600 font-semibold uppercase">
                        Games
                      </div>
                    </div>
                  </div>

                  {player.bio && (
                    <p className="text-sm text-willard-grey-700 leading-relaxed line-clamp-2">
                      {player.bio}
                    </p>
                  )}

                  <button className="mt-4 w-full bg-willard-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-willard-grey-900 transition flex items-center justify-center gap-2">
                    View Profile
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-willard-black to-willard-grey-900 text-white p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-black shadow-xl">
                  {selectedPlayer.jerseyNumber || selectedPlayer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-2">{selectedPlayer.name}</h2>
                  {selectedPlayer.grade && (
                    <p className="text-willard-grey-300 text-lg font-semibold">
                      Grade {selectedPlayer.grade}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-willard-grey-50 rounded-xl">
                  <div className="text-4xl font-black text-willard-black mb-2">
                    {selectedPlayer.averageScore || '-'}
                  </div>
                  <div className="text-sm text-willard-grey-600 font-semibold uppercase">
                    Average Score
                  </div>
                </div>
                <div className="text-center p-4 bg-willard-grey-50 rounded-xl">
                  <div className="text-4xl font-black text-willard-black mb-2">
                    {selectedPlayer.highGame || '-'}
                  </div>
                  <div className="text-sm text-willard-grey-600 font-semibold uppercase">
                    High Game
                  </div>
                </div>
                <div className="text-center p-4 bg-willard-grey-50 rounded-xl">
                  <div className="text-4xl font-black text-willard-black mb-2">
                    {selectedPlayer.gamesPlayed || 0}
                  </div>
                  <div className="text-sm text-willard-grey-600 font-semibold uppercase">
                    Games Played
                  </div>
                </div>
              </div>

              {selectedPlayer.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-black text-willard-black mb-3">About</h3>
                  <p className="text-willard-grey-700 leading-relaxed">{selectedPlayer.bio}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedPlayer(null)}
                className="w-full bg-willard-black text-white py-3 px-6 rounded-lg font-bold hover:bg-willard-grey-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
