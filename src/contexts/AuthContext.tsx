import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserData } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, userData: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const today = new Date().toISOString().split('T')[0];
        
        if (userSnap.exists()) {
          const data = userSnap.data() as UserData;
          
          let newStreak = data.loginStreak || 1;
          const lastLogin = data.lastLoginDate || today;
          let loginHistory = data.loginHistory || (data.lastLoginDate ? [data.lastLoginDate] : []);
          
          let shouldUpdate = false;
          
          if (user.email === 'edwinageng113@gmail.com' && data.role !== 'admin') {
            data.role = 'admin';
            shouldUpdate = true;
          }
          
          if (lastLogin !== today) {
            const lastDate = new Date(lastLogin);
            const currentDate = new Date(today);
            const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1; // Reset streak
            }
            
            shouldUpdate = true;
          }
          
          if (!loginHistory.includes(today)) {
            loginHistory = [...loginHistory, today];
            shouldUpdate = true;
          }

          if (shouldUpdate) {
            const updates: any = { 
              lastLoginDate: today, 
              loginStreak: newStreak, 
              lastActiveDate: new Date().toISOString(),
              loginHistory
            };
            if (data.role === 'admin') {
              updates.role = 'admin';
            }
            if (!data.email && user.email) {
              updates.email = user.email;
              data.email = user.email;
            }
            setDoc(userRef, updates, { merge: true }).catch(console.error);
            setUserData({ ...data, ...updates });
          } else {
            setUserData(data);
          }
        } else {
          // Initialize new user
          const newUser: UserData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            role: user.email === 'edwinageng113@gmail.com' ? 'admin' : 'user',
            level: 1,
            points: 0,
            totalStudyTime: 0,
            masteredVocabCount: 0,
            lastActiveDate: new Date().toISOString(),
            lastLoginDate: today,
            loginStreak: 1,
            loginHistory: [today],
            isProfileComplete: false,
          };
          await setDoc(userRef, newUser);
          setUserData(newUser);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
