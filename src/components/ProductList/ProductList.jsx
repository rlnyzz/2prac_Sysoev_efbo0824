import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductsList.scss';

export default function ProductsList({ products, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <p>Товаров пока нет</p>
        <button className="btn btn--primary">➕ Добавить первый товар</button>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}