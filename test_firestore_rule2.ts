import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

async function test() {
  const env = await initializeTestEnvironment({
    projectId: "demo-test2",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8")
    }
  });

  const db = env.authenticatedContext('user123', { email: 'user@example.com' }).firestore();
  
  try {
    await db.collection("active_sessions").doc("user123_flashcard").get();
    console.log("Read non-existent allowed");
  } catch(e) {
    console.log("Error reading non-existent:", e);
  }
  
  try {
    await db.collection("active_sessions").doc("user123_flashcard").set({
      userId: 'user123',
      stateData: 'test'
    });
    console.log("Create allowed");
  } catch(e) {
    console.log("Error creating:", e);
  }
  
  try {
    await db.collection("active_sessions").doc("user123_flashcard").get();
    console.log("Read existing allowed");
  } catch(e) {
    console.log("Error reading existing:", e);
  }

  await env.cleanup();
}

test();
