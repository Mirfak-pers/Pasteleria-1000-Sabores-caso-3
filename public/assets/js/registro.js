// js/registro.js
import { auth, db } from './config.js';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Obtener valores del formulario (sin región ni comuna)
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const confirmarCorreo = document.getElementById('confirmar-correo').value.trim();
            const contrasena = document.getElementById('contrasena').value;
            const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
            const telefono = document.getElementById('telefono').value.trim();
            // const region = document.getElementById('region').value; // Eliminado
            // const comuna = document.getElementById('comuna').value; // Eliminado

            // Validaciones adicionales del lado del cliente
            let isValid = true;
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

            if (correo !== confirmarCorreo) {
                document.getElementById('confirm-email-error').textContent = 'Los correos no coinciden.';
                isValid = false;
            }
            if (contrasena !== confirmarContrasena) {
                document.getElementById('confirm-password-error').textContent = 'Las contraseñas no coinciden.';
                isValid = false;
            }
            if (!nombre || !correo) { // Ahora solo nombre y correo son obligatorios
                 alert('Por favor, completa todos los campos obligatorios (Nombre y Correo).');
                 isValid = false;
            }
            if (contrasena.length < 6) {
                document.getElementById('password-error').textContent = 'La contraseña debe tener al menos 6 caracteres.';
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
                const user = userCredential.user;
                console.log('Usuario registrado con Auth:', user.uid);

                // Guardar perfil adicional en Firestore (sin región ni comuna)
                const userProfile = {
                    nombre: nombre,
                    correo: correo,
                    telefono: telefono || null,
                    // region: region, // Eliminado
                    // comuna: comuna, // Eliminado
                    uid: user.uid,
                    fechaRegistro: new Date()
                };

                await setDoc(doc(db, "usuarios", user.uid), userProfile);
                console.log('Perfil de usuario guardado en Firestore.');

                alert('Usuario registrado exitosamente. Bienvenido/a!');
                window.location.href = 'index.html';

            } catch (error) {
                console.error('Error al registrar usuario:', error);
                let errorMessage = 'Error al registrar usuario.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'El correo electrónico ya está registrado.';
                    document.getElementById('email-error').textContent = 'El correo ya está en uso.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'La contraseña es muy débil.';
                    document.getElementById('password-error').textContent = 'Contraseña débil.';
                }
                alert(errorMessage);
            }
        });
    }
});