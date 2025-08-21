import React, { useState, useEffect } from 'react';
import { Castle as Whistle, Users, Calendar, ClipboardList, LogOut, Bell, Plus, Trophy, Target, TrendingUp, User, Award, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NewsCarousel from '../NewsCarousel';
import AddPlayerModal from '../modals/AddPlayerModal';
import AddTrainingModal from '../modals/AddTrainingModal';
import AddMatchModal from '../modals/AddMatchModal';
import { apiService, type Player, type TrainingSession, type Match } from '../../services/api';

const CoachDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [players, setPlayers] = useState<Player[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);

  const stats = [
    { title: 'My Players', value: players.length.toString(), change: '+2', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { title: 'Training Sessions', value: trainingSessions.length.toString(), change: '+4', icon: Target, color: 'text-green-600 bg-green-50' },
    { title: 'Upcoming Matches', value: matches.filter(m => new Date(m.date) > new Date() && m.status === 'Scheduled').length.toString(), change: '0', icon: Trophy, color: 'text-yellow-600 bg-yellow-50' },
    { title: 'Team Ranking', value: '3rd', change: '+1', icon: Award, color: 'text-purple-600 bg-purple-50' },
  ];

  // Load data when component mounts
  useEffect(() => {
    if (user?.id) {
      loadPlayers();
      loadTrainingSessions();
      loadMatches();
    }
  }, [user?.id]);

  const loadPlayers = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await apiService.getPlayers(user.id);
      setPlayers(response.players);
    } catch (error) {
      console.error('Failed to load players:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrainingSessions = async () => {
    if (!user?.id) {
      console.log('❌ No user ID available for loading training sessions');
      return;
    }

    console.log('🔄 Loading training sessions for coach:', user.id);
    try {
      const response = await apiService.getTrainingSessions(user.id);
      console.log('✅ Training sessions loaded:', response.sessions);
      setTrainingSessions(response.sessions);
    } catch (error) {
      console.error('❌ Failed to load training sessions:', error);
    }
  };

  const loadMatches = async () => {
    if (!user?.id) {
      console.log('❌ No user ID available for loading matches');
      return;
    }

    console.log('🔄 Loading matches for coach:', user.id);
    try {
      const response = await apiService.getMatches(user.id);
      console.log('✅ Matches loaded:', response.matches);
      setMatches(response.matches);
    } catch (error) {
      console.error('❌ Failed to load matches:', error);
    }
  };

  const handlePlayerAdded = () => {
    loadPlayers(); // Refresh the players list
  };

  const handleTrainingAdded = () => {
    loadTrainingSessions(); // Refresh the training sessions list
  };

  const handleMatchAdded = () => {
    loadMatches(); // Refresh the matches list
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Are you sure you want to remove this player?')) return;

    try {
      await apiService.deletePlayer(playerId);
      loadPlayers(); // Refresh the players list
    } catch (error) {
      console.error('Failed to delete player:', error);
      alert('Failed to remove player. Please try again.');
    }
  };

  const handleDeleteTraining = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this training session?')) return;

    try {
      await apiService.deleteTrainingSession(sessionId);
      loadTrainingSessions(); // Refresh the training sessions list
    } catch (error) {
      console.error('Failed to delete training session:', error);
      alert('Failed to delete training session. Please try again.');
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;

    try {
      await apiService.deleteMatch(matchId);
      loadMatches(); // Refresh the matches list
    } catch (error) {
      console.error('Failed to delete match:', error);
      alert('Failed to delete match. Please try again.');
    }
  };

  const upcomingSessions = [
    { id: '1', title: 'Passing & Movement', date: '2025-02-05', time: '16:00', location: 'Training Ground A' },
    { id: '2', title: 'Defensive Tactics', date: '2025-02-07', time: '16:00', location: 'Training Ground B' },
    { id: '3', title: 'Set Pieces', date: '2025-02-10', time: '16:00', location: 'Main Pitch' },
    { id: '4', title: 'Match Preparation', date: '2025-02-12', time: '15:00', location: 'Training Ground A' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  {stat.change === '0' ? 'No change' : stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News Carousel */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Academy News</h2>
        <NewsCarousel />
      </div>

      {/* Quick Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Training Sessions</h3>
          <div className="space-y-3">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{session.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {players.filter(p => p.performance === 'Excellent').map((player) => (
              <div key={player._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {player.fullname.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{player.fullname}</p>
                    <p className="text-sm text-gray-500">{player.position}, Age {player.age}</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">{player.attendance}</span>
              </div>
            ))}
            {players.filter(p => p.performance === 'Excellent').length === 0 && (
              <p className="text-gray-500 text-center py-4">No top performers yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlayers = () => (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Team Players</h2>
          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Player
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading players...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="p-8 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Players Yet</h3>
          <p className="text-gray-500 mb-4">Start building your team by adding your first player.</p>
          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Player
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {player.fullname.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{player.fullname}</div>
                        <div className="text-sm text-gray-500">{player.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      player.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                      player.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                      player.performance === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {player.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.attendance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player._id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTrainingSessions = () => (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Training Sessions</h2>
          <button
            onClick={() => setShowAddTrainingModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Training
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading training sessions...</p>
        </div>
      ) : trainingSessions.length === 0 ? (
        <div className="p-8 text-center">
          <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Sessions</h3>
          <p className="text-gray-500 mb-4">Start planning your team's training schedule.</p>
          <button
            onClick={() => setShowAddTrainingModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule First Session
          </button>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingSessions.map((session) => (
              <div key={session._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{session.title}</h3>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTraining(session._id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {session.startTime} - {session.endTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {session.location}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    session.type === 'Technical Skills' ? 'bg-blue-100 text-blue-800' :
                    session.type === 'Physical Fitness' ? 'bg-red-100 text-red-800' :
                    session.type === 'Tactical Training' ? 'bg-purple-100 text-purple-800' :
                    session.type === 'Scrimmage' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    session.intensity === 'High' ? 'bg-red-100 text-red-800' :
                    session.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {session.intensity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMatches = () => (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Matches</h2>
          <button
            onClick={() => setShowAddMatchModal(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Match
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="p-8 text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Scheduled</h3>
          <p className="text-gray-500 mb-4">Schedule your team's upcoming matches.</p>
          <button
            onClick={() => setShowAddMatchModal(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule First Match
          </button>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div key={match._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{match.title}</h3>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMatch(match._id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    vs {match.opponent.name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {match.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {match.venue.name} {match.venue.isHome ? '(Home)' : '(Away)'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    match.type === 'League' ? 'bg-blue-100 text-blue-800' :
                    match.type === 'Cup' ? 'bg-purple-100 text-purple-800' :
                    match.type === 'Tournament' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {match.type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    match.importance === 'Critical' ? 'bg-red-100 text-red-800' :
                    match.importance === 'High' ? 'bg-orange-100 text-orange-800' :
                    match.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {match.importance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Whistle className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Coach Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/payment')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Payment Portal
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'players', label: 'Players', icon: Users },
              { id: 'sessions', label: 'Training', icon: ClipboardList },
              { id: 'matches', label: 'Matches', icon: Trophy },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'players' && renderPlayers()}
        {activeTab === 'sessions' && renderTrainingSessions()}
        {activeTab === 'matches' && renderMatches()}
      </div>

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onPlayerAdded={handlePlayerAdded}
        coachId={user?.id || ''}
      />

      {/* Add Training Modal */}
      <AddTrainingModal
        isOpen={showAddTrainingModal}
        onClose={() => setShowAddTrainingModal(false)}
        onTrainingAdded={handleTrainingAdded}
        coachId={user?.id || ''}
      />

      {/* Add Match Modal */}
      <AddMatchModal
        isOpen={showAddMatchModal}
        onClose={() => setShowAddMatchModal(false)}
        onMatchAdded={handleMatchAdded}
        coachId={user?.id || ''}
      />
    </div>
  );
};

export default CoachDashboard;