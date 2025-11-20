import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import DashboardAPI from "../organisms/DashboardAPI";

const PerfilAdmin = () => {
  const { user } = useContext(UserContext);
  const [reactMontado, setReactMontado] = useState(false);

  useEffect(() => {
    console.log('REACT: PerfilAdmin MONTADO');
    setReactMontado(true);
    
    // Forzar la exposición global inmediatamente
    setTimeout(() => {
      console.log('REACT: Verificando DashboardAPI...');
      if (window.dashboardAPIReady) {
        console.log('REACT: DashboardAPI está listo');
      } else {
        console.log('REACT: DashboardAPI NO está listo - problema de montaje');
        
        // Intentar forzar la inicialización
        if (typeof window !== 'undefined') {
          console.log('REACT: Forzando inicialización...');
          // Aquí podrías llamar manualmente a alguna función de inicialización
        }
      }
    }, 1000);
  }, []);

  return (
    <>
      {/* Mostrar estado de React */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: reactMontado ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 10000
      }}>
        React: {reactMontado ? 'Montado' : 'No montado'}
      </div>

      {/* DashboardAPI se monta PRIMERO */}
      <DashboardAPI />
      
      {/* HTML estático */}
      <div dangerouslySetInnerHTML={{ 
        __html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Panel de Administración</title>
              <link rel="stylesheet" href="/assets/css/perfilAdmin.css">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
          </head>
          <body>
              <div id="react-status" style="position: fixed; top: 50px; right: 10px; background: #f59e0b; color: white; padding: 10px; border-radius: 5px; z-index: 10000;">
                  JavaScript Vanilla: Cargado
              </div>

              <div class="admin-container">
                                                  </div>

              <script>
                // DEBUG COMPLETO
                console.log('INICIO DEBUG - Verificando todo...');
                console.log('URL:', window.location.href);
                console.log('React en window:', typeof window.React);
                console.log('APIs disponibles:', {
                  dashboardAPIReady: window.dashboardAPIReady,
                  crudManager: window.crudManager,
                  DashboardService: window.DashboardService,
                  CrudService: window.CrudService
                });

                // Verificar cada segundo si React ha cargado
                const reactCheckInterval = setInterval(() => {
                  const reactStatus = document.getElementById('react-status');
                  if (window.dashboardAPIReady && window.crudManager) {
                    console.log('REACT CARGÓ LAS APIS');
                    reactStatus.style.background = '#10b981';
                    reactStatus.textContent = 'React + APIs: Listo';
                    clearInterval(reactCheckInterval);
                  } else {
                    console.log('Esperando React...', {
                      dashboardAPIReady: window.dashboardAPIReady,
                      crudManager: !!window.crudManager,
                      time: new Date().toLocaleTimeString()
                    });
                  }
                }, 1000);

                // Timeout después de 15 segundos
                setTimeout(() => {
                  clearInterval(reactCheckInterval);
                  if (!window.crudManager) {
                    console.error('REACT NUNCA CARGÓ - Usando fallback');
                    // Inicializar fallback
                    window.dashboardAPIReady = true;
                    window.crudManager = crearCRUDFallback();
                  }
                }, 15000);

                // Fallback básico (Ahora usa "Pedidos" en lugar de "Ordenes")
                function crearCRUDFallback() {
                  console.log('Inicializando CRUD Fallback...');
                  return {
                    getPedidos: async () => { // <--- CAMBIO AQUÍ
                      console.log('Fallback: getPedidos');
                      return [{id: '1', clienteNombre: 'Demo', total: 100, estado: 'completado', fecha: new Date()}];
                    },
                    getProductos: async () => {
                      console.log('Fallback: getProductos');
                      return [{id: '1', nombre: 'Producto Demo', precio: 50, cantidad: 10, categoria: 'General'}];
                    },
                    getCategorias: async () => {
                      console.log('Fallback: getCategorias');
                      return [{id: '1', nombre: 'Categoría Demo', descripcion: 'Descripción demo'}];
                    },
                    getUsuarios: async () => {
                      console.log('Fallback: getUsuarios');
                      return [{id: '1', nombre: 'Usuario Demo', email: 'demo@test.com', rol: 'usuario'}];
                    },
                    getReporteVentas: async () => {
                      console.log('Fallback: getReporteVentas');
                      return [];
                    },
                    getProductosMasVendidos: async () => {
                      console.log('Fallback: getProductosMasVendidos');
                      return [];
                    },
                    // Aseguramos el resto de las funciones de Pedidos si fueran necesarias
                    getPedidoById: async (id) => { console.log('Fallback: getPedidoById', id); return null; },
                    updatePedidoEstado: async (id, estado) => { console.log('Fallback: updatePedidoEstado', id, estado); return true; },
                    // Añadimos las funciones restantes para que crudManager esté completo, aunque solo sean fallbacks vacíos
                    getProductoById: async (id) => { console.log('Fallback: getProductoById', id); return null; },
                    createProducto: async (p) => { console.log('Fallback: createProducto'); return 'DEMO_ID'; },
                    updateProducto: async (id, d) => { console.log('Fallback: updateProducto'); return true; },
                    deleteProducto: async (id) => { console.log('Fallback: deleteProducto'); return true; },
                    createCategoria: async (c) => { console.log('Fallback: createCategoria'); return 'DEMO_ID'; },
                    updateCategoria: async (id, d) => { console.log('Fallback: updateCategoria'); return true; },
                    deleteCategoria: async (id) => { console.log('Fallback: deleteCategoria'); return true; },
                    getUsuarioById: async (id) => { console.log('Fallback: getUsuarioById', id); return null; },
                    updateUsuario: async (id, d) => { console.log('Fallback: updateUsuario'); return true; },
                  };
                }
              </script>
              <script src="/assets/js/saludo.js"></script>
              <script src="/assets/js/logout.js"></script>
              <script src="/assets/js/dashboard.js"></script>
              <script src="/assets/js/crud-manager.js"></script>
              <script src="/assets/js/crud-functions.js"></script>
          </body>
          </html>
        `
      }} />
    </>
  );
};

export default PerfilAdmin;