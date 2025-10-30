import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contacto() {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });
  const [errors, setErrors] = useState({});

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Limpiar error específico si el usuario escribe
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Validar el formulario
  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido.';
    }

    if (!formData.comentario.trim()) {
      newErrors.comentario = 'El comentario es obligatorio.';
    }

    return newErrors;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Aquí puedes agregar la lógica para enviar el formulario (por ejemplo, a una API o Firebase)
    alert('¡Mensaje enviado con éxito! Gracias por contactarnos.');
    setFormData({ nombre: '', correo: '', comentario: '' }); // Resetear form
    setErrors({}); // Limpiar errores
  };

  return (
    <div className="contact-page">
      {/* Contact Start */}
      <div className="container-fluid contact position-relative px-5" style={{ marginTop: '90px' }}>
        <div className="container">
          <div className="row g-5 mb-5">
            <div className="col-lg-4 col-md-6">
              <div className="bg-primary border-inner text-center text-white p-5">
                <i className="bi bi-geo-alt fs-1 text-white"></i>
                <h6 className=" my-2">Nuestra Pastelería</h6>
                <span>Av. Siempre Viva 123, Santiago, Chile</span>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="bg-primary border-inner text-center text-white p-5">
                <i className="bi bi-envelope-open fs-1 text-white"></i>
                <h6 className=" my-2">Escríbenos</h6>
                <span>contacto@milsabores.cl</span>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="bg-primary border-inner text-center text-white p-5">
                <i className="bi bi-phone-vibrate fs-1 text-white"></i>
                <h6 className=" my-2">Llámanos</h6>
                <span>+56 2 2345 6789</span>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <form id="formContacto" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <input
                      type="text"
                      className={`form-control bg-light border-0 px-4 ${errors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu Nombre"
                      style={{ height: '55px' }}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-sm-6">
                    <input
                      type="email"
                      className={`form-control bg-light border-0 px-4 ${errors.correo ? 'is-invalid' : ''}`}
                      id="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="Tu Correo Electrónico"
                      style={{ height: '55px' }}
                    />
                    {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                  </div>
                  <div className="col-sm-12">
                    <input
                      type="text"
                      className="form-control bg-light border-0 px-4"
                      placeholder="Asunto"
                      style={{ height: '55px' }}
                      // No se valida el asunto en este ejemplo
                    />
                  </div>
                  <div className="col-sm-12">
                    <textarea
                      className={`form-control bg-light border-0 px-4 py-3 ${errors.comentario ? 'is-invalid' : ''}`}
                      id="comentario"
                      value={formData.comentario}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tu Mensaje"
                    ></textarea>
                    {errors.comentario && <div className="invalid-feedback">{errors.comentario}</div>}
                  </div>
                  <div className="col-sm-12">
                    <button className="btn btn-primary border-inner w-100 py-3" type="submit">
                      Enviar Mensaje
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}

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