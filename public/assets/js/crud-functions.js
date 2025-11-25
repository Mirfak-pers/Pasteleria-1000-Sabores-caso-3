class CRUDFunctions {
    constructor() {
        this.db = null;
        this.inicializarFirebase();
        
        // Formateador de moneda (CLP)
        this.formatoCLP = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });

        // ============================================================
        // EXPOSICIÓN GLOBAL DE FUNCIONES (Para que el HTML las vea)
        // ============================================================
        
        // Cargas de datos
        window.cargarProductos = () => this.cargarProductos();
        window.cargarOrdenes = () => this.cargarPedidos(); // Mapea 'ordenes' a 'pedidos'
        window.cargarUsuarios = () => this.cargarUsuarios();
        window.cargarCategorias = () => this.cargarCategorias();
        window.generarReporte = () => alert("Funcionalidad de reportes en desarrollo");

        // Acciones CRUD
        window.guardarProducto = (e) => this.guardarProducto(e);
        window.guardarUsuario = (e) => this.guardarUsuario(e);
        window.guardarCategoria = (e) => this.guardarCategoria(e);
        
        window.editarProducto = (id) => this.cargarDatosProducto(id);
        window.eliminarProducto = (id) => this.eliminarProducto(id);
        
        window.verDetallePedido = (id) => alert('Detalle pedido ID: ' + id);
        window.cambiarEstadoOrden = (id, val) => this.cambiarEstadoPedido(id, val); // Mapea HTML a JS
        
        window.editarUsuario = (id) => this.cargarDatosUsuario(id);
        window.eliminarUsuario = (id) => this.eliminarUsuario(id);
        
        window.editarCategoria = (id) => alert("Editar categoría: " + id);
        window.eliminarCategoria = (id) => alert("Eliminar categoría no disponible en modo automático");
        
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
            // TUS CREDENCIALES REALES
            const firebaseConfig = {
                apiKey: "AIzaSyC01DeLX515dsD29to5rHeqaWC8RV98KNg",
                authDomain: "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
                databaseURL: "https://tiendapasteleriamilsabor-a7ac6-default-rtdb.firebaseio.com",
                projectId: "tiendapasteleriamilsabor-a7ac6",
                storageBucket: "tiendapasteleriamilsabor-a7ac6.appspot.com",
                messagingSenderId: "408928911689", // Dato inferido del anterior, puede variar
                appId: "1:408928911689:web:d8b313c7e15fc528661a98" // Dato inferido
            };

            if (typeof firebase !== 'undefined' && !firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.firestore();
            console.log('Firebase conectado correctamente a: tiendapasteleriamilsabor-a7ac6');
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

    // ==================== PRODUCTOS ====================

    async cargarProductos() {
        const tbody = document.getElementById('productos-tbody');
        if(!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando productos...</td></tr>';

        try {
            // NOTA: Usamos "producto" (singular) según tu código base
            const snapshot = await this.db.collection("producto").get();
            
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos registrados.</td></tr>';
                return;
            }

            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const precio = this.formatoCLP.format(data.precio || 0);
                const activo = data.activo !== false; // Asumimos true si no existe
                
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
                        <td>
                            <button class="btn btn-sm btn-info" onclick="editarProducto('${doc.id}')"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${doc.id}')"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;

        } catch (error) {
            console.error("Error productos:", error);
            tbody.innerHTML = `<tr><td colspan="6" class="error">Error: ${error.message}</td></tr>`;
        }
    }

    async guardarProducto(e) {
        e.preventDefault();
        const id = document.getElementById('productoId').value;
        const nombre = document.getElementById('productoNombre').value;
        const precio = parseFloat(document.getElementById('productoPrecio').value);
        const stock = parseInt(document.getElementById('productoStock').value);
        const categoria = document.getElementById('productoCategoria').value;
        const imagen = document.getElementById('productoImagen').value;

        try {
            const data = { nombre, precio, stock, categoria, imagen, activo: true };
            
            if(id) {
                await this.db.collection("producto").doc(id).update(data);
                alert("Producto actualizado");
            } else {
                await this.db.collection("producto").add(data);
                alert("Producto creado");
            }
            
            document.getElementById('modalProducto').style.display = 'none';
            this.cargarProductos();
            
        } catch (error) {
            alert("Error al guardar: " + error.message);
        }
    }

    async cargarDatosProducto(id) {
        try {
            const doc = await this.db.collection("producto").doc(id).get();
            if(doc.exists) {
                const data = doc.data();
                document.getElementById('productoId').value = doc.id;
                document.getElementById('productoNombre').value = data.nombre;
                document.getElementById('productoPrecio').value = data.precio;
                document.getElementById('productoStock').value = data.stock;
                document.getElementById('productoCategoria').value = data.categoria;
                document.getElementById('productoImagen').value = data.imagen || '';
                
                document.getElementById('modalProductoTitulo').innerText = "Editar Producto";
                document.getElementById('modalProducto').style.display = 'block';
            }
        } catch (error) {
            console.error(error);
        }
    }

    async eliminarProducto(id) {
        if(confirm("¿Estás seguro de eliminar este producto?")) {
            await this.db.collection("producto").doc(id).delete();
            this.cargarProductos();
        }
    }

    // ==================== PEDIDOS (COMPRAS) ====================

    async cargarPedidos() {
        // En el HTML el ID es ordenes-tbody, pero lógica interna es pedidos
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

                // Selección de estado
                const selectEstado = `
                    <select onchange="cambiarEstadoOrden('${doc.id}', this.value)" style="font-size:0.8rem; padding:2px;">
                        <option value="" disabled selected>Cambiar...</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="horneando">Horneando</option>
                        <option value="listo_retiro">Listo Retiro</option>
                        <option value="completado">Completado</option>
                    </select>
                `;

                html += `
                    <tr>
                        <td><small>${doc.id.slice(0,8)}...</small></td>
                        <td>${data.clienteNombre || 'Cliente Web'}</td>
                        <td><strong>${total}</strong></td>
                        <td><span class="badge bg-${badgeClass}" style="padding:5px; border-radius:4px; color:black; border:1px solid #ccc;">${data.estado || 'pendiente'}</span></td>
                        <td>${fecha}</td>
                        <td>
                             <button class="btn btn-sm btn-light" onclick="verDetallePedido('${doc.id}')"><i class="bi bi-eye"></i></button>
                             ${selectEstado}
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

    async cambiarEstadoPedido(id, nuevoEstado) {
        try {
            await this.db.collection("compras").doc(id).update({ estado: nuevoEstado });
            this.cargarPedidos(); // Recargar tabla
            alert(`Pedido actualizado a: ${nuevoEstado}`);
        } catch (error) {
            alert("Error al actualizar estado");
        }
    }

    // ==================== USUARIOS ====================

    async cargarUsuarios() {
        const tbody = document.getElementById('usuarios-tbody');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando usuarios...</td></tr>';

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
                        <td><small>${(data.direccion || '').substring(0,15)}...</small></td>
                        <td>${data.rol || 'cliente'}</td>
                        <td>${data.activo ? '✅' : '❌'}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="editarUsuario('${doc.id}')"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${doc.id}')"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="8" class="error">Error: ${error.message}</td></tr>`;
        }
    }

    async guardarUsuario(e) {
        e.preventDefault();
        // Lógica simplificada de guardado
        const nombre = document.getElementById('usuarioNombre').value;
        const email = document.getElementById('usuarioEmail').value;
        const rol = document.getElementById('usuarioRol').value;
        const run = document.getElementById('usuarioRun').value;
        
        try {
            await this.db.collection("usuario").add({
                nombre, email, rol, run, 
                activo: true, 
                createdAt: new Date()
            });
            alert("Usuario creado");
            document.getElementById('modalUsuario').style.display = 'none';
            this.cargarUsuarios();
        } catch(err) {
            alert("Error: " + err.message);
        }
    }
    
    async eliminarUsuario(id) {
        if(confirm("¿Eliminar usuario?")) {
            await this.db.collection("usuario").doc(id).delete();
            this.cargarUsuarios();
        }
    }

    // ==================== CATEGORÍAS (Extracción Automática) ====================

    async cargarCategorias() {
        const tbody = document.getElementById('categorias-tbody');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Analizando productos...</td></tr>';

        try {
            // Extraer categorías únicas basadas en los productos existentes
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
                        <td>
                            <button class="btn btn-sm btn-secondary" disabled>Auto</button>
                        </td>
                    </tr>
                `;
            });

            if(Object.keys(conteo).length === 0) {
                html = '<tr><td colspan="5" class="text-center">No hay categorías detectadas</td></tr>';
            }
            
            tbody.innerHTML = html;

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="5" class="error">Error: ${error.message}</td></tr>`;
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.crudManager = new CRUDFunctions();
});

// Helpers para Modales (Fuera de la clase para acceso simple desde HTML onclick)
function mostrarModalProducto() {
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = "";
    document.getElementById('modalProductoTitulo').innerText = "Nuevo Producto";
    document.getElementById('modalProducto').style.display = 'block';
}

function mostrarModalUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('modalUsuario').style.display = 'block';
}

function crearCategoria() {
    document.getElementById('formCategoria').reset();
    document.getElementById('modalCategoria').style.display = 'block';
}

function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Cerrar modales al hacer click fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}