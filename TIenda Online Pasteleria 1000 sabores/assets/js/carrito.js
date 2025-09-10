// js/carrito.js

// 1. Arreglo de Productos (simulado)
const productos = [
    { id: 1, codigo: "TC001", nombre: "Torta Cuadrada de Chocolate", precio: 45000, stock: 10, imagen: "img/torta-chocolate.jpg" },
    { id: 2, codigo: "TC002", nombre: "Torta Cuadrada de Frutas", precio: 50000, stock: 5, imagen: "img/torta-frutas.jpg" },
    { id: 3, codigo: "TT001", nombre: "Torta Circular de Vainilla", precio: 40000, stock: 15, imagen: "img/torta-vainilla.jpg" },
    { id: 4, codigo: "PI001", nombre: "Mousse de Chocolate", precio: 5000, stock: 0, imagen: "img/mousse-chocolate.jpg" }
];

// 2. Función para cargar productos en la página (para productos.html)
function cargarProductos() {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) return;

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio.toLocaleString()} CLP</p>
                    <p class="card-text"><small class="text-muted">Stock: ${producto.stock}</small></p>
                    <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${producto.id})" ${producto.stock <= 0 ? 'disabled' : ''}>
                        ${producto.stock <= 0 ? 'Agotado' : 'Añadir al Carrito'}
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 3. Función para agregar un producto al carrito
function agregarAlCarrito(idProducto) {
    // Obtener el carrito del localStorage o crear uno nuevo
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Encontrar el producto
    const producto = productos.find(p => p.id === idProducto);
    if (!producto || producto.stock <= 0) return;

    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad < producto.stock) {
            productoEnCarrito.cantidad++;
        } else {
            alert("No hay más stock disponible para este producto.");
            return;
        }
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Mostrar mensaje de éxito
    alert(`${producto.nombre} añadido al carrito.`);
}

// 4. Cargar productos cuando la página esté lista
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("lista-productos")) {
        cargarProductos();
    }
});