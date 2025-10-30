// js/auth.js
// Login con Firebase v8

document.addEventListener("DOMContentLoaded", function () {
    console.log('auth.js cargado');
    
    // Verificar que Firebase esté disponible
    if (typeof firebase === 'undefined') {
        console.error('Firebase no está disponible');
        alert('Error: Firebase no está cargado. Por favor recarga la página.');
        return;
    }
    
    // Verificar que auth y db estén disponibles
    if (typeof auth === 'undefined' || typeof db === 'undefined') {
        console.error('auth o db no están definidos');
        alert('Error: Configuración de Firebase incompleta. Por favor recarga la página.');
        return;
    }
    
    console.log('Firebase configurado correctamente');
    
    const formLogin = document.getElementById('formLogin');
    const mensaje = document.getElementById('mensaje');

    if (!formLogin) {
        console.error('Formulario de login no encontrado');
        return;
    }
    
    console.log('Formulario de login encontrado');

    formLogin.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Formulario de login enviado');

        const correo = document.getElementById('correoLogin').value.trim();
        const password = document.getElementById('passwordLogin').value;

        console.log('Intentando login con:', correo);

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

        console.log('Validaciones pasadas, autenticando...');

        try {
            // Iniciar sesión con Firebase Auth v8
            console.log('Autenticando usuario...');
            const userCredential = await auth.signInWithEmailAndPassword(correo, password);
            const user = userCredential.user;

            console.log('✅ Usuario autenticado:', user.uid);
            console.log('Email:', user.email);
            mostrarMensaje('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

            // Verificar si existe el perfil en Firestore (colección "usuario")
            console.log('Verificando perfil en Firestore...');
            const perfilDoc = await db.collection('usuarios').doc(user.uid).get();
            
            if (!perfilDoc.exists) {
                console.log('Perfil no existe, creando nuevo perfil...');
                // Crear perfil básico si no existe
                await db.collection('usuarios').doc(user.uid).set({
                    nombre: user.displayName || correo.split('@')[0],
                    correo: user.email,
                    telefono: "",
                    clave: "", // No guardar contraseña aquí por seguridad
                    rut: "",
                    fechaNacimiento: null,
                    fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Perfil de usuario creado en colección "usuario"');
            }

            // TAMBIÉN verificar/crear en colección "clientes" para perfil-cliente
            console.log('Verificando perfil de cliente...');
            const clienteDoc = await db.collection('usuarios').doc(user.uid).get();
            
            if (!clienteDoc.exists) {
                console.log('Perfil de cliente no existe, creando...');
                const clienteProfile = {
                    nombre: user.displayName || correo.split('@')[0],
                    email: user.email,
                    telefono: "",
                    direccion: "",
                    fechaRegistro: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
                    puntos: 0,
                    fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await db.collection('usuarios').doc(user.uid).set(clienteProfile);
                console.log('✅ Perfil de cliente creado en colección "clientes"');
            }

            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1000);

        } catch (error) {
            console.error('❌ Error completo al iniciar sesión:', error);
            console.error('Código de error:', error.code);
            console.error('Mensaje de error:', error.message);
            
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
                case 'auth/invalid-credential':
                    mensajeError = 'Credenciales inválidas. Verifica tu correo y contraseña';
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

    function mostrarMensaje(texto, tipo) {
        if (mensaje) {
            mensaje.textContent = texto;
            mensaje.className = `alert alert-${tipo}`;
            mensaje.style.display = 'block';
            
            // Ocultar después de 5 segundos
            setTimeout(() => {
                mensaje.style.display = 'none';
            }, 5000);
        } else {
            // Si no existe el elemento mensaje, usar alert
            if (tipo === 'danger') {
                alert('❌ ' + texto);
            } else {
                alert('✅ ' + texto);
            }
        }
    }
});

// Función para cerrar sesión (usar en cualquier página)
function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        auth.signOut().then(() => {
            console.log('Sesión cerrada');
            alert('Has cerrado sesión correctamente');
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión');
        });
    }
}

// Exportar función globalmente
window.cerrarSesion = cerrarSesion;