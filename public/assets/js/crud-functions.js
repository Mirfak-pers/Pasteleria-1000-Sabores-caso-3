class CRUDFunctions {
    constructor() {
        this.db = null;
        this.inicializarFirebase();
        this.cargarDatosPerfil();
        this.ocultarModalesAlInicio();
        
        // Exponer funciones necesarias globalmente para el CrudManager y el HTML
        window.verDetallePedido = (id) => console.log('Ver detalle de pedido:', id); // Placeholder
        window.cambiarEstadoPedido = (id) => this.cambiarEstadoPedido(id);
        window.editarProducto = (id) => this.cargarDatosProducto(id);
        window.guardarProducto = (data) => this.guardarProducto(data);
        window.eliminarProducto = (id) => this.eliminarProducto(id);
        window.verProductosCategoria = (nombre) => this.verProductosCategoria(nombre);
        window.editarCategoriaGlobal = (nombre) => this.editarCategoriaGlobal(nombre);
        window.crearCategoria = () => this.crearCategoria();
        window.editarUsuario = (id) => this.cargarDatosUsuario(id);
        window.cambiarEstadoUsuario = (id, estado) => this.cambiarEstadoUsuario(id, estado);
        window.cambiarRolUsuario = (id) => this.cambiarRolUsuario(id);
        window.eliminarUsuario = (id) => this.eliminarUsuario(id);
    }

    inicializarFirebase() {
        try {
            // Nota: Estos datos deben ser reemplazados por los reales de tu proyecto.
            const firebaseConfig = {
                apiKey: "AIzaSyBBT7jka7a-7v3vY19BlSajamiedLrBTN0",
                authDomain: "tiendanombretienda.firebaseapp.com",
                projectId: "tiendanombretienda",
                storageBucket: "tiendanombretienda.appspot.com",
                messagingSenderId: "408928911689",
                appId: "1:408928911689:web:d8b313c7e15fc528661a98",
                measurementId: "G-Y1DW47VEWZ"
            };

            if (typeof firebase !== 'undefined' && !firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.firestore();
            console.log('Firebase listo para CRUD');
        } catch (error) {
            console.error('Error inicializando Firebase para CRUD:', error);
        }
    }

    cargarDatosPerfil() {
        // Esta función necesita ser implementada si debe cargar datos de perfil
    }

    ocultarModalesAlInicio() {
        const modales = ['modalProducto', 'modalCategoria', 'modalUsuario'];
        modales.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            // Opcionalmente limpiar formularios
        }
    }

    // ==================== MANEJO DE ESTADO DE CARGA Y ERRORES ====================

    mostrarLoading(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            const colspan = target.parentElement.querySelector('thead tr th')?.length || 5;
            target.innerHTML = `<tr><td colspan="${colspan}" class="loading-data"><span class="loading-dots"><span>.</span><span>.</span><span>.</span></span> Cargando datos...</td></tr>`;
        }
    }

    mostrarError(targetId, mensaje) {
        const target = document.getElementById(targetId);
        if (target) {
            const colspan = target.parentElement.querySelector('thead tr th')?.length || 5;
            target.innerHTML = `<tr><td colspan="${colspan}" class="error-data">${mensaje}</td></tr>`;
        }
    }
    
    // Funciones de Resumen (Mantienen la lógica original de 'compras')
    mostrarCargaResumen() { /* ... código ... */ }
    ocultarCargaResumen() { /* ... código ... */ }
    mostrarErrorResumen(mensaje) { /* ... código ... */ }

    // ==================== DASHBOARD Y RESUMENES ====================

    async cargarResumenes() {
        try {
            console.log('Cargando resumenes del dashboard...');
            this.mostrarCargaResumen();
            
            const [comprasData, productosData, usuariosData] = await Promise.all([
                this.obtenerDatosCompras(),
                this.obtenerDatosProductos(), 
                this.obtenerDatosUsuarios()
            ]);
            
            this.actualizarResumenes(comprasData, productosData, usuariosData);
            this.ocultarCargaResumen();
            
        } catch (error) {
            console.error('Error cargando resumenes:', error);
            this.mostrarErrorResumen(error.message);
        }
    }

    async obtenerDatosCompras() {
        try {
            // Colección de Firebase para Pedidos/Órdenes
            const snapshot = await this.db.collection("compras") 
                .orderBy("fecha", "desc")
                .limit(100)
                .get();
                
            const compras = snapshot.docs.map(doc => ({
                ...doc.data(),
                fecha: doc.data().fecha?.toDate?.() || doc.data().fecha
            }));
            
            const totalCompras = compras.length;
            const ingresosTotales = compras.reduce((sum, compra) => sum + (compra.total || 0), 0);
            const proyeccion = this.calcularProyeccion(compras);
            
            return { totalCompras, ingresosTotales, proyeccion };
        } catch (error) {
            throw new Error(`Compras: ${error.message}`);
        }
    }
    
    // ... (obtenerDatosProductos, obtenerDatosUsuarios, actualizarResumenes, calcularProyeccion, obtenerComprasUltimoMes, obtenerComprasMesAnterior, contarUsuariosEsteMes - Sin cambios)
    
    async obtenerDatosProductos() {
        try {
            const snapshot = await this.db.collection("producto").get();
            const productos = snapshot.docs.map(doc => doc.data());
            
            const totalProductos = productos.length;
            const productosActivos = productos.filter(p => p.activo !== false).length;
            const inventarioTotal = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
            const bajoStock = productos.filter(p => (p.stock || 0) < 10).length;
            
            return { totalProductos, productosActivos, inventarioTotal, bajoStock };
        } catch (error) {
            throw new Error(`Productos: ${error.message}`);
        }
    }
    
    async obtenerDatosUsuarios() {
        try {
            const snapshot = await this.db.collection("usuario").get();
            const usuarios = snapshot.docs.map(doc => ({
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
            }));
            
            const totalUsuarios = usuarios.length;
            const nuevosUsuariosMes = this.contarUsuariosEsteMes(usuarios);
            const usuariosActivos = usuarios.filter(u => u.activo !== false).length;
            
            return { totalUsuarios, nuevosUsuariosMes, usuariosActivos };
        } catch (error) {
            throw new Error(`Usuarios: ${error.message}`);
        }
    }

    actualizarResumenes(comprasData, productosData, usuariosData) {
        if (document.getElementById('totalCompras')) {
            document.getElementById('totalCompras').textContent = comprasData.totalCompras;
        }
        if (document.getElementById('proyeccionCompras')) {
            document.getElementById('proyeccionCompras').textContent = comprasData.proyeccion;
        }
        
        if (document.getElementById('totalProductos')) {
            document.getElementById('totalProductos').textContent = productosData.totalProductos;
        }
        if (document.getElementById('inventarioTotal')) {
            document.getElementById('inventarioTotal').textContent = productosData.inventarioTotal;
        }
        
        if (document.getElementById('totalUsuarios')) {
            document.getElementById('totalUsuarios').textContent = usuariosData.totalUsuarios;
        }
        if (document.getElementById('nuevosUsuariosMes')) {
            document.getElementById('nuevosUsuariosMes').textContent = usuariosData.nuevosUsuariosMes;
        }
        
        console.log('Resumenes actualizados correctamente');
    }

    calcularProyeccion(compras) {
        if (compras.length === 0) return 0;
        
        const ultimoMes = this.obtenerComprasUltimoMes(compras);
        const mesAnterior = this.obtenerComprasMesAnterior(compras);
        
        if (mesAnterior.length === 0) return 100;
        
        const crecimiento = ((ultimoMes.length - mesAnterior.length) / mesAnterior.length) * 100;
        return Math.max(0, Math.round(crecimiento));
    }

    obtenerComprasUltimoMes(compras) {
        const ahora = new Date();
        const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        return compras.filter(compra => {
            const fechaCompra = compra.fecha?.toDate ? compra.fecha.toDate() : new Date(compra.fecha);
            return fechaCompra >= primerDiaMes;
        });
    }

    obtenerComprasMesAnterior(compras) {
        const ahora = new Date();
        const primerDiaMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
        const ultimoDiaMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
        
        return compras.filter(compra => {
            const fechaCompra = compra.fecha?.toDate ? compra.fecha.toDate() : new Date(compra.fecha);
            return fechaCompra >= primerDiaMesAnterior && fechaCompra <= ultimoDiaMesAnterior;
        });
    }

    contarUsuariosEsteMes(usuarios) {
        const ahora = new Date();
        const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        
        return usuarios.filter(usuario => {
            const fechaCreacion = usuario.createdAt?.toDate ? usuario.createdAt.toDate() : new Date(usuario.createdAt);
            return fechaCreacion >= primerDiaMes;
        }).length;
    }


    // ==================== PEDIDOS (ANTES ÓRDENES) ====================

    async getPedidos() {
        // Función utilizada por CrudManager.js para cargar la tabla
        try {
            const snapshot = await this.db.collection("compras") // Colección "compras"
                .orderBy("fecha", "desc")
                .get();
                
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                fecha: doc.data().fecha?.toDate?.() || doc.data().fecha
            }));
        } catch (error) {
            console.error('Error obteniendo pedidos:', error);
            throw error;
        }
    }

    async cargarPedidos() { // <--- CAMBIO: de cargarOrdenes
        try {
            this.mostrarLoading('pedidos-tbody'); // <--- CAMBIO: de ordenes-tbody
            const pedidos = await this.getPedidos();
            this.mostrarPedidos(pedidos); // <--- CAMBIO: de mostrarOrdenes
        } catch (error) {
            console.error('Error cargando pedidos:', error);
            this.mostrarError('pedidos-tbody', 'Error al cargar pedidos'); // <--- CAMBIO: de ordenes-tbody
        }
    }

    mostrarPedidos(pedidos) { // <--- CAMBIO: de mostrarOrdenes
        const tbody = document.getElementById('pedidos-tbody'); // <--- CAMBIO: de ordenes-tbody
        if (!tbody) return;

        if (pedidos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay pedidos disponibles</td></tr>';
            return;
        }

        tbody.innerHTML = pedidos.map(pedido => `
            <tr>
                <td>${pedido.id.substring(0, 8)}...</td>
                <td>${pedido.clienteNombre || pedido.usuarioNombre || pedido.nombre || 'N/A'}</td>
                <td>$${pedido.total || pedido.precio || 0}</td>
                <td>
                    <span class="badge ${this.getEstadoClass(pedido.estado)}">
                        ${pedido.estado || 'Pendiente'}
                    </span>
                </td>
                <td>${this.formatFecha(pedido.fecha)}</td>
                <td class="acciones">
                    <button class="btn btn-sm btn-info" onclick="verDetallePedido('${pedido.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="cambiarEstadoPedido('${pedido.id}')">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async cambiarEstadoPedido(pedidoId) { // <--- CAMBIO: de cambiarEstadoOrden
        const nuevoEstado = prompt('Ingrese el nuevo estado (pendiente/procesando/completado/cancelado):');
        if (!nuevoEstado) return;

        try {
            await this.db.collection("compras").doc(pedidoId).update({ // Colección "compras"
                estado: nuevoEstado,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert('Estado actualizado correctamente');
            this.cargarPedidos(); // <--- CAMBIO: de cargarOrdenes
        } catch (error) {
            console.error('Error actualizando pedido:', error);
            alert('Error al actualizar el estado');
        }
    }

    // ==================== REPORTES ====================
    
    async getReporteVentas(fechaInicio, fechaFin) {
        try {
            const snapshot = await this.db.collection("compras")
                .where("fecha", ">=", fechaInicio)
                .where("fecha", "<=", fechaFin)
                .orderBy("fecha", "desc")
                .get();
                
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                fecha: doc.data().fecha?.toDate?.() || doc.data().fecha
            }));
        } catch (error) {
            console.error('Error obteniendo reporte de ventas:', error);
            throw error;
        }
    }

    async getProductosMasVendidos() {
        // Implementación dummy o simplificada
        return [
            { nombre: 'Producto A', cantidadVendida: 50 },
            { nombre: 'Producto B', cantidadVendida: 45 },
            { nombre: 'Producto C', cantidadVendida: 30 }
        ];
    }
    
    // ==================== PRODUCTOS ====================
    
    async getProductos() {
        try {
            const snapshot = await this.db.collection("producto").get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            throw error;
        }
    }

    async cargarProductos() {
        // ... (código existente)
    }

    mostrarProductos(productos) {
        // ... (código existente)
    }

    async cargarDatosProducto(productoId) {
        // ... (código existente)
    }

    async guardarProducto(productoData) {
        // ... (código existente)
    }

    async eliminarProducto(productoId) {
        // ... (código existente)
    }

    // ==================== CATEGORÍAS ====================

    async getCategorias() {
        // Función utilizada por CrudManager.js
        try {
            const productosSnapshot = await this.db.collection("producto").get();
            return this.extraerCategoriasDeProductosSnapshot(productosSnapshot);
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            throw error;
        }
    }
    
    async cargarCategorias() {
        // ... (código existente)
    }

    extraerCategoriasDeProductosSnapshot(productosSnapshot) {
        // ... (código existente)
        const categoriasMap = new Map();
        
        productosSnapshot.docs.forEach(doc => {
            const producto = doc.data();
            if (producto.categoria && producto.categoria.trim() !== '') {
                const categoriaNombre = producto.categoria.trim();
                
                if (!categoriasMap.has(categoriaNombre)) {
                    categoriasMap.set(categoriaNombre, {
                        id: categoriaNombre,
                        nombre: categoriaNombre,
                        descripcion: 'Categoria extraida de productos',
                        productosCount: 0,
                        esExtraida: true
                    });
                }
                
                const categoria = categoriasMap.get(categoriaNombre);
                categoria.productosCount++;
            }
        });

        const categorias = Array.from(categoriasMap.values());
        console.log('Categorias extraidas de productos:', categorias);
        return categorias;
    }

    mostrarCategorias(categorias) {
        // ... (código existente)
    }

    async crearCategoria() {
        // ... (código existente)
    }

    async asignarCategoriaAProductos(nombreCategoria) {
        // ... (código existente)
    }

    async editarCategoriaGlobal(nombreCategoria) {
        // ... (código existente)
    }

    async cambiarNombreCategoria(nombreActual) {
        // ... (código existente)
    }

    async verProductosCategoria(nombreCategoria) {
        // ... (código existente)
    }

    async eliminarCategoriaGlobal(nombreCategoria) {
        // ... (código existente)
    }


    // ==================== USUARIOS ====================

    async getUsuarios() {
         try {
            const snapshot = await this.db.collection("usuario").get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
                updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
            }));
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            throw error;
        }
    }
    
    async cargarUsuarios() {
        // ... (código existente)
    }

    mostrarUsuarios(usuarios) {
        // ... (código existente)
    }

    async cargarDatosUsuario(usuarioId) {
        // ... (código existente)
    }

    async guardarUsuario(usuarioData) {
        // ... (código existente)
    }

    async cambiarEstadoUsuario(usuarioId, estadoActual) {
        // ... (código existente)
    }

    async cambiarRolUsuario(usuarioId) {
        // ... (código existente)
    }

    async eliminarUsuario(usuarioId) {
        // ... (código existente)
    }

    // ==================== UTILIDADES ====================

    formatFecha(timestamp) {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString();
    }

    getEstadoClass(estado) {
        if (!estado) return 'pendiente';
        switch (estado.toLowerCase()) {
            case 'completado':
                return 'completado';
            case 'procesando':
                return 'procesando';
            case 'cancelado':
                return 'cancelado';
            default:
                return 'pendiente';
        }
    }

    getRolClass(rol) {
        if (!rol) return 'cliente';
        switch (rol.toLowerCase()) {
            case 'administrador':
                return 'administrador';
            case 'staff':
                return 'staff';
            default:
                return 'cliente';
        }
    }
}


// Exponer la instancia de CRUDFunctions como crudManager en el objeto window
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado - CRUDFunctions listo');
    window.crudManager = new CRUDFunctions();
});