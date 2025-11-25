// checkout.js - Adaptado al HTML proporcionado
console.log('checkout.js cargado');

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Datos de regiones y comunas de Chile
const regionesComunas = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Treguaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
    "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío", "Lebú", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa"],
    "Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Aysén": ["Coihaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando checkout...');
    console.log('Carrito desde localStorage:', carrito);
    console.log('Total de productos en carrito:', carrito.length);
    
    // Inicializar todas las funciones
    inicializarCheckout();
});

/**
 * Función principal de inicialización
 */
function inicializarCheckout() {
    // 1. Cargar regiones
    cargarRegiones();
    
    // 2. Renderizar productos
    renderizarProductosCheckout();
    
    // 3. Actualizar totales
    actualizarTotales();
    
    // 4. Configurar eventos
    configurarEventosCheckout();
    
    console.log('Checkout inicializado correctamente');
}

/**
 * Renderiza los productos en la tabla del checkout
 */
function renderizarProductosCheckout() {
    const tbody = document.getElementById('tablaCheckoutBody');
    
    if (!tbody) {
        console.error('❌ No se encontró el elemento con ID "tablaCheckoutBody"');
        return;
    }
    
    console.log(`📦 Renderizando ${carrito.length} productos...`);
    
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;">🛒</div>
                    <h3 style="color: #666; margin-bottom: 10px;">Tu carrito está vacío</h3>
                    <p style="color: #999; margin-bottom: 30px;">Agrega productos desde nuestra tienda</p>
                    <a href="/assets/Page/productos.html" class="btn btn-primary" style="padding: 12px 30px;">
                        Ver Productos
                    </a>
                </td>
            </tr>
        `;
        
        // Deshabilitar botón de pago
        deshabilitarBotonPago();
        return;
    }

    // Generar HTML para cada producto
    tbody.innerHTML = carrito.map((producto, index) => {
        const precio = parseFloat(producto.precio) || 0;
        const cantidad = parseInt(producto.cantidad) || 1;
        const subtotal = precio * cantidad;
        
        console.log(`Producto ${index + 1}:`, {
            nombre: producto.nombre,
            precio,
            cantidad,
            subtotal
        });
        
        return `
            <tr>
                <td>
                    <img src="${producto.imagen || '/assets/image/placeholder.jpg'}" 
                         alt="${producto.nombre || 'Producto'}" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;"
                         onerror="this.src='https://via.placeholder.com/80x80/f0f0f0/999999?text=Sin+Imagen'">
                </td>
                <td style="font-weight: 500;">${producto.nombre || 'Producto sin nombre'}</td>
                <td style="color: #e91e63; font-weight: 600;">$${precio.toLocaleString('es-CL')}</td>
                <td style="text-align: center; font-weight: 500;">${cantidad}</td>
                <td style="color: #333; font-weight: 700; font-size: 1.1em;">$${subtotal.toLocaleString('es-CL')}</td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Productos renderizados correctamente');
}

/**
 * Actualiza los totales en la interfaz
 */
function actualizarTotales() {
    const total = carrito.reduce((sum, producto) => {
        const precio = parseFloat(producto.precio) || 0;
        const cantidad = parseInt(producto.cantidad) || 1;
        return sum + (precio * cantidad);
    }, 0);
    
    console.log('💰 Total calculado: $' + total.toLocaleString('es-CL'));
    
    // Actualizar el monto en el botón de pagar
    const montoPagar = document.getElementById('montoPagar');
    if (montoPagar) {
        montoPagar.textContent = total.toLocaleString('es-CL');
        console.log('✅ Total actualizado en el botón');
    } else {
        console.warn('⚠️ No se encontró el elemento "montoPagar"');
    }
    
    // Actualizar total en el header (si existe)
    const carritoTotal = document.querySelector('.carrito-total');
    if (carritoTotal) {
        carritoTotal.textContent = total.toLocaleString('es-CL');
    }
}

/**
 * Deshabilita el botón de pago cuando el carrito está vacío
 */
function deshabilitarBotonPago() {
    const btnPagar = document.getElementById('btnPagarAhora');
    if (btnPagar) {
        btnPagar.disabled = true;
        btnPagar.style.opacity = '0.5';
        btnPagar.style.cursor = 'not-allowed';
        btnPagar.innerHTML = 'Carrito vacío';
        console.log('🔒 Botón de pago deshabilitado');
    }
}

/**
 * Carga las regiones en el select
 */
function cargarRegiones() {
    const selectRegion = document.getElementById('region');
    if (!selectRegion) {
        console.error('❌ No se encontró el select de región');
        return;
    }
    
    // Limpiar opciones existentes (excepto la primera)
    selectRegion.innerHTML = '<option value="">Selecciona una región</option>';
    
    // Ordenar regiones alfabéticamente
    const regionesOrdenadas = Object.keys(regionesComunas).sort();
    
    regionesOrdenadas.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        selectRegion.appendChild(option);
    });
    
    console.log(`✅ ${regionesOrdenadas.length} regiones cargadas`);
}

/**
 * Carga las comunas según la región seleccionada
 */
function cargarComunas(region) {
    const selectComuna = document.getElementById('comuna');
    if (!selectComuna) {
        console.error('❌ No se encontró el select de comuna');
        return;
    }
    
    const comunas = regionesComunas[region] || [];
    
    // Limpiar select de comunas
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    
    // Ordenar comunas alfabéticamente y agregarlas
    comunas.sort().forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        selectComuna.appendChild(option);
    });
    
    // Habilitar el select de comunas
    selectComuna.disabled = false;
    
    console.log(`✅ ${comunas.length} comunas cargadas para ${region}`);
}

/**
 * Configura todos los eventos del checkout
 */
function configurarEventosCheckout() {
    // Evento del botón de pagar
    const btnPagar = document.getElementById('btnPagarAhora');
    if (btnPagar) {
        btnPagar.addEventListener('click', procesarPago);
        console.log('✅ Evento click configurado en botón de pago');
    } else {
        console.error('❌ No se encontró el botón "btnPagarAhora"');
    }
    
    // Evento para cambio de región
    const selectRegion = document.getElementById('region');
    if (selectRegion) {
        selectRegion.addEventListener('change', function() {
            if (this.value) {
                cargarComunas(this.value);
            } else {
                const selectComuna = document.getElementById('comuna');
                selectComuna.innerHTML = '<option value="">Primero selecciona una región</option>';
                selectComuna.disabled = true;
            }
        });
        console.log('✅ Evento change configurado en select de región');
    }
    
    // Validación en tiempo real de campos requeridos
    const camposRequeridos = document.querySelectorAll('input[required], select[required]');
    camposRequeridos.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });
    
    console.log(`✅ Validación configurada en ${camposRequeridos.length} campos`);
}

/**
 * Valida un campo individual
 */
function validarCampo(campo) {
    if (!campo.value.trim()) {
        campo.style.borderColor = '#dc3545';
        campo.style.borderWidth = '2px';
        return false;
    } else {
        campo.style.borderColor = '#28a745';
        campo.style.borderWidth = '2px';
        return true;
    }
}

/**
 * Valida todos los formularios
 */
function validarFormularios() {
    const formCliente = document.getElementById('formCliente');
    const formDireccion = document.getElementById('formDireccion');
    
    if (!formCliente || !formDireccion) {
        console.error('❌ No se encontraron los formularios');
        return false;
    }
    
    const clienteValido = formCliente.checkValidity();
    const direccionValida = formDireccion.checkValidity();
    
    if (!clienteValido) {
        formCliente.reportValidity();
        console.log('❌ Formulario de cliente inválido');
        return false;
    }
    
    if (!direccionValida) {
        formDireccion.reportValidity();
        console.log('❌ Formulario de dirección inválido');
        return false;
    }
    
    console.log('✅ Formularios válidos');
    return true;
}

/**
 * Obtiene los datos del cliente
 */
function obtenerDatosCliente() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        correo: document.getElementById('correo').value.trim()
    };
}

/**
 * Obtiene los datos de dirección
 */
function obtenerDatosDireccion() {
    return {
        calle: document.getElementById('calle').value.trim(),
        departamento: document.getElementById('departamento').value.trim() || 'N/A',
        region: document.getElementById('region').value,
        comuna: document.getElementById('comuna').value,
        indicaciones: document.getElementById('indicaciones').value.trim() || 'Sin indicaciones adicionales'
    };
}

/**
 * Genera un número de orden único
 */
function generarNumeroOrden() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
}

/**
 * Procesa el pago y guarda la compra en Firestore
 */
async function procesarPago() {
    console.log('🔄 Iniciando proceso de pago...');
    
    // 1. Validar carrito
    if (carrito.length === 0) {
        alert('❌ No hay productos en el carrito');
        return;
    }
    
    // 2. Verificar autenticación de Firebase
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.error('❌ Firebase no está disponible');
        alert('Error: Sistema de autenticación no disponible');
        return;
    }
    
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('⚠️ Debes iniciar sesión para completar la compra');
        // Guardar URL actual para volver después del login
        localStorage.setItem('returnUrl', window.location.href);
        window.location.href = 'login.html';
        return;
    }
    
    console.log('✅ Usuario autenticado:', user.email);
    
    // 3. Validar formularios
    if (!validarFormularios()) {
        alert('⚠️ Por favor completa todos los campos obligatorios marcados con *');
        return;
    }
    
    // 4. Deshabilitar botón y mostrar estado
    const btnPagar = document.getElementById('btnPagarAhora');
    const textoOriginal = btnPagar.innerHTML;
    btnPagar.disabled = true;
    btnPagar.innerHTML = '⏳ Procesando pago...';
    btnPagar.style.opacity = '0.7';
    
    try {
        // 5. Recopilar datos
        const datosCliente = obtenerDatosCliente();
        const datosDireccion = obtenerDatosDireccion();
        const total = carrito.reduce((sum, p) => sum + ((p.precio || 0) * (p.cantidad || 1)), 0);
        const numeroOrden = generarNumeroOrden();
        
        // 6. Crear objeto de compra
        const compra = {
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            fechaLocal: new Date().toISOString(),
            userId: user.uid,
            userEmail: user.email, // Email del usuario autenticado
            cliente: {
                ...datosCliente,
                correo: user.email // Asegurar que use el email de Firebase Auth
            },
            direccion: datosDireccion,
            productos: carrito.map(p => ({
                nombre: p.nombre,
                precio: p.precio,
                cantidad: p.cantidad,
                imagen: p.imagen
            })),
            total: total,
            estado: 'pendiente',
            numeroOrden: numeroOrden
        };
        
        console.log('📦 Datos de compra:', compra);
        
        // 7. Guardar en Firestore
        const docRef = await db.collection('compras').add(compra);
        console.log('✅ Compra guardada en Firestore con ID:', docRef.id);
        
        // 8. Simular procesamiento de pago (70% éxito)
        const pagoExitoso = Math.random() > 0.3;
        
        if (pagoExitoso) {
            // Pago exitoso
            await db.collection('compras').doc(docRef.id).update({
                estado: 'completada',
                fechaPago: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Pago completado exitosamente');
            
            // Actualizar puntos del usuario
            const puntosGanados = Math.floor(total / 1000);
            if (puntosGanados > 0) {
                try {
                    await db.collection('usuarios').doc(user.uid).update({
                        puntos: firebase.firestore.FieldValue.increment(puntosGanados),
                        ultimaCompra: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`✅ ${puntosGanados} puntos agregados al usuario`);
                } catch (error) {
                    console.warn('⚠️ No se pudieron actualizar los puntos:', error);
                }
            }
            
            // Limpiar carrito
            localStorage.removeItem('carrito');
            localStorage.setItem('ultimaCompra', JSON.stringify({
                ...compra,
                id: docRef.id
            }));
            
            // Redirigir a página de éxito
            window.location.href = `compraExitosa.html?orden=${numeroOrden}`;
            
        } else {
            // Pago fallido
            await db.collection('compras').doc(docRef.id).update({
                estado: 'error_pago',
                fechaError: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('❌ Error en el procesamiento del pago');
            
            localStorage.setItem('ultimaCompra', JSON.stringify({
                ...compra,
                id: docRef.id
            }));
            
            // Redirigir a página de error
            window.location.href = `errorPago.html?orden=${numeroOrden}`;
        }
        
    } catch (error) {
        console.error('❌ Error procesando la compra:', error);
        alert('Error al procesar la compra: ' + error.message);
        
        // Rehabilitar botón
        btnPagar.disabled = false;
        btnPagar.innerHTML = textoOriginal;
        btnPagar.style.opacity = '1';
    }
}

console.log('✅ checkout.js completamente cargado y listo');