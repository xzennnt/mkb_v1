import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

# Add calculateLevel import
if "import { calculateLevel }" not in content:
    content = content.replace("import { UserData } from '../types';", "import { UserData } from '../types';\nimport { calculateLevel } from '../utils/levelUtils';")
    content = content.replace("import { doc, getDoc, setDoc }", "import { doc, getDoc, setDoc, updateDoc, onSnapshot }")

new_effect = """  useEffect(() => {
    let userUnsub: () => void;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        
        userUnsub = onSnapshot(userRef, async (userSnap) => {
          const today = new Date().toISOString().split('T')[0];
          
          if (userSnap.exists()) {
            const data = userSnap.data() as UserData;
            
            let newStreak = data.loginStreak || 1;
            const lastLogin = data.lastLoginDate || today;
            let loginHistory = data.loginHistory || (data.lastLoginDate ? [data.lastLoginDate] : []);
            
            let shouldUpdate = false;
            let updates: any = {};
            
            if (user.email === 'edwinageng113@gmail.com' && data.role !== 'admin') {
              updates.role = 'admin';
              shouldUpdate = true;
            } else if (user.email !== 'edwinageng113@gmail.com' && data.role === 'admin') {
              updates.role = 'user';
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
              
              updates.lastLoginDate = today;
              updates.loginStreak = newStreak;
              updates.lastActiveDate = new Date().toISOString();
              
              shouldUpdate = true;
            }
            
            if (!loginHistory.includes(today)) {
              updates.loginHistory = [...loginHistory, today];
              shouldUpdate = true;
            }

            // Check level
            const correctLevel = calculateLevel(data.points || 0);
            if (correctLevel > (data.level || 1)) {
              updates.level = correctLevel;
              shouldUpdate = true;
            }
            
            if (shouldUpdate) {
              // Merge updates into data for local state immediately
              const newData = { ...data, ...updates };
              setUserData(newData);
              setLoading(false);
              // Fire and forget update
              await updateDoc(userRef, updates);
            } else {
              setUserData(data);
              setLoading(false);
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
            setLoading(false);
          }
        });
      } else {
        if (userUnsub) userUnsub();
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (userUnsub) userUnsub();
    };
  }, []);"""

# Replace the whole useEffect block
content = re.sub(r'  useEffect\(\(\) => \{.*?    return unsubscribe;\n  \}, \[\]\);', new_effect, content, flags=re.DOTALL)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)

print("AuthContext patched")
