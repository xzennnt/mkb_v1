import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Note: I cannot bypass the Firebase security rules/admin constraints directly from the server since I don't have the service account key here.
// I will provide an explicit fallback mechanism inside the React code to clean this up dynamically at runtime instead!
