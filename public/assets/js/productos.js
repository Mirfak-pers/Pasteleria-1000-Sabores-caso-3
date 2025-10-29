// js/productos.js
import { db } from './config.js';
import { collection, getDocs } from "firebase/firestore";
import { addToCart, updateCart } from './common.js'; // Asegúrate que common.js exporte estas funciones

document.addEventListener("DOMContentLoaded", function () {
  const productsContainer = document.getElementById('products-container'); // Asegúrate que productos.html tenga este contenedor

  if (productsContainer) {
    // Función para cargar y mostrar productos
    async function cargarProductosDesdeFirestore() {
      try {
        console.log("Cargando productos desde Firestore en productos.html...");
        const querySnapshot = await getDocs(collection(db, "productos")); // Consulta la colección 'productos'

        if (querySnapshot.empty) {
          console.log("No se encontraron productos en la colección 'productos'.");
          productsContainer.innerHTML = '<p class="text-center">No hay productos disponibles en este momento.</p>';
          return;
        }

        productsContainer.innerHTML = ''; // Limpiar contenedor antes de agregar nuevos productos

        querySnapshot.forEach((doc) => {
          const data = doc.data(); // Obtiene los datos del producto
          const productoId = doc.id; // Obtiene el ID único del documento

          // --- Crear el HTML para cada producto (tarjeta) ---
          // Puedes adaptar esta estructura al estilo de tu plantilla
          const productCard = document.createElement('div');
          productCard.className = 'col-lg-4 col-md-6 mb-4'; // Bootstrap columnas
          productCard.innerHTML = `
            <div class="card h-100 producto-card shadow-sm">
                <img src="${data.imagen || 'assets/image/default-product.jpg'}" class="card-img-top" alt="${data.nombre}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${data.nombre}</h5>
                    <!-- Cambiado de 'descripcion' a 'categoria' -->
                    <p class="card-text flex-grow-1">Categoría: ${data.categoria || 'Sin categoría'}</p>
                    <div class="mt-auto">
                        <p class="card-text"><strong>Precio: $${data.precio}</strong></p>
                        <button class="btn btn-primary add-to-cart w-100" data-nombre="${data.nombre}" data-precio="${data.precio}">
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
          `;
          productsContainer.appendChild(productCard);
        });

        console.log("Productos cargados exitosamente desde Firestore en productos.html.");

        // --- Agregar eventos a los botones "Agregar al Carrito" ---
        document.querySelectorAll('.add-to-cart').forEach(button => {
          button.addEventListener('click', () => {
            const nombre = button.getAttribute('data-nombre');
            const precio = parseFloat(button.getAttribute('data-precio'));
            addToCart(nombre, precio); // Llama a la función desde common.js
            alert(`${nombre} agregado al carrito.`);
            updateCart(); // Actualiza el contador del carrito
          });
        });

      } catch (error) {
        console.error("Error al cargar productos desde Firestore en productos.html: ", error);
        productsContainer.innerHTML = '<p class="text-center text-danger">Error al cargar los productos. Por favor, inténtalo más tarde.</p>';
      }
    }

    cargarProductosDesdeFirestore(); // Llama a la función para cargar los productos cuando se carga la página
  }
});