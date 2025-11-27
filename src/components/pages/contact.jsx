import React from 'react';
import MainTemplate from '../templates/MainTemplate';
import Title from '../atoms/Title';

const Contact = () => {
  return (
    <MainTemplate>
      <div className="contact">
        <Title text="Contáctanos" level={1} />
        <p>¿Tienes alguna pregunta? Escríbenos a: info@pasteleria1000sabores.com</p>
      </div>
    </MainTemplate>
  );
};

export default Contact;