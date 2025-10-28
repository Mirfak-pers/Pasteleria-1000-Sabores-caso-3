// js/auth.js
import { auth } from './config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          alert('Inicio de sesión exitoso');
          window.location.href = 'index.html';
        })
        .catch(error => {
          console.error('Error al iniciar sesión:', error);
          alert('Error al iniciar sesión: ' + error.message);
        });
    });
  }

});