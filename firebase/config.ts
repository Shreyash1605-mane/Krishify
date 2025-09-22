import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration provided for Krishify
const firebaseConfig = {
  apiKey: "AIzaSyDKja6UuC_LE2pAo2yNCpwKRY0s5SumTiY",
  authDomain: "krishify-2217f.firebaseapp.com",
  projectId: "krishify-2217f",
  storageBucket: "krishify-2217f.firebasestorage.app",
  messagingSenderId: "863302069017",
  appId: "1:863302069017:web:3031f7dff005e78b313388",
  measurementId: "G-Q1GJLPY771"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// FIX: The import for getAnalytics and its initialization have been removed.
// This resolves a build error: "Module 'firebase/analytics' has no exported member 'getAnalytics'".
// The analytics feature was not used in the application.

export default app;
