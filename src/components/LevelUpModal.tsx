import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Star, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LevelUpModal() {
  const { userData } = useAuth();
  const [show, setShow] = useState(false);
  const [level, setLevel] = useState(userData?.level || 1);
  const [prevLevel, setPrevLevel] = useState(userData?.level || 1);

  useEffect(() => {
    if (userData?.level && userData.level > level) {
      setPrevLevel(level);
      setLevel(userData.level);
      setShow(true);
      
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        setShow(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [userData?.level, level]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setShow(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-400 to-amber-200 opacity-20"></div>
            
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
              className="mx-auto w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-300 rounded-full flex items-center justify-center shadow-lg shadow-amber-200 mb-6 relative z-10"
            >
              <Trophy size={48} className="text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10"
            >
              <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">Level Up!</h2>
              <p className="text-slate-500 mb-6 font-medium">Kerja bagus, kamu naik level!</p>
              
              <div className="flex items-center justify-center gap-4 text-2xl font-black">
                <span className="text-slate-400">Lv {prevLevel}</span>
                <ChevronUp className="text-emerald-500" size={32} />
                <span className="text-amber-500 text-4xl">Lv {level}</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-xs text-slate-400 font-medium"
            >
              Ketuk untuk menutup
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
