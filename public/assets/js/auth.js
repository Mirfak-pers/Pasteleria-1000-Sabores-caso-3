// js/auth.js
// Login con Firebase v8

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById('formLogin');
    const mensaje = document.getElementById('mensaje');

    if (formLogin) {
        formLogin.addEventListener('submit', async function (e) {
            e.preventDefault();

            const correo = document.getElementById('correoLogin').value.trim();
            const password = document.getElementById('passwordLogin').value;

            // Validaciones básicas
            if (!correo || !password) {
                mostrarMensaje('Por favor completa todos los campos', 'danger');
                return;
            }

            if (password.length < 4 || password.length > 10) {
                mostrarMensaje('La contraseña debe tener entre 4 y 10 caracteres', 'danger');
                return;
            }

            // Validar formato de correo
            const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            const correoValido = dominiosPermitidos.some(dominio => correo.endsWith(dominio));
            
            if (!correoValido) {
                mostrarMensaje('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com', 'danger');
                return;
            }

            try {
                // Iniciar sesión con Firebase Auth
                const userCredential = await auth.signInWithEmailAndPassword(correo, password);
                const user = userCredential.user;

                console.log('✅ Usuario autenticado:', user.uid);
                mostrarMensaje('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

                // Verificar si existe el perfil en Firestore
                const perfilDoc = await db.collection('usuario').doc(user.uid).get();
                
                if (!perfilDoc.exists) {
                    // Crear perfil básico si no existe
                    await db.collection('usuario').doc(user.uid).set({
                        nombre: user.displayName || correo.split('@')[0],
                        correo: user.email,
                        telefono: "",
                        clave: "", // No guardar contraseña aquí por seguridad
                        rut: "",
                        fechaNacimiento: null,
                        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log('✅ Perfil de usuario creado');
                }

                // Redirigir después de 1 segundo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            } catch (error) {
                console.error('❌ Error al iniciar sesión:', error);
                
                let mensajeError = 'Error al iniciar sesión';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        mensajeError = 'No existe una cuenta con este correo';
                        break;
                    case 'auth/wrong-password':
                        mensajeError = 'Contraseña incorrecta';
                        break;
                    case 'auth/invalid-email':
                        mensajeError = 'Formato de correo inválido';
                        break;
                    case 'auth/too-many-requests':
                        mensajeError = 'Demasiados intentos. Intenta más tarde';
                        break;
                    default:
                        mensajeError = error.message;
                }
                
                mostrarMensaje(mensajeError, 'danger');
            }
        });
    }

    function mostrarMensaje(texto, tipo) {
        if (mensaje) {
            mensaje.textContent = texto;
            mensaje.className = `alert alert-${tipo}`;
            mensaje.style.display = 'block';
            
            // Ocultar después de 5 segundos
            setTimeout(() => {
                mensaje.style.display = 'none';
            }, 5000);
        }
    }
});