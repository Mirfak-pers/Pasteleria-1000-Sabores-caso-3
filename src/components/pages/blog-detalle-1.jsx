import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogDetalle1() {
  return (
    <div className="blog-detalle-page">
      {/* Header del Blog */}
      <header className="blog-header">
        <div className="container text-center">
          <h1 className="display-4">La Torta que Entró en el Libro Guinness</h1>
          <p className="lead">Una hazaña dulce que marcó la historia de Chile y nuestra pastelería.</p>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container my-5">
        <div className="blog-content">
          <p className="lead">
            En 1995, nuestra humilde pastelería tuvo el honor de participar en un evento que cambiaría nuestra historia para siempre: la creación de <strong>la torta más grande del mundo</strong>, reconocida oficialmente por el Libro Guinness de los Récords.
          </p>

          <h3>¿Cómo surgió la idea?</h3>
          <p>
            Todo comenzó como un sueño loco de un grupo de pasteleros apasionados. Queríamos hacer algo grande, algo que pusiera a Chile en el mapa mundial de la repostería. Después de meses de planificación, logística y mucho, mucho chocolate, nació el proyecto.
          </p>

          <h3>Los números que asombran</h3>
          <ul>
            <li><strong>Peso total:</strong> Más de 12 toneladas.</li>
            <li><strong>Dimensiones:</strong> 8 metros de largo por 4 metros de ancho.</li>
            <li><strong>Ingredientes:</strong> 5,000 litros de leche, 2 toneladas de harina, 1.5 toneladas de azúcar y 800 kg de chocolate.</li>
            <li><strong>Equipo:</strong> 50 pasteleros trabajando sin parar durante 72 horas.</li>
          </ul>

          <h3>El día del récord</h3>
          <p>
            El evento se realizó en el Estadio Nacional, ante miles de espectadores. Fue un día de nervios, emoción y orgullo. Cuando el juez oficial del Guinness anunció que habíamos roto el récord, las lágrimas de alegría no se hicieron esperar. No solo era un logro para nosotros, sino para toda la comunidad pastelera chilena.
          </p>

          {/* Asegúrate de que la imagen esté en public/assets/image/ */}
          <img
            src="assets/image/blog-torta-guinness.jpg"
            className="img-fluid rounded shadow my-4"
            alt="Torta Récord Guinness"
          />

          <h3>El legado</h3>
          <p>
            Ese día no solo creamos una torta, creamos una leyenda. Hoy, 50 años después, seguimos inspirados por ese espíritu de superación y pasión. Cada torta que sale de nuestra cocina lleva un pedacito de esa hazaña. ¡Gracias a todos los que han sido parte de esta dulce historia!
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