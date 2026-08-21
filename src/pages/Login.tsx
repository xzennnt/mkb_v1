import React, { useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#F1F5F9] font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-sm">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-center text-slate-800 mb-2 tracking-tight">
          Masuk ke MKB <br/>
          <span className="text-lg text-indigo-600">(Makan Kotoba Bergizi)</span>
        </h2>
        <p className="text-center text-slate-500 font-medium mb-8">
          "Makan kotoba 3x sehari untuk menutupi gizi Anda."
        </p>
        
        {error && (
          <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm mb-6 border border-rose-100 font-medium">
            {error}
          </div>
        )}

        <div className="mb-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 shadow-sm transition-colors flex items-center justify-center gap-3 disabled:bg-slate-100"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {loading ? 'Memproses...' : 'Lanjutkan dengan Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
