import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Opcional: Si tienes un servicio para productos
// import { getProducts } from '../../services/productService';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Opcional: Cargar productos desde Firebase
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const data = await getProducts();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error('Error al cargar productos:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  // Por ahora, dejamos el contenido estático del HTML
  return (
    <div className="home-page">
      {/* Sección "Sobre Nosotros" */}
      <div className="container-fluid pt-5">
        <div className="container">
          <div className="section-title position-relative text-center mx-auto mb-5 text-secondary pb-3" style={{ maxWidth: '600px' }}>
            <h2 className="text-primary font-secondary">Sobre Nosotros</h2>
            <h1 className="display-4 text-uppercase">Bienvenidos a Pastelería Mil Sabores</h1>
          </div>
          <div className="row gx-5">
            <div className="col-lg-6 pb-5">
              <div>
                <h4 className="mb-4">Nuestra misión es ofrecer una experiencia dulce y memorable.</h4>
                <p className="text-body">
                  Ofrecemos tortas y productos de repostería de alta calidad para todas las ocasiones,
                  celebrando nuestras raíces históricas y fomentando la creatividad.
                  Conocida por nuestro récord Guinness en 1995, renovamos nuestra tienda online
                  para brindarte lo mejor.
                </p>
              </div>
            </div>
            <div className="col-lg-5 mb-5 text-secondary mb-lg-0" style={{ minHeight: '400px' }}>
              <div className="position-relative h-100">
                <img
                  className="position-absolute w-100 h-100"
                  src="assets/image/about.jpg" // Asegúrate de que esta imagen esté en public/assets/image/
                  style={{ objectFit: 'cover' }}
                  alt="Nuestra Pastelería"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Productos (Dinámica o Placeholder) */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="section-title position-relative text-center mx-auto mb-5 pb-3" style={{ maxWidth: '600px' }}>
            <h2 className="text-primary font-secondary">Productos Destacados</h2>
            <h1 className="display-4 text-uppercase">Lo más Dulce</h1>
          </div>

          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <div id="products-container" className="row">
              {/* Ejemplo de tarjeta de producto (deberás reemplazarlo con un mapeo de `products`) */}
              {/* {products.length > 0 ? (
                products.map((producto) => (
                  <div key={producto.id} className="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <div className="card">
                      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
                      <div className="card-body">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <p className="card-text">{producto.descripcion}</p>
                        <p className="card-text">$ {producto.precio}</p>
                        <button className="btn btn-primary">Agregar al Carrito</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : ( */}
                <p>No hay productos disponibles en este momento.</p>
              {/* )} */}
            </div>
          )}
        </div>
      </div>

      {/* Footer (Puedes crear un componente Footer.jsx aparte) */}
      <div className="container-fluid bg-dark bg-img text-secondary" style={{ marginTop: '135px' }}>
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-4 col-md-6 mt-lg-n5">
              <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 bg-primary border-inner p-4">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                  {/* Asegúrate de tener el logo en public/assets/image/ */}
                  <img src="assets/image/logo.jpg" alt="Mil Sabores Logo" height="30" />
                </Link>
                <p className="mt-3">
                  Celebramos 50 años de dulzura, tradición e innovación. Cada torta y postre es una obra de arte hecha con amor,
                  ingredientes de primera calidad y la pasión que nos caracteriza desde 1974.
                  ¡Descubre por qué somos un referente en la repostería chilena!
                </p>
              </div>
            </div>
            <div className="col-lg-8 col-md-6">
              <div className="row gx-5">
                <div className="col-lg-4 col-md-12 pt-5 mb-5">
                  <h4 className="text-primary text-uppercase mb-4">Ponte en Contacto</h4>
                  <div className="d-flex mb-2">
                    <i className="bi bi-geo-alt text-primary me-2"></i>
                    <p className="mb-0">Av. Siempre Viva 123, Santiago, Chile</p>
                  </div>
                  <div className="d-flex mb-2">
                    <i className="bi bi-envelope-open text-primary me-2"></i>
                    <p className="mb-0">contacto@milsabores.cl</p>
                  </div>
                  <div className="d-flex mb-2">
                    <i className="bi bi-telephone text-primary me-2"></i>
                    <p className="mb-0">+56 2 2345 6789</p>
                  </div>
                  <div className="d-flex mt-4">
                    <a className="btn btn-lg btn-primary btn-lg-square border-inner rounded-0 me-2" href="#">
                      <i className="fab fa-twitter fw-normal"></i>
                    </a>
                    <a className="btn btn-lg btn-primary btn-lg-square border-inner rounded-0 me-2" href="#">
                      <i className="fab fa-facebook-f fw-normal"></i>
                    </a>
                    <a className="btn btn-lg btn-primary btn-lg-square border-inner rounded-0 me-2" href="#">
                      <i className="fab fa-instagram fw-normal"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                  <h4 className="text-primary text-uppercase mb-4">Enlaces Rápidos</h4>
                  <div className="d-flex flex-column justify-content-start">
                    <Link to="/" className="text-secondary mb-2">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Inicio
                    </Link>
                    <Link to="/productos" className="text-secondary mb-2">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Productos
                    </Link>
                    <Link to="/nosotros" className="text-secondary mb-2">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Nosotros
                    </Link>
                    <Link to="/contacto" className="text-secondary mb-2">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Contacto
                    </Link>
                    <Link to="/blog" className="text-secondary mb-2">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Blog
                    </Link>
                    <Link to="/carrito" className="text-secondary mb-2">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Carrito
                    </Link>
                    <Link to="/login" className="text-secondary">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Iniciar Sesión
                    </Link>
                    <Link to="/registro" className="text-secondary">
                      <i className="bi bi-arrow-right text-primary me-2"></i>Registro
                    </Link>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                  <h4 className="text-primary text-uppercase mb-4">Boletín Informativo</h4>
                  <p>
                    ¡Suscríbete y recibe un 10% de descuento en tu primera compra! Entérate de nuestras nuevas recetas,
                    promociones y eventos especiales.
                  </p>
                  <form>
                    <div className="input-group">
                      <input type="text" className="form-control border-white p-3" placeholder="Tu Correo Electrónico" />
                      <button className="btn btn-primary">Suscríbete</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid text-secondary py-4" style={{ background: '#111111' }}>
        <div className="container text-center">
          <p className="mb-0">
            &copy; <a className="text-white border-bottom" href="#">Pastelería Mil Sabores</a>. Todos los Derechos Reservados.
          </p>
        </div>
      </div>
    </div>
  );
}