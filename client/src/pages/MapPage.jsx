import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Shield, AlertTriangle, CheckCircle, Clock, Navigation, Map as MapIcon, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { saveAlertOffline, syncOfflineAlerts } from '../services/offlineSync';

const MapPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [speed, setSpeed] = useState(0);
  
  const lastPosRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const countdownInterval = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY"
  });

  useEffect(() => {
    fetchRoutes();
    syncOfflineAlerts();
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = { lat: latitude, lng: longitude };
        
        if (lastPosRef.current) {
          const dist = calculateDistance(lastPosRef.current, newPos);
          const time = (Date.now() - lastTimeRef.current) / 1000 / 3600;
          const currentSpeed = dist / time || 0;
          setSpeed(Math.round(currentSpeed));

          if (speed > 40 && currentSpeed === 0) {
            triggerSafetyCheck();
          }
        }

        setCurrentPosition(newPos);
        lastPosRef.current = newPos;
        lastTimeRef.current = Date.now();
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [speed]);

  const fetchRoutes = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/routes/generate', {
        start: state?.startPoint,
        destination: state?.destination
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setRoutes(res.data);
      setSelectedRoute(res.data.find(r => r.id === 'safest') || res.data[0]);
    } catch (err) {
      console.error('Failed to fetch routes');
    }
  };

  const calculateDistance = (p1, p2) => {
    const R = 6371;
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLon = (p2.lng - p1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const triggerSafetyCheck = () => {
    if (isSafetyModalOpen) return;
    setIsSafetyModalOpen(true);
    setCountdown(300);
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          triggerSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerSOS = async () => {
    setIsSafetyModalOpen(false);
    clearInterval(countdownInterval.current);
    
    const alertData = {
      lat: currentPosition?.lat,
      lng: currentPosition?.lng,
      message: 'AUTOMATIC SOS: Potential Accident Detected'
    };

    if (!navigator.onLine) {
      saveAlertOffline(alertData);
      alert('Offline! SOS saved locally and will sync when internet returns. Sending SMS fallback...');
      triggerSMSFallback();
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/sos/trigger', alertData, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      alert('AUTOMATIC SOS SENT!');
    } catch (err) {
      saveAlertOffline(alertData);
      alert('Network error! SOS saved locally.');
    }
  };

  const triggerSMSFallback = () => {
    const mapsLink = `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}`;
    const message = encodeURIComponent(`EMERGENCY SOS: Help me! My location: ${mapsLink}`);
    window.location.href = `sms:?body=${message}`;
  };

  const handleFinishTrip = async () => {
    try {
      await axios.post('http://localhost:5000/api/trips/start', {
        startPoint: state?.startPoint || 'Current Location',
        destination: state?.destination
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      toast.success('Trip saved to history!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save trip');
    }
  };

  const handleImSafe = () => {
    setIsSafetyModalOpen(false);
    clearInterval(countdownInterval.current);
    alert('Glad you are safe! Monitoring continues.');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={currentPosition || { lat: 0, lng: 0 }}
          zoom={15}
          options={{ styles: mapDarkStyles, disableDefaultUI: true }}
        >
          {currentPosition && <Marker position={currentPosition} />}
        </GoogleMap>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Top Overlays */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
        <div className="glass p-4 rounded-2xl pointer-events-auto flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${monitoringActive ? 'bg-accent animate-pulse' : 'bg-slate-500'}`}></div>
          <span className="font-bold text-sm tracking-widest uppercase">Monitoring Active</span>
        </div>
        
        <div className="glass p-4 rounded-2xl pointer-events-auto flex flex-col items-end">
          <span className="text-xs text-slate-400 uppercase font-bold">Speed</span>
          <span className="text-2xl font-black">{speed} <small className="text-sm font-normal">km/h</small></span>
        </div>
      </div>

      {/* Route Selector (Floating Left) */}
      <div className="absolute left-6 top-24 bottom-32 w-80 pointer-events-none flex flex-col gap-4">
        <h3 className="glass p-4 rounded-2xl font-bold text-sm uppercase tracking-widest pointer-events-auto">Available Routes</h3>
        <div className="flex-grow overflow-y-auto space-y-3 pointer-events-auto no-scrollbar">
          {routes.map(route => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`w-full glass p-5 rounded-3xl text-left transition-all border-l-4 ${
                selectedRoute?.id === route.id ? 'border-l-red-600 bg-red-600/10' : 'border-l-transparent hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{route.name}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                  route.color === 'green' ? 'bg-accent/20 text-accent' :
                  route.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {route.indicator}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} /> {route.duration}</span>
                <span className="flex items-center gap-1"><MapIcon size={12} /> {route.distance}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-xl glass p-6 rounded-[2.5rem] pointer-events-auto flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center shadow-lg shadow-red-600/20">
             <Navigation size={32} />
           </div>
           <div>
             <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Navigating to</p>
             <h3 className="text-xl font-bold truncate max-w-[180px]">{state?.destination || 'Target'}</h3>
           </div>
        </div>
        
        <div className="h-12 w-px bg-white/10 mx-4"></div>
        
        <div className="flex-grow grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Safety Score</p>
            <p className={`text-lg font-black ${selectedRoute?.color === 'green' ? 'text-accent' : 'text-yellow-500'}`}>
              {selectedRoute?.safetyScore || 0}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">ETA</p>
            <p className="text-lg font-black">{selectedRoute?.duration || '--'}</p>
          </div>
        </div>
        
        <button 
          onClick={handleFinishTrip}
          className="ml-4 p-4 bg-white text-slate-950 rounded-2xl hover:scale-105 transition-all"
        >
          <CheckCircle size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Safety Modal (Same as before) */}
      {isSafetyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
          <div className="w-full max-w-sm text-center">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 sos-pulse">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Are You Safe?</h2>
            <p className="text-slate-400 mb-8 text-lg">Potential incident detected. If no response, emergency services will be contacted.</p>
            <div className="text-7xl font-mono font-black mb-12 text-red-500 tracking-tighter">{formatTime(countdown)}</div>
            <div className="space-y-4">
              <button onClick={handleImSafe} className="w-full py-5 bg-accent text-slate-950 font-black text-xl rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <CheckCircle size={24} /> I'M SAFE
              </button>
              <button onClick={triggerSOS} className="w-full py-5 bg-red-600 text-white font-black text-xl rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <AlertTriangle size={24} /> SEND HELP NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapDarkStyles = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] }
];

export default MapPage;
