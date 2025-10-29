// js/productos.js
import { db } from './config.js';
import { collection, getDocs } from "firebase/firestore"; // Importar funciones específicas de Firestore
import { addToCart, updateCart } from './common.js'; // Suponiendo que estén exportadas

document.addEventListener("DOMContentLoaded", function () {
  const productsContainer = document.getElementById('products-container');

  if (productsContainer) {
    getDocs(collection(db, "productos"))
      .then((querySnapshot) => {
        productsContainer.innerHTML = '';

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const productCard = document.createElement('div');
          productCard.className = 'product-card';
          productCard.innerHTML = `
            <h3>${data.nombre}</h3>
            <p>${data.descripcion}</p>
            <p class="price">$${data.precio}</p>
            <button class="add-to-cart" data-id="${doc.id}">Agregar al carrito</button>
          `;
          productsContainer.appendChild(productCard);
        });

        // Agregar productos al carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
          button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
            addToCart(productName, price); // Llama a la función desde common.js
            alert(`${productName} agregado al carrito`);
          });
        });
      })
      .catch(error => {
        console.error("Error al cargar productos: ", error);
      });
  }
});