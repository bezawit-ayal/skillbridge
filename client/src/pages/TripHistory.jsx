import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Navigation, ChevronRight, Clock, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TripHistory = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/trips/history', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setTrips(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to load trip history');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 pt-12">
            <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
                <Calendar className="text-red-600" /> Trip History
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            ) : trips.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl">
                    <p className="text-slate-500 italic">No trips recorded yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {trips.map(trip => (
                        <div key={trip._id} className="glass p-8 rounded-[2.5rem] group hover:border-red-600/30 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <Clock size={12} /> {new Date(trip.createdAt).toLocaleDateString()}
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                    trip.status === 'completed' ? 'bg-accent/20 text-accent' : 'bg-red-600/20 text-red-600'
                                }`}>
                                    {trip.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Start</p>
                                            <p className="font-bold">{trip.startPoint}</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-6 bg-slate-800 ml-4"></div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                                            <Navigation size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Destination</p>
                                            <p className="font-bold">{trip.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Safety Score</p>
                                        <p className="text-xl font-black text-accent">{trip.safetyScore}%</p>
                                    </div>
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Duration</p>
                                        <p className="text-xl font-black">{trip.duration || '--'}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                                View Details <ChevronRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TripHistory;
