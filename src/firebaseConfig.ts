// Import Firebase SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAohe7e5dL96C-4xMAL4ouTHz--QGLy5PY",
  authDomain: "logiflow-44267.firebaseapp.com",
  projectId: "logiflow-44267",
  storageBucket: "logiflow-44267.appspot.com", // ✅ Fixed ".app" typo
  messagingSenderId: "832073087490",
  appId: "1:832073087490:web:cf98196ba388fde90f451b",
  measurementId: "G-XHPX32S8D0",
};

// ✅ Prevent duplicate Firebase app initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

console.log("🔥 Firestore Initialized:", db);

export { app };
