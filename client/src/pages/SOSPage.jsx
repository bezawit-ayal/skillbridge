import React from 'react';
import { AlertTriangle, Home, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SOSPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-red-950/20">
            <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mb-8 sos-pulse">
                <AlertTriangle size={64} className="text-white" />
            </div>
            
            <h1 className="text-5xl font-black text-center mb-4">SOS ACTIVE</h1>
            <p className="text-slate-400 text-xl text-center mb-12 max-w-md">
                Emergency services and your contacts have been notified. Stay calm and remain at your location.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center gap-3 py-5 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                >
                    <Home size={20} /> DASHBOARD
                </button>
                <button 
                    className="flex items-center justify-center gap-3 py-5 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                    <Phone size={20} /> CALL HELP
                </button>
            </div>
        </div>
    );
};

export default SOSPage;
