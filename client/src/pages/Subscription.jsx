import React from 'react';
import { Check, Shield, CreditCard, Smartphone } from 'lucide-react';

const Subscription = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      features: ['Basic Navigation', 'Manual SOS', '1 Emergency Contact'],
      accent: 'slate'
    },
    {
      name: 'Weekly',
      price: '99',
      features: ['Basic Navigation', 'Manual SOS', '3 Emergency Contacts', 'Real-time Tracking'],
      accent: 'blue'
    },
    {
      name: 'Monthly',
      price: '299',
      features: ['Full Features', 'Auto SOS', 'Unlimited Contacts', 'Accident Detection', 'Priority Alerts'],
      accent: 'red',
      recommended: true
    },
    {
      name: 'Yearly',
      price: '2499',
      features: ['All Monthly Features', 'Family Sharing', 'Offline Maps', 'Insurance Discounts'],
      accent: 'accent'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 pt-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4">Choose Your Safety Plan</h1>
        <p className="text-slate-400 text-xl">Protect yourself and your loved ones with SafeRoute Premium.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {plans.map((plan, i) => (
          <div key={i} className={`glass p-8 rounded-3xl relative flex flex-col ${plan.recommended ? 'border-2 border-red-600 scale-105 z-10' : ''}`}>
            {plan.recommended && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                RECOMMENDED
              </span>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black">ETB {plan.price}</span>
              <span className="text-slate-400 text-sm">/{plan.name === 'Yearly' ? 'year' : plan.name.toLowerCase()}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check size={18} className="text-accent shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.recommended ? 'bg-red-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>

      <div className="glass p-12 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CreditCard className="text-secondary" /> Supported Payments
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-6 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                <Smartphone size={32} className="text-accent" />
                <span className="font-bold">Telebirr</span>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                <Shield size={32} className="text-secondary" />
                <span className="font-bold">CBE Birr</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Manual Verification</h3>
            <p className="text-slate-400">
              After payment, please upload your transaction screenshot or enter the transaction reference number. Our team will verify and activate your plan within 15 minutes.
            </p>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Transaction Reference" 
                className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
              />
              <button className="bg-white text-slate-950 px-6 py-3 rounded-xl font-bold">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
