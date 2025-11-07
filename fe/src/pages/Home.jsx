import React from 'react';

function Home({ products, addToCart }) {
  return (
    <div className="products-section">
      <h2 className="section-title">Featured Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <div className="image-placeholder">
                <span>📦</span>
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{product.price}</p>
              <button className="add-to-cart-btn" onClick={() => addToCart(product.id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
