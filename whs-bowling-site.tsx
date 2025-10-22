import { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Award, TrendingUp, Mail, ChevronRight, Pin, Star, Target, Zap, BarChart3, Activity } from 'lucide-react';

// Types
interface Player {
  id: number;
  name: string;
  grade: string;
  average: number;
  highGame: number;
  strikes: number;
  spares: number;
  photo: string;
}

interface Tournament {
  name: string;
  date: string;
  place: string;
  score: string;
  pins: string;
}

interface Stats {
  teamAverage: number;
  totalMembers: number;
  seasonsWins: number;
  championships: number;
}

interface LiveStatsData {
  currentGame?: {
    score: number;
    frame: number;
    playerName: string;
  };
  recentScores?: Array<{
    playerName: string;
    score: number;
    timestamp: number;
  }>;
}

const WHSBowlingWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [liveStats, setLiveStats] = useState<LiveStatsData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    experience: ''
  });

  // Fetch live stats from Stats app integration
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        // This will connect to the shared Firebase Firestore
        // Based on STATS_APP_INTEGRATION.md - Option 1: Shared Firebase Project
        const statsAppUrl = import.meta.env.VITE_STATS_APP_URL || 'https://stats.willardtigersbowling.com';

        // For now, using mock data - replace with actual Firestore queries
        // Example: const snapshot = await db.collection('games').orderBy('timestamp', 'desc').limit(1).get();
        setLiveStats({
          currentGame: {
            score: 187,
            frame: 8,
            playerName: 'Alex Johnson'
          },
          recentScores: [
            { playerName: 'Sarah Williams', score: 234, timestamp: Date.now() - 300000 },
            { playerName: 'Mike Chen', score: 221, timestamp: Date.now() - 600000 }
          ]
        });
      } catch (error) {
        console.error('Error fetching live stats:', error);
      }
    };

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Sample data
  const players: Player[] = [
    { id: 1, name: 'Alex Johnson', grade: '12', average: 215, highGame: 289, strikes: 156, spares: 89, photo: '👨' },
    { id: 2, name: 'Sarah Williams', grade: '11', average: 198, highGame: 267, strikes: 142, spares: 102, photo: '👩' },
    { id: 3, name: 'Mike Chen', grade: '12', average: 205, highGame: 278, strikes: 148, spares: 95, photo: '👨' },
    { id: 4, name: 'Emily Rodriguez', grade: '10', average: 192, highGame: 256, strikes: 135, spares: 98, photo: '👩' },
    { id: 5, name: 'Josh Martinez', grade: '11', average: 210, highGame: 280, strikes: 152, spares: 88, photo: '👨' },
    { id: 6, name: 'Rachel Kim', grade: '12', average: 203, highGame: 268, strikes: 145, spares: 91, photo: '👩' },
  ];

  const tournaments: Tournament[] = [
    { name: 'Regional Championships', date: '2025-03-15', place: '2nd Place', score: '3,847', pins: '🎳' },
    { name: 'District Finals', date: '2025-02-28', place: '1st Place', score: '4,012', pins: '🎳' },
    { name: 'Invitational Classic', date: '2025-02-10', place: '3rd Place', score: '3,765', pins: '🎳' },
  ];

  const stats: Stats = {
    teamAverage: 202,
    totalMembers: 24,
    seasonsWins: 15,
    championships: 3
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.email || !formData.grade || !formData.experience) {
      alert('Please fill out all fields');
      return;
    }
    alert(`Thanks for your interest, ${formData.name}! We'll contact you at ${formData.email}`);
    setFormData({ name: '', email: '', grade: '', experience: '' });
  };

  const HomePage = () => (
    <div className="space-y-6 md:space-y-10">
      {/* Hero Section - Glassmorphic Design */}
      <div className="relative bg-gradient-to-br from-zinc-950 via-neutral-900 to-black rounded-3xl md:rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden shadow-2xl border border-white/10">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-6xl md:text-8xl opacity-5 animate-bounce">🎳</div>
          <div className="absolute bottom-10 right-20 text-5xl md:text-6xl opacity-5 animate-pulse">⚡</div>
          <div className="absolute top-1/2 right-10 text-6xl md:text-7xl opacity-5" style={{animation: 'spin 10s linear infinite'}}>💫</div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <Pin className="w-12 h-12 md:w-20 md:h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
            </div>
            <div>
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-lg">
                WILLARD TIGERS
              </h1>
              <div className="text-xl md:text-3xl font-bold text-gray-300 mt-2">BOWLING TEAM</div>
            </div>
          </div>

          <p className="text-2xl md:text-4xl mb-4 md:mb-6 font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            ⚡ Strike Your Way to Victory ⚡
          </p>

          <p className="text-base md:text-xl max-w-3xl mb-8 md:mb-10 text-gray-300 leading-relaxed">
            Join the most dynamic high school bowling program in the region. We're building champions, one frame at a time. Perfect your game, compete with the best, and leave your mark on the lanes!
          </p>

          <button
            onClick={() => setActiveTab('join')}
            className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-base md:text-xl hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] transition-all hover:scale-105 flex items-center gap-3 shadow-2xl"
          >
            <Zap className="w-5 h-5 md:w-7 md:h-7" />
            JOIN THE TEAM
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
          </button>
        </div>
      </div>

      {/* Live Stats Section - Integrated from Stats App */}
      {liveStats && (
        <div className="bg-gradient-to-br from-zinc-950 to-neutral-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-yellow-400/10 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-yellow-400/20">
                <Activity className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white">LIVE STATS</h2>
                <p className="text-sm md:text-base text-gray-400">Real-time bowling action</p>
              </div>
            </div>
            <a
              href={import.meta.env.VITE_STATS_APP_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2 w-fit"
            >
              <BarChart3 className="w-5 h-5" />
              View Full Stats App
            </a>
          </div>

          {/* Desktop: Side-by-side layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveStats.currentGame && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10">
                <div className="text-sm md:text-base font-bold text-yellow-400 mb-3">🔴 LIVE NOW</div>
                <div className="text-xl md:text-2xl font-black text-white mb-2">{liveStats.currentGame.playerName}</div>
                <div className="flex items-end gap-4">
                  <div>
                    <div className="text-4xl md:text-6xl font-black text-white">{liveStats.currentGame.score}</div>
                    <div className="text-xs md:text-sm text-gray-400">Current Score</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-2xl md:text-3xl font-bold text-gray-300">Frame {liveStats.currentGame.frame}</div>
                  </div>
                </div>
              </div>
            )}

            {liveStats.recentScores && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10">
                <div className="text-sm md:text-base font-bold text-gray-300 mb-4">Recent Scores</div>
                <div className="space-y-3 md:space-y-4">
                  {liveStats.recentScores.map((score, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm md:text-base text-gray-300">{score.playerName}</span>
                      <span className="text-xl md:text-2xl font-black text-white">{score.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid - Glassmorphic with spacing */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {[
          { icon: TrendingUp, label: 'Team Average', value: stats.teamAverage, gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
          { icon: Users, label: 'Team Members', value: stats.totalMembers, gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
          { icon: Trophy, label: 'Season Wins', value: stats.seasonsWins, gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400' },
          { icon: Award, label: 'Championships', value: stats.championships, gradient: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-2 border ${stat.border} group`}>
            <stat.icon className={`w-8 h-8 md:w-12 md:h-12 mb-4 ${stat.text} group-hover:scale-110 transition-transform drop-shadow-lg`} />
            <div className={`text-4xl md:text-5xl font-black ${stat.text} mb-2 drop-shadow-lg`}>{stat.value}</div>
            <div className="text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Highlights - Glassmorphic */}
      <div className="bg-gradient-to-br from-zinc-950 to-neutral-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="text-8xl md:text-9xl absolute top-4 right-4">🎳</div>
          <div className="text-8xl md:text-9xl absolute bottom-4 left-4 rotate-12">⚡</div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-yellow-400/10 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-yellow-400/20">
              <Star className="w-6 h-6 md:w-10 md:h-10 text-yellow-400 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">RECENT HIGHLIGHTS</h2>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10 hover:border-yellow-400/30 transition-all hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="text-5xl md:text-7xl">🏆</div>
                <div className="flex-1">
                  <div className="font-black text-xl md:text-3xl text-white mb-2">DISTRICT CHAMPIONS!</div>
                  <div className="text-gray-300 text-sm md:text-lg">Team posted a season-high 4,012 pins</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10 hover:border-yellow-400/30 transition-all hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="text-5xl md:text-7xl">⚡</div>
                <div className="flex-1">
                  <div className="font-black text-xl md:text-3xl text-white mb-2">NEAR PERFECT GAME!</div>
                  <div className="text-gray-300 text-sm md:text-lg">Alex Johnson bowled a 289 at Regionals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl">
        <h3 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 text-black">READY TO STRIKE? 🎳</h3>
        <p className="text-base md:text-xl mb-6 md:mb-8 text-black/80 font-bold">Practice starts every Monday & Wednesday at 3:30 PM</p>
        <button
          onClick={() => setActiveTab('join')}
          className="bg-black text-yellow-400 px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform inline-flex items-center gap-2 md:gap-3 shadow-xl"
        >
          Learn More <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );

  const RosterPage = () => (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-gradient-to-br from-zinc-900 to-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10">
          <Users className="w-10 h-10 md:w-14 md:h-14 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-white">TEAM ROSTER</h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Meet our amazing bowlers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {players.map(player => (
          <div
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] hover:border-yellow-400/30 transition-all cursor-pointer hover:-translate-y-3 group relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 text-5xl md:text-6xl opacity-5 group-hover:opacity-10 transition-opacity">🎳</div>

            <div className="flex items-start gap-4 md:gap-5 mb-6">
              <div className="text-6xl md:text-7xl group-hover:scale-125 transition-transform">{player.photo}</div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-black text-white mb-2">{player.name}</h3>
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-400 text-black px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold">
                  Grade {player.grade}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="bg-purple-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 border border-purple-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-bold text-gray-300">Average:</span>
                  <span className="font-black text-purple-400 text-2xl md:text-3xl">{player.average}</span>
                </div>
              </div>
              <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 border border-blue-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-bold text-gray-300">High Game:</span>
                  <span className="font-black text-blue-400 text-2xl md:text-3xl">{player.highGame}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 md:mt-6 pt-5 border-t border-white/10">
              <button className="text-yellow-400 text-sm md:text-base font-bold hover:text-yellow-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                View Full Stats <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="bg-gradient-to-br from-zinc-950 to-neutral-900 border border-white/10 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="text-8xl md:text-9xl mb-6">{selectedPlayer.photo}</div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">{selectedPlayer.name}</h3>
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-400 text-black px-5 py-2 md:px-6 md:py-3 rounded-full font-black text-sm md:text-base">
                Grade {selectedPlayer.grade}
              </div>
            </div>

            <div className="space-y-4 md:space-y-5">
              <div className="bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="text-sm md:text-base font-bold text-purple-300 mb-3">🎯 Bowling Average</div>
                <div className="text-5xl md:text-6xl font-black text-white">{selectedPlayer.average}</div>
              </div>

              <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="text-sm md:text-base font-bold text-blue-300 mb-3">🔥 High Game</div>
                <div className="text-5xl md:text-6xl font-black text-white">{selectedPlayer.highGame}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <div className="bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-5 md:p-6">
                  <div className="text-xs md:text-sm font-bold text-green-300 mb-2">⚡ Strikes</div>
                  <div className="text-3xl md:text-4xl font-black text-white">{selectedPlayer.strikes}</div>
                </div>
                <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 md:p-6">
                  <div className="text-xs md:text-sm font-bold text-amber-300 mb-2">✓ Spares</div>
                  <div className="text-3xl md:text-4xl font-black text-white">{selectedPlayer.spares}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlayer(null)}
              className="mt-8 w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-black py-4 md:py-5 rounded-full font-black hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all hover:scale-105 text-base md:text-lg"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const TournamentsPage = () => (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-gradient-to-br from-zinc-900 to-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10">
          <Trophy className="w-10 h-10 md:w-14 md:h-14 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-white">TOURNAMENT RESULTS</h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Our journey to greatness</p>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        {tournaments.map((tournament, idx) => (
          <div
            key={idx}
            className="bg-white/5 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(250,204,21,0.2)] hover:border-yellow-400/30 transition-all hover:-translate-y-2 relative overflow-hidden group"
          >
            <div className="absolute top-4 right-4 text-7xl md:text-8xl opacity-5 group-hover:opacity-10 transition-opacity group-hover:rotate-12">
              🎳
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 md:gap-8 relative z-10">
              <div className="flex-1">
                <h3 className="text-2xl md:text-4xl font-black text-white mb-4">{tournament.name}</h3>
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-semibold text-sm md:text-base">
                    {new Date(tournament.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="lg:text-right">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-lg md:text-xl mb-4 shadow-lg">
                  {tournament.place}
                </div>
                <div className="text-3xl md:text-4xl font-black text-yellow-400 drop-shadow-lg">
                  {tournament.score} PINS
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Season Summary */}
      <div className="mt-12 bg-gradient-to-br from-zinc-950 to-neutral-900 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl">
        <h3 className="text-3xl md:text-4xl font-black mb-6 md:mb-8 flex items-center gap-3 md:gap-4 text-white">
          <div className="bg-yellow-400/10 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-yellow-400/20">
            <Target className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
          </div>
          SEASON HIGHLIGHTS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="text-5xl md:text-6xl font-black mb-3 text-yellow-400">{tournaments.length}</div>
            <div className="text-base md:text-lg font-bold text-gray-300">Tournaments</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="text-5xl md:text-6xl mb-3">🏆</div>
            <div className="text-base md:text-lg font-bold text-gray-300">1st Place Win</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="text-5xl md:text-6xl font-black mb-3 text-yellow-400">4,012</div>
            <div className="text-base md:text-lg font-bold text-gray-300">Best Score</div>
          </div>
        </div>
      </div>
    </div>
  );

  const JoinPage = () => (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-gradient-to-br from-zinc-900 to-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10">
          <Mail className="w-10 h-10 md:w-14 md:h-14 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-white">JOIN THE TEAM</h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Start your bowling journey today!</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 right-4 text-7xl md:text-8xl opacity-5">🎳</div>
        <div className="absolute bottom-4 left-4 text-7xl md:text-8xl opacity-5">⚡</div>

        <div className="relative z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-black rounded-2xl md:rounded-3xl p-6 md:p-8 mb-8 md:mb-10">
            <p className="text-lg md:text-xl font-black leading-relaxed">
              ⚡ Interested in joining the Willard Tigers Bowling Team? Fill out this form and we'll get back to you with tryout information!
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div>
              <label className="block text-sm md:text-base font-black text-gray-300 mb-3 uppercase tracking-wide">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-yellow-400 focus:outline-none transition text-base md:text-lg font-semibold text-white placeholder-gray-500 backdrop-blur-xl"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-black text-gray-300 mb-3 uppercase tracking-wide">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-yellow-400 focus:outline-none transition text-base md:text-lg font-semibold text-white placeholder-gray-500 backdrop-blur-xl"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-black text-gray-300 mb-3 uppercase tracking-wide">
                Current Grade *
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-yellow-400 focus:outline-none transition text-base md:text-lg font-semibold text-white backdrop-blur-xl"
              >
                <option value="" className="bg-zinc-900">Select your grade</option>
                <option value="9" className="bg-zinc-900">9th Grade</option>
                <option value="10" className="bg-zinc-900">10th Grade</option>
                <option value="11" className="bg-zinc-900">11th Grade</option>
                <option value="12" className="bg-zinc-900">12th Grade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm md:text-base font-black text-gray-300 mb-3 uppercase tracking-wide">
                Bowling Experience *
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-5 md:px-6 py-4 md:py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-yellow-400 focus:outline-none transition text-base md:text-lg font-semibold text-white backdrop-blur-xl"
              >
                <option value="" className="bg-zinc-900">Select your experience level</option>
                <option value="beginner" className="bg-zinc-900">🎳 Beginner (Just for fun)</option>
                <option value="intermediate" className="bg-zinc-900">🎯 Intermediate (Bowl occasionally)</option>
                <option value="advanced" className="bg-zinc-900">⚡ Advanced (League experience)</option>
                <option value="competitive" className="bg-zinc-900">🏆 Competitive (Tournament experience)</option>
              </select>
            </div>

            <button
              onClick={handleFormSubmit}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-black py-5 md:py-6 rounded-2xl font-black text-lg md:text-xl hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6 md:w-7 md:h-7" />
              SUBMIT APPLICATION
              <Zap className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Navigation - Responsive */}
      <nav className="bg-gradient-to-r from-zinc-950 to-neutral-900 shadow-2xl sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-4xl md:text-5xl animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">🎳</div>
              <div>
                <div className="text-xl md:text-3xl font-black bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  WILLARD TIGERS
                </div>
                <div className="text-xs md:text-sm font-bold text-gray-400">BOWLING TEAM</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-2 lg:gap-3">
              {[
                { id: 'home', label: 'Home', icon: Pin },
                { id: 'roster', label: 'Roster', icon: Users },
                { id: 'tournaments', label: 'Tournaments', icon: Trophy },
                { id: 'join', label: 'Join', icon: Mail }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 lg:px-6 py-3 lg:py-4 rounded-2xl font-black transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-105'
                      : 'text-gray-400 hover:bg-white/5 hover:text-yellow-400 border border-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden gap-1">
              {[
                { id: 'home', icon: Pin },
                { id: 'roster', icon: Users },
                { id: 'tournaments', icon: Trophy },
                { id: 'join', icon: Mail }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-xl font-black transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black shadow-lg'
                      : 'text-gray-400 hover:bg-white/5 border border-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Proper centering and max-width */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'roster' && <RosterPage />}
        {activeTab === 'tournaments' && <TournamentsPage />}
        {activeTab === 'join' && <JoinPage />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-zinc-950 to-neutral-900 border-t border-white/10 text-white py-10 md:py-16 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="text-9xl absolute top-4 left-10">🎳</div>
          <div className="text-9xl absolute bottom-4 right-10">⚡</div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="text-5xl md:text-6xl mb-6">🎳</div>
          <div className="text-2xl md:text-3xl font-black mb-3 text-white">WILLARD HIGH SCHOOL BOWLING</div>
          <div className="text-lg md:text-xl font-bold text-gray-400">Strike Your Way to Victory</div>
          <div className="mt-6 text-sm text-gray-500">© 2025 Willard Tigers Bowling Team. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default WHSBowlingWebsite;
