import React from 'react';
import MainTemplate from '../templates/MainTemplate';
import Title from '../atoms/Title';
import Image from '../atoms/Image';

const Home = () => {
  return (
    <MainTemplate>
      <div className="home">
        <Title text="Bienvenido a Pastelería 1000 Sabores" level={1} />
        <Image src="banner.jpg" alt="Banner" />
        <p>Deliciosos pasteles para todos los gustos.</p>
      </div>
    </MainTemplate>
  );
};

export default Home;