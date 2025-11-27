import React from 'react';
import MainTemplate from '../templates/MainTemplate';
import Title from '../atoms/Title';

const About = () => {
  return (
    <MainTemplate>
      <div className="about">
        <Title text="Sobre Nosotros" level={1} />
        <p>
          En Pastelería 1000 Sabores, nos dedicamos a crear pasteles artesanales
          con los mejores ingredientes y sabores únicos para cada ocasión.
        </p>
      </div>
    </MainTemplate>
  );
};

export default About;