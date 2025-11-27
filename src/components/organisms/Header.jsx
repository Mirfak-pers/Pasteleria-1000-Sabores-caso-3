import React from 'react';
import Image from '../atoms/Image';

const Header = () => {
  return (
    <header className="header">
      <Image src="logo.png" alt="Logo" className="logo" />
      <nav>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;