import { db } from "../config/firebase";
import { 
  collection, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from "firebase/firestore";

export class CrudService {
  
  // ==================== PEDIDOS (usa la colección "compras") ====================
  /** Obtiene todos los pedidos, ordenados por fecha descendente. */
  static async getPedidos() { // Renombrado de getOrdenes a getPedidos
    try {
      const pedidosRef = collection(db, "compras"); // Mantiene la colección "compras"
      const q = query(pedidosRef, orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate?.() || doc.data().fecha
      }));
    } catch (error) {
      console.error("Error obteniendo pedidos:", error);
      return [];
    }
  }

  /** Obtiene un pedido por su ID. */
  static async getPedidoById(id) { // Renombrado de getOrdenById a getPedidoById
    try {
      const pedidoRef = doc(db, "compras", id); // Mantiene la colección "compras"
      const pedidoSnap = await getDoc(pedidoRef);
      if (pedidoSnap.exists()) {
        const data = pedidoSnap.data();
        return { 
          id: pedidoSnap.id, 
          ...data,
          fecha: data.fecha?.toDate?.() || data.fecha
        };
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo pedido:", error);
      return null;
    }
  }

  /** Actualiza el estado de un pedido. */
  static async updatePedidoEstado(id, nuevoEstado) { // Renombrado de updateOrdenEstado a updatePedidoEstado
    try {
      const pedidoRef = doc(db, "compras", id); // Mantiene la colección "compras"
      await updateDoc(pedidoRef, {
        estado: nuevoEstado,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error actualizando pedido:", error);
      return false;
    }
  }

  // ==================== PRODUCTOS (usa la colección "producto") ====================
  // Se mantienen los nombres de funciones originales
  static async getProductos() {
    try {
      const productosRef = collection(db, "producto"); // Mantiene la colección "producto"
      const querySnapshot = await getDocs(productosRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      return [];
    }
  }

  static async getProductoById(id) {
    try {
      const productoRef = doc(db, "producto", id); // Mantiene la colección "producto"
      const productSnap = await getDoc(productoRef);
      if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo producto:", error);
      return null;
    }
  }

  static async createProducto(producto) {
    try {
      const docRef = await addDoc(collection(db, "producto"), { // Mantiene la colección "producto"
        ...producto,
        createdAt: Timestamp.now(),
        activo: true
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creando producto:", error);
      return null;
    }
  }

  static async updateProducto(id, datos) {
    try {
      const productoRef = doc(db, "producto", id); // Mantiene la colección "producto"
      await updateDoc(productoRef, {
        ...datos,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error actualizando producto:", error);
      return false;
    }
  }

  static async deleteProducto(id) {
    try {
      await deleteDoc(doc(db, "producto", id)); // Mantiene la colección "producto"
      return true;
    } catch (error) {
      console.error("Error eliminando producto:", error);
      return false;
    }
  }

  // ==================== CATEGORÍAS (usa la colección "categorias") ====================
  // Se mantienen sin cambios
  static async getCategorias() {
    try {
      const categoriasRef = collection(db, "categorias");
      const querySnapshot = await getDocs(categoriasRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
      return [];
    }
  }

  static async createCategoria(categoria) {
    try {
      const docRef = await addDoc(collection(db, "categorias"), {
        ...categoria,
        createdAt: Timestamp.now(),
        activa: true
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creando categoría:", error);
      return null;
    }
  }

  static async updateCategoria(id, datos) {
    try {
      const categoriaRef = doc(db, "categorias", id);
      await updateDoc(categoriaRef, {
        ...datos,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      return false;
    }
  }

  static async deleteCategoria(id) {
    try {
      await deleteDoc(doc(db, "categorias", id));
      return true;
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      return false;
    }
  }

  // ==================== USUARIOS (usa la colección "usuario") ====================
  // Se mantienen los nombres de funciones y colecciones originales
  static async getUsuarios() {
    try {
      const usuariosRef = collection(db, "usuario"); // Mantiene la colección "usuario"
      const querySnapshot = await getDocs(usuariosRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      }));
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      return [];
    }
  }

  static async getUsuarioById(id) {
    try {
      const usuarioRef = doc(db, "usuario", id); // Mantiene la colección "usuario"
      const usuarioSnap = await getDoc(usuarioRef);
      if (usuarioSnap.exists()) {
        const data = usuarioSnap.data();
        return { 
          id: usuarioSnap.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        };
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  }

  static async updateUsuario(id, datos) {
    try {
      const usuarioRef = doc(db, "usuario", id); // Mantiene la colección "usuario"
      await updateDoc(usuarioRef, {
        ...datos,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      return false;
    }
  }

  // ==================== REPORTES (usa la colección "compras") ====================
  // Se mantienen los nombres de funciones originales, pero usan "compras"
  static async getReporteVentas(fechaInicio, fechaFin) {
    try {
      const comprasRef = collection(db, "compras"); // Mantiene la colección "compras"
      const q = query(
        comprasRef,
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin),
        orderBy("fecha", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate?.() || doc.data().fecha
      }));
    } catch (error) {
      console.error("Error obteniendo reporte de ventas:", error);
      return [];
    }
  }

  static async getProductosMasVendidos() {
    try {
      const comprasRef = collection(db, "compras"); // Mantiene la colección "compras"
      const querySnapshot = await getDocs(comprasRef);
      
      const productosVendidos = {};
      querySnapshot.forEach(doc => {
        const compra = doc.data();
        if (compra.productos) {
          compra.productos.forEach(producto => {
            if (productosVendidos[producto.id]) {
              productosVendidos[producto.id].cantidad += producto.cantidad;
            } else {
              productosVendidos[producto.id] = {
                ...producto,
                cantidad: producto.cantidad
              };
            }
          });
        }
      });

      return Object.values(productosVendidos)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
    } catch (error) {
      console.error("Error obteniendo productos más vendidos:", error);
      return [];
    }
  }
}