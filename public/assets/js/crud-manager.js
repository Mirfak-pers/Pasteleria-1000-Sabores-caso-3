class CrudManager {
    constructor() {
        this.currentModule = null;
        this.currentData = [];
        this.init();
    }

    init() {
        console.log('CrudManager inicializado');
        this.configurarGlobales();
    }

    configurarGlobales() {
        // Configurar funciones globales
        window.cargarPedidos = () => this.cargarModulo('pedidos'); // <--- CAMBIO: de cargarOrdenes
        window.cargarProductos = () => this.cargarModulo('productos');
        window.cargarCategorias = () => this.cargarModulo('categorias');
        window.cargarUsuarios = () => this.cargarModulo('usuarios');
        window.cargarReportes = () => this.cargarModulo('reportes');
    }

    async cargarModulo(modulo) {
        console.log(`Cargando módulo: ${modulo}`);
        
        // El window.crudManager en este punto debe ser el CrudService (o el fallback) expuesto por React.
        if (!window.crudManager) {
            console.error('CRUD Manager (API de React) no disponible');
            this.mostrarError(modulo);
            return;
        }

        this.currentModule = modulo;
        
        try {
            await this.cargarDatos();
            this.renderizarVista();
        } catch (error) {
            console.error(`Error en ${modulo}:`, error);
            this.mostrarError(modulo);
        }
    }

    async cargarDatos() {
        // window.crudManager debe ser la interfaz (CrudService) expuesta por DashboardAPI.
        switch(this.currentModule) {
            case 'pedidos': // <--- CAMBIO: de 'ordenes'
                this.currentData = await window.crudManager.getPedidos(); // <--- CAMBIO: de getOrdenes
                break;
            case 'productos':
                this.currentData = await window.crudManager.getProductos();
                break;
            case 'categorias':
                this.currentData = await window.crudManager.getCategorias();
                break;
            case 'usuarios':
                this.currentData = await window.crudManager.getUsuarios();
                break;
            case 'reportes':
                const fechaInicio = new Date();
                fechaInicio.setDate(1);
                const fechaFin = new Date();
                const ventas = await window.crudManager.getReporteVentas(fechaInicio, fechaFin);
                const productosMasVendidos = await window.crudManager.getProductosMasVendidos();
                this.currentData = { ventas, productosMasVendidos };
                break;
        }
    }

    renderizarVista() {
        const containerId = `crud-container-${this.currentModule}`;
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `
            <div class="crud-header">
                <h2>${this.getModuloNombre(this.currentModule)}</h2>
                <span class="badge">${Array.isArray(this.currentData) ? this.currentData.length : (this.currentModule === 'reportes' ? this.currentData.ventas.length : 0)} registros</span>
            </div>
        `;

        if (this.currentModule === 'reportes') {
            const hasData = this.currentData && this.currentData.ventas && this.currentData.ventas.length > 0;
            if (!hasData) {
                html += '<div class="no-data"><p>No hay datos disponibles para Reportes</p></div>';
            } else {
                html += '<div class="table-responsive"><table class="crud-table"><tbody>';
                html += this.renderizarReportes();
                html += '</tbody></table></div>';
            }
        } else if (this.currentData.length === 0) {
             html += '<div class="no-data"><p>No hay datos disponibles</p></div>';
        } else {
            html += '<div class="table-responsive"><table class="crud-table"><thead><tr><th>ID/Nombre</th><th>Detalle 1</th><th>Detalle 2</th><th>Detalle 3</th></tr></thead><tbody>';
            html += this.currentData.map(item => this.renderizarFila(item)).join('');
            html += '</tbody></table></div>';
        }

        container.innerHTML = html;
    }

    renderizarFila(item) {
        // Renderizado básico según el módulo
        switch(this.currentModule) {
            case 'pedidos': // <--- CAMBIO: de 'ordenes'
                return `
                    <tr>
                        <td>${item.id?.substring(0, 8)}...</td>
                        <td>${item.clienteNombre || 'N/A'}</td>
                        <td>$${item.total || 0}</td>
                        <td><span class="badge status-${item.estado ? item.estado.toLowerCase() : 'pendiente'}">${item.estado || 'Pendiente'}</span></td>
                    </tr>
                `;
            case 'productos':
                // Nota: Usamos 'stock' o 'cantidad'
                return `
                    <tr>
                        <td>${item.nombre || 'Sin nombre'}</td>
                        <td>$${item.precio || 0}</td>
                        <td>${item.cantidad || item.stock || 0}</td>
                        <td>${item.categoria || 'General'}</td>
                    </tr>
                `;
            case 'categorias':
                return `
                    <tr>
                        <td>${item.nombre || 'Sin nombre'}</td>
                        <td colspan="3">${item.descripcion || 'Sin descripción'}</td>
                    </tr>
                `;
            case 'usuarios':
                 return `
                    <tr>
                        <td>${item.nombre || 'Sin nombre'}</td>
                        <td>${item.email || 'N/A'}</td>
                        <td colspan="2"><span class="badge role-${item.rol ? item.rol.toLowerCase() : 'usuario'}">${item.rol || 'Usuario'}</span></td>
                    </tr>
                `;
            default:
                return `<tr><td colspan="4">${JSON.stringify(item)}</td></tr>`;
        }
    }

    renderizarReportes() {
        const { ventas = [], productosMasVendidos = [] } = this.currentData;
        let html = '';
        
        // Muestra de Ventas
        html += `
            <tr><td colspan="4"><h3>Resumen de Ventas (Pedidos)</h3></td></tr>
            <tr><th>ID Pedido</th><th>Total</th><th>Estado</th><th>Fecha (aprox)</th></tr>
        `;
        if (ventas.length > 0) {
            html += ventas.map(venta => `
                <tr>
                    <td>${venta.id?.substring(0, 8)}...</td>
                    <td>$${venta.total || 0}</td>
                    <td>${venta.estado || 'Pendiente'}</td>
                    <td>${new Date(venta.fecha).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            html += `<tr><td colspan="4">No hay datos de ventas recientes.</td></tr>`;
        }
        
        // Muestra de Productos Más Vendidos
        html += `
            <tr><td colspan="4"><h3>Productos Más Vendidos</h3></td></tr>
            <tr><th>Nombre Producto</th><th>Cantidad Vendida</th><th colspan="2"></th></tr>
        `;
         if (productosMasVendidos.length > 0) {
            html += productosMasVendidos.map(prod => `
                <tr>
                    <td>${prod.nombre || 'Desconocido'}</td>
                    <td>${prod.cantidadVendida || 0}</td>
                    <td colspan="2"></td>
                </tr>
            `).join('');
        } else {
            html += `<tr><td colspan="4">No hay datos de productos más vendidos.</td></tr>`;
        }
        
        return html;
    }

    mostrarError(modulo) {
        const containerId = `crud-container-${modulo}`;
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="error-message">
                <p>Error al cargar ${this.getModuloNombre(modulo)}</p>
                <p><small>Verifique la conexión con el servidor o si el API está expuesto (window.crudManager).</small></p>
            </div>
        `;
    }

    getModuloNombre(modulo) {
        const nombres = {
            'pedidos': 'Pedidos', // <--- CAMBIO: de 'ordenes' a 'pedidos'
            'productos': 'Productos', 
            'categorias': 'Categorías',
            'usuarios': 'Usuarios',
            'reportes': 'Reportes'
        };
        return nombres[modulo] || modulo;
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado - CrudManager listo');
    window.crudManagerInstance = new CrudManager();
});