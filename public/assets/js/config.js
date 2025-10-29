// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Comentamos analytics por ahora si no lo vamos a usar
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC01DeLX515dsD29to5rHeqaWC8RV98KNg",
  authDomain: "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
  databaseURL: "  https://tiendapasteleriamilsabor-a7ac6-default-rtdb.firebaseio.com  ",
  projectId: "tiendapasteleriamilsabor-a7ac6",
  storageBucket: "tiendapasteleriamilsabor-a7ac6.firebasestorage.app",
  messagingSenderId: "522171765461",
  appId: "1:522171765461:web:6745850bf2a9735682885c",
  measurementId: "G-08JFT3CMHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Comentamos analytics por ahora si no lo vamos a usar

// Inicializar servicios que sí vamos a usar
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Exportar instancias para usarlas en otros archivos
export const db = getFirestore(app);
export const auth = getAuth(app);