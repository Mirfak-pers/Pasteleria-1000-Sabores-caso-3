// src/components/routes/RouterConfig.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import PerfilCliente from '../pages/perfilCliente';
import PerfilAdmin from '../pages/perfilAdmin';
import Productos from '../pages/productos';
import Contacto from '../pages/contacto';
import About from '../pages/about';
import Blog from '../pages/blog';
import BlogDetalle1 from '../pages/blog-detalle-1';
import BlogDetalle2 from '../pages/blog-detalle-2';
import Carrito from '../pages/carrito'; // ✅ Solo una vez
import Login from '../pages/login';
import Registro from '../pages/registro';
import Catalogo from '../pages/catalogo';
import Checkout from '../pages/checkout';
import CompraExitosa from '../pages/compraExitosa';
import ErrorPago from '../pages/errorPago';

const RouterConfig = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/productos" element={<Productos />} />
    <Route path="/contacto" element={<Contacto />} />
    <Route path="/nosotros" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog-detalle-1" element={<BlogDetalle1 />} />
    <Route path="/blog-detalle-2" element={<BlogDetalle2 />} />
    <Route path="/carrito" element={<Carrito />} /> {/* ✅ Corregido */}
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Registro />} />
    <Route path="/perfil-cliente" element={<PerfilCliente />} />
    <Route path="/perfil-admin" element={<PerfilAdmin />} />
    <Route path="/catalogo" element={<Catalogo />} /> {/* ✅ Corregido */}
    <Route path="/checkout" element={<Checkout />} /> {/* ✅ Corregido */}
    <Route path="/exito" element={<CompraExitosa />} /> {/* ✅ Corregido */}
    <Route path="/error" element={<ErrorPago />} /> {/* ✅ Corregido */}
  </Routes>
);

export default RouterConfig;