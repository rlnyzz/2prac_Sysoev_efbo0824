import React from 'react';
import './ProductCard.scss';

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-card__header">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-category">{product.category}</span>
      </div>
      
      <p className="product-description">{product.description}</p>
      
      <div className="product-details">
        <div className="product-price">{product.price.toLocaleString()} ₽</div>
        <div className={`product-stock ${product.stock < 5 ? 'low-stock' : ''}`}>
          {product.stock} шт.
        </div>
      </div>
      
      <div className="product-actions">
        <button className="btn btn--edit" onClick={() => onEdit(product)}>
          ✏️ Ред.
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
          🗑️ Удалить
        </button>
      </div>
    </div>
  );
}