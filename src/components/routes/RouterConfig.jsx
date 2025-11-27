import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../components/pages/Home';
import Products from '../components/pages/Products';
import Contact from '../components/pages/Contact';
import About from '../components/pages/About';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/nosotros" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;