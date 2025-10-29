import React, { useContext } from 'react'; // Importa useContext si usas UserContext
import { Link } from 'react-router-dom';
// Opcional: importa tu logo si lo tienes como imagen
// import logo from '../../assets/img/logo.png';

// Opcional: Si tienes un UserContext para manejar la sesión
// import { UserContext } from '../../contexts/UserContext';

export default function Header() {
  // Opcional: const { user, logout } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg bg-light navbar-light shadow-sm py-2 px-3 px-lg-4">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <i className="fas fa-birthday-cake me-2" style={{ color: '#8B4513' }}></i>
          <span style={{ color: '#8B4513', fontFamily: "'Pacifico', cursive" }}>
            Mil Sabores
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {/* Menú principal (izquierda) */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/productos" className="nav-link">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacto" className="nav-link">
                Contacto
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/nosotros" className="nav-link">
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link">
                Blog
              </Link>
            </li>
          </ul>

          {/* Derecha: Carrito + Login + Registro */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Carrito: visible en todos los tamaños */}
            <li className="nav-item">
              <Link to="/carrito" className="nav-link">
                <i className="fas fa-shopping-cart me-1"></i> Carrito
              </Link>
            </li>
            {/* Opcional: Botón de Cerrar Sesión si el usuario está logueado */}
            {/* 
            {user ? (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={logout}>
                  Cerrar Sesión
                </button>
              </li>
            ) : ( */}
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/registro" className="nav-link">
                    Registro
                  </Link>
                </li>
              </>
            {/* )} */}
          </ul>
        </div>
      </div>
    </nav>
  );
}