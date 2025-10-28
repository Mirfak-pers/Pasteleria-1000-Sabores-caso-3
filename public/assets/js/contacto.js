// js/contacto.js

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (name && email && message) {
        alert('¡Gracias por tu mensaje!');
        contactForm.reset();
      } else {
        alert('Por favor, completa todos los campos.');
      }
    });
  }
});