import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

async function test() {
  const env = await initializeTestEnvironment({
    projectId: "demo-test-admin",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8")
    }
  });

  // Setup admin user
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.collection('users').doc('admin123').set({ role: 'admin' });
    await db.collection('user_progress').doc('prog1').set({ userId: 'targetUser' });
    await db.collection('study_sessions').doc('sess1').set({ userId: 'targetUser' });
    await db.collection('active_sessions').doc('targetUser_flash').set({ userId: 'targetUser' });
  });

  const db = env.authenticatedContext('admin123', { email: 'admin@example.com' }).firestore();
  
  try {
    const snap = await db.collection("user_progress").where('userId', '==', 'targetUser').get();
    console.log("Read user_progress allowed", snap.size);
    for (const d of snap.docs) {
      await d.ref.delete();
    }
    console.log("Delete user_progress allowed");
  } catch(e) {
    console.log("Error user_progress:", e);
  }

  try {
    const snap = await db.collection("study_sessions").where('userId', '==', 'targetUser').get();
    console.log("Read study_sessions allowed", snap.size);
    for (const d of snap.docs) {
      await d.ref.delete();
    }
    console.log("Delete study_sessions allowed");
  } catch(e) {
    console.log("Error study_sessions:", e);
  }

  try {
    const snap = await db.collection("active_sessions").where('userId', '==', 'targetUser').get();
    console.log("Read active_sessions allowed", snap.size);
    for (const d of snap.docs) {
      await d.ref.delete();
    }
    console.log("Delete active_sessions allowed");
  } catch(e) {
    console.log("Error active_sessions:", e);
  }
  
  try {
    await db.collection('users').doc('targetUser').update({ points: 0 });
    console.log("Update users allowed");
  } catch(e) {
    console.log("Error update users:", e);
  }

  await env.cleanup();
}

test();
