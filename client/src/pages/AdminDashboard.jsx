import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Map as MapIcon, Users, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sos/all', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setAlerts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch alerts');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/sos/${id}`, { status }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchAlerts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2">Command Center</h1>
          <p className="text-slate-400 text-lg">Real-time Emergency Monitoring</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <Users size={20} className="text-secondary" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Active Trips</p>
              <p className="text-xl font-black">24</p>
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Open Alerts</p>
              <p className="text-xl font-black text-red-500">{alerts.filter(a => a.status === 'pending').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" /> Recent Alerts
          </h2>
          
          {loading ? (
             <div className="h-64 flex items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
             </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert._id} className={`glass p-6 rounded-2xl border-l-4 transition-all ${
                alert.status === 'pending' ? 'border-l-red-600 bg-red-600/5' : 
                alert.status === 'responded' ? 'border-l-blue-500' : 'border-l-accent'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl ${alert.status === 'pending' ? 'bg-red-600' : 'bg-slate-800'}`}>
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{alert.userId?.name || 'Unknown User'}</h3>
                      <p className="text-slate-400 text-sm mb-2">{alert.message}</p>
                      <div className="flex gap-3 text-xs">
                        <span className="text-slate-500">{new Date(alert.createdAt).toLocaleString()}</span>
                        <a href={alert.mapsLink} target="_blank" rel="noreferrer" className="text-secondary flex items-center gap-1 hover:underline">
                          <MapIcon size={12} /> View Location <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {alert.status === 'pending' && (
                      <button onClick={() => updateStatus(alert._id, 'responded')} className="px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-700">
                        RESPOND
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button onClick={() => updateStatus(alert._id, 'resolved')} className="px-4 py-2 bg-accent text-slate-950 rounded-lg text-xs font-bold hover:bg-accent/80">
                        RESOLVE
                      </button>
                    )}
                    {alert.status === 'resolved' && (
                      <span className="flex items-center gap-1 text-accent font-bold text-sm">
                        <CheckCircle2 size={16} /> RESOLVED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-3xl h-[400px] flex flex-col items-center justify-center text-center bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
             <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-3xl"></div>
             <div className="relative z-10">
               <MapIcon size={48} className="text-secondary mx-auto mb-4" />
               <h3 className="text-xl font-bold mb-2">Live Map View</h3>
               <p className="text-slate-400 text-sm mb-6">Interactive monitoring map showing all active SOS locations.</p>
               <button className="btn-secondary w-full">Launch Map</button>
             </div>
           </div>

           <div className="glass p-8 rounded-3xl">
             <h3 className="text-xl font-bold mb-6">Pending Subscriptions</h3>
             <div className="space-y-4">
               {/* Mock pending payments */}
               {[1, 2].map(i => (
                 <div key={i} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-sm">User #{i}542</span>
                     <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold">ETB 299</span>
                   </div>
                   <p className="text-xs text-slate-500 mb-4">Ref: TXN-8273645{i}</p>
                   <div className="flex gap-2">
                     <button className="flex-grow py-2 bg-accent text-slate-950 text-xs font-bold rounded-lg">APPROVE</button>
                     <button className="py-2 px-3 bg-red-600/20 text-red-500 text-xs font-bold rounded-lg">REJECT</button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
