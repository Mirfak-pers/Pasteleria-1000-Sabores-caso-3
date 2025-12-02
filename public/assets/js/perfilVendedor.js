// 1. CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyC01DeLX515dsD29to5rHeqaWC8RV98KNg",
    authDomain: "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
    databaseURL: "https://tiendapasteleriamilsabor-a7ac6-default-rtdb.firebaseio.com",
    projectId: "tiendapasteleriamilsabor-a7ac6",
    storageBucket: "tiendapasteleriamilsabor-a7ac6.firebasestorage.app",
    messagingSenderId: "522171765461",
    appId: "1:522171765461:web:6745850bf2a9735682885c",
    measurementId: "G-08JFT3CMHR"
};

// 2. INICIALIZAR FIREBASE
let db, auth;

if (typeof firebase === 'undefined') {
    console.error('Error: Los scripts de Firebase no se cargaron en el HTML.');
    alert("Error de conexión: Firebase no cargó.");
} else {
    // Inicializar solo si no existe ya
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Referencias a los servicios
    db = firebase.firestore();
    auth = firebase.auth();
    console.log('Sistema Vendedor: Firebase Conectado');
}

// 3. VERIFICAR SESIÓN (Protección de ruta)
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuario logueado, cargar datos
        console.log("Usuario detectado:", user.email);
        cargarPedidos();
        cargarStock();
    } else {
        // No hay usuario, expulsar al login
        console.warn("No hay sesión, redirigiendo...");
        window.location.href = "../../../index.html";
    }
});

// 4. LÓGICA DE PEDIDOS (Tiempo Real)
function cargarPedidos() {
    const tabla = document.getElementById('tabla-pedidos-body');
    const countPend = document.getElementById('counter-pending');
    const countPrep = document.getElementById('counter-prep');
    const countReady = document.getElementById('counter-ready');

    // Escuchar cambios en la colección 'pedidos'
    // IMPORTANTE: Si la consola da error de índice, quita .orderBy('fecha', 'desc')
    db.collection("pedidos").orderBy("fecha", "desc").onSnapshot((snapshot) => {
        tabla.innerHTML = ""; // Limpiar tabla
        
        let pPendientes = 0;
        let pPreparacion = 0;
        let pListos = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;

            // Contadores para las tarjetas de arriba
            if(data.estado === 'pendiente') pPendientes++;
            if(data.estado === 'preparacion') pPreparacion++;
            if(data.estado === 'listo') pListos++;

            // Crear fila HTML
            const fila = `
                <tr>
                    <td><small>${id.substring(0, 6)}...</small></td>
                    <td>${data.usuario || data.cliente || "Cliente"}</td>
                    <td><small>${formatearProductos(data.productos)}</small></td>
                    <td>$${data.total}</td>
                    <td>
                        <select class="form-select form-select-sm fw-bold ${getColor(data.estado)}" 
                                onchange="cambiarEstadoPedido('${id}', this.value)">
                            <option value="pendiente" ${data.estado === 'pendiente' ? 'selected' : ''}>🟡 Pendiente</option>
                            <option value="preparacion" ${data.estado === 'preparacion' ? 'selected' : ''}>🔥 En Preparación</option>
                            <option value="listo" ${data.estado === 'listo' ? 'selected' : ''}>✅ Listo para Retiro</option>
                            <option value="entregado" ${data.estado === 'entregado' ? 'selected' : ''}>🏁 Entregado</option>
                        </select>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });

        // Actualizar números del dashboard
        if(countPend) countPend.innerText = pPendientes;
        if(countPrep) countPrep.innerText = pPreparacion;
        if(countReady) countReady.innerText = pListos;
    });
}

// 5. CAMBIAR ESTADO (Función Global)
window.cambiarEstadoPedido = function(idDoc, nuevoEstado) {
    db.collection("pedidos").doc(idDoc).update({
        estado: nuevoEstado
    }).then(() => {
        console.log("Estado actualizado a:", nuevoEstado);
        // No es necesario recargar, onSnapshot actualiza la tabla solo
    }).catch((error) => {
        console.error("Error al actualizar:", error);
        alert("No se pudo actualizar el estado.");
    });
};

// 6. CARGAR STOCK (Solo Lectura)
function cargarStock() {
    const grid = document.getElementById('grid-inventario');
    
    db.collection("productos").onSnapshot((snapshot) => {
        if(!grid) return; // Si no existe el contenedor, salir
        grid.innerHTML = "";

        snapshot.forEach((doc) => {
            const prod = doc.data();
            
            const badge = prod.stock > 0 
                ? `<span class="badge bg-success">Stock: ${prod.stock}</span>` 
                : `<span class="badge bg-danger">AGOTADO</span>`;

            const card = `
                <div class="col-md-3 mb-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center">
                            <h6 class="card-title fw-bold">${prod.nombre}</h6>
                            <p class="text-muted">$${prod.precio}</p>
                            ${badge}
                        </div>
                    </div>
                </div>
            `;
            grid.innerHTML += card;
        });
    });
}

// 7. UTILIDADES
function formatearProductos(productos) {
    // Si es un array de objetos (ej: [{nombre: "Torta", cantidad: 1}])
    if (Array.isArray(productos)) {
        return productos.map(p => `• ${p.nombre} (${p.cantidad || 1})`).join('<br>');
    }
    // Si es texto simple
    return productos;
}

function getColor(estado) {
    if(estado === 'pendiente') return 'text-warning border-warning';
    if(estado === 'preparacion') return 'text-primary border-primary';
    if(estado === 'listo') return 'text-success border-success';
    return 'text-secondary';
}

// 8. CERRAR SESIÓN
window.cerrarSesion = function() {
    auth.signOut().then(() => {
        window.location.href = "../../../index.html";
    }).catch((error) => {
        console.error("Error al salir:", error);
    });
};