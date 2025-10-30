// assets/js/detalleProducto.js
// Sistema de detalle de producto con Firebase

document.addEventListener("DOMContentLoaded", async function () {
  console.log("Inicializando detalleProducto.js...");

  // Esperar Firebase
  const db = await esperarFirebase();
  if (!db) {
    mostrarError("Error de configuración de Firebase");
    return;
  }

  // Obtener ID del producto desde URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    mostrarError("No se especificó un producto");
    return;
  }

  // Cargar producto
  await cargarProducto(productId, db);

  // Configurar eventos
  configurarEventos();

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
          console.error("Firebase no disponible");
          resolve(null);
        }
      }, 100);
    });
  }

  /**
   * Cargar producto desde Firebase
   */
  async function cargarProducto(productId, db) {
    try {
      mostrarCargando();

      const productoDoc = await db.collection("producto").doc(productId).get();

      if (!productoDoc.exists) {
        mostrarError("Producto no encontrado");
        return;
      }

      const producto = {
        id: productoDoc.id,
        ...productoDoc.data()
      };

      console.log("Producto cargado:", producto);
      mostrarProducto(producto);

    } catch (error) {
      console.error("Error al cargar producto:", error);
      mostrarError("Error al cargar el producto");
    }
  }

  /**
   * Mostrar información del producto
   */
  function mostrarProducto(producto) {
    // Actualizar título de página
    document.getElementById('page-title').textContent = 
      `${producto.nombre} - Pastelería Mil Sabores`;
    
    document.getElementById('page-description').setAttribute('content', 
      `${producto.descripcion || producto.nombre} - Pastelería Mil Sabores`);

    // Actualizar breadcrumb
    document.getElementById('breadcrumb-product-name').textContent = producto.nombre;

    // Actualizar contenido principal
    document.getElementById('product-name').textContent = producto.nombre;
    document.getElementById('product-code').textContent = producto.id;
    document.getElementById('product-category').textContent = producto.categoria || 'Sin categoría';
    
    // Imagen
    const imgElement = document.getElementById('product-image');
    imgElement.src = producto.imagen || 'https://via.placeholder.com/600x600/FFC0CB/8B4513?text=Sin+Imagen';
    imgElement.alt = producto.nombre;

    // Descripción
    document.getElementById('product-description').textContent = 
      producto.descripcion || 'Sin descripción disponible.';

    // Precios y ofertas
    mostrarPrecio(producto);

    // Stock
    mostrarStock(producto);

    // Guardar producto en data attribute del botón
    const btnAgregar = document.getElementById('btn-add-to-cart');
    btnAgregar.dataset.productId = producto.id;
    btnAgregar.dataset.productData = JSON.stringify(producto);
  }

  /**
   * Mostrar precio (con o sin oferta)
   */
  function mostrarPrecio(producto) {
    const precioContainer = document.getElementById('product-price');
    const esOferta = producto.nuevoPrecio && producto.nuevoPrecio < producto.precio;

    if (esOferta) {
      const descuento = Math.round(
        ((producto.precio - producto.nuevoPrecio) / producto.precio) * 100
      );
      const ahorro = producto.precio - producto.nuevoPrecio;

      precioContainer.innerHTML = `
        <div class="mb-2">
          <span class="badge bg-danger fs-6 mb-2">
            -${descuento}% OFF
          </span>
        </div>
        <div class="mb-1">
          <span class="text-muted text-decoration-line-through fs-5">
            $${producto.precio.toLocaleString('es-CL')}
          </span>
        </div>
        <div class="text-danger fw-bold" style="font-size: 2rem;">
          $${producto.nuevoPrecio.toLocaleString('es-CL')}
        </div>
        <div class="mt-2 p-2 bg-success bg-opacity-10 rounded">
          <small class="text-success fw-bold">
            <i class="fas fa-tag me-1"></i>
            ¡Ahorras $${ahorro.toLocaleString('es-CL')}!
          </small>
        </div>
      `;
    } else {
      precioContainer.innerHTML = `
        <div class="text-primary fw-bold" style="font-size: 2rem;">
          $${producto.precio.toLocaleString('es-CL')}
        </div>
      `;
    }
  }

  /**
   * Mostrar información de stock
   */
  function mostrarStock(producto) {
    const stockContainer = document.getElementById('stock-info');
    const btnAgregar = document.getElementById('btn-add-to-cart');
    const quantitySelect = document.getElementById('product-quantity');
    const stock = producto.stock || 0;

    if (!stockContainer) {
      // Crear contenedor si no existe
      const priceContainer = document.getElementById('product-price');
      const newStockContainer = document.createElement('div');
      newStockContainer.id = 'stock-info';
      newStockContainer.className = 'mb-3';
      priceContainer.parentNode.insertBefore(newStockContainer, priceContainer.nextSibling);
    }

    const stockElement = document.getElementById('stock-info');

    if (stock <= 0) {
      stockElement.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-times-circle me-2"></i>
          <strong>Sin stock disponible</strong>
        </div>
      `;
      btnAgregar.disabled = true;
      btnAgregar.textContent = 'Sin stock';
      quantitySelect.disabled = true;
    } else if (stock <= 5) {
      stockElement.innerHTML = `
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <strong>¡Últimas ${stock} unidades!</strong>
        </div>
      `;
      // Actualizar opciones de cantidad
      actualizarOpcionesCantidad(stock);
    } else {
      stockElement.innerHTML = `
        <div class="alert alert-success">
          <i class="fas fa-check-circle me-2"></i>
          <strong>${stock} unidades disponibles</strong>
        </div>
      `;
      actualizarOpcionesCantidad(Math.min(stock, 10));
    }
  }

  /**
   * Actualizar opciones de cantidad según stock
   */
  function actualizarOpcionesCantidad(maxStock) {
    const quantitySelect = document.getElementById('product-quantity');
    quantitySelect.innerHTML = '';

    for (let i = 1; i <= maxStock; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      quantitySelect.appendChild(option);
    }
  }

  /**
   * Agregar al carrito
   */
  async function agregarAlCarrito() {
    const btnAgregar = document.getElementById('btn-add-to-cart');
    const productData = JSON.parse(btnAgregar.dataset.productData);
    const cantidad = parseInt(document.getElementById('product-quantity').value);

    if (!productData) {
      mostrarNotificacion('Error al agregar producto', 'error');
      return;
    }

    // Obtener carrito actual
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Calcular precio (usar nuevoPrecio si existe)
    const precio = productData.nuevoPrecio || productData.precio;
    const esOferta = productData.nuevoPrecio && productData.nuevoPrecio < productData.precio;

    // Verificar si ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === productData.id);

    if (productoExistente) {
      const nuevaCantidad = productoExistente.cantidad + cantidad;
      
      // Verificar stock
      if (nuevaCantidad > productData.stock) {
        mostrarNotificacion('No hay suficiente stock disponible', 'error');
        return;
      }
      
      productoExistente.cantidad = nuevaCantidad;
    } else {
      carrito.push({
        id: productData.id,
        nombre: productData.nombre,
        imagen: productData.imagen,
        categoria: productData.categoria,
        precio: precio,
        precioOriginal: esOferta ? productData.precio : null,
        stock: productData.stock,
        cantidad: cantidad,
        esOferta: esOferta
      });
    }

    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar stock en Firebase
    await actualizarStockFirebase(productData.id, cantidad, db);

    // Feedback visual
    const ahorro = esOferta ? (productData.precio - precio) * cantidad : 0;
    const mensaje = ahorro > 0 
      ? `"${productData.nombre}" agregado - ¡Ahorraste $${ahorro.toLocaleString('es-CL')}!`
      : `"${productData.nombre}" agregado al carrito`;
    
    mostrarNotificacion(mensaje, 'success');
    animarBotonAgregado();

    // Actualizar stock local
    productData.stock -= cantidad;
    mostrarStock(productData);
  }

  /**
   * Actualizar stock en Firebase
   */
  async function actualizarStockFirebase(productId, cantidad, db) {
    try {
      const productoRef = db.collection("producto").doc(productId);
      const productoDoc = await productoRef.get();
      
      if (productoDoc.exists) {
        const stockActual = productoDoc.data().stock;
        const nuevoStock = Math.max(0, stockActual - cantidad);
        
        await productoRef.update({ stock: nuevoStock });
        console.log(`Stock actualizado - Nuevo: ${nuevoStock}`);
      }
    } catch (error) {
      console.error("Error actualizando stock:", error);
    }
  }

  /**
   * Configurar eventos
   */
  function configurarEventos() {
    const btnAgregar = document.getElementById('btn-add-to-cart');
    
    if (btnAgregar) {
      btnAgregar.addEventListener('click', agregarAlCarrito);
    }
  }

  /**
   * Animación del botón al agregar
   */
  function animarBotonAgregado() {
    const btn = document.getElementById('btn-add-to-cart');
    const textoOriginal = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Agregado!';
    btn.classList.add('btn-success');
    btn.classList.remove('btn-primary');
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.classList.remove('btn-success');
      btn.classList.add('btn-primary');
      btn.disabled = false;
    }, 2000);
  }

  /**
   * Mostrar notificación
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
   * Mostrar mensaje de carga
   */
  function mostrarCargando() {
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando producto...</p>
      </div>
    `;
  }

  /**
   * Mostrar mensaje de error
   */
  function mostrarError(mensaje) {
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-exclamation-triangle text-danger" style="font-size: 4rem;"></i>
        <h3 class="text-danger mt-3">${mensaje}</h3>
        <a href="productos.html" class="btn btn-primary mt-3">
          <i class="fas fa-arrow-left me-2"></i>Volver a Productos
        </a>
      </div>
    `;
  }

  console.log("detalleProducto.js inicializado correctamente");
});