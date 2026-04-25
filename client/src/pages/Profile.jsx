import React, { useState, useEffect } from 'react';
import { User, Phone, Shield, Plus, Trash2, Heart } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRel, setNewRel] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Mock fetch contacts
    setContacts([
      { id: 1, name: 'John Doe', phone: '+251 911 223344', relationship: 'Brother' },
      { id: 2, name: 'Jane Smith', phone: '+251 922 556677', relationship: 'Mother' }
    ]);
  }, []);

  const addContact = (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    const contact = { id: Date.now(), name: newName, phone: newPhone, relationship: newRel };
    setContacts([...contacts, contact]);
    setNewName(''); setNewPhone(''); setNewRel('');
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pt-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl shadow-red-600/20">
          {user.name?.[0]}
        </div>
        <div>
          <h1 className="text-4xl font-black">{user.name}</h1>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart size={24} className="text-red-500" /> Emergency Contacts
          </h2>
          <div className="space-y-4">
            {contacts.map(contact => (
              <div key={contact.id} className="glass p-5 rounded-2xl flex justify-between items-center group">
                <div>
                  <h4 className="font-bold">{contact.name}</h4>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Phone size={12} /> {contact.phone}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest font-black text-secondary mt-1 block">{contact.relationship}</span>
                </div>
                <button onClick={() => removeContact(contact.id)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Add New Contact</h2>
          <form onSubmit={addContact} className="glass p-6 rounded-3xl space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-red-600 outline-none" 
                placeholder="e.g. Samuel Ayele"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-red-600 outline-none" 
                placeholder="+251 ..."
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Relationship</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-red-600 outline-none" 
                placeholder="e.g. Father"
                value={newRel}
                onChange={(e) => setNewRel(e.target.value)}
              />
            </div>
            <button className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2">
              <Plus size={20} /> Save Contact
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
