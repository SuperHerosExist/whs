import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { statsDb, STATS_TEAM_ID } from '@/lib/statsFirebase';
import { getAllPlayerStats, type PlayerGameStats } from '@/lib/statsCalculator';
import type { Player } from '@/types';
import { ArrowUpDown, ArrowUp, ArrowDown, Medal } from 'lucide-react';

type SortField = 'name' | 'average' | 'highGame' | 'highSeries';
type SortDirection = 'asc' | 'desc';

export const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerStatsMap, setPlayerStatsMap] = useState<Map<string, PlayerGameStats>>(new Map());
  const [sortField, setSortField] = useState<SortField>('average');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Fetch calculated stats to supplement player data
        const calculatedStats = await getAllPlayerStats();
        console.log('📊 Calculated stats received:', calculatedStats);
        const statsMap = new Map<string, PlayerGameStats>();
        calculatedStats.forEach(stat => {
          console.log(`   Player ${stat.playerName}: avg=${stat.average}, high=${stat.highGame}, games=${stat.games}`);
          statsMap.set(stat.playerId, stat);
        });
        setPlayerStatsMap(statsMap);

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

  // Sorting function
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending for stats, ascending for name
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  // Get sorted players
  const sortedPlayers = [...players].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sortField) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'average':
        aVal = a.averageScore || 0;
        bVal = b.averageScore || 0;
        break;
      case 'highGame':
        aVal = a.highGame || 0;
        bVal = b.highGame || 0;
        break;
      case 'highSeries':
        // Get high series from playerStatsMap
        aVal = playerStatsMap.get(a.id)?.highSeries || 0;
        bVal = playerStatsMap.get(b.id)?.highSeries || 0;
        break;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
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
      {/* 🏆 BOLD HEADER */}
      <section className="bg-gradient-to-br from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <img
                src="/assets/logos/tiger-logo.jpg"
                alt="Willard Tigers"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-wider">TEAM ROSTER</h1>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 PLAYERS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {players.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎳</div>
            <p className="text-2xl text-willard-grey-600 font-bold">No players found</p>
            <p className="text-willard-grey-500 mt-2">Check back soon!</p>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white rounded-2xl shadow-tiger-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-willard-black to-willard-grey-900 text-white">
                  <tr>
                    <th className="text-left py-4 px-6">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 font-black text-sm uppercase tracking-wider hover:text-willard-grey-300 transition"
                      >
                        Player
                        <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider">
                        Medals
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <button
                        onClick={() => handleSort('average')}
                        className="flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider hover:text-willard-grey-300 transition mx-auto"
                      >
                        Average
                        <SortIcon field="average" />
                      </button>
                    </th>
                    <th className="text-center py-4 px-4">
                      <button
                        onClick={() => handleSort('highGame')}
                        className="flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider hover:text-willard-grey-300 transition mx-auto"
                      >
                        High Game
                        <SortIcon field="highGame" />
                      </button>
                    </th>
                    <th className="text-center py-4 px-4">
                      <button
                        onClick={() => handleSort('highSeries')}
                        className="flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider hover:text-willard-grey-300 transition mx-auto"
                      >
                        High Series
                        <SortIcon field="highSeries" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-willard-grey-200">
                  {sortedPlayers.map((player) => {
                    const playerStats = playerStatsMap.get(player.id);
                    const totalBronze = (playerStats?.gamesOver25 || 0) + (playerStats?.seriesOver25 || 0);
                    const totalSilver = (playerStats?.gamesOver50 || 0) + (playerStats?.seriesOver50 || 0);
                    const totalGold = (playerStats?.gamesOver100 || 0) + (playerStats?.seriesOver100 || 0);
                    const highSeries = playerStats?.highSeries || 0;

                    return (
                      <tr
                        key={player.id}
                        className="hover:bg-willard-grey-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPlayer(player)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            {player.photoURL ? (
                              <img
                                src={player.photoURL}
                                alt={player.name}
                                className="w-12 h-12 rounded-full object-cover shadow-lg flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-willard-black to-willard-grey-900 text-white rounded-full flex items-center justify-center text-lg font-black shadow-lg flex-shrink-0">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-black text-willard-black">{player.name}</div>
                              {player.grade && (
                                <div className="text-sm text-willard-grey-600 font-semibold">
                                  Grade {player.grade}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {totalGold > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-lg">🥇</span>
                                <span className="text-sm font-black text-yellow-600">{totalGold}</span>
                              </div>
                            )}
                            {totalSilver > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-lg">🥈</span>
                                <span className="text-sm font-black text-gray-600">{totalSilver}</span>
                              </div>
                            )}
                            {totalBronze > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-lg">🥉</span>
                                <span className="text-sm font-black text-amber-700">{totalBronze}</span>
                              </div>
                            )}
                            {totalGold === 0 && totalSilver === 0 && totalBronze === 0 && (
                              <span className="text-willard-grey-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-2xl font-black text-willard-black">
                            {player.averageScore || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-2xl font-black text-willard-black">
                            {player.highGame || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-2xl font-black text-willard-black">
                            {highSeries || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

              {/* USBC Youth Achievements */}
              {(() => {
                const playerStats = playerStatsMap.get(selectedPlayer.id);
                if (!playerStats) return null;

                const totalBronze = playerStats.gamesOver25 + playerStats.seriesOver25;
                const totalSilver = playerStats.gamesOver50 + playerStats.seriesOver50;
                const totalGold = playerStats.gamesOver100 + playerStats.seriesOver100;
                const totalAchievements = totalBronze + totalSilver + totalGold;

                if (totalAchievements === 0) return null;

                return (
                  <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Medal className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-black text-willard-black">USBC Youth Achievements</h3>
                    </div>
                    <p className="text-sm text-willard-grey-600 mb-4">
                      Games and series scoring significantly above average
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">🥉</div>
                        <div className="text-2xl font-black text-amber-700 mb-1">{totalBronze}</div>
                        <div className="text-xs text-willard-grey-600 font-semibold">Bronze Goals</div>
                        <div className="text-xs text-willard-grey-500 mt-1">+25 over avg</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">🥈</div>
                        <div className="text-2xl font-black text-gray-600 mb-1">{totalSilver}</div>
                        <div className="text-xs text-willard-grey-600 font-semibold">Silver Goals</div>
                        <div className="text-xs text-willard-grey-500 mt-1">+50 over avg</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">🥇</div>
                        <div className="text-2xl font-black text-yellow-600 mb-1">{totalGold}</div>
                        <div className="text-xs text-willard-grey-600 font-semibold">Gold Goals</div>
                        <div className="text-xs text-willard-grey-500 mt-1">+100 over avg</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

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
