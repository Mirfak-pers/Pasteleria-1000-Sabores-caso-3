import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC01DeLX515dsD29to5rHeqaWC8RV98KNg",
  authDomain: "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
  projectId: "tiendapasteleriamilsabor-a7ac6",
  storageBucket: "tiendapasteleriamilsabor-a7ac6.firebasestorage.app",
  messagingSenderId: "522171765461",
  appId: "1:522171765461:web:6745850bf2a9735682885c",
  measurementId: "G-08JFT3CMHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);