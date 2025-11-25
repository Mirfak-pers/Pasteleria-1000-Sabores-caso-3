// perfilCliente.js - Versión mejorada siguiendo estructura de perfilAdmin.js
// Pastelería 1000 Sabores

console.log('perfilCliente.js cargado');

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let usuarioActual = null;
let clienteData = {};
let comprasCache = [];
let contactosCache = [];

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando perfil de cliente...');
    
    // Verificar que Firebase esté disponible
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase no está cargado');
        mostrarError('Error al cargar el sistema de autenticación');
        return;
    }
    
    // Escuchar cambios de autenticación
    inicializarAutenticacion();
    
    // Configurar eventos de la interfaz
    configurarEventosUI();
});

// ==========================================
// AUTENTICACIÓN
// ==========================================
function inicializarAutenticacion() {
    if (!auth) {
        console.error('❌ auth no está definido');
        return;
    }
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('✅ Usuario autenticado:', user.email);
            usuarioActual = user;
            cargarPerfilCompleto(user.uid, user.email);
        } else {
            console.log('⚠️ No hay usuario autenticado');
            mostrarVistaInvitado();
        }
    });
}

// ==========================================
// CARGA DE DATOS DEL PERFIL
// ==========================================
async function cargarPerfilCompleto(userId, email) {
    try {
        console.log('📦 Cargando perfil completo...');
        mostrarCargando(true);
        
        // Cargar datos del cliente
        await cargarDatosCliente(userId, email);
        
        // Cargar historial de compras
        await cargarHistorialCompras(userId, email);
        
        // Cargar historial de contacto
        await cargarHistorialContacto(userId, email);
        
        mostrarCargando(false);
        console.log('✅ Perfil cargado completamente');
        
    } catch (error) {
        console.error('❌ Error al cargar perfil:', error);
        mostrarError('Error al cargar los datos del perfil');
        mostrarCargando(false);
    }
}

async function cargarDatosCliente(userId, email) {
    try {
        console.log('👤 Buscando datos del cliente...');
        
        // Intentar buscar por UID primero
        let clienteDoc = await db.collection('usuarios').doc(userId).get();
        
        if (clienteDoc.exists) {
            console.log('✅ Cliente encontrado por UID');
            clienteData = { id: userId, ...clienteDoc.data() };
            actualizarInterfazCliente(clienteData);
            return;
        }
        
        // Buscar por email si no se encontró por UID
        console.log('🔍 Buscando por email...');
        const clientesSnapshot = await db.collection('usuarios')
            .where('correo', '==', email)
            .limit(1)
            .get();
        
        if (!clientesSnapshot.empty) {
            const doc = clientesSnapshot.docs[0];
            console.log('✅ Cliente encontrado por email');
            clienteData = { id: doc.id, ...doc.data() };
            actualizarInterfazCliente(clienteData);
            return;
        }
        
        // Si no existe, crear nuevo perfil
        console.log('📝 Creando nuevo perfil...');
        await crearNuevoPerfil(userId, email);
        
    } catch (error) {
        console.error('❌ Error al cargar datos del cliente:', error);
        throw error;
    }
}

async function crearNuevoPerfil(userId, email) {
    const nuevoCliente = {
        nombre: auth.currentUser.displayName || "Nuevo Cliente",
        correo: email,
        email: email,
        telefono: "",
        direccion: "",
        puntos: 0,
        rol: "cliente",
        activo: true,
        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
        fechaRegistro: new Date().toLocaleDateString('es-ES', { 
            month: 'long', 
            year: 'numeric' 
        })
    };
    
    try {
        await db.collection('usuarios').doc(userId).set(nuevoCliente);
        clienteData = { id: userId, ...nuevoCliente };
        actualizarInterfazCliente(clienteData);
        console.log('✅ Perfil creado exitosamente');
    } catch (error) {
        console.error('❌ Error al crear perfil:', error);
        throw error;
    }
}

// ==========================================
// ACTUALIZACIÓN DE INTERFAZ
// ==========================================
function actualizarInterfazCliente(datos) {
    console.log('🎨 Actualizando interfaz con datos:', datos);
    
    // Nombre del cliente
    const nombre = datos.nombre || 'Usuario';
    const clienteNameEl = document.getElementById('clienteName');
    if (clienteNameEl) {
        clienteNameEl.textContent = nombre;
    }
    
    // Fecha de registro
    let fechaRegistro = 'Reciente';
    if (datos.fechaRegistro && typeof datos.fechaRegistro === 'string') {
        fechaRegistro = datos.fechaRegistro;
    } else if (datos.fechaCreacion && datos.fechaCreacion.toDate) {
        fechaRegistro = datos.fechaCreacion.toDate().toLocaleDateString('es-ES', { 
            month: 'long', 
            year: 'numeric' 
        });
    }
    
    const fechaRegistroEl = document.getElementById('fechaRegistro');
    if (fechaRegistroEl) {
        fechaRegistroEl.textContent = fechaRegistro;
    }
    
    // Puntos
    const puntos = datos.puntos || 0;
    const puntosElements = document.querySelectorAll('#puntos, #puntosCard');
    puntosElements.forEach(el => {
        if (el) el.textContent = puntos.toLocaleString('es-CL');
    });
    
    // Email
    const email = datos.email || datos.correo || '';
    const emailEl = document.getElementById('displayEmail');
    if (emailEl) {
        emailEl.textContent = email;
    }
    
    // Teléfono
    const telefonoEl = document.getElementById('displayTelefono');
    if (telefonoEl) {
        telefonoEl.textContent = datos.telefono || 'No especificado';
    }
    
    // Dirección
    const direccionEl = document.getElementById('displayDireccion');
    if (direccionEl) {
        direccionEl.textContent = datos.direccion || 'No especificada';
    }
    
    // Avatar con iniciales
    if (nombre && nombre !== 'Usuario') {
        const iniciales = nombre
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
        
        const avatarEl = document.getElementById('avatar');
        if (avatarEl) {
            avatarEl.textContent = iniciales;
        }
    }
    
    // Recrear íconos de Lucide si está disponible
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('✅ Interfaz actualizada');
}

// ==========================================
// HISTORIAL DE COMPRAS
// ==========================================
async function cargarHistorialCompras(userId, email) {
    try {
        console.log('🛒 Cargando historial de compras...');
        
        const containerEl = document.getElementById('historialCompras');
        if (!containerEl) {
            console.warn('⚠️ Contenedor historialCompras no encontrado');
            return;
        }
        
        containerEl.innerHTML = '<div class="loading">Cargando compras...</div>';
        
        // Buscar compras por email del cliente
        let comprasSnapshot = await db.collection('compras')
            .where('cliente.correo', '==', email)
            .limit(50)
            .get();
        
        // Fallback: buscar por userEmail
        if (comprasSnapshot.empty) {
            comprasSnapshot = await db.collection('compras')
                .where('userEmail', '==', email)
                .limit(50)
                .get();
        }
        
        // Procesar compras
        const comprasArray = [];
        
        for (const doc of comprasSnapshot.docs) {
            const compra = doc.data();
            
            // Obtener productos
            let productosTexto = '';
            let total = 0;
            
            if (compra.productos && Array.isArray(compra.productos)) {
                productosTexto = compra.productos
                    .map(p => `${p.nombre} (x${p.cantidad})`)
                    .join(', ');
                total = compra.total || 0;
            } else {
                productosTexto = 'Productos no especificados';
                total = compra.total || 0;
            }
            
            // Obtener fecha
            let fechaObj = new Date(0);
            let fechaTexto = 'Sin fecha';
            
            if (compra.fecha && compra.fecha.toDate) {
                fechaObj = compra.fecha.toDate();
                fechaTexto = formatearFecha(fechaObj);
            } else if (compra.fechaLocal) {
                fechaObj = new Date(compra.fechaLocal);
                fechaTexto = formatearFecha(fechaObj);
            }
            
            comprasArray.push({
                id: doc.id,
                fechaObj: fechaObj,
                fecha: fechaTexto,
                productos: productosTexto,
                monto: total,
                estado: compra.estado || 'pendiente',
                numeroOrden: compra.numeroOrden || doc.id
            });
        }
        
        // Ordenar por fecha (más reciente primero)
        comprasArray.sort((a, b) => b.fechaObj - a.fechaObj);
        
        // Guardar en caché y tomar solo las 10 más recientes
        comprasCache = comprasArray.slice(0, 10);
        
        console.log(`✅ ${comprasCache.length} compras cargadas`);
        mostrarHistorialCompras(comprasCache);
        
    } catch (error) {
        console.error('❌ Error al cargar compras:', error);
        const containerEl = document.getElementById('historialCompras');
        if (containerEl) {
            containerEl.innerHTML = '<p style="text-align: center; color: #999;">Error al cargar compras</p>';
        }
    }
}

function mostrarHistorialCompras(compras) {
    const containerEl = document.getElementById('historialCompras');
    if (!containerEl) return;
    
    containerEl.innerHTML = '';
    
    if (compras.length === 0) {
        containerEl.innerHTML = `
            <p style="text-align: center; color: #999; padding: 20px;">
                No hay compras registradas
            </p>
        `;
        return;
    }
    
    compras.forEach(compra => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Determinar clase del badge según estado
        const estadoTraducido = traducirEstado(compra.estado);
        const badgeClass = 
            ['Completado', 'Entregado'].includes(estadoTraducido) ? 'success' :
            ['Cancelado', 'Error en Pago'].includes(estadoTraducido) ? 'error' :
            'warning';
        
        card.innerHTML = `
            <div class="card-content">
                <div>
                    <div class="card-title">${compra.productos}</div>
                    <div class="card-date">${compra.fecha}</div>
                    <div class="card-date" style="font-size: 0.75rem; color: #999;">
                        Orden: ${compra.numeroOrden}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="card-price">${formatearPrecio(compra.monto)}</div>
                    <span class="badge ${badgeClass}">${estadoTraducido}</span>
                </div>
            </div>
        `;
        
        containerEl.appendChild(card);
    });
}

// ==========================================
// HISTORIAL DE CONTACTO
// ==========================================
async function cargarHistorialContacto(userId, email) {
    try {
        console.log('💬 Cargando historial de contacto...');
        
        const containerEl = document.getElementById('historialContacto');
        if (!containerEl) {
            console.warn('⚠️ Contenedor historialContacto no encontrado');
            return;
        }
        
        containerEl.innerHTML = '<div class="loading">Cargando contactos...</div>';
        
        if (!email) {
            console.log('⚠️ No hay email disponible');
            containerEl.innerHTML = '<p style="text-align: center; color: #999;">No hay contactos registrados</p>';
            return;
        }
        
        // Buscar en colección 'contactos'
        let contactosSnapshot = await db.collection('contactos')
            .where('email', '==', email)
            .limit(50)
            .get();
        
        // Fallback: buscar en 'contacto' (singular)
        if (contactosSnapshot.empty) {
            contactosSnapshot = await db.collection('contacto')
                .where('email', '==', email)
                .limit(50)
                .get();
        }
        
        const contactosArray = [];
        
        contactosSnapshot.forEach(doc => {
            const contacto = doc.data();
            
            let fechaObj = new Date(0);
            let fechaTexto = 'Sin fecha';
            
            if (contacto.fecha && contacto.fecha.toDate) {
                fechaObj = contacto.fecha.toDate();
                fechaTexto = formatearFecha(fechaObj);
            }
            
            contactosArray.push({
                id: doc.id,
                fechaObj: fechaObj,
                fecha: fechaTexto,
                tipo: contacto.tipo || 'Consulta',
                mensaje: contacto.message || contacto.mensaje || 'Sin mensaje',
                nombre: contacto.nombre || 'Usuario',
                respuesta: contacto.estadoRespuesta || contacto.estado || 'Pendiente'
            });
        });
        
        // Ordenar por fecha
        contactosArray.sort((a, b) => b.fechaObj - a.fechaObj);
        
        // Guardar en caché y tomar solo los 10 más recientes
        contactosCache = contactosArray.slice(0, 10);
        
        console.log(`✅ ${contactosCache.length} contactos cargados`);
        mostrarHistorialContacto(contactosCache);
        
    } catch (error) {
        console.error('❌ Error al cargar contactos:', error);
        const containerEl = document.getElementById('historialContacto');
        if (containerEl) {
            containerEl.innerHTML = '<p style="text-align: center; color: #999;">Error al cargar contactos</p>';
        }
    }
}

function mostrarHistorialContacto(contactos) {
    const containerEl = document.getElementById('historialContacto');
    if (!containerEl) return;
    
    containerEl.innerHTML = '';
    
    if (contactos.length === 0) {
        containerEl.innerHTML = `
            <p style="text-align: center; color: #999; padding: 20px;">
                No hay contactos registrados
            </p>
        `;
        return;
    }
    
    contactos.forEach(contacto => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        const badgeClass = 
            contacto.tipo === 'Consulta' ? 'blue' : 
            contacto.tipo === 'Reclamo' ? 'red' : 'yellow';
        
        card.innerHTML = `
            <div class="contact-header">
                <span class="badge ${badgeClass}">${contacto.tipo}</span>
                <span class="card-date">${contacto.fecha}</span>
            </div>
            <div class="card-title" style="margin-bottom: 0.5rem;">
                ${contacto.mensaje}
            </div>
            <div class="card-date">
                Estado: <strong>${contacto.respuesta}</strong>
            </div>
        `;
        
        containerEl.appendChild(card);
    });
}

// ==========================================
// EDICIÓN DE PERFIL
// ==========================================
function toggleEdit() {
    const infoView = document.getElementById('infoView');
    const editView = document.getElementById('editView');
    const btnEditar = document.getElementById('btnEditar');
    
    if (!infoView || !editView || !btnEditar) {
        console.error('❌ Elementos de edición no encontrados');
        return;
    }
    
    if (infoView.classList.contains('hidden')) {
        // Volver a vista normal
        infoView.classList.remove('hidden');
        editView.classList.add('hidden');
        btnEditar.innerHTML = '<i data-lucide="edit-2"></i> Editar';
    } else {
        // Mostrar formulario de edición
        document.getElementById('inputNombre').value = clienteData.nombre || '';
        document.getElementById('inputEmail').value = clienteData.email || clienteData.correo || '';
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

async function guardarCambiosPerfil(event) {
    event.preventDefault();
    
    if (!usuarioActual) {
        alert('❌ Debes iniciar sesión para editar tu perfil');
        return;
    }
    
    const datosActualizados = {
        nombre: document.getElementById('inputNombre').value.trim(),
        correo: document.getElementById('inputEmail').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        telefono: document.getElementById('inputTelefono').value.trim(),
        direccion: document.getElementById('inputDireccion').value.trim()
    };
    
    try {
        mostrarCargando(true);
        
        await db.collection('usuarios').doc(usuarioActual.uid).update({
            ...datosActualizados,
            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        clienteData = { ...clienteData, ...datosActualizados };
        actualizarInterfazCliente(clienteData);
        toggleEdit();
        
        mostrarCargando(false);
        alert('✅ Datos actualizados correctamente');
        
        console.log('✅ Perfil actualizado');
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        mostrarCargando(false);
        alert('❌ Error al guardar los cambios: ' + error.message);
    }
}

// ==========================================
// CONFIGURACIÓN DE EVENTOS
// ==========================================
function configurarEventosUI() {
    // Formulario de edición
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', guardarCambiosPerfil);
    }
    
    // Botón de editar
    const btnEditar = document.getElementById('btnEditar');
    if (btnEditar) {
        btnEditar.addEventListener('click', toggleEdit);
    }
    
    console.log('✅ Eventos de UI configurados');
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
function traducirEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'completada': 'Completado',
        'completado': 'Completado',
        'confirmado': 'Confirmado',
        'en_preparacion': 'En Preparación',
        'procesando': 'Procesando',
        'enviado': 'Enviado',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado',
        'error_pago': 'Error en Pago'
    };
    return estados[estado] || estado;
}

function formatearFecha(fecha) {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(precio);
}

function mostrarError(mensaje) {
    console.error('❌', mensaje);
    // Aquí podrías mostrar un toast o notificación visual
}

function mostrarCargando(mostrar) {
    // Implementar lógica de loading spinner si es necesario
    if (mostrar) {
        console.log('⏳ Cargando...');
    } else {
        console.log('✅ Carga completada');
    }
}

function mostrarVistaInvitado() {
    console.log('👤 Mostrando vista de invitado');
    
    const datosEjemplo = {
        nombre: "Usuario Invitado",
        correo: "invitado@ejemplo.com",
        email: "invitado@ejemplo.com",
        telefono: "No disponible",
        direccion: "No disponible",
        fechaRegistro: "Reciente",
        puntos: 0
    };
    
    actualizarInterfazCliente(datosEjemplo);
    
    const historialCompras = document.getElementById('historialCompras');
    if (historialCompras) {
        historialCompras.innerHTML = `
            <p style="text-align: center; color: #999; padding: 20px;">
                <i data-lucide="lock" style="margin-bottom: 10px;"></i><br>
                Inicia sesión para ver tu historial de compras
            </p>
        `;
    }
    
    const historialContacto = document.getElementById('historialContacto');
    if (historialContacto) {
        historialContacto.innerHTML = `
            <p style="text-align: center; color: #999; padding: 20px;">
                <i data-lucide="lock" style="margin-bottom: 10px;"></i><br>
                Inicia sesión para ver tus contactos
            </p>
        `;
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ==========================================
// FUNCIONES PARA CREAR COMPRA/CONTACTO
// ==========================================
async function crearCompra(compraData) {
    if (!usuarioActual) {
        alert("❌ Debes iniciar sesión para realizar una compra");
        return null;
    }
    
    try {
        const clienteInfo = {
            nombre: clienteData.nombre || usuarioActual.displayName || "Cliente",
            apellidos: clienteData.apellidos || "",
            correo: usuarioActual.email
        };
        
        const nuevaCompra = {
            cliente: clienteInfo,
            direccion: compraData.direccion || {
                calle: clienteData.direccion || "",
                comuna: "",
                region: "",
                departamento: "",
                indicaciones: ""
            },
            estado: compraData.estado || 'pendiente',
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            numeroOrden: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            productos: compraData.productos || [],
            total: compraData.total || 0,
            userId: usuarioActual.uid,
            userEmail: usuarioActual.email
        };
        
        const compraRef = await db.collection('compras').add(nuevaCompra);
        console.log('✅ Compra creada:', compraRef.id);
        
        // Actualizar puntos
        const puntosGanados = Math.floor(compraData.total / 1000);
        if (puntosGanados > 0) {
            await db.collection('usuarios').doc(usuarioActual.uid).update({
                puntos: firebase.firestore.FieldValue.increment(puntosGanados)
            });
        }
        
        // Recargar historial
        await cargarHistorialCompras(usuarioActual.uid, usuarioActual.email);
        
        return compraRef.id;
    } catch (error) {
        console.error("❌ Error al crear compra:", error);
        alert("❌ Error al procesar la compra");
        return null;
    }
}

async function crearContacto(contactoData) {
    if (!usuarioActual) {
        alert("❌ Debes iniciar sesión para enviar un contacto");
        return null;
    }
    
    try {
        const nuevoContacto = {
            email: usuarioActual.email,
            nombre: clienteData.nombre || usuarioActual.displayName || "Usuario",
            message: contactoData.mensaje || contactoData.message || "",
            tipo: contactoData.tipo || 'Consulta',
            estado: 'Pendiente',
            estadoRespuesta: 'Pendiente',
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const contactoRef = await db.collection('contactos').add(nuevoContacto);
        console.log('✅ Contacto creado:', contactoRef.id);
        
        // Recargar historial
        await cargarHistorialContacto(usuarioActual.uid, usuarioActual.email);
        
        alert('✅ Contacto enviado correctamente');
        return contactoRef.id;
    } catch (error) {
        console.error("❌ Error al crear contacto:", error);
        alert("❌ Error al enviar el contacto");
        return null;
    }
}

// ==========================================
// EXPORTAR FUNCIONES GLOBALES
// ==========================================
window.perfilCliente = {
    crearCompra,
    crearContacto,
    toggleEdit,
    cargarPerfilCompleto
};

console.log('✅ perfilCliente.js completamente cargado');