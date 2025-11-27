import React from 'react';
import MainTemplate from '../templates/MainTemplate';
import ProductList from '../organisms/ProductList';

const Products = () => {
  return (
    <MainTemplate>
      <div className="products">
        <h1>Productos</h1>
        <ProductList />
      </div>
    </MainTemplate>
  );
};

export default Products;