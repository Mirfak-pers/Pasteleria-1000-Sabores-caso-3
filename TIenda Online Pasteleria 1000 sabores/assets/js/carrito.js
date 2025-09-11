// 1. Arreglo de Productos (Simulado)
const productos = [
    { id: 1, codigo: "TC001", nombre: "Torta Cuadrada de Chocolate", precio: 45000, stock: 10, categoria: "Tortas Cuadradas", imagen: "img/torta-chocolate.jpg" },
    { id: 2, codigo: "TC002", nombre: "Torta Cuadrada de Frutas", precio: 50000, stock: 5, categoria: "Tortas Cuadradas", imagen: "img/torta-frutas.jpg" },
    { id: 3, codigo: "TT001", nombre: "Torta Circular de Vainilla", precio: 40000, stock: 15, categoria: "Tortas Circulares", imagen: "img/torta-vainilla.jpg" },
    { id: 4, codigo: "PI001", nombre: "Mousse de Chocolate", precio: 5000, stock: 0, categoria: "Postres Individuales", imagen: "img/mousse-chocolate.jpg" },
    { id: 5, codigo: "PV001", nombre: "Torta Vegana de Chocolate", precio: 50000, stock: 8, categoria: "Productos Veganos", imagen: "img/torta-vegana.jpg" }
];


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
                    <p class="card-text text-muted">${producto.categoria}</p>
                    <p class="card-text fw-bold">$${producto.precio.toLocaleString()} CLP</p>
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


function agregarAlCarrito(idProducto) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


    const producto = productos.find(p => p.id === idProducto);
    if (!producto || producto.stock <= 0) {
        alert("⛔ Este producto está agotado.");
        return;
    }


    const itemExistente = carrito.find(item => item.id === idProducto);
    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad++;
            alert(`Se añadió otra unidad de ${producto.nombre}. Total: ${itemExistente.cantidad}`);
        } else {
            alert(`No puedes añadir más de ${producto.stock} unidades de ${producto.nombre}.`);
            return;
        }
    } else {
        carrito.push({ ...producto, cantidad: 1 });
        alert(`${producto.nombre} añadido al carrito.`);
    }


    actualizarContadorCarrito();
    }


    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = totalItems;
    }



document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("lista-productos")) {
        cargarProductos();
    }
    actualizarContadorCarrito();
});