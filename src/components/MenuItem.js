import React from 'react';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="menu-item">
      {item.image && (
        <img src={item.image} alt={item.name} className="menu-item-image" />
      )}
      <div className="menu-item-content">
        <h3 className="menu-item-name">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-price">${item.price.toFixed(2)}</span>
          <button 
            className="add-to-cart-btn" 
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;