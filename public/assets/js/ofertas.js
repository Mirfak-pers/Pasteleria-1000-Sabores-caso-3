// assets/js/ofertas.js
// Sistema SIMPLE de ofertas - Solo usa campo "nuevoPrecio" en productos

document.addEventListener("DOMContentLoaded", async function () {
  const ofertasContainer = document.getElementById('lista-ofertas');

  if (!ofertasContainer) {
    console.log("No se encontró #lista-ofertas");
    return;
  }

  console.log("Inicializando ofertas.js...");

  // Elementos del DOM
  const carritoTotal = document.querySelector('.carrito-total');
  const btnCarrito = document.querySelector('.btn-carrito');
  const contadorOfertas = document.getElementById('contador-ofertas');
  const filtroDescuento = document.getElementById('filtro-descuento');

  // Variables globales
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let ofertasGlobal = [];

  // Esperar Firebase
  const db = await esperarFirebase();
  if (!db) {
    mostrarError(ofertasContainer, "Error de configuración de Firebase");
    return;
  }

  // Cargar ofertas
  await cargarOfertas();

  // Configurar eventos
  configurarEventos();

  // Escuchar cambios en tiempo real
  escucharCambiosProductos(db);

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

  /**
   * Cargar productos que tienen "nuevoPrecio" (están en oferta)
   */
  async function cargarOfertas() {
    try {
      mostrarCargando(ofertasContainer);
      
      // Obtener TODOS los productos
      const snapshot = await db.collection("producto").get();

      // Filtrar solo los que tienen "nuevoPrecio" y tienen stock
      ofertasGlobal = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(producto => {
          // Producto está en oferta si:
          // 1. Tiene campo "nuevoPrecio"
          // 2. nuevoPrecio es menor que precio original
          // 3. Tiene stock disponible
          return producto.nuevoPrecio && 
                 producto.nuevoPrecio < producto.precio && 
                 producto.stock > 0;
        })
        .map(producto => {
          // Calcular descuento para cada producto
          const descuento = Math.round(
            ((producto.precio - producto.nuevoPrecio) / producto.precio) * 100
          );
          const ahorro = producto.precio - producto.nuevoPrecio;

          return {
            ...producto,
            porcentajeDescuento: descuento,
            ahorro: ahorro
          };
        })
        .sort((a, b) => b.porcentajeDescuento - a.porcentajeDescuento); // Ordenar por mayor descuento

      console.log(`${ofertasGlobal.length} ofertas encontradas`);
      
      mostrarOfertas(ofertasGlobal);
      actualizarContadorOfertas();
      actualizarCarritoUI();

    } catch (error) {
      console.error("Error al cargar ofertas:", error);
      mostrarError(ofertasContainer, "Error al cargar ofertas. Intenta recargar la página.");
    }
  }

  /**
   * Mostrar ofertas en el grid
   */
  function mostrarOfertas(ofertas) {
    ofertasContainer.innerHTML = '';

    if (ofertas.length === 0) {
      ofertasContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            No hay ofertas disponibles en este momento
          </div>
          <a href="productos.html" class="btn btn-primary mt-3">
            <i class="fas fa-shopping-bag me-2"></i>Ver todos los productos
          </a>
        </div>
      `;
      return;
    }

    ofertas.forEach((producto) => {
      const ofertaCol = document.createElement('div');
      ofertaCol.className = 'col-lg-4 col-md-6 mb-4';
      
      ofertaCol.innerHTML = `
        <div class="card h-100 shadow-sm oferta-card">
          <div class="product-img-container position-relative">
            <img src="${producto.imagen || 'https://via.placeholder.com/400x300/FFC0CB/8B4513?text=Sin+Imagen'}"
                 alt="${producto.nombre || 'Producto'}"
                 class="card-img-top product-img"
                 onerror="this.src='https://via.placeholder.com/400x300/FFC0CB/8B4513?text=Sin+Imagen'">
            
            <!-- Badge de descuento -->
            <div class="badge-descuento">
              -${producto.porcentajeDescuento}%
            </div>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate" title="${producto.nombre || 'Sin nombre'}">
              ${producto.nombre || 'Sin nombre'}
            </h5>
            
            <p class="text-muted small mb-2">
              <i class="fas fa-tag me-1"></i>${producto.categoria || 'Sin categoría'}
            </p>

            <!-- Precios -->
            <div class="mb-2">
              <div class="precio-original">
                <span class="text-decoration-line-through text-muted">
                  $${producto.precio.toLocaleString('es-CL')}
                </span>
              </div>
              <div class="precio-oferta">
                <span class="text-danger fw-bold fs-4">
                  $${producto.nuevoPrecio.toLocaleString('es-CL')}
                </span>
              </div>
              <div class="mt-1">
                <small class="text-success fw-bold">
                  <i class="fas fa-tag me-1"></i>
                  Ahorras $${producto.ahorro.toLocaleString('es-CL')}
                </small>
              </div>
            </div>

            <!-- Stock -->
            <p class="card-text small mb-3">
              <i class="fas fa-box me-1"></i>
              <span class="${producto.stock <= 5 ? 'text-danger' : 'text-success'}">
                ${producto.stock <= 5 ? '¡Últimas unidades!' : `${producto.stock} disponibles`}
              </span>
            </p>

            <button class="btn btn-danger mt-auto btn-agregar-oferta" 
                    data-id="${producto.id}"
                    data-precio="${producto.nuevoPrecio}">
              <i class="fas fa-shopping-cart me-2"></i>
              Agregar al carrito
            </button>
          </div>
        </div>
      `;
      ofertasContainer.appendChild(ofertaCol);
    });

    console.log(`${ofertas.length} ofertas renderizadas`);
  }

  /**
   * Agregar oferta al carrito
   */
  async function agregarOfertaAlCarrito(productId, nuevoPrecio) {
    const producto = ofertasGlobal.find(p => p.id === productId);
    
    if (!producto) {
      mostrarNotificacion('Producto no encontrado', 'error');
      return;
    }

    if (producto.stock <= 0) {
      mostrarNotificacion('Producto sin stock', 'error');
      return;
    }

    // Verificar si ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === productId);
    
    if (productoExistente) {
      if (productoExistente.cantidad >= producto.stock) {
        mostrarNotificacion('No hay más stock disponible', 'error');
        return;
      }
      productoExistente.cantidad += 1;
    } else {
      carrito.push({
        ...producto,
        precio: nuevoPrecio, // Usar el nuevo precio (precio de oferta)
        precioOriginal: producto.precio, // Guardar precio original para referencia
        esOferta: true,
        cantidad: 1
      });
    }

    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar stock en Firebase
    await actualizarStockFirebase(productId, 1);
    
    // Actualizar UI
    actualizarCarritoUI();
    
    // Notificación
    mostrarNotificacion(
      `"${producto.nombre}" agregado - ¡Ahorraste $${producto.ahorro.toLocaleString('es-CL')}!`, 
      'success'
    );
    animarBotonAgregado(productId);
  }

  /**
   * Actualizar stock en Firebase
   */
  async function actualizarStockFirebase(productId, cantidad) {
    try {
      const productoRef = db.collection("producto").doc(productId);
      const productoDoc = await productoRef.get();
      
      if (productoDoc.exists) {
        const stockActual = productoDoc.data().stock;
        const nuevoStock = Math.max(0, stockActual - cantidad);
        
        await productoRef.update({ stock: nuevoStock });
        
        // Actualizar localmente
        const index = ofertasGlobal.findIndex(p => p.id === productId);
        if (index !== -1) {
          ofertasGlobal[index].stock = nuevoStock;
        }
        
        console.log(`Stock actualizado - Nuevo: ${nuevoStock}`);
      }
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  }

  /**
   * Escuchar cambios en productos en tiempo real
   */
  function escucharCambiosProductos(db) {
    db.collection("producto").onSnapshot((snapshot) => {
      let hubocambios = false;
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const productoActualizado = {
            id: change.doc.id,
            ...change.doc.data()
          };
          
          // Actualizar en ofertasGlobal si está ahí
          const index = ofertasGlobal.findIndex(p => p.id === productoActualizado.id);
          if (index !== -1) {
            huboChangios = true;
          }
        }
      });
      
      // Si hubo cambios, recargar ofertas
      if (huboChangios) {
        console.log('Ofertas actualizadas en tiempo real');
        cargarOfertas();
      }
    });
  }

  /**
   * Actualizar UI del carrito
   */
  function actualizarCarritoUI() {
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
   * Actualizar contador de ofertas
   */
  function actualizarContadorOfertas() {
    if (contadorOfertas) {
      contadorOfertas.textContent = ofertasGlobal.length;
    }
  }

  /**
   * Configurar eventos
   */
  function configurarEventos() {
    // Botones agregar al carrito
    ofertasContainer.addEventListener('click', function(event) {
      const btnAgregar = event.target.closest('.btn-agregar-oferta');
      if (btnAgregar) {
        const productId = btnAgregar.getAttribute('data-id');
        const nuevoPrecio = parseFloat(btnAgregar.getAttribute('data-precio'));
        agregarOfertaAlCarrito(productId, nuevoPrecio);
      }
    });

    // Botón del carrito
    if (btnCarrito) {
      btnCarrito.addEventListener('click', () => {
        window.location.href = 'carrito.html';
      });
    }

    // Filtro por descuento
    if (filtroDescuento) {
      filtroDescuento.addEventListener('change', function() {
        aplicarFiltroDescuento(this.value);
      });
    }
  }

  /**
   * Aplicar filtro por porcentaje de descuento
   */
  function aplicarFiltroDescuento(filtro) {
    let ofertasFiltradas = [...ofertasGlobal];

    switch(filtro) {
      case '10':
        ofertasFiltradas = ofertasGlobal.filter(o => 
          o.porcentajeDescuento >= 10 && o.porcentajeDescuento < 25
        );
        break;
      case '25':
        ofertasFiltradas = ofertasGlobal.filter(o => 
          o.porcentajeDescuento >= 25 && o.porcentajeDescuento < 50
        );
        break;
      case '50':
        ofertasFiltradas = ofertasGlobal.filter(o => 
          o.porcentajeDescuento >= 50
        );
        break;
      default:
        ofertasFiltradas = ofertasGlobal;
    }

    mostrarOfertas(ofertasFiltradas);
  }

  /**
   * Animación del botón
   */
  function animarBotonAgregado(productId) {
    const btn = document.querySelector(`[data-id="${productId}"]`);
    if (btn) {
      const textoOriginal = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Agregado!';
      btn.disabled = true;
      btn.classList.add('btn-success');
      btn.classList.remove('btn-danger');
      
      setTimeout(() => {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-danger');
      }, 1500);
    }
  }

  /**
   * Mostrar notificación
   */
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
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando ofertas...</p>
      </div>
    `;
  }

  function mostrarError(container, mensaje) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          <h5><i class="fas fa-exclamation-triangle me-2"></i>Error</h5>
          <p>${mensaje}</p>
          <button class="btn btn-primary mt-2" onclick="location.reload()">
            <i class="fas fa-sync-alt me-2"></i>Recargar
          </button>
        </div>
      </div>
    `;
  }

  console.log("ofertas.js inicializado correctamente");
});