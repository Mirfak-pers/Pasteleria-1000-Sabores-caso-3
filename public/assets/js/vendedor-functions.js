// vendedor-functions.js
// Versión de solo lectura del CRUD para vendedores

class VendedorFunctions {
    constructor() {
        this.db = null;
        this.inicializarFirebase();
        
        // Formateador de moneda (CLP)
        this.formatoCLP = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });

        // ============================================================
        // EXPOSICIÓN GLOBAL DE FUNCIONES (Solo lectura)
        // ============================================================
        
        // Cargas de datos (solo lectura)
        window.cargarProductos = () => this.cargarProductos();
        window.cargarOrdenes = () => this.cargarPedidos();
        window.cargarUsuarios = () => this.cargarUsuarios();
        window.cargarCategorias = () => this.cargarCategorias();
        
        // Función de ver detalle (sin modificar)
        window.verDetallePedido = (id) => this.verDetallePedido(id);
        
        // Navegación (SPA simple)
        window.navegarA = (seccion) => {
            document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
            const target = document.getElementById(seccion);
            if(target) {
                target.style.display = 'block';
                if(seccion === 'dashboard') this.cargarResumenes();
                if(seccion === 'productos') this.cargarProductos();
                if(seccion === 'ordenes') this.cargarPedidos();
                if(seccion === 'usuarios') this.cargarUsuarios();
                if(seccion === 'categorias') this.cargarCategorias();
            }
        };

        // Cargar dashboard al inicio
        this.cargarResumenes();
    }

    inicializarFirebase() {
        try {
            this.db = firebase.firestore();
            console.log('Firebase inicializado en modo vendedor (solo lectura)');
        } catch (error) {
            console.error('Error fatal inicializando Firebase:', error);
        }
    }

    // ==================== DASHBOARD ====================

    async cargarResumenes() {
        try {
            // Contar productos
            const snapProd = await this.db.collection("producto").get();
            const totalProd = snapProd.size;
            const stockTotal = snapProd.docs.reduce((acc, doc) => acc + (parseInt(doc.data().stock) || 0), 0);

            // Contar usuarios
            const snapUser = await this.db.collection("usuario").get();
            const totalUser = snapUser.size;

            // Contar pedidos (compras)
            const snapCompras = await this.db.collection("compras").get();
            const totalCompras = snapCompras.size;

            // Actualizar DOM
            if(document.getElementById('totalProductos')) document.getElementById('totalProductos').innerText = totalProd;
            if(document.getElementById('inventarioTotal')) document.getElementById('inventarioTotal').innerText = stockTotal;
            if(document.getElementById('totalUsuarios')) document.getElementById('totalUsuarios').innerText = totalUser;
            if(document.getElementById('totalCompras')) document.getElementById('totalCompras').innerText = totalCompras;

        } catch (error) {
            console.error("Error cargando dashboard:", error);
        }
    }

    // ==================== PRODUCTOS (Solo Lectura) ====================

    async cargarProductos() {
        const tbody = document.getElementById('productos-tbody');
        if(!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando productos...</td></tr>';

        try {
            const snapshot = await this.db.collection("producto").get();
            
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay productos registrados.</td></tr>';
                return;
            }

            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const precio = this.formatoCLP.format(data.precio || 0);
                const activo = data.activo !== false;
                
                html += `
                    <tr>
                        <td>
                            <div style="display:flex; align-items:center; gap:10px;">
                                ${data.imagen ? `<img src="${data.imagen}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">` : '<i class="bi bi-image"></i>'}
                                <strong>${data.nombre}</strong>
                            </div>
                        </td>
                        <td>${precio}</td>
                        <td>${data.stock || 0} un.</td>
                        <td>${data.categoria || 'General'}</td>
                        <td>
                            <span style="color: ${activo ? 'green' : 'red'}; font-weight:bold;">
                                ${activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;

        } catch (error) {
            console.error("Error productos:", error);
            tbody.innerHTML = `<tr><td colspan="5" class="error">Error: ${error.message}</td></tr>`;
        }
    }

    // ==================== PEDIDOS (Solo Lectura) ====================

    async cargarPedidos() {
        const tbody = document.getElementById('ordenes-tbody');
        const filtro = document.getElementById('filtroEstado') ? document.getElementById('filtroEstado').value : '';
        
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando pedidos...</td></tr>';

        try {
            let query = this.db.collection("compras").orderBy("fecha", "desc");
            
            if(filtro) {
                query = query.where("estado", "==", filtro);
            }

            const snapshot = await query.get();

            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron pedidos.</td></tr>';
                return;
            }

            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const total = this.formatoCLP.format(data.total || 0);
                
                // Formateo de fecha seguro
                let fecha = "N/A";
                if(data.fecha && data.fecha.toDate) {
                    fecha = data.fecha.toDate().toLocaleDateString() + ' ' + data.fecha.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                } else if (data.fecha) {
                     fecha = new Date(data.fecha).toLocaleDateString();
                }

                // Colores de estado
                let badgeClass = 'secondary';
                if(data.estado === 'completado') badgeClass = 'success';
                if(data.estado === 'pendiente') badgeClass = 'warning';
                if(data.estado === 'horneando') badgeClass = 'info';

                html += `
                    <tr>
                        <td><small>${doc.id.slice(0,8)}...</small></td>
                        <td>${data.clienteNombre || 'Cliente Web'}</td>
                        <td><strong>${total}</strong></td>
                        <td><span class="badge bg-${badgeClass}" style="padding:5px; border-radius:4px; color:black; border:1px solid #ccc;">${data.estado || 'pendiente'}</span></td>
                        <td>${fecha}</td>
                        <td>
                             <button class="btn btn-sm btn-info" onclick="verDetallePedido('${doc.id}')">
                                <i class="bi bi-eye"></i> Ver
                             </button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;

        } catch (error) {
            console.error("Error pedidos:", error);
            tbody.innerHTML = `<tr><td colspan="6" class="error">Error (compras): ${error.message}</td></tr>`;
        }
    }

    async verDetallePedido(id) {
        try {
            const doc = await this.db.collection("compras").doc(id).get();
            if(doc.exists) {
                const data = doc.data();
                
                let detalleHTML = `
                    <strong>ID:</strong> ${doc.id}<br>
                    <strong>Cliente:</strong> ${data.clienteNombre || 'N/A'}<br>
                    <strong>Email:</strong> ${data.clienteEmail || 'N/A'}<br>
                    <strong>Total:</strong> ${this.formatoCLP.format(data.total || 0)}<br>
                    <strong>Estado:</strong> ${data.estado || 'pendiente'}<br>
                    <strong>Productos:</strong><br>
                `;
                
                if(data.items && Array.isArray(data.items)) {
                    data.items.forEach(item => {
                        detalleHTML += `- ${item.nombre} (${item.cantidad}x) = ${this.formatoCLP.format(item.precio * item.cantidad)}<br>`;
                    });
                }
                
                alert(detalleHTML.replace(/<br>/g, '\n').replace(/<strong>|<\/strong>/g, ''));
            } else {
                alert('Pedido no encontrado');
            }
        } catch(error) {
            alert('Error al cargar detalle: ' + error.message);
        }
    }

    // ==================== USUARIOS (Solo Lectura) ====================

    async cargarUsuarios() {
        const tbody = document.getElementById('usuarios-tbody');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando clientes...</td></tr>';

        try {
            const snapshot = await this.db.collection("usuario").get();
            
            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                html += `
                    <tr>
                        <td>${data.run || 'N/A'}</td>
                        <td>${data.nombre}</td>
                        <td>${data.email}</td>
                        <td>${data.telefono || '-'}</td>
                        <td><small>${(data.direccion || '').substring(0,25)}...</small></td>
                        <td>${data.rol || 'cliente'}</td>
                        <td>${data.activo ? '✅' : '❌'}</td>
                    </tr>
                `;
            });
            
            if(!html) {
                html = '<tr><td colspan="7" class="text-center">No hay clientes registrados</td></tr>';
            }
            
            tbody.innerHTML = html;

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="7" class="error">Error: ${error.message}</td></tr>`;
        }
    }

    // ==================== CATEGORÍAS (Solo Lectura) ====================

    async cargarCategorias() {
        const tbody = document.getElementById('categorias-tbody');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Analizando productos...</td></tr>';

        try {
            const snapshot = await this.db.collection("producto").get();
            const conteo = {};

            snapshot.forEach(doc => {
                const cat = doc.data().categoria || "Sin Categoría";
                conteo[cat] = (conteo[cat] || 0) + 1;
            });

            let html = '';
            Object.keys(conteo).forEach(catNombre => {
                html += `
                    <tr>
                        <td><strong>${catNombre}</strong></td>
                        <td>Categoría generada automáticamente</td>
                        <td>Activa</td>
                        <td>${conteo[catNombre]} productos</td>
                    </tr>
                `;
            });

            if(Object.keys(conteo).length === 0) {
                html = '<tr><td colspan="4" class="text-center">No hay categorías detectadas</td></tr>';
            }
            
            tbody.innerHTML = html;

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="4" class="error">Error: ${error.message}</td></tr>`;
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.vendedorManager = new VendedorFunctions();
    console.log('Panel de vendedor inicializado en modo solo lectura');
});

// Prevenir acciones no autorizadas
document.addEventListener('click', (e) => {
    // Si intentan hacer click en botones que no deberían existir
    if(e.target.onclick && typeof e.target.onclick === 'string') {
        const action = e.target.onclick.toString();
        if(action.includes('eliminar') || action.includes('editar') || action.includes('guardar')) {
            e.preventDefault();
            e.stopPropagation();
            alert('⚠️ No tienes permisos para realizar esta acción. Solo puedes consultar información.');
            return false;
        }
    }
}, true);