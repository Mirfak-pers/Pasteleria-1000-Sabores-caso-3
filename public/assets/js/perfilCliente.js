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
        cargarDatosClientePorEmailOUid(user.email, user.uid);
    } else {
        console.log("No hay usuario autenticado");
        mostrarDatosEjemplo();
    }
});

// ==========================================
// FUNCIONES PARA CARGAR DATOS DEL CLIENTE
// ==========================================

async function cargarDatosClientePorEmailOUid(email, userId) {
    try {
        console.log('Buscando cliente con email:', email, 'y uid:', userId);
        
        let clienteDoc = await db.collection('usuarios').doc(userId).get();
        
        if (clienteDoc.exists) {
            console.log('Cliente encontrado por UID en "usuarios"');
            clienteData = clienteDoc.data();
            actualizarInterfazCliente(clienteData);
            await cargarHistorialComprasFirebase(userId, email);
            await cargarHistorialContactoFirebase(userId, email);
            return;
        }
        
        console.log('No encontrado por UID, buscando por email...');
        const camposEmail = ['correo', 'email'];
        
        for (const campo of camposEmail) {
            try {
                const clientesSnapshot = await db.collection('usuarios')
                    .where(campo, '==', email)
                    .limit(1)
                    .get();
                
                if (!clientesSnapshot.empty) {
                    console.log('Cliente encontrado por', campo, 'en usuarios');
                    const doc = clientesSnapshot.docs[0];
                    clienteData = doc.data();
                    clienteData.id = doc.id;
                    actualizarInterfazCliente(clienteData);
                    await cargarHistorialComprasFirebase(doc.id, email);
                    await cargarHistorialContactoFirebase(doc.id, email);
                    return;
                }
            } catch (error) {
                console.log('Error buscando por', campo, ':', error);
            }
        }
        
        console.log("Cliente no encontrado, creando nuevo perfil");
        await crearPerfilClienteNuevo(userId, email);
        
    } catch (error) {
        console.error("Error al cargar datos:", error);
        mostrarError("Error al cargar los datos del perfil");
        mostrarDatosEjemplo();
    }
}

async function cargarDatosClienteFirebase(userId) {
    const user = auth.currentUser;
    if (user) {
        await cargarDatosClientePorEmailOUid(user.email, userId);
    }
}

function actualizarInterfazCliente(datos) {
    const nombre = datos.nombre || 'Usuario';
    document.getElementById('clienteName').textContent = nombre;
    
    // Formatear fecha de registro correctamente
    let fechaRegistro = 'Reciente';
    
    if (datos.fechaRegistro && typeof datos.fechaRegistro === 'string') {
        // Si ya es un string formateado
        fechaRegistro = datos.fechaRegistro;
    } else if (datos.fechaCreacion) {
        // Si es un Timestamp de Firebase
        try {
            const fecha = datos.fechaCreacion.toDate();
            fechaRegistro = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        } catch (error) {
            console.log('Error al convertir fechaCreacion:', error);
            fechaRegistro = 'Reciente';
        }
    } else if (datos.fechaRegistro && datos.fechaRegistro.toDate) {
        // Si fechaRegistro es un Timestamp
        try {
            const fecha = datos.fechaRegistro.toDate();
            fechaRegistro = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        } catch (error) {
            console.log('Error al convertir fechaRegistro:', error);
            fechaRegistro = 'Reciente';
        }
    }
    
    document.getElementById('fechaRegistro').textContent = fechaRegistro;
    
    const puntos = datos.puntos || 0;
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('puntosCard').textContent = puntos;
    
    const email = datos.email || datos.correo || '';
    document.getElementById('displayEmail').textContent = email;
    
    document.getElementById('displayTelefono').textContent = datos.telefono || 'No especificado';
    document.getElementById('displayDireccion').textContent = datos.direccion || 'No especificada';
    
    if (nombre && nombre !== 'Usuario') {
        const iniciales = nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('avatar').textContent = iniciales;
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

async function crearPerfilClienteNuevo(userId, email) {
    const nuevoCliente = {
        nombre: auth.currentUser.displayName || "Nuevo Cliente",
        correo: email || auth.currentUser.email,
        telefono: "",
        clave: "",
        rut: "",
        fechaNacimiento: null,
        direccion: "",
        fechaRegistro: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        puntos: 0,
        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('usuarios').doc(userId).set(nuevoCliente);
        clienteData = nuevoCliente;
        actualizarInterfazCliente(nuevoCliente);
        console.log('Perfil de cliente creado exitosamente en "usuarios"');
    } catch (error) {
        console.error("Error al crear perfil:", error);
    }
}

// ==========================================
// FUNCIONES PARA HISTORIAL DE COMPRAS
// ==========================================

async function cargarHistorialComprasFirebase(userId, email) {
    try {
        console.log('Cargando compras para userId:', userId, 'email:', email);
        
        let comprasSnapshot;
        
        // Buscar por cliente.correo (formato nuevo) - SIN orderBy para evitar índice
        try {
            comprasSnapshot = await db.collection('compras')
                .where('cliente.correo', '==', email)
                .limit(50)
                .get();
            
            if (!comprasSnapshot.empty) {
                console.log('Compras encontradas con cliente.correo:', comprasSnapshot.size);
            }
        } catch (error) {
            console.log('Error buscando con cliente.correo:', error.message);
        }
        
        // Fallback: buscar por correoCliente (formato antiguo)
        if (comprasSnapshot.empty && email) {
            console.log('No se encontraron compras con cliente.correo, intentando con correoCliente...');
            try {
                comprasSnapshot = await db.collection('compras')
                    .where('correoCliente', '==', email)
                    .limit(50)
                    .get();
                
                if (!comprasSnapshot.empty) {
                    console.log('Compras encontradas con correoCliente:', comprasSnapshot.size);
                }
            } catch (error) {
                console.log('Error buscando con correoCliente:', error.message);
            }
        }
        
        // Convertir a array y ordenar manualmente por fecha
        const comprasArray = [];
        
        for (const doc of comprasSnapshot.docs) {
            const compra = doc.data();
            
            // Obtener productos de la compra
            let productos = '';
            let total = 0;
            
            if (compra.productos && Array.isArray(compra.productos)) {
                productos = compra.productos.map(p => `${p.nombre} (x${p.cantidad})`).join(', ');
                total = compra.total || 0;
            } else if (compra.pastelId) {
                // Formato antiguo con pastelId
                try {
                    const pastelDoc = await db.collection('producto').doc(compra.pastelId).get();
                    if (pastelDoc.exists) {
                        productos = pastelDoc.data().nombre || 'Producto';
                    }
                } catch (error) {
                    console.log("No se pudo obtener información del pastel");
                    productos = compra.nombreProducto || 'Producto';
                }
                total = compra.total || 0;
            } else {
                productos = compra.nombreProducto || 'Producto';
                total = compra.total || 0;
            }
            
            comprasArray.push({
                id: doc.id,
                fechaObj: compra.fecha ? compra.fecha.toDate() : new Date(0),
                fecha: compra.fecha ? formatearFecha(compra.fecha.toDate()) : 'Sin fecha',
                producto: productos,
                monto: formatearPrecio(total),
                estado: traducirEstado(compra.estado || 'pendiente'),
                numeroOrden: compra.numeroOrden || doc.id
            });
        }
        
        // Ordenar manualmente por fecha (más reciente primero)
        comprasArray.sort((a, b) => b.fechaObj - a.fechaObj);
        
        // Tomar solo las 10 más recientes
        const compras = comprasArray.slice(0, 10);
        
        console.log('Compras cargadas:', compras.length);
        mostrarHistorialCompras(compras);
    } catch (error) {
        console.error("Error al cargar compras:", error);
        document.getElementById('historialCompras').innerHTML = 
            '<p style="text-align: center; color: #999;">No hay compras registradas</p>';
    }
}

function traducirEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'confirmado': 'Confirmado',
        'en_preparacion': 'En Preparación',
        'enviado': 'Enviado',
        'entregado': 'Entregado',
        'completado': 'Completado',
        'cancelado': 'Cancelado',
        'error_pago': 'Error en Pago'
    };
    return estados[estado] || estado;
}

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
        
        const badgeClass = compra.estado === 'Completado' || compra.estado === 'Entregado' ? 'success' :
                          compra.estado === 'Cancelado' || compra.estado === 'Error en Pago' ? 'error' :
                          'warning';
        
        card.innerHTML = `
            <div class="card-content">
                <div>
                    <div class="card-title">${compra.producto}</div>
                    <div class="card-date">${compra.fecha}</div>
                    <div class="card-date" style="font-size: 0.75rem; color: #999;">Orden: ${compra.numeroOrden}</div>
                </div>
                <div style="text-align: right;">
                    <div class="card-price">${compra.monto}</div>
                    <span class="badge ${badgeClass}">${compra.estado}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// FUNCIONES PARA HISTORIAL DE CONTACTO
// ==========================================

async function cargarHistorialContactoFirebase(userId, email) {
    try {
        console.log('Cargando contactos para userId:', userId, 'email:', email);
        
        if (!email) {
            console.log('No hay email disponible para buscar contactos');
            document.getElementById('historialContacto').innerHTML = 
                '<p style="text-align: center; color: #999;">No hay contactos registrados</p>';
            return;
        }
        
        // Buscar contactos por email - Intentar primero 'contactos' y luego 'contacto'
        let contactosSnapshot = await db.collection('contactos')
            .where('email', '==', email)
            .limit(50)
            .get();
        
        // Fallback: si no encuentra en 'contactos', buscar en 'contacto'
        if (contactosSnapshot.empty) {
            console.log('No se encontraron en "contactos", buscando en "contacto"...');
            contactosSnapshot = await db.collection('contacto')
                .where('email', '==', email)
                .limit(50)
                .get();
        }
        
        const contactosArray = [];
        contactosSnapshot.forEach(doc => {
            const contacto = doc.data();
            console.log('Procesando contacto:', doc.id, contacto); // Debug
            contactosArray.push({
                id: doc.id,
                fechaObj: contacto.fecha ? contacto.fecha.toDate() : new Date(0),
                fecha: contacto.fecha ? formatearFecha(contacto.fecha.toDate()) : 'Sin fecha',
                tipo: contacto.tipo || 'Consulta',
                mensaje: contacto.message || contacto.mensaje || 'Sin mensaje',
                nombre: contacto.nombre || 'Usuario',
                respuesta: contacto.estadoRespuesta || contacto.estado || 'Pendiente'
            });
        });
        
        console.log('Total contactos procesados:', contactosArray.length); // Debug
        
        // Ordenar por fecha (más reciente primero)
        contactosArray.sort((a, b) => b.fechaObj - a.fechaObj);
        
        // Tomar solo los 10 más recientes
        const contactos = contactosArray.slice(0, 10);
        
        console.log('Contactos cargados:', contactos.length);
        mostrarHistorialContacto(contactos);
    } catch (error) {
        console.error("Error al cargar contactos:", error);
        document.getElementById('historialContacto').innerHTML = 
            '<p style="text-align: center; color: #999;">No hay contactos registrados</p>';
    }
}

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

function toggleEdit() {
    const infoView = document.getElementById('infoView');
    const editView = document.getElementById('editView');
    const btnEditar = document.getElementById('btnEditar');
    
    if (infoView.classList.contains('hidden')) {
        infoView.classList.remove('hidden');
        editView.classList.add('hidden');
        btnEditar.innerHTML = '<i data-lucide="edit-2"></i> Editar';
    } else {
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
                correo: document.getElementById('inputEmail').value,
                telefono: document.getElementById('inputTelefono').value,
                direccion: document.getElementById('inputDireccion').value
            };
            
            try {
                await db.collection('usuarios').doc(usuarioActual.uid).update({
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

function formatearFecha(fecha) {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(precio);
}

function mostrarError(mensaje) {
    console.error(mensaje);
}

function mostrarDatosEjemplo() {
    const datosEjemplo = {
        nombre: "Usuario Invitado",
        correo: "invitado@ejemplo.com",
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
// FUNCIONES ADICIONALES
// ==========================================

async function crearCompra(compraData) {
    if (!usuarioActual) {
        alert("❌ Debes iniciar sesión para realizar una compra");
        return null;
    }
    
    try {
        // Obtener datos completos del cliente
        const clienteInfo = {
            nombre: clienteData.nombre || usuarioActual.displayName || "Cliente",
            apellidos: clienteData.apellidos || "",
            correo: usuarioActual.email
        };
        
        // Estructura de la nueva compra siguiendo el formato del ejemplo
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
            numeroOrden: `ORDEN${Date.now()}${Math.floor(Math.random() * 1000)}`,
            productos: compraData.productos || [],
            total: compraData.total || 0
        };
        
        const compraRef = await db.collection('compras').add(nuevaCompra);
        console.log('Compra creada con ID:', compraRef.id);
        
        // Actualizar puntos del cliente
        const puntosGanados = Math.floor(compraData.total / 1000);
        if (puntosGanados > 0) {
            await db.collection('usuarios').doc(usuarioActual.uid).update({
                puntos: firebase.firestore.FieldValue.increment(puntosGanados)
            });
            
            await cargarDatosClienteFirebase(usuarioActual.uid);
        }
        
        // Recargar historial de compras
        await cargarHistorialComprasFirebase(usuarioActual.uid, usuarioActual.email);
        
        return compraRef.id;
    } catch (error) {
        console.error("Error al crear compra:", error);
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
        // Obtener nombre del cliente desde clienteData
        const nombreCliente = clienteData.nombre || usuarioActual.displayName || "Usuario";
        
        // Estructura simple del contacto según el ejemplo
        const nuevoContacto = {
            email: usuarioActual.email,
            nombre: nombreCliente,
            message: contactoData.mensaje || contactoData.message || "",
            tipo: contactoData.tipo || 'Consulta',
            estado: 'Pendiente',
            estadoRespuesta: 'Pendiente',
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('Creando contacto:', nuevoContacto);
        
        // Guardar en la colección 'contactos' (con 's')
        const contactoRef = await db.collection('contactos').add(nuevoContacto);
        console.log('Contacto creado con ID:', contactoRef.id);
        
        // Recargar historial de contactos
        await cargarHistorialContactoFirebase(usuarioActual.uid, usuarioActual.email);
        
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