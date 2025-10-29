import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Componente para un solo item del carrito
const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          {/* Imagen del producto (opcional, puedes agregarla si está en el objeto item) */}
          {/* <img src={item.imagen} className="img-fluid rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} alt={item.nombre} /> */}
          <div className="ms-3">
            <h6 className="mb-0">{item.nombre}</h6>
            <p className="mb-0">{item.descripcion}</p>
          </div>
        </div>
      </td>
      <td>${item.precio}</td>
      <td>
        <input
          type="number"
          className="form-control"
          value={item.cantidad}
          onChange={handleQuantityChange}
          min="1"
          style={{ width: '80px' }}
        />
      </td>
      <td>${item.precio * item.cantidad}</td>
      <td>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onRemoveItem(item.id)}>
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default function Carrito() {
  // Estado del carrito (simulado por ahora)
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Simular carga de carrito desde localStorage o contexto (aquí se inicializa vacío)
  useEffect(() => {
    // Aquí puedes cargar el carrito desde un contexto o localStorage si lo tienes
    // const savedCart = localStorage.getItem('cart');
    // if (savedCart) setCartItems(JSON.parse(savedCart));

    // Simulación de cálculo de totales
    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    setCartSubtotal(subtotal);
    // Puedes agregar lógica para envío, descuentos, etc. aquí
    setCartTotal(subtotal);
  }, [cartItems]);

  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-container">
          {/* Mensaje de Carrito Vacío */}
          {isCartEmpty ? (
            <div id="cart-empty-message" className="cart-empty-message text-center py-5">
              <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#B0BEC5' }}></i>
              <h3 className="mt-3">Tu carrito está vacío</h3>
              <p>Agrega algunos productos deliciosos para comenzar.</p>
              <Link to="/productos" className="btn btn-primary">Ver Productos</Link>
            </div>
          ) : (
            // Contenido del Carrito
            <div id="cart-content">
              {/* Tabla de Items del Carrito */}
              <div className="table-responsive">
                <table className="table table-borderless align-middle">
                  <thead>
                    <tr>
                      <th scope="col" width="40%">Producto</th>
                      <th scope="col" width="15%">Precio</th>
                      <th scope="col" width="20%">Cantidad</th>
                      <th scope="col" width="15%">Subtotal</th>
                      <th scope="col" width="10%">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="cart-items">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen del Carrito */}
              <div className="row justify-content-end mt-4">
                <div className="col-lg-4">
                  <div className="cart-summary bg-light p-4 rounded">
                    <h4>Resumen del Pedido</h4>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span id="cart-subtotal">${cartSubtotal} CLP</span>
                    </div>
                    {/* Puedes agregar descuentos, envío, etc. aquí */}
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span id="cart-total">${cartTotal} CLP</span>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                      <button className="btn btn-primary" type="button" id="btn-proceed-to-checkout">
                        Proceder al Pago
                      </button>
                      <Link to="/productos" className="btn btn-outline-secondary">
                        Seguir Comprando
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer (puedes reutilizar un componente Footer.jsx aquí si lo tienes) */}
      <div className="container-fluid bg-dark bg-img text-secondary" style={{ marginTop: '135px' }}>
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-4 col-md-6 mt-lg-n5">
              <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 bg-primary border-inner p-4">
                <Link to="/" className="navbar-brand">
                  <h1 className="m-0 text-uppercase text-white">
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