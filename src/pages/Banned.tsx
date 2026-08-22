import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, AlertTriangle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Banned() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 max-w-md w-full text-center">
        <div className="bg-rose-100 text-rose-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Akun Diblokir</h1>
        <p className="text-slate-600 mb-8">
          Akses Anda ke aplikasi ini telah dibatasi oleh administrator. Jika Anda merasa ini adalah kesalahan, silakan hubungi dukungan.
        </p>
        <button 
          onClick={handleLogout}
          className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
        >
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </div>
  );
}
