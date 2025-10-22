import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Player } from '@/types';
import { Users, Search, Trophy, TrendingUp, Target, Mail, X } from 'lucide-react';
import { Card, Badge, Button, EmptyState } from '@/components/ui';

export const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');

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

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (player.bio && player.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGrade = filterGrade === 'all' || player.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const grades = Array.from(new Set(players.map(p => p.grade).filter(Boolean))).sort();

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
      <section className="bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl">
              <Users className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">
                Team Roster
              </h1>
              <p className="text-xl opacity-90 mt-2">
                Meet the Tigers
              </p>
            </div>
          </div>
          <p className="text-lg opacity-75 max-w-3xl">
            Our dedicated athletes competing at the highest level
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20">
        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tiger-neutral-400" />
              <input
                type="text"
                placeholder="Search by name or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
              >
                <option value="all">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
              {(searchTerm || filterGrade !== 'all') && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterGrade('all');
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {filteredPlayers.length > 0 && (
            <div className="mt-4 text-sm text-tiger-neutral-600">
              Showing {filteredPlayers.length} of {players.length} athlete{players.length !== 1 ? 's' : ''}
            </div>
          )}
        </Card>

        {/* Player Grid */}
        {filteredPlayers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map(player => (
              <Card
                key={player.id}
                hover
                className="cursor-pointer"
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center overflow-hidden mb-4">
                    {player.photoURL ? (
                      <img
                        src={player.photoURL}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-white" />
                    )}
                  </div>

                  <h3 className="text-xl font-black text-tiger-primary-black mb-1">
                    {player.name}
                  </h3>

                  {player.jerseyNumber && (
                    <div className="text-sm text-tiger-neutral-600 mb-3">
                      #{player.jerseyNumber}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 mb-4">
                    {player.grade && (
                      <Badge variant="default">
                        Grade {player.grade}
                      </Badge>
                    )}
                    {player.graduationYear && (
                      <Badge variant="info">
                        Class of {player.graduationYear}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-tiger-neutral-50 rounded-lg p-3">
                      <div className="text-2xl font-black text-tiger-primary-black">
                        {player.averageScore || '--'}
                      </div>
                      <div className="text-xs text-tiger-neutral-600 font-semibold">
                        Average
                      </div>
                    </div>
                    <div className="bg-tiger-neutral-50 rounded-lg p-3">
                      <div className="text-2xl font-black text-tiger-primary-black">
                        {player.highGame || '--'}
                      </div>
                      <div className="text-xs text-tiger-neutral-600 font-semibold">
                        High Game
                      </div>
                    </div>
                  </div>

                  {player.bio && (
                    <p className="text-sm text-tiger-neutral-700 line-clamp-2 mb-4">
                      {player.bio}
                    </p>
                  )}

                  <Button variant="ghost" size="sm" fullWidth>
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No athletes found"
            description={searchTerm || filterGrade !== 'all'
              ? "Try adjusting your search or filters"
              : "No active athletes in the roster yet"}
            actionLabel={searchTerm || filterGrade !== 'all' ? "Clear Filters" : undefined}
            onAction={() => {
              setSearchTerm('');
              setFilterGrade('all');
            }}
          />
        )}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-tiger-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b border-tiger-neutral-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-black text-tiger-primary-black">
                Player Profile
              </h2>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-2 hover:bg-tiger-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center overflow-hidden mb-4">
                  {selectedPlayer.photoURL ? (
                    <img
                      src={selectedPlayer.photoURL}
                      alt={selectedPlayer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-16 h-16 text-white" />
                  )}
                </div>

                <h3 className="text-3xl font-black text-tiger-primary-black mb-2">
                  {selectedPlayer.name}
                </h3>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {selectedPlayer.grade && (
                    <Badge variant="default" size="lg">
                      Grade {selectedPlayer.grade}
                    </Badge>
                  )}
                  {selectedPlayer.jerseyNumber && (
                    <Badge variant="info" size="lg">
                      #{selectedPlayer.jerseyNumber}
                    </Badge>
                  )}
                </div>

                {selectedPlayer.email && (
                  <div className="flex items-center justify-center gap-2 text-tiger-neutral-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedPlayer.email}</span>
                  </div>
                )}
              </div>

              {selectedPlayer.bio && (
                <div className="mb-8">
                  <h4 className="font-bold text-tiger-primary-black mb-2">About</h4>
                  <p className="text-tiger-neutral-700 leading-relaxed">
                    {selectedPlayer.bio}
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <Card padding="md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-tiger-neutral-600 font-semibold">
                        Average Score
                      </div>
                      <div className="text-2xl font-black text-tiger-primary-black">
                        {selectedPlayer.averageScore || '--'}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card padding="md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm text-tiger-neutral-600 font-semibold">
                        High Game
                      </div>
                      <div className="text-2xl font-black text-tiger-primary-black">
                        {selectedPlayer.highGame || '--'}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card padding="md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-tiger-neutral-600 font-semibold">
                        Games Played
                      </div>
                      <div className="text-2xl font-black text-tiger-primary-black">
                        {selectedPlayer.gamesPlayed || 0}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {selectedPlayer.graduationYear && (
                <div className="mt-6 p-4 bg-tiger-neutral-50 rounded-lg text-center">
                  <p className="text-sm text-tiger-neutral-600">
                    Graduating in <span className="font-bold text-tiger-primary-black">{selectedPlayer.graduationYear}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
