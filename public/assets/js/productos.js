// assets/js/productos.js
// Con integración de enlaces a detalle de producto

document.addEventListener("DOMContentLoaded", async function () {
  const productsContainer = document.getElementById('lista-productos');

  if (!productsContainer) {
    console.log("No se encontró #lista-productos");
    return;
  }

  console.log("Inicializando productos.js...");

  // Variables globales
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let productosGlobal = [];

  // Esperar Firebase
  const db = await esperarFirebase();
  if (!db) {
    mostrarError(productsContainer, "Error de configuración de Firebase");
    return;
  }

  // Cargar productos
  await cargarProductos();

  // Configurar eventos
  configurarEventos();

  // Escuchar cambios en tiempo real
  escucharCambiosStock(db);

  // ============================================
  // FUNCIONES PRINCIPALES
  // ============================================

  function esperarFirebase(maxIntentos = 50) {
    return new Promise((resolve) => {
      let intentos = 0;
      const intervalo = setInterval(() => {
        intentos++;
        
        if (typeof firebase !== 'undefined' && firebase.firestore) {
          clearInterval(intervalo);
          console.log("Firebase disponible");
          resolve(firebase.firestore());
        } else if (intentos >= maxIntentos) {
          clearInterval(intervalo);
          console.error("Firebase no se inicializó");
          resolve(null);
        }
      }, 100);
    });
  }

  async function cargarProductos() {
    try {
      mostrarCargando(productsContainer);
      
      const snapshot = await db.collection("producto").get();

      if (snapshot.empty) {
        productsContainer.innerHTML = `
          <div class="col-12">
            <div class="alert alert-info text-center">
              <i class="fas fa-info-circle me-2"></i>
              No hay productos disponibles en este momento.
            </div>
          </div>
        `;
        return;
      }

      productosGlobal = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`${productosGlobal.length} productos cargados`);
      mostrarProductos(productosGlobal);
      actualizarCarritoUI();

    } catch (error) {
      console.error("Error al cargar productos:", error);
      mostrarError(productsContainer, "Error al cargar productos.");
    }
  }

  /**
   * Mostrar productos en el grid - ACTUALIZADO con link a detalle
   */
  function mostrarProductos(productos) {
    productsContainer.innerHTML = '';

    if (productos.length === 0) {
      productsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted">No se encontraron productos</p>
        </div>
      `;
      return;
    }

    productos.forEach((producto) => {
      const stockDisponible = producto.stock !== undefined ? producto.stock : 0;
      const sinStock = stockDisponible <= 0;
      const esOferta = producto.nuevoPrecio && producto.nuevoPrecio < producto.precio;

      const productCol = document.createElement('div');
      productCol.className = 'col-lg-4 col-md-6 mb-4 producto-item';
      productCol.setAttribute('data-category', producto.categoria || 'Sin categoría');
      
      // Calcular descuento si es oferta
      let badgeOferta = '';
      let precioHTML = '';
      
      if (esOferta) {
        const descuento = Math.round(
          ((producto.precio - producto.nuevoPrecio) / producto.precio) * 100
        );
        badgeOferta = `
          <div style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 8px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; z-index: 2; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);">
            -${descuento}%
          </div>
        `;
        precioHTML = `
          <div class="mb-2">
            <span class="text-muted text-decoration-line-through">
              $${producto.precio.toLocaleString('es-CL')}
            </span>
          </div>
          <p class="card-text text-danger fw-bold fs-5 mb-2">
            $${producto.nuevoPrecio.toLocaleString('es-CL')}
          </p>
        `;
      } else {
        precioHTML = `
          <p class="card-text text-primary fw-bold fs-5 mb-2">
            $${(producto.precio || 0).toLocaleString('es-CL')}
          </p>
        `;
      }
      
      productCol.innerHTML = `
        <div class="card h-100 shadow-sm producto-card">
          <div class="product-img-container position-relative" style="cursor: pointer;" data-product-id="${producto.id}">
            ${badgeOferta}
            <img src="${producto.imagen || 'https://via.placeholder.com/400x300/FFC0CB/8B4513?text=Sin+Imagen'}"
                 alt="${producto.nombre || 'Producto'}"
                 class="card-img-top product-img"
                 onerror="this.src='https://via.placeholder.com/400x300/FFC0CB/8B4513?text=Sin+Imagen'">
            ${sinStock ? '<div class="badge-sin-stock">Sin Stock</div>' : ''}
            
            <!-- Overlay de "Ver detalle" -->
            <div class="producto-overlay">
              <i class="fas fa-search-plus fa-2x"></i>
              <p class="mt-2 mb-0">Ver detalle</p>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate" title="${producto.nombre || 'Sin nombre'}">
              ${producto.nombre || 'Sin nombre'}
            </h5>
            <p class="text-muted small mb-2">
              <i class="fas fa-tag me-1"></i>${producto.categoria || 'Sin categoría'}
            </p>
            ${precioHTML}
            <p class="card-text small mb-3">
              <i class="fas fa-box me-1"></i>
              <span class="${sinStock ? 'text-danger' : 'text-success'}">
                ${sinStock ? 'Sin stock' : `${stockDisponible} disponibles`}
              </span>
            </p>
            <button class="btn btn-primary mt-auto btn-agregar" 
                    data-id="${producto.id}"
                    ${sinStock ? 'disabled' : ''}>
              <i class="fas fa-shopping-cart me-2"></i>
              ${sinStock ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      `;
      productsContainer.appendChild(productCol);
    });

    console.log(`${productos.length} productos renderizados`);
    
    // Agregar estilos CSS para el overlay si no existen
    if (!document.getElementById('producto-overlay-styles')) {
      agregarEstilosOverlay();
    }
  }

  /**
   * Agregar estilos para el overlay de producto
   */
  function agregarEstilosOverlay() {
    const style = document.createElement('style');
    style.id = 'producto-overlay-styles';
    style.textContent = `
      .product-img-container {
        position: relative;
        overflow: hidden;
      }
      
      .producto-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1;
      }
      
      .product-img-container:hover .producto-overlay {
        opacity: 1;
      }
      
      .producto-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .producto-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Redirigir al detalle del producto
   */
function irADetalle(productId) {
    window.location.href = "assets/Page/detalleProducto.html?id=${productId}";
}

  async function agregarAlCarrito(productId) {
    const producto = productosGlobal.find(p => p.id === productId);
    
    if (!producto) {
      mostrarNotificacion('Producto no encontrado', 'error');
      return;
    }

    const stockActual = producto.stock !== undefined ? producto.stock : 0;
    
    if (stockActual <= 0) {
      mostrarNotificacion('Producto sin stock disponible', 'error');
      return;
    }

    // Determinar precio (usar nuevoPrecio si existe)
    const precio = producto.nuevoPrecio || producto.precio;
    const esOferta = producto.nuevoPrecio && producto.nuevoPrecio < producto.precio;

    // Verificar si ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === productId);
    
    if (productoExistente) {
      if (productoExistente.cantidad >= stockActual) {
        mostrarNotificacion('No hay más stock disponible', 'error');
        return;
      }
      productoExistente.cantidad += 1;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        categoria: producto.categoria,
        precio: precio,
        precioOriginal: esOferta ? producto.precio : null,
        stock: producto.stock,
        cantidad: 1,
        esOferta: esOferta
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    await actualizarStockFirebase(productId, 1);
    
    actualizarCarritoUI();
    
    const ahorro = esOferta ? producto.precio - precio : 0;
    const mensaje = ahorro > 0
      ? `"${producto.nombre}" agregado - ¡Ahorraste $${ahorro.toLocaleString('es-CL')}!`
      : `"${producto.nombre}" agregado al carrito`;
    
    mostrarNotificacion(mensaje, 'success');
    animarBotonAgregado(productId);
  }

  async function actualizarStockFirebase(productId, cantidad) {
    try {
      const productoRef = db.collection("producto").doc(productId);
      const productoDoc = await productoRef.get();
      
      if (productoDoc.exists) {
        const stockActual = productoDoc.data().stock;
        const nuevoStock = Math.max(0, stockActual - cantidad);
        
        await productoRef.update({ stock: nuevoStock });
        
        const index = productosGlobal.findIndex(p => p.id === productId);
        if (index !== -1) {
          productosGlobal[index].stock = nuevoStock;
        }
        
        console.log(`Stock actualizado - Nuevo: ${nuevoStock}`);
      }
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  }

  function escucharCambiosStock(db) {
    db.collection("producto").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const productoActualizado = {
            id: change.doc.id,
            ...change.doc.data()
          };
          
          const index = productosGlobal.findIndex(p => p.id === productoActualizado.id);
          if (index !== -1) {
            const stockAnterior = productosGlobal[index].stock;
            productosGlobal[index] = productoActualizado;
            
            if (stockAnterior !== productoActualizado.stock) {
              console.log(`Stock actualizado en tiempo real: ${productoActualizado.nombre}`);
              
              const filtroActivo = document.querySelector('.filter-btn.active');
              const categoria = filtroActivo ? filtroActivo.getAttribute('data-category') : 'all';
              
              if (categoria === 'all') {
                mostrarProductos(productosGlobal);
              } else {
                const productosFiltrados = productosGlobal.filter(p => p.categoria === categoria);
                mostrarProductos(productosFiltrados);
              }
            }
          }
        }
      });
    });
  }

  function actualizarCarritoUI() {
    const carritoTotal = document.querySelector('.carrito-total');
    if (carritoTotal) {
      const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
      carritoTotal.textContent = total.toLocaleString('es-CL');
    }

    const contadorItems = document.querySelector('.carrito-count');
    if (contadorItems) {
      const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
      contadorItems.textContent = totalItems > 0 ? `(${totalItems})` : '';
    }
  }

  /**
   * Configurar eventos - ACTUALIZADO con click en imagen
   */
  function configurarEventos() {
    // Click en imagen para ir al detalle
    productsContainer.addEventListener('click', function(event) {
      const imgContainer = event.target.closest('.product-img-container');
      if (imgContainer) {
        const productId = imgContainer.getAttribute('data-product-id');
        if (productId) {
          irADetalle(productId);
          return;
        }
      }
      
      // Click en botón agregar
      const btnAgregar = event.target.closest('.btn-agregar');
      if (btnAgregar && !btnAgregar.disabled) {
        const productId = btnAgregar.getAttribute('data-id');
        agregarAlCarrito(productId);
      }
    });

    // Botón del carrito
    const btnCarrito = document.querySelector('.btn-carrito');
    if (btnCarrito) {
      btnCarrito.addEventListener('click', () => {
        window.location.href = 'carrito.html';
      });
    }

    // Filtros de categorías
    configurarFiltros();
  }

  function configurarFiltros() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const category = this.getAttribute('data-category');
        
        if (category === 'all') {
          mostrarProductos(productosGlobal);
        } else {
          const productosFiltrados = productosGlobal.filter(p => p.categoria === category);
          mostrarProductos(productosFiltrados);
        }
      });
    });
  }

  function animarBotonAgregado(productId) {
    const btn = document.querySelector(`[data-id="${productId}"]`);
    if (btn) {
      const textoOriginal = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Agregado!';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
      }, 1500);
    }
  }

  function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    const backgroundColor = tipo === 'success' ? '#28a745' : '#dc3545';
    
    notificacion.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

  function mostrarCargando(container) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando productos...</p>
      </div>
    `;
  }

  function mostrarError(container, mensaje) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center" role="alert">
          <h5><i class="fas fa-exclamation-triangle me-2"></i>Error</h5>
          <p>${mensaje}</p>
          <button class="btn btn-primary mt-2" onclick="location.reload()">
            <i class="fas fa-sync-alt me-2"></i>Recargar página
          </button>
        </div>
      </div>
    `;
  }

  window.agregarAlCarrito = agregarAlCarrito;

  console.log("productos.js inicializado correctamente");
});