// contacto.js
// Gestión del formulario de contacto con Firebase

// Esperar a que Firebase esté inicializado
document.addEventListener("DOMContentLoaded", function () {
  console.log('Página de contacto cargada');
  
  // Verificar que Firebase esté disponible
  if (typeof firebase === 'undefined') {
    console.error('Firebase no está cargado');
    return;
  }
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Autocompletar campos si el usuario está autenticado
  auth.onAuthStateChanged(async function(user) {
    if (user) {
      console.log('Usuario autenticado:', user.email);
      
      // Autocompletar correo
      const inputCorreo = document.getElementById('correo');
      if (inputCorreo) {
        inputCorreo.value = user.email;
        inputCorreo.readOnly = true;
      }
      
      // Intentar obtener el nombre del usuario desde Firestore
      try {
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const inputNombre = document.getElementById('nombre');
          if (inputNombre && userData.nombre) {
            inputNombre.value = userData.nombre;
          }
        }
      } catch (error) {
        console.log('No se pudo cargar datos del usuario:', error);
      }
    } else {
      console.log('Usuario no autenticado');
    }
  });
  
  // Manejar el envío del formulario
  const formContacto = document.getElementById('formContacto');
  if (formContacto) {
    formContacto.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const comentario = document.getElementById('comentario').value.trim();
      const tipoSeleccionado = document.getElementById('tipo').value;
      // Validar campos
      if (!nombre || !correo || !comentario) {
        mostrarError('Por favor, completa todos los campos obligatorios.');
        return;
      }
      
      // Validar formato de email
      if (!validarEmail(correo)) {
        mostrarError('Por favor, ingresa un correo electrónico válido.');
        return;
      }
      
      // Deshabilitar botón de envío
      const btnSubmit = formContacto.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Enviando...';
      
      try {
        // Crear objeto de contacto con la estructura correcta
        const nuevoContacto = {
          email: correo,
          nombre: nombre,
          message: comentario,
          tipo: tipoSeleccionado, // Puedes agregar un select para que el usuario elija
          estado: 'Pendiente',
          estadoRespuesta: 'Pendiente',
          fecha: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('Enviando contacto:', nuevoContacto);
        
        // Guardar en Firestore en la colección 'contactos'
        const contactoRef = await db.collection('contactos').add(nuevoContacto);
        
        console.log('Contacto guardado con ID:', contactoRef.id);
        
        // Mostrar mensaje de éxito
        mostrarExito('✅ ¡Mensaje enviado correctamente! Te contactaremos pronto.');
        
        // Limpiar formulario
        formContacto.reset();
        
        // Si el usuario está autenticado, volver a autocompletar el correo
        const user = auth.currentUser;
        if (user) {
          document.getElementById('correo').value = user.email;
        }
        
      } catch (error) {
        console.error('Error al enviar contacto:', error);
        mostrarError('❌ Error al enviar el mensaje. Por favor, intenta nuevamente.');
      } finally {
        // Rehabilitar botón
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
      }
    });
  }
});

/**
 * Valida formato de email
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Muestra mensaje de error
 */
function mostrarError(mensaje) {
  // Crear alert de Bootstrap
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger alert-dismissible fade show';
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    <strong>Error:</strong> ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // Insertar antes del formulario
  const formContacto = document.getElementById('formContacto');
  formContacto.parentElement.insertBefore(alertDiv, formContacto);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
  
  // Scroll hacia el error
  alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Muestra mensaje de éxito
 */
function mostrarExito(mensaje) {
  // Crear alert de Bootstrap
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success alert-dismissible fade show';
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // Insertar antes del formulario
  const formContacto = document.getElementById('formContacto');
  formContacto.parentElement.insertBefore(alertDiv, formContacto);
  
  // Auto-remover después de 8 segundos
  setTimeout(() => {
    alertDiv.remove();
  }, 8000);
  
  // Scroll hacia el mensaje
  alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Validación en tiempo real de campos
 */
document.addEventListener('DOMContentLoaded', function() {
  const inputs = ['nombre', 'correo', 'comentario'];
  
  inputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('blur', function() {
        const feedback = this.parentElement.querySelector('.invalid-feedback');
        
        if (!this.value.trim()) {
          this.classList.add('is-invalid');
          if (feedback) {
            feedback.textContent = 'Este campo es obligatorio';
            feedback.style.display = 'block';
          }
        } else if (inputId === 'correo' && !validarEmail(this.value)) {
          this.classList.add('is-invalid');
          if (feedback) {
            feedback.textContent = 'Ingresa un correo válido';
            feedback.style.display = 'block';
          }
        } else {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
          if (feedback) {
            feedback.style.display = 'none';
          }
        }
      });
      
      // Limpiar validación al escribir
      input.addEventListener('input', function() {
        this.classList.remove('is-invalid', 'is-valid');
      });
    }
  });
});