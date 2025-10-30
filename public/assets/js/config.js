// assets/js/config.js
// Configuración de Firebase

const firebaseConfig = {
  apiKey: "AIzaSyC01DeLX515dsD29to5rHeqaWC8RV98KNg",
  authDomain: "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
  databaseURL: "https://tiendapasteleriamilsabor-a7ac6-default-rtdb.firebaseio.com",
  projectId: "tiendapasteleriamilsabor-a7ac6",
  storageBucket: "tiendapasteleriamilsabor-a7ac6.firebasestorage.app",
  messagingSenderId: "522171765461",
  appId: "1:522171765461:web:6745850bf2a9735682885c",
  measurementId: "G-08JFT3CMHR"
};

// Verificar que Firebase esté disponible
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK no está cargado. Asegúrate de incluir los scripts de Firebase en el HTML.');
} else {
  console.log('Inicializando Firebase...');
  
  // Inicializar Firebase solo si no está ya inicializado
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase inicializado correctamente');
  } else {
    console.log('Firebase ya está inicializado');
  }
}

// No es necesario exportar db aquí porque productos.js lo obtendrá directamente