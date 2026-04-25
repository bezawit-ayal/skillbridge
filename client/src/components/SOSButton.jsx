import React from 'react';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

const SOSButton = () => {
  const triggerSOS = async () => {
    if (confirm('Trigger Emergency SOS?')) {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          await axios.post('http://localhost:5000/api/sos/trigger', {
            lat: latitude,
            lng: longitude,
            message: 'Manual SOS Triggered via Floating Button'
          }, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          });
          alert('SOS Alert Sent to Emergency Contacts and Admin!');
        });
      } catch (err) {
        console.error('SOS Trigger Failed', err);
        // Fallback to SMS if internet fails
        if (!navigator.onLine) {
          triggerSMSFallback();
        }
      }
    }
  };

  const triggerSMSFallback = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const message = encodeURIComponent(`EMERGENCY SOS: Help me! My location: ${mapsLink}`);
      window.location.href = `sms:?body=${message}`;
    });
  };

  return (
    <button
      onClick={triggerSOS}
      className="fixed bottom-8 right-8 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 hover:bg-red-700 transition-all z-50 sos-pulse"
    >
      <AlertTriangle size={32} className="text-white" />
    </button>
  );
};

export default SOSButton;
