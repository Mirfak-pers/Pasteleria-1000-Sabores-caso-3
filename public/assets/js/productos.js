// js/productos.js
import { db } from './config.js';
import { collection, getDocs } from "firebase/firestore";

// Suponiendo que funciones como 'agregarAlCarrito' y 'productosGlobal' están disponibles
// o se importan desde un lugar común como catalogo.js o un archivo common.js actualizado.
// Si se definen en catalogo.js y catalogo.js se carga antes, no es necesario importarlas aquí explícitamente,
// pero si se quieren compartir mejor, se pueden mover a common.js y exportarlas desde allí.
// Por ahora, asumiremos que están disponibles globalmente o en el scope donde se ejecuta este módulo
// si catalogo.js se carga antes o comparte el scope (p.ej., ambos se cargan como módulos en el mismo index.html).

document.addEventListener("DOMContentLoaded", function () {
  // Cambiado: Ahora busca el ID correcto del HTML usado en index.html y catalogo.html
  const productsContainer = document.getElementById('productosGrid');

  if (productsContainer) {
    // Función para cargar y mostrar productos
    async function cargarProductosDesdeFirestore() {
      try {
        console.log("Cargando productos desde Firestore en productos.js...");
        const querySnapshot = await getDocs(collection(db, "producto"));

        if (querySnapshot.empty) {
          console.log("No se encontraron productos en la colección 'producto'.");
          // Usando el mismo HTML de catalogo.js para consistencia
          productsContainer.innerHTML = `
            <div class="no-productos" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
              <p style="font-size: 18px; color: #666; margin-bottom: 15px;">No se encontraron productos</p>
              <!-- Opcional: Botón para "Ver todos" si se define la función global -->
              <!-- <button onclick="mostrarTodosLosProductos && mostrarTodosLosProductos()" class="btn-signup">Ver todos los productos</button> -->
            </div>
          `;
          return;
        }

        // Opcional: Limpiar contenedor si se llama a esta función varias veces
        // productsContainer.innerHTML = '';

        // Construir HTML de las cards
        let productosHTML = '';
        querySnapshot.forEach((doc) => {
          const data = doc.data(); // Obtiene los datos del producto
          const productoId = doc.id; // Obtiene el ID único del documento

          // --- Crear el HTML para cada producto (tarjeta) ---
          // Usando el mismo formato que catalogo.js para consistencia
          productosHTML += `
            <div class="producto-card">
              <img src="${data.imagen || 'https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'}"
                   alt="${data.nombre}"
                   class="producto-imagen"
                   onerror="this.src='https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'">
              <div class="producto-info">
                <h3 class="producto-nombre">${data.nombre || 'Sin nombre'}</h3>
                <p class="producto-precio">$${(data.precio || 0).toLocaleString('es-CL')}</p>
                <p class="producto-stock">Stock: ${data.stock !== undefined ? data.stock : 'N/A'}</p>
                <button class="btn-agregar" data-id="${productoId}">
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          `;
        });

        productsContainer.innerHTML = productosHTML; // Insertar todas las cards de una vez

        console.log("Productos cargados exitosamente desde Firestore en productos.js.");

        // --- Agregar eventos a los botones "Agregar al Carrito" ---
        // Usando delegación de eventos para manejar botones dinámicamente agregados
        productsContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-agregar')) {
                const productId = event.target.getAttribute('data-id');
                // Asumiendo que 'agregarAlCarrito' es una función global definida en catalogo.js o disponible en este scope
                if (typeof window.agregarAlCarrito === 'function') {
                    window.agregarAlCarrito(productId); // Llama a la función desde catalogo.js
                } else {
                    console.error("La función 'agregarAlCarrito' no está definida en el scope global o no se ha cargado antes de productos.js.");
                }
            }
        });

      } catch (error) {
        console.error("Error al cargar productos desde Firestore en productos.js: ", error);
        productsContainer.innerHTML = '<p class="text-center text-danger">Error al cargar los productos. Por favor, inténtalo más tarde.</p>';
      }
    }

    cargarProductosDesdeFirestore(); // Llama a la función para cargar los productos cuando se carga la página
  } else {
      console.warn("No se encontró el contenedor #productosGrid en productos.js. Asegúrate de que el HTML lo contenga.");
  }
});