import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1KqzcUdG9A7730C4HzooMv4qR_prDRZk",
  authDomain: "mybookstore-63e72.firebaseapp.com",
  projectId: "mybookstore-63e72",
  storageBucket: "mybookstore-63e72.firebasestorage.app",
  messagingSenderId: "837631458380",
  appId: "1:837631458380:web:7e32c1c2ff4908dbdfc8e9",
  measurementId: "G-4HL2GB9MBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
