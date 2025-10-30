// perfilCliente.js
// Perfil de Cliente - Pastelería 1000 Sabores
// NOTA: Este archivo usa auth y db del config.js global

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let usuarioActual = null;
let clienteData = {};

// ==========================================
// AUTENTICACIÓN
// ==========================================
auth.onAuthStateChanged((user) => {
    if (user) {
        usuarioActual = user;
        console.log("Usuario autenticado:", user.email);
        cargarDatosClienteFirebase(user.uid);
    } else {
        console.log("No hay usuario autenticado");
        // Mostrar datos de ejemplo o redirigir a login
        mostrarDatosEjemplo();
    }
});

// ==========================================
// FUNCIONES PARA CARGAR DATOS DEL CLIENTE
// ==========================================

/**
 * Cargar datos del cliente desde Firebase
 * @param {string} userId - ID del usuario
 */
async function cargarDatosClienteFirebase(userId) {
    try {
        const clienteDoc = await db.collection('clientes').doc(userId).get();
        
        if (clienteDoc.exists) {
            clienteData = clienteDoc.data();
            actualizarInterfazCliente(clienteData);
            await cargarHistorialComprasFirebase(userId);
            await cargarHistorialContactoFirebase(userId);
        } else {
            console.log("Creando nuevo perfil de cliente");
            await crearPerfilClienteNuevo(userId);
        }
    } catch (error) {
        console.error("Error al cargar datos:", error);
        mostrarError("Error al cargar los datos del perfil");
    }
}

/**
 * Actualizar la interfaz con los datos del cliente
 */
function actualizarInterfazCliente(datos) {
    document.getElementById('clienteName').textContent = datos.nombre || 'Usuario';
    document.getElementById('fechaRegistro').textContent = datos.fechaRegistro || 'Reciente';
    document.getElementById('puntos').textContent = datos.puntos || 0;
    document.getElementById('puntosCard').textContent = datos.puntos || 0;
    document.getElementById('displayEmail').textContent = datos.email || '';
    document.getElementById('displayTelefono').textContent = datos.telefono || 'No especificado';
    document.getElementById('displayDireccion').textContent = datos.direccion || 'No especificada';
    
    // Actualizar avatar con iniciales
    if (datos.nombre) {
        const iniciales = datos.nombre.split(' ').map(n => n[0]).join('').substring(0, 2);
        document.getElementById('avatar').textContent = iniciales;
    }
    
    // Reinicializar iconos de Lucide si está disponible
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Crear perfil nuevo para cliente
 */
async function crearPerfilClienteNuevo(userId) {
    const nuevoCliente = {
        nombre: auth.currentUser.displayName || "Nuevo Cliente",
        email: auth.currentUser.email,
        telefono: "",
        direccion: "",
        fechaRegistro: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        puntos: 0,
        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('clientes').doc(userId).set(nuevoCliente);
        clienteData = nuevoCliente;
        actualizarInterfazCliente(nuevoCliente);
    } catch (error) {
        console.error("Error al crear perfil:", error);
    }
}

// ==========================================
// FUNCIONES PARA HISTORIAL DE COMPRAS
// ==========================================

/**
 * Cargar historial de compras desde Firebase
 */
async function cargarHistorialComprasFirebase(userId) {
    try {
        const comprasSnapshot = await db.collection('compras')
            .where('clienteId', '==', userId)
            .orderBy('fecha', 'desc')
            .limit(10)
            .get();
        
        const compras = [];
        
        for (const doc of comprasSnapshot.docs) {
            const compra = doc.data();
            
            // Obtener información del pastel si existe
            let nombreProducto = compra.nombreProducto || 'Producto';
            if (compra.pastelId) {
                try {
                    const pastelDoc = await db.collection('pasteles').doc(compra.pastelId).get();
                    if (pastelDoc.exists) {
                        nombreProducto = pastelDoc.data().nombre || nombreProducto;
                    }
                } catch (error) {
                    console.log("No se pudo obtener información del pastel");
                }
            }
            
            compras.push({
                id: doc.id,
                fecha: compra.fecha ? formatearFecha(compra.fecha.toDate()) : 'Sin fecha',
                producto: nombreProducto,
                monto: formatearPrecio(compra.total || 0),
                estado: compra.estado || 'Pendiente'
            });
        }
        
        mostrarHistorialCompras(compras);
    } catch (error) {
        console.error("Error al cargar compras:", error);
        document.getElementById('historialCompras').innerHTML = 
            '<p style="text-align: center; color: #999;">No hay compras registradas</p>';
    }
}

/**
 * Mostrar historial de compras en la interfaz
 */
function mostrarHistorialCompras(compras) {
    const container = document.getElementById('historialCompras');
    container.innerHTML = '';
    
    if (compras.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No hay compras registradas</p>';
        return;
    }
    
    compras.forEach(compra => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <div>
                    <div class="card-title">${compra.producto}</div>
                    <div class="card-date">${compra.fecha}</div>
                </div>
                <div style="text-align: right;">
                    <div class="card-price">${compra.monto}</div>
                    <span class="badge success">${compra.estado}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// FUNCIONES PARA HISTORIAL DE CONTACTO
// ==========================================

/**
 * Cargar historial de contacto desde Firebase
 */
async function cargarHistorialContactoFirebase(userId) {
    try {
        const contactosSnapshot = await db.collection('contactos')
            .where('clienteId', '==', userId)
            .orderBy('fecha', 'desc')
            .limit(10)
            .get();
        
        const contactos = [];
        contactosSnapshot.forEach(doc => {
            const contacto = doc.data();
            contactos.push({
                id: doc.id,
                fecha: contacto.fecha ? formatearFecha(contacto.fecha.toDate()) : 'Sin fecha',
                tipo: contacto.tipo || 'Consulta',
                mensaje: contacto.mensaje || 'Sin mensaje',
                respuesta: contacto.estadoRespuesta || 'Pendiente'
            });
        });
        
        mostrarHistorialContacto(contactos);
    } catch (error) {
        console.error("Error al cargar contactos:", error);
        document.getElementById('historialContacto').innerHTML = 
            '<p style="text-align: center; color: #999;">No hay contactos registrados</p>';
    }
}

/**
 * Mostrar historial de contacto en la interfaz
 */
function mostrarHistorialContacto(contactos) {
    const container = document.getElementById('historialContacto');
    container.innerHTML = '';
    
    if (contactos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No hay contactos registrados</p>';
        return;
    }
    
    contactos.forEach(contacto => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        const badgeClass = contacto.tipo === 'Consulta' ? 'blue' : 
                          contacto.tipo === 'Reclamo' ? 'red' : 'yellow';
        
        card.innerHTML = `
            <div class="contact-header">
                <span class="badge ${badgeClass}">${contacto.tipo}</span>
                <span class="card-date">${contacto.fecha}</span>
            </div>
            <div class="card-title" style="margin-bottom: 0.5rem;">${contacto.mensaje}</div>
            <div class="card-date">Estado: <strong>${contacto.respuesta}</strong></div>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// FUNCIONES PARA EDITAR PERFIL
// ==========================================

/**
 * Alternar entre vista de información y edición
 */
function toggleEdit() {
    const infoView = document.getElementById('infoView');
    const editView = document.getElementById('editView');
    const btnEditar = document.getElementById('btnEditar');
    
    if (infoView.classList.contains('hidden')) {
        // Cancelar edición
        infoView.classList.remove('hidden');
        editView.classList.add('hidden');
        btnEditar.innerHTML = '<i data-lucide="edit-2"></i> Editar';
    } else {
        // Activar edición
        document.getElementById('inputNombre').value = clienteData.nombre || '';
        document.getElementById('inputEmail').value = clienteData.email || '';
        document.getElementById('inputTelefono').value = clienteData.telefono || '';
        document.getElementById('inputDireccion').value = clienteData.direccion || '';
        
        infoView.classList.add('hidden');
        editView.classList.remove('hidden');
        btnEditar.innerHTML = '<i data-lucide="x"></i> Cancelar';
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Manejar envío del formulario de edición
 */
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!usuarioActual) {
                alert('❌ Debes iniciar sesión para editar tu perfil');
                return;
            }
            
            const datosActualizados = {
                nombre: document.getElementById('inputNombre').value,
                email: document.getElementById('inputEmail').value,
                telefono: document.getElementById('inputTelefono').value,
                direccion: document.getElementById('inputDireccion').value
            };
            
            try {
                await db.collection('clientes').doc(usuarioActual.uid).update({
                    ...datosActualizados,
                    fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                clienteData = { ...clienteData, ...datosActualizados };
                actualizarInterfazCliente(clienteData);
                toggleEdit();
                alert('✅ ¡Datos actualizados correctamente!');
            } catch (error) {
                console.error("Error al guardar:", error);
                alert('❌ Error al guardar los cambios');
            }
        });
    }
});

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

/**
 * Formatear fecha a texto legible
 */
function formatearFecha(fecha) {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

/**
 * Formatear precio en formato chileno
 */
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(precio);
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    console.error(mensaje);
}

/**
 * Mostrar datos de ejemplo cuando no hay usuario autenticado
 */
function mostrarDatosEjemplo() {
    const datosEjemplo = {
        nombre: "Usuario Invitado",
        email: "invitado@ejemplo.com",
        telefono: "No disponible",
        direccion: "No disponible",
        fechaRegistro: "Reciente",
        puntos: 0
    };
    actualizarInterfazCliente(datosEjemplo);
    document.getElementById('historialCompras').innerHTML = 
        '<p style="text-align: center; color: #999;">Inicia sesión para ver tu historial</p>';
    document.getElementById('historialContacto').innerHTML = 
        '<p style="text-align: center; color: #999;">Inicia sesión para ver tus contactos</p>';
}

// ==========================================
// FUNCIONES ADICIONALES (OPCIONAL)
// ==========================================

/**
 * Crear nueva compra
 */
async function crearCompra(compraData) {
    if (!usuarioActual) {
        alert("❌ Debes iniciar sesión para realizar una compra");
        return null;
    }
    
    try {
        const nuevaCompra = {
            clienteId: usuarioActual.uid,
            pastelId: compraData.pastelId || null,
            nombreProducto: compraData.nombreProducto,
            cantidad: compraData.cantidad || 1,
            total: compraData.total,
            estado: 'Pendiente',
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const compraRef = await db.collection('compras').add(nuevaCompra);
        
        // Actualizar puntos del cliente (1 punto por cada $1000 gastados)
        const puntosGanados = Math.floor(compraData.total / 1000);
        if (puntosGanados > 0) {
            await db.collection('clientes').doc(usuarioActual.uid).update({
                puntos: firebase.firestore.FieldValue.increment(puntosGanados)
            });
            
            // Recargar datos del cliente
            await cargarDatosClienteFirebase(usuarioActual.uid);
        }
        
        return compraRef.id;
    } catch (error) {
        console.error("Error al crear compra:", error);
        alert("❌ Error al procesar la compra");
        return null;
    }
}

/**
 * Crear nuevo contacto
 */
async function crearContacto(contactoData) {
    if (!usuarioActual) {
        alert("❌ Debes iniciar sesión para enviar un contacto");
        return null;
    }
    
    try {
        const nuevoContacto = {
            clienteId: usuarioActual.uid,
            tipo: contactoData.tipo, // 'Consulta', 'Reclamo', 'Sugerencia'
            mensaje: contactoData.mensaje,
            estadoRespuesta: 'Pendiente',
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const contactoRef = await db.collection('contactos').add(nuevoContacto);
        
        // Recargar historial de contacto
        await cargarHistorialContactoFirebase(usuarioActual.uid);
        
        alert('✅ Contacto enviado correctamente');
        return contactoRef.id;
    } catch (error) {
        console.error("Error al crear contacto:", error);
        alert("❌ Error al enviar el contacto");
        return null;
    }
}

// ==========================================
// EXPORTAR FUNCIONES PARA USO GLOBAL
// ==========================================
window.firebasePerfil = {
    crearCompra,
    crearContacto,
    cargarDatosClienteFirebase,
    toggleEdit
};