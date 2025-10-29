// src/components/routes/RouterConfig.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Usar Routes y Route de v6
import Home from '../pages/Home'; // Ajusta la ruta si es necesario
import PerfilCliente from '../pages/perfilCliente'; // ✅ Nombre correcto y PascalCase
import PerfilAdmin from '../pages/perfilAdmin'; // ✅ Nombre correcto y PascalCase
// Asegúrate de importar también tus otras páginas
import Productos from '../pages/productos';
import Contacto from '../pages/contacto';
import About from '../pages/about';
import Blog from '../pages/blog';
import BlogDetalle1 from '../pages/blog-detalle-1';
import BlogDetalle2 from '../pages/blog-detalle-2';
import Carrito from '../pages/carrito';
import Login from '../pages/login'; // Asumiendo que tienes esta página
import Registro from '../pages/registro'; // Asumiendo que tienes esta página

// ❌ REMOVER BrowserRouter de aquí
const RouterConfig = () => (
  // No envolver con <Router> aquí si ya está en App.jsx o main.jsx
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/productos" element={<Productos />} />
    <Route path="/contacto" element={<Contacto />} />
    <Route path="/nosotros" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog-detalle-1" element={<BlogDetalle1 />} />
    <Route path="/blog-detalle-2" element={<BlogDetalle2 />} />
    <Route path="/carrito" element={<Carrito />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Registro />} />
    <Route path="/perfil-cliente" element={<PerfilCliente />} /> {/* ✅ Ruta corregida */}
    <Route path="/perfil-admin" element={<PerfilAdmin />} />
    {/* Agrega más rutas aquí según necesites */}
  </Routes>
);

export default RouterConfig;