import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

export default function SetupProfile() {
  const { currentUser, userData } = useAuth();
  const [name, setName] = useState(userData?.displayName || currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name.trim()) return;
    
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: name.trim(),
        isProfileComplete: true
      });
      
      // Force reload to update state smoothly
      window.location.href = '/'; 
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#F1F5F9] font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full shadow-sm border border-indigo-200">
            <User size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-center text-slate-800 mb-2 tracking-tight">
          Siapa Nama Anda?
        </h2>
        <p className="text-center text-slate-500 mb-8 text-sm">
          Masukkan nama panggilan yang akan digunakan di papan peringkat.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Nama Tampilan</label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-slate-50 focus:bg-white text-slate-800 font-bold text-lg text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 shadow-sm transition-colors disabled:bg-slate-300"
          >
            {loading ? 'Menyimpan...' : 'Mulai Belajar'}
          </button>
        </form>
      </div>
    </div>
  );
}
