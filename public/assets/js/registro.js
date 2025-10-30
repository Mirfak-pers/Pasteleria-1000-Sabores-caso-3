// js/registro.js
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const confirmarCorreo = document.getElementById('confirmar-correo').value.trim();
            const contrasena = document.getElementById('contrasena').value;
            const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
            const telefono = document.getElementById('telefono').value.trim();
            
            // Validaciones adicionales del lado del cliente
            let isValid = true;
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
                el.style.display = 'none';
            });
            
            if (correo !== confirmarCorreo) {
                const errorEl = document.getElementById('confirm-email-error');
                errorEl.textContent = 'Los correos no coinciden.';
                errorEl.style.display = 'block';
                isValid = false;
            }
            if (contrasena !== confirmarContrasena) {
                const errorEl = document.getElementById('confirm-password-error');
                errorEl.textContent = 'Las contraseñas no coinciden.';
                errorEl.style.display = 'block';
                isValid = false;
            }
            if (!nombre || !correo) {
                alert('Por favor, completa todos los campos obligatorios (Nombre y Correo).');
                isValid = false;
            }
            if (contrasena.length < 6) {
                const errorEl = document.getElementById('password-error');
                errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                errorEl.style.display = 'block';
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            try {
                // Crear usuario con Firebase v8
                const userCredential = await auth.createUserWithEmailAndPassword(correo, contrasena);
                const user = userCredential.user;
                console.log('Usuario registrado con Auth:', user.uid);
                
                // Guardar perfil adicional en Firestore
                const userProfile = {
                    nombre: nombre,
                    correo: correo,
                    telefono: telefono || null,
                    uid: user.uid,
                    fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await db.collection("usuarios").doc(user.uid).set(userProfile);
                console.log('Perfil de usuario guardado en Firestore.');
                
                alert('Usuario registrado exitosamente. ¡Bienvenido/a!');
                window.location.href = 'index.html';
                
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                let errorMessage = 'Error al registrar usuario.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'El correo electrónico ya está registrado.';
                    const errorEl = document.getElementById('email-error');
                    errorEl.textContent = 'El correo ya está en uso.';
                    errorEl.style.display = 'block';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'La contraseña es muy débil.';
                    const errorEl = document.getElementById('password-error');
                    errorEl.textContent = 'Contraseña débil.';
                    errorEl.style.display = 'block';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'El correo electrónico no es válido.';
                    const errorEl = document.getElementById('email-error');
                    errorEl.textContent = 'Correo inválido.';
                    errorEl.style.display = 'block';
                }
                alert(errorMessage);
            }
        });
    }
});