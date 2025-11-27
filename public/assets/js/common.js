//common.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

function addToCart(productName, price) {
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: productName, price, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// --- Exportar para otros módulos ---
export { updateCart, addToCart };



