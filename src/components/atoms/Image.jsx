import React from 'react';

const Image = ({ src, alt, className }) => {
  return (
    <img src={`/assets/img/${src}`} alt={alt} className={className} />
  );
};

export default Image;