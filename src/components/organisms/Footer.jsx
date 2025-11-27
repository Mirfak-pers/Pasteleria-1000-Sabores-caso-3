import React from 'react';
import { APP_CONFIG } from '../../config';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} {APP_CONFIG.NAME}</p>
      <p>Contacto: {APP_CONFIG.CONTACT_EMAIL}</p>
    </footer>
  );
};

export default Footer;