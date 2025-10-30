import React from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  return (
    <div className="blog-page">
      {/* Contenido Principal */}
      <main className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-4">Nuestros Blogs</h1>
          <p className="lead">Descubre historias, recetas y consejos detrás de nuestros deliciosos productos.</p>
        </div>

        <div className="d-flex flex-wrap gap-4 justify-content-center">
          {/* Tarjeta de Blog 1 */}
          <div
            className="blog-card-horizontal d-flex align-items-center p-3 bg-light border rounded"
            style={{ maxWidth: '100%', width: '100%', minHeight: '200px' }}
          >
            <div className="flex-grow-1 me-4">
              <h3 className="blog-title mb-2">CASO CURIOSO #1</h3>
              <p className="blog-excerpt mb-3" style={{ fontSize: '0.9rem', color: '#666' }}>
                Nuestra torta Guinness entró al Libro Guinness en 1995. Descubre cómo lo logramos.
              </p>
              {/* Asegúrate de que la ruta /blog-detalle-1 exista o apunte a donde corresponda */}
              <Link to="/blog-detalle-1" className="btn btn-outline-primary btn-sm">
                VER CASO
              </Link>
            </div>
            <div>
              {/* Asegúrate de que la imagen esté en public/assets/image/ */}
              <img
                src="assets/image/blog-torta-guinness.jpg"
                className="img-fluid rounded"
                alt="Torta Récord Guinness"
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Tarjeta de Blog 2 */}
          <div
            className="blog-card-horizontal d-flex align-items-center p-3 bg-light border rounded"
            style={{ maxWidth: '100%', width: '100%', minHeight: '200px' }}
          >
            <div className="flex-grow-1 me-4">
              <h3 className="blog-title mb-2">CASO CURIOSO #2</h3>
              <p className="blog-excerpt mb-3" style={{ fontSize: '0.9rem', color: '#666' }}>
                Apoyamos a estudiantes de Duoc UC con prácticas y tortas gratis. ¡Invertimos en el futuro!
              </p>
              {/* Asegúrate de que la ruta /blog-detalle-2 exista o apunte a donde corresponda */}
              <Link to="/blog-detalle-2" className="btn btn-outline-primary btn-sm">
                VER CASO
              </Link>
            </div>
            <div>
              {/* Asegúrate de que la imagen esté en public/assets/image/ */}
              <img
                src="assets/image/blog-estudiantes-duoc.jpg"
                className="img-fluid rounded"
                alt="Estudiantes de Duoc"
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer (puedes reutilizar un componente Footer.jsx aquí si lo tienes) */}
      <div className="container-fluid bg-dark bg-img text-secondary" style={{ marginTop: '135px' }}>
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-4 col-md-6 mt-lg-n5">
              <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 bg-primary border-inner p-4">
                <Link to="/" className="navbar-brand">
                  <h1 className="m-0  text-white">
                    <i className="fa fa-birthday-cake fs-1 text-dark me-3"></i>Mil Sabores
                  </h1>
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
                  <h4 className="text-primary  mb-4">Ponte en Contacto</h4>
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
                  <h4 className="text-primary  mb-4">Enlaces Rápidos</h4>
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
                  <h4 className="text-primary  mb-4">Boletín Informativo</h4>
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