import React, { useState } from 'react';
import { Trophy, Users, Calendar, Award, TrendingUp, Mail, ChevronRight, Pin, Star, Target, Zap } from 'lucide-react';

const WHSBowlingWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    experience: ''
  });

  // Sample data - you'll replace with real data
  const players = [
    { id: 1, name: 'Alex Johnson', grade: '12', average: 215, highGame: 289, strikes: 156, spares: 89, photo: '👨' },
    { id: 2, name: 'Sarah Williams', grade: '11', average: 198, highGame: 267, strikes: 142, spares: 102, photo: '👩' },
    { id: 3, name: 'Mike Chen', grade: '12', average: 205, highGame: 278, strikes: 148, spares: 95, photo: '👨' },
    { id: 4, name: 'Emily Rodriguez', grade: '10', average: 192, highGame: 256, strikes: 135, spares: 98, photo: '👩' },
    { id: 5, name: 'Josh Martinez', grade: '11', average: 210, highGame: 280, strikes: 152, spares: 88, photo: '👨' },
    { id: 6, name: 'Rachel Kim', grade: '12', average: 203, highGame: 268, strikes: 145, spares: 91, photo: '👩' },
  ];

  const tournaments = [
    { name: 'Regional Championships', date: '2025-03-15', place: '2nd Place', score: '3,847', pins: '🎳' },
    { name: 'District Finals', date: '2025-02-28', place: '1st Place', score: '4,012', pins: '🎳' },
    { name: 'Invitational Classic', date: '2025-02-10', place: '3rd Place', score: '3,765', pins: '🎳' },
  ];

  const stats = {
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

  // Bowling pin animation component
  const BowlingPins = () => (
    <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
      <div className="relative">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${(i % 4) * 60}px`,
              top: `${Math.floor(i / 4) * 70}px`,
              animation: `float ${3 + (i * 0.2)}s ease-in-out infinite`,
            }}
          >
            🎳
          </div>
        ))}
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="space-y-12">
      {/* Hero Section with Bowling Theme */}
      <div className="relative bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 rounded-3xl p-12 text-white overflow-hidden shadow-2xl">
        {/* Animated bowling pins background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-8xl opacity-20 animate-bounce">🎳</div>
          <div className="absolute bottom-10 right-20 text-6xl opacity-20 animate-pulse">🎯</div>
          <div className="absolute top-1/2 right-10 text-7xl opacity-20" style={{animation: 'spin 10s linear infinite'}}>⚡</div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
              <Pin className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-6xl font-black tracking-tight">WILLARD TIGERS</h1>
              <div className="text-2xl font-bold opacity-90 mt-1">BOWLING TEAM</div>
            </div>
          </div>
          <p className="text-3xl mb-6 opacity-95 font-bold">🔥 Strike Your Way to Victory 🔥</p>
          <p className="text-xl max-w-2xl mb-8 opacity-90 leading-relaxed">
            Join the most dynamic high school bowling program in the region. We're building champions, one frame at a time. Perfect your game, compete with the best, and leave your mark on the lanes!
          </p>
          <button 
            onClick={() => setActiveTab('join')}
            className="bg-white text-orange-600 px-10 py-4 rounded-full font-black text-lg hover:bg-opacity-90 transition-all hover:scale-105 flex items-center gap-3 shadow-xl"
          >
            <Zap className="w-6 h-6" />
            JOIN THE TEAM
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats Grid with Bowling Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Team Average', value: stats.teamAverage, color: 'from-blue-500 to-cyan-500', emoji: '📊' },
          { icon: Users, label: 'Team Members', value: stats.totalMembers, color: 'from-purple-500 to-pink-500', emoji: '👥' },
          { icon: Trophy, label: 'Season Wins', value: stats.seasonsWins, color: 'from-green-500 to-emerald-500', emoji: '🏆' },
          { icon: Award, label: 'Championships', value: stats.championships, color: 'from-amber-500 to-orange-500', emoji: '🥇' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 hover:scale-105 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 text-6xl opacity-20">{stat.emoji}</div>
            <stat.icon className="w-10 h-10 mb-3 relative z-10" />
            <div className="text-4xl font-black relative z-10">{stat.value}</div>
            <div className="text-sm font-semibold mt-1 opacity-90 relative z-10">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Highlights with Pins */}
      <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="text-9xl absolute top-4 right-4">🎳</div>
          <div className="text-9xl absolute bottom-4 left-4 rotate-12">🎯</div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-10 h-10 animate-pulse" />
            <h2 className="text-4xl font-black">RECENT HIGHLIGHTS</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 shadow hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="text-6xl">🏆</div>
                <div>
                  <div className="font-black text-2xl">DISTRICT CHAMPIONS!</div>
                  <div className="opacity-90 text-lg">Team posted a season-high 4,012 pins 🔥</div>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 shadow hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="text-6xl">🎯</div>
                <div>
                  <div className="font-black text-2xl">NEAR PERFECT GAME!</div>
                  <div className="opacity-90 text-lg">Alex Johnson bowled a 289 at Regionals ⚡</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Stripe */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 text-center text-white shadow-2xl">
        <h3 className="text-3xl font-black mb-3">READY TO STRIKE? 🎳</h3>
        <p className="text-xl mb-6 opacity-90">Practice starts every Monday & Wednesday at 3:30 PM</p>
        <button
          onClick={() => setActiveTab('join')}
          className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform inline-flex items-center gap-2"
        >
          Learn More <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const RosterPage = () => (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white">
          <Users className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-5xl font-black text-gray-800">TEAM ROSTER</h2>
          <p className="text-gray-600 mt-1">Meet our amazing bowlers 🎳</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map(player => (
          <div 
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-3 group relative overflow-hidden"
          >
            {/* Bowling pin decoration */}
            <div className="absolute top-2 right-2 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">🎳</div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="text-7xl group-hover:scale-125 transition-transform">{player.photo}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-800 mb-1">{player.name}</h3>
                <div className="inline-block bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Grade {player.grade}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">Average:</span>
                  <span className="font-black text-purple-600 text-2xl">{player.average}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">High Game:</span>
                  <span className="font-black text-blue-600 text-2xl">{player.highGame}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-gray-100">
              <button className="text-orange-600 text-sm font-bold hover:text-orange-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                View Full Stats <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedPlayer(null)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-9xl mb-4">{selectedPlayer.photo}</div>
              <h3 className="text-4xl font-black text-gray-800">{selectedPlayer.name}</h3>
              <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold mt-2">
                Grade {selectedPlayer.grade}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-sm font-semibold mb-2 opacity-90">🎯 Bowling Average</div>
                <div className="text-5xl font-black">{selectedPlayer.average}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-sm font-semibold mb-2 opacity-90">🔥 High Game</div>
                <div className="text-5xl font-black">{selectedPlayer.highGame}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-4 shadow-lg">
                  <div className="text-xs font-semibold mb-1 opacity-90">⚡ Strikes</div>
                  <div className="text-3xl font-black">{selectedPlayer.strikes}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg">
                  <div className="text-xs font-semibold mb-1 opacity-90">✓ Spares</div>
                  <div className="text-3xl font-black">{selectedPlayer.spares}</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedPlayer(null)}
              className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-full font-black hover:shadow-lg transition-all hover:scale-105"
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
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white">
          <Trophy className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-5xl font-black text-gray-800">TOURNAMENT RESULTS</h2>
          <p className="text-gray-600 mt-1">Our journey to greatness 🏆</p>
        </div>
      </div>

      <div className="space-y-6">
        {tournaments.map((tournament, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden group"
          >
            {/* Decorative bowling elements */}
            <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity group-hover:rotate-12">
              🎳
            </div>
            
            <div className="flex items-start justify-between flex-wrap gap-6 relative z-10">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-gray-800 mb-3">{tournament.name}</h3>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">
                    {new Date(tournament.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="inline-block bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full font-black text-xl mb-3 shadow-lg">
                  {tournament.place}
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {tournament.score} PINS
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Season Summary */}
      <div className="mt-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
        <h3 className="text-3xl font-black mb-4 flex items-center gap-3">
          <Target className="w-10 h-10" />
          SEASON HIGHLIGHTS
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-5xl font-black mb-2">{tournaments.length}</div>
            <div className="text-lg font-semibold opacity-90">Tournaments</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-5xl font-black mb-2">🏆</div>
            <div className="text-lg font-semibold opacity-90">1st Place Win</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-5xl font-black mb-2">4,012</div>
            <div className="text-lg font-semibold opacity-90">Best Score</div>
          </div>
        </div>
      </div>
    </div>
  );

  const JoinPage = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
          <Mail className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-5xl font-black text-gray-800">JOIN THE TEAM</h2>
          <p className="text-gray-600 mt-1">Start your bowling journey today! 🎳</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative pins */}
        <div className="absolute top-4 right-4 text-7xl opacity-5">🎳</div>
        <div className="absolute bottom-4 left-4 text-7xl opacity-5">🎯</div>
        
        <div className="relative z-10">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-8">
            <p className="text-xl font-bold leading-relaxed">
              🔥 Interested in joining the Willard Tigers Bowling Team? Fill out this form and we'll get back to you with tryout information!
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 border-3 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition text-lg font-semibold"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-4 border-3 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition text-lg font-semibold"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                Current Grade *
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                className="w-full px-5 py-4 border-3 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition text-lg font-semibold"
              >
                <option value="">Select your grade</option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                Bowling Experience *
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-5 py-4 border-3 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition text-lg font-semibold"
              >
                <option value="">Select your experience level</option>
                <option value="beginner">🎳 Beginner (Just for fun)</option>
                <option value="intermediate">🎯 Intermediate (Bowl occasionally)</option>
                <option value="advanced">⚡ Advanced (League experience)</option>
                <option value="competitive">🏆 Competitive (Tournament experience)</option>
              </select>
            </div>
            
            <button
              onClick={handleFormSubmit}
              className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-5 rounded-2xl font-black text-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6" />
              SUBMIT APPLICATION
              <Zap className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
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

      {/* Navigation */}
      <nav className="bg-white shadow-xl sticky top-0 z-40 border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-pulse">🎳</div>
              <div>
                <div className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                  WILLARD TIGERS
                </div>
                <div className="text-sm font-bold text-gray-600">BOWLING TEAM</div>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'home', label: 'Home', icon: Pin },
                { id: 'roster', label: 'Roster', icon: Users },
                { id: 'tournaments', label: 'Tournaments', icon: Trophy },
                { id: 'join', label: 'Join', icon: Mail }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-2xl font-black transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'roster' && <RosterPage />}
        {activeTab === 'tournaments' && <TournamentsPage />}
        {activeTab === 'join' && <JoinPage />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-12 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="text-9xl absolute top-4 left-10">🎳</div>
          <div className="text-9xl absolute bottom-4 right-10">🎯</div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="text-6xl mb-6">🎳</div>
          <div className="text-3xl font-black mb-3">WILLARD HIGH SCHOOL BOWLING</div>
          <div className="text-xl font-bold opacity-90">Strike Your Way to Victory</div>
          <div className="mt-6 text-sm opacity-75">© 2025 Willard Tigers Bowling Team. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default WHSBowlingWebsite;