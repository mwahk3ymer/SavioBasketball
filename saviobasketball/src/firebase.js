// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACATQZVTnMe9NVpRK6CE6jiPr0W5s1_e8",
  authDomain: "saviobasketball.firebaseapp.com",
  projectId: "saviobasketball",
  storageBucket: "saviobasketball.firebasestorage.app",
  messagingSenderId: "548654606247",
  appId: "1:548654606247:web:bcba751552e1cb0691b882",
  measurementId: "G-03NJSMFRDC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
