// js/carrito.js

document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    function renderCart() {
      cartItemsContainer.innerHTML = '';
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <span>${item.name}</span>
          <span>Cantidad: ${item.quantity}</span>
          <span>Precio: $${item.price * item.quantity}</span>
          <button class="remove-btn" data-name="${item.name}">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItem);
      });

      // Añadir evento para eliminar productos
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
          const name = button.getAttribute('data-name');
          cart = cart.filter(item => item.name !== name);
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
          updateCart();
        });
      });
    }
    renderCart();
  }
});