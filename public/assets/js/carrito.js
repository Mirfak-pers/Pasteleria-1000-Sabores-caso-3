// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC01DeLX515dsD29to5rHeqaWC8RV98KNg",
    authDomain: "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
    databaseURL: "https://tiendapasteleriamilsabor-a7ac6-default-rtdb.firebaseio.com",
    projectId: "tiendapasteleriamilsabor-a7ac6",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosOferta = [];

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarCarrito();
    cargarProductosOferta();
    configurarEventos();
});

/**
 * Inicializa la interfaz del carrito
 */
function inicializarCarrito() {
    actualizarCarritoHeader();
    renderizarCarrito();
    calcularTotal();
}

/**
 * Carga productos en oferta desde Firestore
 * MEJORADO: Usa campo "nuevoPrecio" para identificar ofertas
 */
async function cargarProductosOferta() {
    try {
        const snapshot = await db.collection("producto").get();
        
        // Filtrar y mapear productos con ofertas (tienen nuevoPrecio < precio)
        productosOferta = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(producto => {
                // Producto en oferta si tiene nuevoPrecio menor que precio y tiene stock
                return producto.nuevoPrecio && 
                       producto.nuevoPrecio < producto.precio && 
                       producto.stock > 0;
            })
            .map(producto => {
                // Calcular descuento y ahorro
                const descuento = Math.round(
                    ((producto.precio - producto.nuevoPrecio) / producto.precio) * 100
                );
                return {
                    ...producto,
                    porcentajeDescuento: descuento,
                    ahorro: producto.precio - producto.nuevoPrecio
                };
            })
            .sort((a, b) => b.porcentajeDescuento - a.porcentajeDescuento)
            .slice(0, 6); // Mostrar solo 6 mejores ofertas
        
        console.log(`${productosOferta.length} productos en oferta cargados`);
        renderizarProductosOferta(productosOferta);
    } catch (error) {
        console.error("Error cargando productos en oferta:", error);
    }
}

/**
 * Renderiza los productos en oferta
 * MEJORADO: Muestra badge de descuento y ahorro
 */
function renderizarProductosOferta(productos) {
    const contenedor = document.getElementById('productosOferta');
    
    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                <p style="font-size: 18px; color: #666;">No hay productos en oferta en este momento</p>
                <a href="productos.html" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px;">
                    Ver todos los productos
                </a>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = productos.map(producto => `
        <div class="producto-card" style="position: relative;">
            <!-- Badge de descuento -->
            <div style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 8px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; z-index: 2; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);">
                -${producto.porcentajeDescuento}%
            </div>
            
            <img src="${producto.imagen}" 
                 alt="${producto.nombre}" 
                 class="producto-imagen"
                 onerror="this.src='https://via.placeholder.com/400x300/FFC0CB/8B4513?text=Sin+Imagen'">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">
                    ${producto.categoria || 'Sin categoría'}
                </p>
                
                <!-- Precios -->
                <div class="precios-oferta" style="margin: 10px 0;">
                    <div style="text-decoration: line-through; color: #999; font-size: 16px;">
                        $${producto.precio.toLocaleString('es-CL')}
                    </div>
                    <div style="color: #dc3545; font-size: 24px; font-weight: bold;">
                        $${producto.nuevoPrecio.toLocaleString('es-CL')}
                    </div>
                    <div style="background: #d4edda; color: #155724; padding: 5px 10px; border-radius: 5px; font-size: 13px; display: inline-block; margin-top: 5px;">
                        ✓ Ahorras $${producto.ahorro.toLocaleString('es-CL')}
                    </div>
                </div>
                
                <p class="stock-disponible" style="color: ${producto.stock <= 5 ? '#dc3545' : '#28a745'}; font-weight: 600; margin: 8px 0;">
                    ${producto.stock <= 5 ? '¡Últimas unidades!' : `Stock: ${producto.stock}`}
                </p>
                
                <button class="btn-agregar-oferta" 
                        data-id="${producto.id}"
                        style="background: #dc3545; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; transition: background 0.3s;">
                    🛒 Agregar al carrito
                </button>
            </div>
        </div>
    `).join('');

    // Agregar eventos a los botones de añadir
    document.querySelectorAll('.btn-agregar-oferta').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            agregarProductoAlCarrito(productId);
        });
        
        // Efecto hover
        btn.addEventListener('mouseenter', function() {
            this.style.background = '#c82333';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.background = '#dc3545';
        });
    });
}

/**
 * Renderiza los productos en el carrito
 * MEJORADO: Muestra si el producto está en oferta
 */
function renderizarCarrito() {
    const tbody = document.getElementById('tablaCarritoBody');
    
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="carrito-vacio">
                    <div class="icono">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para continuar</p>
                    <a href="productos.html" class="btn-ir-catalogo">Ir al Catálogo</a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = carrito.map((producto, index) => {
        const esOferta = producto.esOferta || (producto.precioOriginal && producto.precioOriginal > producto.precio);
        const precioUnitario = producto.precio || 0;
        const cantidad = producto.cantidad || 1;
        const subtotal = precioUnitario * cantidad;

        return `
        <tr style="background: ${esOferta ? '#fff5f5' : 'white'};">
            <td>
                <div style="position: relative;">
                    <img src="${producto.imagen}" 
                         alt="${producto.nombre}" 
                         class="imagen-tabla"
                         onerror="this.src='https://via.placeholder.com/100x100/FFC0CB/8B4513?text=Sin+Imagen'">
                    ${esOferta ? '<span style="position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; font-size: 10px; padding: 2px 6px; border-radius: 3px; font-weight: bold;">OFERTA</span>' : ''}
                </div>
            </td>
            <td>
                <div style="font-weight: 600;">${producto.nombre}</div>
                ${esOferta && producto.precioOriginal ? `
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">
                        Antes: <span style="text-decoration: line-through;">$${producto.precioOriginal.toLocaleString('es-CL')}</span>
                        <span style="color: #28a745; font-weight: bold; margin-left: 5px;">
                            Ahorras $${((producto.precioOriginal - producto.precio) * cantidad).toLocaleString('es-CL')}
                        </span>
                    </div>
                ` : ''}
            </td>
            <td style="font-weight: bold; color: ${esOferta ? '#dc3545' : '#333'};">
                $${precioUnitario.toLocaleString('es-CL')}
            </td>
            <td>
                <div class="controles-cantidad">
                    <button class="btn-cantidad" onclick="disminuirCantidad(${index})">-</button>
                    <span class="cantidad-actual">${cantidad}</span>
                    <button class="btn-cantidad" onclick="aumentarCantidad(${index})">+</button>
                </div>
            </td>
            <td style="font-weight: bold; font-size: 16px;">
                $${subtotal.toLocaleString('es-CL')}
            </td>
            <td>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                    🗑️ Eliminar
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

/**
 * Agrega un producto al carrito
 * MEJORADO: Usa nuevoPrecio si existe (producto en oferta)
 */
function agregarProductoAlCarrito(productId) {
    const producto = productosOferta.find(p => p.id === productId);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    // Verificar stock
    if (producto.stock <= 0) {
        mostrarNotificacion('Producto sin stock disponible', 'error');
        return;
    }
    
    // Verificar si ya está en el carrito
    const productoExistente = carrito.find(item => item.id === productId);
    
    if (productoExistente) {
        // Verificar que no exceda el stock
        if (productoExistente.cantidad >= producto.stock) {
            mostrarNotificacion('No hay más stock disponible', 'error');
            return;
        }
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
        // Agregar nuevo producto al carrito
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen,
            categoria: producto.categoria,
            precio: producto.nuevoPrecio, // ← USAR PRECIO DE OFERTA
            precioOriginal: producto.precio, // ← GUARDAR PRECIO ORIGINAL
            stock: producto.stock,
            cantidad: 1,
            esOferta: true // ← MARCAR COMO OFERTA
        });
    }
    
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    
    // Actualizar stock en Firebase
    actualizarStockFirebase(productId, 1);
    
    // Notificación con ahorro
    const ahorro = producto.precio - producto.nuevoPrecio;
    mostrarNotificacion(
        `"${producto.nombre}" agregado - ¡Ahorraste $${ahorro.toLocaleString('es-CL')}!`,
        'success'
    );
}

/**
 * Actualizar stock en Firebase cuando se agrega al carrito
 */
async function actualizarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const stockActual = productoDoc.data().stock;
            const nuevoStock = Math.max(0, stockActual - cantidad);
            
            await productoRef.update({ stock: nuevoStock });
            
            console.log(`Stock actualizado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error actualizando stock en Firebase:", error);
    }
}

/**
 * Restaurar stock cuando se elimina del carrito
 */
async function restaurarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const stockActual = productoDoc.data().stock;
            const nuevoStock = stockActual + cantidad;
            
            await productoRef.update({ stock: nuevoStock });
            
            console.log(`Stock restaurado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error restaurando stock en Firebase:", error);
    }
}

/**
 * Aumenta la cantidad de un producto en el carrito
 */
function aumentarCantidad(index) {
    const producto = carrito[index];
    
    // Verificar stock antes de aumentar
    if (producto.stock <= producto.cantidad) {
        mostrarNotificacion('No hay suficiente stock disponible', 'error');
        return;
    }
    
    carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    
    // Actualizar stock en Firebase
    actualizarStockFirebase(producto.id, 1);
}

/**
 * Disminuye la cantidad de un producto en el carrito
 */
function disminuirCantidad(index) {
    const producto = carrito[index];
    
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        
        // Restaurar stock en Firebase
        restaurarStockFirebase(producto.id, 1);
    } else {
        // Si la cantidad es 1, preguntar si desea eliminar
        if (confirm('¿Deseas eliminar este producto del carrito?')) {
            eliminarDelCarrito(index);
        }
    }
}

/**
 * Elimina un producto del carrito
 */
function eliminarDelCarrito(index) {
    const producto = carrito[index];
    const cantidadEliminada = producto.cantidad || 1;
    
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    mostrarNotificacion(`"${producto.nombre}" eliminado del carrito`, 'success');

    // Restaurar stock en Firebase
    restaurarStockFirebase(producto.id, cantidadEliminada);
}

/**
 * Calcula el total del carrito
 * MEJORADO: Muestra ahorro total si hay ofertas
 */
function calcularTotal() {
    const total = carrito.reduce((sum, producto) => {
        return sum + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);
    
    // Calcular ahorro total
    const ahorroTotal = carrito.reduce((sum, producto) => {
        if (producto.esOferta && producto.precioOriginal) {
            const ahorroProducto = (producto.precioOriginal - producto.precio) * producto.cantidad;
            return sum + ahorroProducto;
        }
        return sum;
    }, 0);
    
    document.getElementById('totalCarrito').textContent = total.toLocaleString('es-CL');
    
    // Mostrar ahorro si existe
    if (ahorroTotal > 0) {
        const totalElement = document.getElementById('totalCarrito').parentElement;
        let ahorroElement = document.getElementById('ahorroTotal');
        
        if (!ahorroElement) {
            ahorroElement = document.createElement('div');
            ahorroElement.id = 'ahorroTotal';
            ahorroElement.style.cssText = 'color: #28a745; font-size: 16px; margin-top: 10px; font-weight: 600;';
            totalElement.appendChild(ahorroElement);
        }
        
        ahorroElement.textContent = `✓ Ahorras un total de $${ahorroTotal.toLocaleString('es-CL')}`;
    } else {
        const ahorroElement = document.getElementById('ahorroTotal');
        if (ahorroElement) {
            ahorroElement.remove();
        }
    }
    
    actualizarCarritoHeader();
}

/**
 * Actualiza el header del carrito
 */
function actualizarCarritoHeader() {
    const total = carrito.reduce((sum, producto) => {
        return sum + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);
    
    const totalElement = document.querySelector('.carrito-total');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString('es-CL');
    }
}

/**
 * Guarda el carrito en localStorage
 */
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Limpia todo el carrito
 * MEJORADO: Restaura el stock de todos los productos
 */
async function limpiarCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito ya está vacío', 'error');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
        // Restaurar stock de todos los productos
        for (const producto of carrito) {
            await restaurarStockFirebase(producto.id, producto.cantidad || 1);
        }
        
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        mostrarNotificacion('Carrito limpiado correctamente', 'success');
    }
}

/**
 * Redirige al checkout
 */
function irAlCheckout() {
    if (carrito.length === 0) {
        mostrarNotificacion('Agrega productos al carrito antes de continuar', 'error');
        return;
    }

    mostrarNotificacion('Redirigiendo al checkout...', 'success');

    // Redirige al checkout
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}


/**
 * Muestra una notificación temporal
 * MEJORADO: Soporte para diferentes tipos (success, error)
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    const backgroundColor = tipo === 'success' ? '#28a745' : '#dc3545';
    
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

/**
 * Configura los eventos de la página
 */
function configurarEventos() {
    const btnLimpiar = document.getElementById('btnLimpiarCarrito');
    const btnComprar = document.getElementById('btnComprarAhora');
    
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarCarrito);
    }
    
    if (btnComprar) {
        btnComprar.addEventListener('click', irAlCheckout);
    }
}

// Hacer funciones disponibles globalmente
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;