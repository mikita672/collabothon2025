import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiDMw6RAcQLECgPvtwOEgAxaij27qDvvs",
  authDomain: "collabothon2025-f1484.firebaseapp.com",
  projectId: "collabothon2025-f1484",
  storageBucket: "collabothon2025-f1484.firebasestorage.app",
  messagingSenderId: "938406849296",
  appId: "1:938406849296:web:8f11c2e602b8d2f0775395"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;