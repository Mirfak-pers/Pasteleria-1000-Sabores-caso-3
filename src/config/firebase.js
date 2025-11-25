// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase (cámbiala por la tuya real)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDummy-Key-Replace-This",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "tiendapasteleriamilsabor-a7ac6",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tiendapasteleriamilsabor-a7ac6.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;