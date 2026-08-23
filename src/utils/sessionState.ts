import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export async function saveSessionState(uid: string | undefined, key: string, state: any) {
  const jsonStr = JSON.stringify(state);
  localStorage.setItem(key, jsonStr);
  
  if (uid) {
    try {
      await setDoc(doc(db, 'active_sessions', `${uid}_${key}`), {
        userId: uid,
        stateData: jsonStr,
        updatedAt: Date.now()
      });
    } catch (e) {
      console.error('Failed to save session state to DB', e);
    }
  }
}

export async function getSessionState(uid: string | undefined, key: string) {
  if (uid) {
    try {
      const docSnap = await getDoc(doc(db, 'active_sessions', `${uid}_${key}`));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.stateData) {
          // Sync back to local storage just in case
          localStorage.setItem(key, data.stateData);
          return data.stateData;
        }
      }
    } catch (e) {
      console.error('Failed to get session state from DB', e);
    }
  }
  return localStorage.getItem(key);
}

export async function removeSessionState(uid: string | undefined, key: string) {
  localStorage.removeItem(key);
  if (uid) {
    try {
      await deleteDoc(doc(db, 'active_sessions', `${uid}_${key}`));
    } catch (e) {
      console.error('Failed to remove session state from DB', e);
    }
  }
}
