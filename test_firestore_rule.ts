import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

async function test() {
  const env = await initializeTestEnvironment({
    projectId: "demo-test",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8")
    }
  });

  const db = env.authenticatedContext('user123', { email: 'user@example.com' }).firestore();
  try {
    await db.collection("active_sessions").doc("user123_flashcard").get();
    console.log("Read allowed");
  } catch(e) {
    console.log("Error:", e);
  }
  
  await env.cleanup();
}

test();
