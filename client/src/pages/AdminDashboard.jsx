import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlertCircle, Map as MapIcon, Users, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { io } from 'socket.io-client';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveUsers, setLiveUsers] = useState({});
  const [pendingPayments, setPendingPayments] = useState([]);
  const socketRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY"
  });

  useEffect(() => {
    fetchAlerts();
    fetchPendingPayments();
    
    // Connect to WebSocket Server
    socketRef.current = io('http://localhost:5000');
    
    // Join admin room
    socketRef.current.emit('join_admin');

    // Listen for live location updates (every 3s)
    socketRef.current.on('live_location', (data) => {
      setLiveUsers((prev) => ({
        ...prev,
        [data.userId]: data.location
      }));
    });

    // Listen for instant emergency triggers
    socketRef.current.on('emergency_trigger', (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
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

  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/payment/pending', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setPendingPayments(res.data);
    } catch (err) {
      console.error('Failed to fetch pending payments');
    }
  };

  const handlePaymentAction = async (id, action) => {
    try {
      await axios.post(`http://localhost:5000/api/payment/${action}/${id}`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchPendingPayments();
      alert(`Payment ${action}d successfully`);
    } catch (err) {
      alert(`Failed to ${action} payment`);
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
           <div className="glass p-8 rounded-3xl h-[400px] flex flex-col relative overflow-hidden">
             {isLoaded ? (
               <div className="absolute inset-0">
                 <GoogleMap
                   mapContainerStyle={{ width: '100%', height: '100%' }}
                   center={{ lat: 9.03, lng: 38.74 }} // Default center (Addis Ababa)
                   zoom={12}
                   options={{ styles: mapDarkStyles, disableDefaultUI: true }}
                 >
                   {Object.keys(liveUsers).map(userId => (
                     <Marker 
                       key={userId} 
                       position={liveUsers[userId]} 
                       icon={{
                         path: window.google.maps.SymbolPath.CIRCLE,
                         scale: 8,
                         fillColor: "#ff0000",
                         fillOpacity: 1,
                         strokeWeight: 2,
                         strokeColor: "#ffffff"
                       }}
                     />
                   ))}
                 </GoogleMap>
               </div>
             ) : (
               <div className="h-full w-full flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
               </div>
             )}
             
             <div className="relative z-10 pointer-events-none flex justify-between items-start">
               <h3 className="text-xl font-bold bg-slate-950/50 backdrop-blur-md px-4 py-2 rounded-xl inline-block border border-white/10">Live Tracking Map</h3>
               <div className="bg-red-600/20 border border-red-600 text-red-500 font-bold px-3 py-1 rounded-full text-xs animate-pulse">
                 {Object.keys(liveUsers).length} Active Trackers
               </div>
             </div>
           </div>

           <div className="glass p-8 rounded-3xl">
             <h3 className="text-xl font-bold mb-6">Pending Subscriptions</h3>
             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {pendingPayments.length === 0 ? (
                 <p className="text-sm text-slate-500 text-center py-4">No pending payments.</p>
               ) : (
                 pendingPayments.map(payment => (
                   <div key={payment._id} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                     <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-sm">{payment.userId?.name || 'Unknown User'}</span>
                       <span className="text-[10px] uppercase bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold">
                         {payment.plan}
                       </span>
                     </div>
                     <p className="text-xs text-slate-500 mb-1">Ref: {payment.refNumber}</p>
                     <p className="text-xs text-slate-500 mb-4">Method: <span className="uppercase">{payment.paymentMethod}</span></p>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => handlePaymentAction(payment._id, 'approve')}
                         className="flex-grow py-2 bg-accent text-slate-950 text-xs font-bold rounded-lg hover:bg-accent/80 transition-colors"
                       >
                         APPROVE
                       </button>
                       <button 
                         onClick={() => handlePaymentAction(payment._id, 'reject')}
                         className="py-2 px-3 bg-red-600/20 text-red-500 text-xs font-bold rounded-lg hover:bg-red-600/40 transition-colors"
                       >
                         REJECT
                       </button>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const mapDarkStyles = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] }
];

export default AdminDashboard;
