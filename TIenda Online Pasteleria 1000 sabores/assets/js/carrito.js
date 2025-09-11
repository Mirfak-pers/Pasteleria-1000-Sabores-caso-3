// 1. Arreglo de Productos (Completo)
const productos = [
    // Tortas Cuadradas
    { 
        id: 1, 
        codigo: "TC001", 
        nombre: "Torta Cuadrada de Chocolate", 
        precio: 45000, 
        stock: 10, 
        categoria: "Tortas Cuadradas", 
        imagen: "../image/torta-chocolate.jpg",
        descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales."
    },
    { 
        id: 2, 
        codigo: "TC002", 
        nombre: "Torta Cuadrada de Frutas", 
        precio: 50000, 
        stock: 5, 
        categoria: "Tortas Cuadradas", 
        imagen: "../image/torta-frutas.jpg",
        descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones."
    },
    
    // Tortas Circulares
    { 
        id: 3, 
        codigo: "TT001", 
        nombre: "Torta Circular de Vainilla", 
        precio: 40000, 
        stock: 15, 
        categoria: "Tortas Circulares", 
        imagen: "../image/torta-vainilla.jpg",
        descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión."
    },
    { 
        id: 4, 
        codigo: "TT002", 
        nombre: "Torta Circular de Manjar", 
        precio: 42000, 
        stock: 8, 
        categoria: "Tortas Circulares", 
        imagen: "../image/torta-manjar.jpg",
        descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos."
    },
    
    // Postres Individuales
    { 
        id: 5, 
        codigo: "PI001", 
        nombre: "Mousse de Chocolate", 
        precio: 5000, 
        stock: 20, 
        categoria: "Postres Individuales", 
        imagen: "../image/mousse-chocolate.jpg",
        descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate."
    },
    { 
        id: 6, 
        codigo: "PI002", 
        nombre: "Tiramisú Clásico", 
        precio: 5500, 
        stock: 12, 
        categoria: "Postres Individuales", 
        imagen: "../image/tiramisu.jpg",
        descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida."
    },
    
    // Productos Sin Azúcar
    { 
        id: 7, 
        codigo: "PSA001", 
        nombre: "Torta Sin Azúcar de Naranja", 
        precio: 48000, 
        stock: 6, 
        categoria: "Productos Sin Azúcar", 
        imagen: "../image/torta-naranja.jpg",
        descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables."
    },
    { 
        id: 8, 
        codigo: "PSA002", 
        nombre: "Cheesecake Sin Azúcar", 
        precio: 47000, 
        stock: 4, 
        categoria: "Productos Sin Azúcar", 
        imagen: "../image/cheesecake-sin-azucar.jpg",
        descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa."
    },
    
    // Pastelería Tradicional
    { 
        id: 9, 
        codigo: "PT001", 
        nombre: "Empanada de Manzana", 
        precio: 3000, 
        stock: 25, 
        categoria: "Pastelería Tradicional", 
        imagen: "../image/empanada-manzana.jpg",
        descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda."
    },
    { 
        id: 10, 
        codigo: "PT002", 
        nombre: "Tarta de Santiago", 
        precio: 6000, 
        stock: 10, 
        categoria: "Pastelería Tradicional", 
        imagen: "../image/tarta-santiago.jpg",
        descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos."
    },
    
    // Productos Sin Gluten
    { 
        id: 11, 
        codigo: "PG001", 
        nombre: "Brownie Sin Gluten", 
        precio: 4000, 
        stock: 15, 
        categoria: "Productos Sin Gluten", 
        imagen: "../image/brownie-sin-gluten.jpg",
        descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor."
    },
    { 
        id: 12, 
        codigo: "PG002", 
        nombre: "Pan Sin Gluten", 
        precio: 3500, 
        stock: 18, 
        categoria: "Productos Sin Gluten", 
        imagen: "../image/pan-sin-gluten.jpg",
        descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida."
    },
    
    // Productos Veganos
    { 
        id: 13, 
        codigo: "PV001", 
        nombre: "Torta Vegana de Chocolate", 
        precio: 50000, 
        stock: 8, 
        categoria: "Productos Veganos", 
        imagen: "../image/torta-vegana.jpg",
        descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos."
    },
    { 
        id: 14, 
        codigo: "PV002", 
        nombre: "Galletas Veganas de Avena", 
        precio: 4500, 
        stock: 20, 
        categoria: "Productos Veganos", 
        imagen: "../image/galletas-veganas.jpg",
        descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano."
    },
    
    // Tortas Especiales
    { 
        id: 15, 
        codigo: "TE001", 
        nombre: "Torta Especial de Cumpleaños", 
        precio: 55000, 
        stock: 3, 
        categoria: "Tortas Especiales", 
        imagen: "../image/torta-cumpleanos.jpg",
        descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos."
    },
    { 
        id: 16, 
        codigo: "TE002", 
        nombre: "Torta Especial de Boda", 
        precio: 60000, 
        stock: 2, 
        categoria: "Tortas Especiales", 
        imagen: "../image/torta-boda.jpg",
        descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda."
    }
];
// Función para formatear el precio en CLP
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(precio);
}

// Función para obtener todas las categorías únicas
function obtenerCategorias() {
    const categorias = [...new Set(productos.map(producto => producto.categoria))];
    return categorias;
}

// Función para crear una tarjeta de producto
function crearTarjetaProducto(producto) {
    // Verificar si hay stock
    const stockClass = producto.stock > 0 ? 'text-success' : 'text-danger';
    const stockText = producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado';
    const disabledClass = producto.stock > 0 ? '' : 'disabled';
    
    return `
        <div class="col-md-6 col-lg-4 col-xl-3 mb-4 producto-item" data-categoria="${producto.categoria}">
            <div class="card h-100 shadow-sm">
                <div class="imagen-clickable" style="cursor: pointer;" data-codigo="${producto.codigo}">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 200px; object-fit: cover;">
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-subtitle mb-2 text-muted">${producto.codigo}</h6>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text flex-grow-1 small">${producto.descripcion}</p>
                    <div class="mt-auto">
                        <p class="card-text">
                            <span class="badge bg-primary">${producto.categoria}</span>
                        </p>
                        <p class="card-text">
                            <small class="${stockClass}"><strong>${stockText}</strong></small>
                        </p>
                        <h4 class="text-primary mb-3">${formatearPrecio(producto.precio)}</h4>
                        <button class="btn btn-primary w-100 agregar-carrito ${disabledClass}" 
                                data-id="${producto.id}" 
                                data-codigo="${producto.codigo}"
                                data-nombre="${producto.nombre}" 
                                data-precio="${producto.precio}"
                                ${producto.stock > 0 ? '' : 'disabled'}>
                            <i class="fas fa-shopping-cart me-2"></i>
                            ${producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar todos los productos
function mostrarProductos(productosFiltrados = productos) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return; // Salir si no existe el contenedor
    
    contenedor.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <h4 class="text-muted">No se encontraron productos en esta categoría</h4>
            </div>
        `;
        return;
    }
    
    productosFiltrados.forEach(producto => {
        contenedor.innerHTML += crearTarjetaProducto(producto);
    });
    
    // Agregar event listeners a los botones de agregar al carrito
    document.querySelectorAll('.agregar-carrito:not(.disabled)').forEach(boton => {
        boton.addEventListener('click', function() {
            const producto = {
                id: parseInt(this.dataset.id),
                codigo: this.dataset.codigo,
                nombre: this.dataset.nombre,
                precio: parseFloat(this.dataset.precio)
            };
            agregarAlCarrito(producto);
        });
    });
    
    // Agregar event listeners a las imágenes para redirigir a detalle
    document.querySelectorAll('.imagen-clickable').forEach(div => {
        div.addEventListener('click', function() {
            const productoCodigo = this.dataset.codigo;
            window.location.href = `detalleProducto.html?codigo=${productoCodigo}`;
        });
    });
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    if (categoria === 'all') {
        mostrarProductos();
    } else {
        const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
        mostrarProductos(productosFiltrados);
    }
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = totalItems;
    }
}

// Función para agregar al carrito
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscar el producto completo en el arreglo productos
    const productoCompleto = productos.find(p => p.id === producto.id);
    
    if (!productoCompleto || productoCompleto.stock <= 0) {
        alert("⛔ Este producto está agotado.");
        return;
    }

    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        if (itemExistente.cantidad < productoCompleto.stock) {
            itemExistente.cantidad++;
            alert(`Se añadió otra unidad de ${productoCompleto.nombre}. Total: ${itemExistente.cantidad}`);
        } else {
            alert(`No puedes añadir más de ${productoCompleto.stock} unidades de ${productoCompleto.nombre}.`);
            return;
        }
    } else {
        carrito.push({ ...productoCompleto, cantidad: 1 });
        alert(`${productoCompleto.nombre} añadido al carrito.`);
    }

    // Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Actualizar contador
    actualizarContadorCarrito();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar todos los productos inicialmente
    mostrarProductos();
    
    // Event listeners para los botones de filtro
    document.querySelectorAll('.filter-btn').forEach(boton => {
        boton.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Filtrar productos
            const categoria = this.dataset.category;
            filtrarPorCategoria(categoria);
        });
    });
    
    // Actualizar contador al cargar la página
    actualizarContadorCarrito();
});

function findProductByCodigo(codigo) {
    // Asegúrate de que el arreglo 'productos' esté disponible
    // Puede ser una variable global o importada
    return productos.find(producto => producto.codigo === codigo);
}


// --- NUEVAS FUNCIONES PARA CART.HTML ---

// Función para calcular el subtotal del carrito
function calcularSubtotal(carrito) {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Función para renderizar el contenido del carrito en cart.html
function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedorItems = document.getElementById('cart-items');
    const contenedorContenido = document.getElementById('cart-content');
    const contenedorMensajeVacio = document.getElementById('cart-empty-message');
    const elementoSubtotal = document.getElementById('cart-subtotal');
    const elementoTotal = document.getElementById('cart-total');

    // Limpiar el contenedor de items
    if (contenedorItems) contenedorItems.innerHTML = '';

    if (carrito.length === 0) {
        // Mostrar mensaje de carrito vacío y ocultar contenido
        if (contenedorMensajeVacio) contenedorMensajeVacio.classList.remove('d-none');
        if (contenedorContenido) contenedorContenido.classList.add('d-none');
        if (elementoSubtotal) elementoSubtotal.textContent = formatearPrecio(0);
        if (elementoTotal) elementoTotal.textContent = formatearPrecio(0);
        return;
    }

    // Ocultar mensaje de carrito vacío y mostrar contenido
    if (contenedorMensajeVacio) contenedorMensajeVacio.classList.add('d-none');
    if (contenedorContenido) contenedorContenido.classList.remove('d-none');

    let subtotal = 0;

    // Generar filas para cada item en el carrito
    carrito.forEach(item => {
        const itemSubtotal = item.precio * item.cantidad;
        subtotal += itemSubtotal;

        if (contenedorItems) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.imagen}" class="cart-item-image me-3" alt="${item.nombre}" onerror="this.onerror=null; this.src='assets/image/cake-placeholder.jpg';">
                        <div>
                            <div class="cart-item-name">${item.nombre}</div>
                            <small class="text-muted">${item.categoria}</small>
                        </div>
                    </div>
                </td>
                <td class="cart-item-price">${formatearPrecio(item.precio)}</td>
                <td>
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary btn-cantidad" type="button" data-accion="restar" data-id="${item.id}">-</button>
                        <input type="number" class="form-control text-center input-cantidad" value="${item.cantidad}" min="1" data-id="${item.id}" style="max-width: 50px;">
                        <button class="btn btn-outline-secondary btn-cantidad" type="button" data-accion="sumar" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td class="cart-item-price fw-bold">${formatearPrecio(itemSubtotal)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            contenedorItems.appendChild(fila);
        }
    });

    // Calcular y mostrar totales
    const total = subtotal; // Por ahora, total = subtotal
    if (elementoSubtotal) elementoSubtotal.textContent = formatearPrecio(subtotal);
    if (elementoTotal) elementoTotal.textContent = formatearPrecio(total);

    // Agregar event listeners a los botones recién creados
    if (contenedorItems) {
        contenedorItems.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idProducto = parseInt(e.currentTarget.dataset.id);
                eliminarDelCarrito(idProducto);
            });
        });

        contenedorItems.querySelectorAll('.btn-cantidad').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idProducto = parseInt(e.currentTarget.dataset.id);
                const accion = e.currentTarget.dataset.accion;
                const item = carrito.find(i => i.id === idProducto);
                if (item) {
                    if (accion === 'sumar') {
                        actualizarCantidad(idProducto, item.cantidad + 1);
                    } else if (accion === 'restar' && item.cantidad > 1) {
                        actualizarCantidad(idProducto, item.cantidad - 1);
                    } else if (accion === 'restar' && item.cantidad === 1) {
                        if (confirm('¿Eliminar este producto del carrito?')) {
                            eliminarDelCarrito(idProducto);
                        }
                    }
                }
            });
        });

        contenedorItems.querySelectorAll('.input-cantidad').forEach(input => {
            input.addEventListener('change', (e) => {
                const idProducto = parseInt(e.target.dataset.id);
                const nuevaCantidad = parseInt(e.target.value);
                if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                    actualizarCantidad(idProducto, nuevaCantidad);
                } else {
                    // Si la cantidad es inválida, volver a mostrar la cantidad actual
                    const item = carrito.find(i => i.id === idProducto);
                    if (item) e.target.value = item.cantidad;
                }
            });
        });
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(item => item.id !== idProducto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito(); // Volver a renderizar
    actualizarContadorCarrito(); // Actualizar el contador global
    // Opcional: Mostrar mensaje
    // alert('Producto eliminado del carrito.');
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidad(idProducto, nuevaCantidad) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const indiceItem = carrito.findIndex(item => item.id === idProducto);
    const productoCompleto = productos.find(p => p.id === idProducto); // Necesitamos el stock

    if (indiceItem > -1 && productoCompleto) {
        if (nuevaCantidad > productoCompleto.stock) {
            alert(`No puedes añadir más de ${productoCompleto.stock} unidades de ${productoCompleto.nombre}.`);
            // Volver a renderizar para corregir la cantidad mostrada
            renderizarCarrito();
            return;
        }
        carrito[indiceItem].cantidad = nuevaCantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito(); // Volver a renderizar para actualizar subtotales
        actualizarContadorCarrito(); // Actualizar el contador global
    }
}

// Función para vaciar el carrito (opcional)
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        localStorage.removeItem("carrito");
        renderizarCarrito(); // Volver a renderizar (mostrará mensaje vacío)
        actualizarContadorCarrito(); // Actualizar el contador global
    }
}

// Función para inicializar la página del carrito
// Esta función debe ser llamada desde cart.html
function inicializarPaginaCarrito() {
    // Renderizar el carrito
    renderizarCarrito();

    // Event listener para el botón de proceder al pago
    const btnPagar = document.getElementById('btn-proceed-to-checkout');
    if (btnPagar) {
        btnPagar.addEventListener('click', function() {
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            if (carrito.length > 0) {
                alert('Redirección al proceso de pago (simulada). En una implementación real, aquí se procesaría el pedido.');
                // Aquí iría la lógica para pasar al checkout
                // Ejemplo: window.location.href = 'checkout.html';
                // Opcional: vaciarCarrito();
            } else {
                alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
            }
        });
    }

    // Event listener para el botón de vaciar carrito (si lo tienes)
    // const btnVaciar = document.getElementById('btn-clear-cart');
    // if (btnVaciar) {
    //     btnVaciar.addEventListener('click', vaciarCarrito);
    // }
}

// --- FIN NUEVAS FUNCIONES PARA CART.HTML ---