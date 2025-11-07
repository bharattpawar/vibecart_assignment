import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, removeFromCart, setShowCheckout }) {
  const navigate = useNavigate();

  return (
    <div className="cart-section">
      <div className="cart-header">
        <h2 className="section-title">Shopping Cart</h2>
        <button className="back-to-shop-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <button className="back-to-shop-btn" onClick={() => navigate('/')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <div className="item-actions">
                  <span className="item-subtotal">₹{item.subtotal.toFixed(2)}</span>
                  <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">₹{parseFloat(cart.total || 0).toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
