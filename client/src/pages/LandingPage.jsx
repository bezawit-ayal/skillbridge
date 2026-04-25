import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Bell, Map as MapIcon, ChevronRight, Activity, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-red-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter">SafeRoute</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="px-6 py-2 font-bold hover:text-red-500 transition-all">Login</button>
            <button onClick={() => navigate('/register')} className="px-6 py-2 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-to-b from-red-600/10 to-transparent rounded-full -mt-[50%] blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-white/5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-red-500 mb-8 animate-bounce">
            <Zap size={14} /> Now available in Ethiopia
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
            Travel With <span className="text-red-600 underline decoration-red-600/30 underline-offset-8">Confidence</span>,<br />
            Arrive Safe.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            The world's most advanced travel safety system. Real-time tracking, AI accident detection, and automatic SOS alerts for you and your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-10 py-5 bg-red-600 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-red-600/40"
            >
              Get Started Free <ChevronRight />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 glass rounded-2xl font-black text-xl hover:bg-white/5 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Unmatched Protection</h2>
            <p className="text-slate-400">Everything you need to stay safe on the road.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass p-10 rounded-[3rem] hover:border-red-600/30 transition-all group">
              <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                <MapIcon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Routes</h3>
              <p className="text-slate-400">Choose between shortest, fastest, or the safest path based on real-time crime and accident data.</p>
            </div>

            <div className="glass p-10 rounded-[3rem] hover:border-accent/30 transition-all group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Accident Detection</h3>
              <p className="text-slate-400">Our AI monitors speed and movement patterns to automatically detect accidents within milliseconds.</p>
            </div>

            <div className="glass p-10 rounded-[3rem] hover:border-blue-500/30 transition-all group">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all">
                <Bell size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Auto SOS</h3>
              <p className="text-slate-400">If you stop responding after a detected event, your location is instantly sent to emergency services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto glass p-16 rounded-[4rem] flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black mb-4">Trusted by thousands of travelers</h2>
            <p className="text-slate-400">Join the community dedicated to safer travel.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <p className="text-5xl font-black text-red-600 mb-2">50k+</p>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-black text-accent mb-2">99.9%</p>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-black text-blue-500 mb-2">1.2k</p>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Lives Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-red-600" />
            <span className="text-xl font-black">SafeRoute</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 SafeRoute Emergency System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-all">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-all">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-all">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
