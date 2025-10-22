import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Player, PublicStats, Achievement } from '@/types';
import { Users, Trophy, Target, TrendingUp, Award, MapPin, Quote } from 'lucide-react';

export const Team: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [publicStats, setPublicStats] = useState<PublicStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch players
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

        // Fetch public stats
        const statsRef = doc(db, 'publicStats', 'willard-tigers');
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          setPublicStats({
            ...statsSnap.data(),
            updatedAt: statsSnap.data().updatedAt?.toDate() || new Date(),
          } as PublicStats);
        }

        // Fetch public achievements
        const achievementsRef = collection(db, 'achievements');
        const achievementsQ = query(
          achievementsRef,
          where('isPublic', '==', true),
          orderBy('date', 'desc')
        );
        const achievementsSnap = await getDocs(achievementsQ);
        const achievementsData = achievementsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Achievement[];

        setAchievements(achievementsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPlayerAchievements = (playerId: string) => {
    return achievements.filter(a => a.playerId === playerId);
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
      {/* Bold Header */}
      <section className="bg-gradient-to-br from-willard-black via-willard-grey-900 to-willard-grey-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-2xl">
              <Users className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-6xl md:text-7xl font-black">
                MEET THE TEAM
              </h1>
              <p className="text-2xl md:text-3xl text-willard-grey-300 mt-2 font-bold">
                Willard Tigers Bowling 2024-2025 🎳
              </p>
            </div>
          </div>

          {/* Team Stats */}
          {publicStats && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6" />
                  <span className="text-sm font-bold opacity-90 uppercase tracking-wide">
                    Team Average
                  </span>
                </div>
                <div className="text-5xl font-black">
                  {publicStats.teamAverage}
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-xl">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm font-bold opacity-90 uppercase tracking-wide">
                    Total Games
                  </span>
                </div>
                <div className="text-5xl font-black">
                  {publicStats.totalGames}
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-6 shadow-tiger-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm font-bold opacity-90 uppercase tracking-wide">
                    Active Bowlers
                  </span>
                </div>
                <div className="text-5xl font-black">
                  {players.length}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Player Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {players.map((player) => {
            const playerAchievements = getPlayerAchievements(player.id);
            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="bg-white rounded-3xl p-8 shadow-tiger-lg hover:shadow-tiger-2xl hover:-translate-y-4 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute top-2 right-2 text-6xl opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
                  🎳
                </div>

                {/* Player Header */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="text-8xl group-hover:scale-125 transition-transform">
                    {player.photoURL ? (
                      <img
                        src={player.photoURL}
                        alt={player.name}
                        className="w-24 h-24 rounded-full object-cover shadow-tiger-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-willard-grey-800 to-willard-black rounded-full flex items-center justify-center text-4xl shadow-tiger-lg">
                        🎯
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-willard-black mb-2 group-hover:scale-105 transition-transform">
                      {player.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-block bg-gradient-to-r from-willard-grey-800 to-willard-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-tiger">
                        Grade {player.grade}
                      </div>
                      {player.jerseyNumber && (
                        <div className="inline-block bg-gradient-to-r from-willard-grey-600 to-willard-grey-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-tiger">
                          #{player.jerseyNumber}
                        </div>
                      )}
                    </div>
                    {player.hometown && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-willard-grey-600">
                        <MapPin className="w-3 h-3" />
                        {player.hometown}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {player.bio && (
                  <div className="mb-6 text-sm text-willard-grey-700 italic line-clamp-2">
                    "{player.bio}"
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-willard-grey-100 to-willard-grey-200 rounded-2xl p-4 shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-willard-grey-600 uppercase tracking-wide">
                        Average
                      </span>
                      <span className="font-black text-willard-black text-3xl">
                        {player.averageScore || player.average || 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-2xl p-3 shadow-inner">
                      <div className="text-xs font-bold text-willard-grey-600 uppercase mb-1">
                        High Game
                      </div>
                      <div className="font-black text-willard-grey-800 text-2xl">
                        {player.highGame || 0}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-2xl p-3 shadow-inner">
                      <div className="text-xs font-bold text-willard-grey-600 uppercase mb-1">
                        High Series
                      </div>
                      <div className="font-black text-willard-grey-800 text-2xl">
                        {player.highSeries || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements Badge */}
                {playerAchievements.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-willard-grey-700">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="font-bold">
                      {playerAchievements.length} Achievement{playerAchievements.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* View More Button */}
                <div className="mt-6 pt-6 border-t-2 border-willard-grey-200">
                  <button className="text-willard-black text-sm font-black hover:text-willard-grey-700 flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-wide">
                    View Full Profile
                    <Award className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
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

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6 z-50 backdrop-blur-sm animate-in fade-in overflow-y-auto"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-tiger-2xl transform scale-100 animate-in zoom-in my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player Header */}
            <div className="text-center mb-8">
              <div className="text-9xl mb-6">
                {selectedPlayer.photoURL ? (
                  <img
                    src={selectedPlayer.photoURL}
                    alt={selectedPlayer.name}
                    className="w-40 h-40 rounded-full object-cover mx-auto shadow-tiger-xl"
                  />
                ) : (
                  '🎯'
                )}
              </div>
              <h3 className="text-5xl font-black text-willard-black mb-4">
                {selectedPlayer.name}
              </h3>
              <div className="flex justify-center gap-3 flex-wrap">
                <div className="inline-block bg-gradient-to-r from-willard-grey-900 to-willard-black text-white px-6 py-3 rounded-full font-black text-lg shadow-tiger-lg">
                  Grade {selectedPlayer.grade}
                </div>
                {selectedPlayer.jerseyNumber && (
                  <div className="inline-block bg-gradient-to-r from-willard-grey-700 to-willard-grey-800 text-white px-6 py-3 rounded-full font-black text-lg shadow-tiger-lg">
                    #{selectedPlayer.jerseyNumber}
                  </div>
                )}
              </div>
              {selectedPlayer.hometown && (
                <div className="flex items-center justify-center gap-2 mt-4 text-lg text-willard-grey-600">
                  <MapPin className="w-5 h-5" />
                  {selectedPlayer.hometown}
                </div>
              )}
            </div>

            {/* Bio */}
            {selectedPlayer.bio && (
              <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-3xl p-6 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <Quote className="w-6 h-6 text-willard-grey-600" />
                  <h4 className="text-sm font-black text-willard-grey-700 uppercase tracking-wide">
                    About
                  </h4>
                </div>
                <p className="text-lg text-willard-grey-800 italic">
                  "{selectedPlayer.bio}"
                </p>
              </div>
            )}

            {/* Favorite Quote */}
            {selectedPlayer.favoriteQuote && (
              <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-3xl p-6 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <Quote className="w-6 h-6 text-willard-grey-600" />
                  <h4 className="text-sm font-black text-willard-grey-700 uppercase tracking-wide">
                    Favorite Quote
                  </h4>
                </div>
                <p className="text-lg text-willard-grey-800 italic">
                  "{selectedPlayer.favoriteQuote}"
                </p>
              </div>
            )}

            {/* Bowling Goals */}
            {selectedPlayer.bowlingGoals && (
              <div className="bg-gradient-to-r from-willard-grey-50 to-willard-grey-100 rounded-3xl p-6 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <Target className="w-6 h-6 text-willard-grey-600" />
                  <h4 className="text-sm font-black text-willard-grey-700 uppercase tracking-wide">
                    Bowling Goals
                  </h4>
                </div>
                <p className="text-lg text-willard-grey-800">
                  {selectedPlayer.bowlingGoals}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-br from-willard-grey-900 to-willard-black text-white rounded-3xl p-8 shadow-tiger-xl">
                <div className="text-sm font-bold mb-2 opacity-90 uppercase tracking-wide">
                  🎯 Bowling Average
                </div>
                <div className="text-6xl font-black">
                  {selectedPlayer.averageScore || selectedPlayer.average || 0}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-willard-grey-800 to-willard-grey-900 text-white rounded-3xl p-6 shadow-tiger-xl">
                  <div className="text-xs font-bold mb-2 opacity-90 uppercase tracking-wide">
                    🔥 High Game
                  </div>
                  <div className="text-5xl font-black">
                    {selectedPlayer.highGame || 0}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-willard-grey-700 to-willard-grey-800 text-white rounded-3xl p-6 shadow-tiger-xl">
                  <div className="text-xs font-bold mb-2 opacity-90 uppercase tracking-wide">
                    ⚡ High Series
                  </div>
                  <div className="text-5xl font-black">
                    {selectedPlayer.highSeries || 0}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-willard-grey-600 to-willard-grey-700 text-white rounded-3xl p-6 shadow-tiger-lg">
                <div className="text-xs font-bold mb-2 opacity-90 uppercase tracking-wide">
                  Games Played
                </div>
                <div className="text-4xl font-black">
                  {selectedPlayer.gamesPlayed || 0}
                </div>
              </div>
            </div>

            {/* Achievements */}
            {getPlayerAchievements(selectedPlayer.id).length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <h4 className="text-sm font-black text-willard-grey-800 uppercase tracking-wide">
                    Achievements
                  </h4>
                </div>
                <div className="space-y-3">
                  {getPlayerAchievements(selectedPlayer.id).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white rounded-2xl p-4 shadow-tiger"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">🏆</div>
                        <div className="flex-1">
                          <h5 className="font-black text-willard-black">
                            {achievement.title}
                          </h5>
                          <p className="text-sm text-willard-grey-700 mt-1">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-willard-grey-500 mt-2">
                            {achievement.date.toLocaleDateString()}
                          </p>
                        </div>
                        {achievement.value && (
                          <div className="font-black text-2xl text-willard-black">
                            {achievement.value}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
