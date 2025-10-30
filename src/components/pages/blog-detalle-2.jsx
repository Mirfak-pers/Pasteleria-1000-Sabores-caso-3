import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogDetalle2() {
  return (
    <div className="blog-detalle-page">
      {/* Header del Blog */}
      <header className="blog-header">
        <div className="container text-center">
          <h1 className="display-4">Formando Nuevos Talentos en Gastronomía</h1>
          <p className="lead">Nuestro compromiso con los futuros chefs de Chile.</p>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container my-5">
        <div className="blog-content">
          <p className="lead">
            En Pastelería 1000 Sabores, creemos que la repostería es más que una profesión: es un arte que se transmite de generación en generación. Por eso, desde hace más de 20 años, hemos establecido una alianza estratégica con <strong>Duoc UC</strong> para formar a los próximos grandes pasteleros de Chile.
          </p>

          <h3>Programa de Prácticas Profesionales</h3>
          <p>
            Cada semestre, recibimos a un grupo selecto de estudiantes de la carrera de Gastronomía de Duoc UC en nuestras cocinas. Aquí, bajo la guía de nuestros maestros pasteleros, aprenden técnicas avanzadas, manejo de ingredientes y el secreto más importante: el amor por lo que se hace.
          </p>

          {/* Asegúrate de que la imagen esté en public/assets/image/ */}
          <img
            src="assets/image/blog-estudiantes-duoc.jpg"
            className="img-fluid rounded shadow my-4"
            alt="Estudiantes de Duoc en la cocina"
          />

          <h3>Tortas Gratis en tu Cumpleaños</h3>
          <p>
            Como un pequeño gesto de cariño, ¡ofrecemos una torta gratis a todos los estudiantes de Duoc UC en su cumpleaños! Solo deben registrarse en nuestra tienda online con su correo institucional (<code>@duoc.cl</code>) y listo. Queremos que celebren sus logros con un dulce recuerdo de nosotros.
          </p>

          <h3>Impacto en la Comunidad</h3>
          <p>
            Muchos de nuestros mejores empleados hoy en día son ex estudiantes de Duoc. Esta alianza no solo enriquece a los jóvenes, sino que también nos permite innovar constantemente, ya que ellos traen nuevas ideas y perspectivas frescas a nuestra cocina.
          </p>

          <blockquote className="blockquote border-start border-4 border-pink p-3 my-4 custom-blockquote">
            <p className="mb-0">
              <em>“Mi pasantía en 1000 Sabores fue el trampolín de mi carrera. Hoy soy jefe de pastelería en un hotel de 5 estrellas, y todo empezó aquí.”</em>
            </p>
            <footer className="blockquote-footer mt-2">María González, Ex alumna Duoc UC</footer>
          </blockquote>

          <h3>¿Quieres ser parte?</h3>
          <p>
            Si eres estudiante de Duoc UC y quieres vivir esta experiencia, ¡no dudes en contactar a tu coordinador de prácticas! Estamos siempre buscando nuevos talentos con pasión por la repostería.
          </p>

          <div className="text-center mt-5">
            {/* Link para volver a la página de blogs */}
            <Link to="/blog" className="btn btn-volver btn-lg px-4">
              ← Volver a Blogs
            </Link>
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