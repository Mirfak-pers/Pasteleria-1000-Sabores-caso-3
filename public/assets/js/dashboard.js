class DashboardManager {
    constructor() {
        this.estadisticas = null;
        this.estaCargando = false;
        this.firebaseInicializado = false;
        this.db = null;
        this.init();
    }

    async init() {
        console.log('Iniciando DashboardManager...');
        
        // Inicializar Firebase
        await this.inicializarFirebase();
        
        // Configurar navegación
        this.configurarNavegacion();
        this.inicializarNavegacion();
        
        // Cargar estadísticas
        await this.cargarEstadisticasReales();
    }

    async inicializarFirebase() {
        try {
            console.log('Inicializando Firebase...');
            
            const firebaseConfig = {
                apiKey: "AIzaSyBBT7jka7a-7v3vY19BlSajamiedLrBTN0",
                authDomain: "tiendanombretienda.firebaseapp.com",
                projectId: "tiendanombretienda",
                storageBucket: "tiendanombretienda.appspot.com",
                messagingSenderId: "408928911689",
                appId: "1:408928911689:web:d8b313c7e15fc528661a98",
                measurementId: "G-Y1DW47VEWZ"
            };

            if (typeof firebase === 'undefined') {
                console.error('Firebase no está cargado');
                return false;
            }

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.firestore();
            this.firebaseInicializado = true;
            
            console.log('Firebase inicializado correctamente');
            return true;
            
        } catch (error) {
            console.error('Error inicializando Firebase:', error);
            return false;
        }
    }

    configurarNavegacion() {
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const seccion = link.getAttribute('href').substring(1);
                    this.navegarASeccion(seccion);
                }
            });
        });
    }

    inicializarNavegacion() {
        this.navegarASeccion('dashboard');
        this.actualizarBienvenida();
    }

    navegarASeccion(seccion) {
        const sections = document.querySelectorAll('main > section:not(.welcome-section)');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        const targetSection = document.getElementById(seccion);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${seccion}`) {
                link.classList.add('active');
            }
        });

        if (seccion === 'dashboard' && this.firebaseInicializado) {
            this.cargarEstadisticasReales();
        }
    }

    // ==================== MÉTODOS DEL DASHBOARD ====================

    async cargarEstadisticasReales() {
        if (this.estaCargando || !this.firebaseInicializado) {
            console.log('No se pueden cargar estadísticas - Firebase no inicializado');
            this.usarDatosEjemplo();
            return;
        }
        
        try {
            this.estaCargando = true;
            this.mostrarEstadoCarga(true);
            
            console.log('Cargando estadísticas REALES de Firebase...');
            
            // Hemos cambiado 'totalCompras' a 'totalPedidos' y 'proyeccionCompras' a 'proyeccionPedidos' en las llamadas.
            const [
                totalPedidos, // CAMBIO: de totalCompras
                proyeccionPedidos, // CAMBIO: de proyeccion
                totalProductos,
                inventario,
                totalUsuarios,
                nuevosUsuarios
            ] = await Promise.all([
                this.getTotalPedidos(), // CAMBIO: de this.getTotalCompras()
                this.getProyeccionPedidos(), // CAMBIO: de this.getProyeccionCompras()
                this.getTotalProductos(),
                this.getInventarioTotal(),
                this.getTotalUsuarios(),
                this.getNuevosUsuariosMes()
            ]);

            this.estadisticas = {
                totalCompras: totalPedidos, // Mantenemos la clave interna como totalCompras si la UI lo espera, pero usamos el valor de Pedidos
                proyeccionCompras: proyeccionPedidos, // Mantenemos la clave interna como proyeccionCompras
                totalProductos,
                inventarioTotal: inventario,
                totalUsuarios,
                nuevosUsuariosMes: nuevosUsuarios
            };

            console.log('Estadísticas REALES obtenidas:', this.estadisticas);
            this.actualizarUI();
            
        } catch (error) {
            console.error('Error cargando estadísticas reales:', error);
            this.usarDatosEjemplo();
        } finally {
            this.estaCargando = false;
            this.mostrarEstadoCarga(false);
        }
    }

    async getTotalPedidos() { // CAMBIO: de getTotalCompras
        try {
            // Buscamos en la colección "pedidos"
            const snapshot = await this.db.collection("pedidos").get(); // <--- COLECCIÓN CAMBIADA
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener total de pedidos:", error);
            return 24;
        }
    }

    async getProyeccionPedidos() { // CAMBIO: de getProyeccionCompras
        try {
            const ahora = new Date();
            const mesActualInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
            const mesAnteriorInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
            const mesAnteriorFin = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

            // Buscamos en la colección "pedidos"
            const snapshotActual = await this.db.collection("pedidos") // <--- COLECCIÓN CAMBIADA
                .where("fecha", ">=", mesActualInicio)
                .where("fecha", "<=", ahora)
                .get();
            const pedidosActual = snapshotActual.size; // CAMBIO: de comprasActual

            // Buscamos en la colección "pedidos"
            const snapshotAnterior = await this.db.collection("pedidos") // <--- COLECCIÓN CAMBIADA
                .where("fecha", ">=", mesAnteriorInicio)
                .where("fecha", "<=", mesAnteriorFin)
                .get();
            const pedidosAnterior = snapshotAnterior.size; // CAMBIO: de comprasAnterior

            if (pedidosAnterior === 0) return pedidosActual > 0 ? 100 : 0;
            
            const aumento = ((pedidosActual - pedidosAnterior) / pedidosAnterior) * 100;
            return Math.round(aumento);
        } catch (error) {
            console.error("Error al calcular proyección de pedidos:", error);
            return 15;
        }
    }

    async getTotalProductos() {
        try {
            const snapshot = await this.db.collection("producto").get();
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener total de productos:", error);
            return 156;
        }
    }

    async getInventarioTotal() {
        try {
            const snapshot = await this.db.collection("producto").get();
            let totalInventario = 0;
            
            snapshot.forEach(doc => {
                const producto = doc.data();
                // Se mantiene la lógica de buscar 'cantidad' o 'stock'
                totalInventario += producto.cantidad || producto.stock || 0;
            });
            
            return totalInventario;
        } catch (error) {
            console.error("Error al calcular inventario:", error);
            return 1248;
        }
    }

    async getTotalUsuarios() {
        try {
            const snapshot = await this.db.collection("usuario").get();
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener total de usuarios:", error);
            return 89;
        }
    }

    async getNuevosUsuariosMes() {
        try {
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const snapshot = await this.db.collection("usuario")
                .where("createdAt", ">=", inicioMes)
                .get();
            
            return snapshot.size;
        } catch (error) {
            console.error("Error al obtener nuevos usuarios:", error);
            return 12;
        }
    }

    // ==================== MÉTODOS UI ====================

    usarDatosEjemplo() {
        this.estadisticas = {
            totalCompras: 24, // Mantenemos el nombre de la clave para la UI
            proyeccionCompras: 15, // Mantenemos el nombre de la clave para la UI
            totalProductos: 156,
            inventarioTotal: 1248,
            totalUsuarios: 89,
            nuevosUsuariosMes: 12
        };
        this.actualizarUI();
    }

    actualizarUI() {
        if (!this.estadisticas) return;

        const mapeoElementos = {
            'totalCompras': this.estadisticas.totalCompras,
            'proyeccionCompras': this.estadisticas.proyeccionCompras,
            'totalProductos': this.estadisticas.totalProductos,
            'inventarioTotal': this.estadisticas.inventarioTotal,
            'totalUsuarios': this.estadisticas.totalUsuarios,
            'nuevosUsuariosMes': this.estadisticas.nuevosUsuariosMes
        };

        Object.entries(mapeoElementos).forEach(([id, valor]) => {
            this.actualizarElemento(id, valor);
        });
    }

    actualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    }

    mostrarEstadoCarga(mostrar) {
        const cards = document.querySelectorAll('.summary-card');
        const botones = document.querySelectorAll('.nav-button');
        
        cards.forEach(card => {
            card.classList.toggle('cargando', mostrar);
        });
        
        botones.forEach(boton => {
            boton.style.opacity = mostrar ? '0.6' : '1';
        });
    }

    actualizarBienvenida() {
        const usuarioStr = localStorage.getItem("usuario");
        if (usuarioStr) {
            const usuario = JSON.parse(usuarioStr);
            const bienvenidoPrincipal = document.getElementById('bienvenidoPrincipal');
            if (bienvenidoPrincipal) {
                bienvenidoPrincipal.textContent = `Bienvenido, ${usuario.nombre}`;
            }
        }
    }
}

// Funciones globales básicas
function navegarA(seccion) {
    if (window.dashboardManager) {
        window.dashboardManager.navegarASeccion(seccion);
    }
}

function irATienda() {
    window.location.href = '../../index.html';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM Cargado - Inicializando DashboardManager...');
    window.dashboardManager = new DashboardManager();
});