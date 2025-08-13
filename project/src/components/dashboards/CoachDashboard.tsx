import React, { useState } from 'react';
import { Castle as Whistle, Users, Calendar, ClipboardList, LogOut, Bell, Plus, Trophy, Target, TrendingUp, User, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NewsCarousel from '../NewsCarousel';

const CoachDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'My Players', value: '24', change: '+2', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { title: 'Training Sessions', value: '18', change: '+4', icon: Target, color: 'text-green-600 bg-green-50' },
    { title: 'Upcoming Matches', value: '5', change: '0', icon: Trophy, color: 'text-yellow-600 bg-yellow-50' },
    { title: 'Team Ranking', value: '3rd', change: '+1', icon: Award, color: 'text-purple-600 bg-purple-50' },
  ];

  const players = [
    { id: '1', name: 'Alex Rodriguez', position: 'Midfielder', age: 16, performance: 'Excellent', attendance: '95%' },
    { id: '2', name: 'Jamie Smith', position: 'Forward', age: 17, performance: 'Good', attendance: '88%' },
    { id: '3', name: 'Taylor Johnson', position: 'Defender', age: 15, performance: 'Good', attendance: '92%' },
    { id: '4', name: 'Jordan Brown', position: 'Goalkeeper', age: 16, performance: 'Excellent', attendance: '97%' },
  ];

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
              <div key={player.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-500">{player.position}, Age {player.age}</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">{player.attendance}</span>
              </div>
            ))}
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
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Player
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {player.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.age}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    player.performance === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {player.performance}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        {activeTab === 'sessions' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Training Management</h3>
            <p className="text-gray-500">Training session management features coming soon...</p>
          </div>
        )}
        {activeTab === 'matches' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Match Management</h3>
            <p className="text-gray-500">Match scheduling and results coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachDashboard;