import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, MapPin, Navigation, History, ShieldCheck, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');

  const handleStartTrip = () => {
    if (!destination) return alert('Please enter a destination');
    navigate('/map', { state: { startPoint, destination } });
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Welcome, {user.name}</h1>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={18} className="text-accent" />
            <span>Plan: {user.subscriptionStatus?.plan || 'Free'}</span>
          </div>
        </div>
        <button onClick={logout} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
          <LogOut size={24} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-red-600/20 transition-all"></div>
            
            <h2 className="text-2xl font-bold mb-6">Start a New Safe Trip</h2>
            
            <div className="space-y-4 mb-8">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Starting Location (or Current Location)"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                />
              </div>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleStartTrip}
              className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 shadow-xl shadow-red-600/30"
            >
              <Play fill="currentColor" /> Start Safe Trip
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/history')}
              className="glass p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-800/80 transition-all"
            >
              <History size={28} className="text-secondary" />
              <span className="font-semibold">Trip History</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="glass p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-slate-800/80 transition-all"
            >
              <ShieldCheck size={28} className="text-accent" />
              <span className="font-semibold">Emergency Contacts</span>
            </button>
          </div>
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border-l-4 border-l-accent">
            <h3 className="text-lg font-bold mb-2">Safety Tip</h3>
            <p className="text-slate-400 text-sm">Always ensure your phone's battery is above 20% before starting a long trip.</p>
          </div>

          <div className="glass p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
            <h3 className="text-lg font-bold mb-4">Subscription</h3>
            <p className="text-slate-400 text-sm mb-4">Upgrade to Premium to enable Auto SOS and Real-time Tracking sharing.</p>
            <button 
              onClick={() => navigate('/subscription')}
              className="w-full py-2 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-200 transition-all"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
