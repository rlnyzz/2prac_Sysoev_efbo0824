import React, { useState, useEffect } from 'react';
import './ProductModal.scss';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    if (open && initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        category: initialProduct.category || '',
        description: initialProduct.description || '',
        price: initialProduct.price || '',
        stock: initialProduct.stock || ''
      });
    } else if (open) {
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        stock: ''
      });
    }
  }, [open, initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Введите название товара');
      return;
    }
    if (!formData.category.trim()) {
      alert('Введите категорию');
      return;
    }
    if (!formData.description.trim()) {
      alert('Введите описание');
      return;
    }
    
    const price = Number(formData.price);
    if (!Number.isFinite(price) || price < 0) {
      alert('Введите корректную цену');
      return;
    }
    
    const stock = Number(formData.stock);
    if (!Number.isFinite(stock) || stock < 0) {
      alert('Введите корректное количество');
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      price: price,
      stock: stock
    });
  };

  if (!open) return null;

  const title = mode === 'edit' ? 'Редактировать товар' : 'Новый товар';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название товара *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например: Ноутбук ASUS"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label>Категория *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Например: Ноутбуки"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Подробное описание товара..."
              rows="3"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1000"
                min="0"
                step="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Количество *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                min="0"
                step="1"
                required
              />
            </div>
          </div>
          
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === 'edit' ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}