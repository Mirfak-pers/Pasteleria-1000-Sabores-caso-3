import React from 'react';
import Image from '../atoms/Image';
import Title from '../atoms/Title';
import { formatCurrency } from '../../utils/helpers';

const ProductCard = ({ name, image, price }) => {
  return (
    <div className="product-card">
      <Image src={image} alt={name} />
      <Title text={name} level={3} />
      <p>{formatCurrency(price)}</p>
    </div>
  );
};

export default ProductCard;