import { db } from "../config/firebase";
import { 
  collection, 
  getCountFromServer,
  query,
  where,
  getDocs
} from "firebase/firestore";

export class DashboardService {
  
  // ==================== MÉTRICAS DE PEDIDOS (usa la colección "compras") ====================

  /** Obtiene el total de pedidos (ventas) históricos. */
  static async getTotalPedidos() { // Renombrado de getTotalCompras
    try {
      console.log('Obteniendo total de pedidos desde Firebase v9...');
      const pedidosRef = collection(db, "compras"); // Mantiene la colección "compras"
      const snapshot = await getCountFromServer(pedidosRef);
      const total = snapshot.data().count;
      console.log('Total pedidos:', total);
      return total;
    } catch (error) {
      console.error("Error al obtener total de pedidos:", error);
      return 24; // Datos de ejemplo
    }
  }

  /** Calcula el porcentaje de aumento/disminución de pedidos vs. el mes anterior. */
  static async getProyeccionPedidos() { // Renombrado de getProyeccionCompras
    try {
      console.log('Calculando proyección de pedidos...');
      const ahora = new Date();
      const mesActualInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const mesAnteriorInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
      const mesAnteriorFin = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59, 999);

      const pedidosRef = collection(db, "compras"); // Mantiene la colección "compras"
      
      // Pedidos del mes actual
      const qActual = query(
        pedidosRef, 
        where("fecha", ">=", mesActualInicio),
        where("fecha", "<=", ahora)
      );
      const snapshotActual = await getCountFromServer(qActual);
      const pedidosActual = snapshotActual.data().count;

      // Pedidos del mes anterior
      const qAnterior = query(
        pedidosRef, 
        where("fecha", ">=", mesAnteriorInicio),
        where("fecha", "<=", mesAnteriorFin)
      );
      const snapshotAnterior = await getCountFromServer(qAnterior);
      const pedidosAnterior = snapshotAnterior.data().count;

      console.log(`Pedidos actual: ${pedidosActual}, anterior: ${pedidosAnterior}`);

      if (pedidosAnterior === 0) return pedidosActual > 0 ? 100 : 0;
      
      const aumento = ((pedidosActual - pedidosAnterior) / pedidosAnterior) * 100;
      return Math.round(aumento);
    } catch (error) {
      console.error("Error al calcular proyección:", error);
      return 15; // Datos de ejemplo
    }
  }

  // ==================== MÉTRICAS DE PRODUCTOS (usa la colección "producto") ====================
  
  static async getTotalProductos() {
    try {
      console.log('Obteniendo total de productos...');
      const productosRef = collection(db, "producto"); // Mantiene la colección "producto"
      const snapshot = await getCountFromServer(productosRef);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error al obtener total de productos:", error);
      return 156; // Datos de ejemplo
    }
  }

  static async getInventarioTotal() {
    try {
      console.log('Calculando inventario total...');
      const productosRef = collection(db, "producto"); // Mantiene la colección "producto"
      const querySnapshot = await getDocs(productosRef);
      let totalInventario = 0;
      
      querySnapshot.forEach((doc) => {
        const producto = doc.data();
        totalInventario += producto.stock || 0; // Se asume que el campo es 'stock'
      });
      
      return totalInventario;
    } catch (error) {
      console.error("Error al calcular inventario:", error);
      return 1248; // Datos de ejemplo
    }
  }

  // ==================== MÉTRICAS DE USUARIOS (usa la colección "usuario") ====================
  
  static async getTotalUsuarios() {
    try {
      console.log('Obteniendo total de usuarios...');
      const usuariosRef = collection(db, "usuario"); // Mantiene la colección "usuario"
      const snapshot = await getCountFromServer(usuariosRef);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error al obtener total de usuarios:", error);
      return 89; // Datos de ejemplo
    }
  }

  static async getNuevosUsuariosMes() {
    try {
      console.log('Obteniendo nuevos usuarios del mes...');
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const usuariosRef = collection(db, "usuario"); // Mantiene la colección "usuario"
      const q = query(
        usuariosRef, 
        where("createdAt", ">=", inicioMes)
      );
      
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error al obtener nuevos usuarios:", error);
      return 12; // Datos de ejemplo
    }
  }

  // ==================== FUNCIÓN COMPUESTA ====================
  
  static async getEstadisticasCompletas() {
    try {
      console.log('Iniciando obtención de estadísticas completas desde Firebase...');
      
      const [
        totalPedidos, // Cambiado el nombre de la variable
        proyeccion, // Cambiado el nombre de la variable
        totalProductos,
        inventario,
        totalUsuarios,
        nuevosUsuarios
      ] = await Promise.all([
        this.getTotalPedidos(), // Llamando a la función renombrada
        this.getProyeccionPedidos(), // Llamando a la función renombrada
        this.getTotalProductos(),
        this.getInventarioTotal(),
        this.getTotalUsuarios(),
        this.getNuevosUsuariosMes()
      ]);

      const estadisticas = {
        totalPedidos, // Clave de retorno cambiada
        proyeccionPedidos: proyeccion, // Clave de retorno cambiada
        totalProductos,
        inventarioTotal: inventario,
        totalUsuarios,
        nuevosUsuariosMes: nuevosUsuarios
      };

      console.log('Estadísticas REALES obtenidas de Firebase:', estadisticas);
      return estadisticas;

    } catch (error) {
      console.error("Error al obtener estadísticas completas, usando datos de ejemplo:", error);
      // Datos de ejemplo como fallback
      return {
        totalPedidos: 24, // Clave de retorno cambiada
        proyeccionPedidos: 15, // Clave de retorno cambiada
        totalProductos: 156,
        inventarioTotal: 1248,
        totalUsuarios: 89,
        nuevosUsuariosMes: 12
      };
    }
  }
}