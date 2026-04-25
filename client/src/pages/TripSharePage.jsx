import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Shield, MapPin, Navigation, Clock, AlertTriangle } from 'lucide-react';

const TripSharePage = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trips/share/${tripId}`);
        setTripData(res.data);
      } catch (err) {
        setError('Trip not found or link has expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
    // Refresh every 15 seconds for live updates
    const interval = setInterval(fetchTrip, 15000);
    return () => clearInterval(interval);
  }, [tripId]);

  const googleMapsUrl = tripData?.lastLocation
    ? `https://www.google.com/maps?q=${tripData.lastLocation.lat},${tripData.lastLocation.lng}`
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
          <Shield size={22} />
        </div>
        <span className="text-2xl font-black tracking-tighter">SafeRoute</span>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-slate-400 font-bold">Loading live location...</p>
        </div>
      )}

      {error && (
        <div className="glass p-10 rounded-3xl text-center max-w-md">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Link Not Found</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      )}

      {tripData && !loading && !error && (
        <div className="w-full max-w-lg space-y-6">
          <div className="glass p-8 rounded-[2.5rem] text-center">
            <div className="w-20 h-20 bg-red-600/10 border-2 border-red-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Navigation size={36} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-black mb-1">{tripData.travelerName}</h1>
            <p className="text-slate-400 font-medium mb-6">is currently on a SafeRoute trip</p>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              tripData.status === 'active' ? 'bg-accent/10 text-accent' : 'bg-slate-700 text-slate-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${tripData.status === 'active' ? 'bg-accent animate-pulse' : 'bg-slate-500'}`}></div>
              {tripData.status === 'active' ? 'LIVE TRACKING ACTIVE' : 'TRIP COMPLETED'}
            </div>
          </div>

          {/* Trip Details */}
          <div className="glass p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">From</p>
                <p className="font-bold">{tripData.startPoint}</p>
              </div>
            </div>
            <div className="ml-5 w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center shrink-0">
                <Navigation size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">To</p>
                <p className="font-bold">{tripData.destination}</p>
              </div>
            </div>
          </div>

          {/* Last Known Location */}
          {tripData.lastLocation ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-6 rounded-3xl flex items-center gap-4 hover:bg-white/5 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600/20 transition-all">
                <MapPin size={24} className="text-blue-400" />
              </div>
              <div className="flex-grow">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Last Known Location</p>
                <p className="font-bold text-sm mt-0.5">
                  {tripData.lastLocation.lat.toFixed(5)}, {tripData.lastLocation.lng.toFixed(5)}
                </p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full">Open Maps →</span>
            </a>
          ) : (
            <div className="glass p-6 rounded-3xl text-center text-slate-500">
              <p className="font-bold">Location not yet available</p>
              <p className="text-sm mt-1">Waiting for GPS signal...</p>
            </div>
          )}

          {/* Last Update */}
          <div className="flex items-center gap-2 justify-center text-slate-500 text-sm">
            <Clock size={14} />
            <span>Updates every 15 seconds · Last update: {new Date(tripData.updatedAt).toLocaleTimeString()}</span>
          </div>

          {/* Safety Notice */}
          <div className="glass p-5 rounded-2xl border border-red-600/20 text-center">
            <p className="text-xs text-slate-400">
              🛡️ This trip is being monitored by <strong className="text-red-500">SafeRoute Emergency System</strong>.
              Automatic SOS will activate if an incident is detected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSharePage;
