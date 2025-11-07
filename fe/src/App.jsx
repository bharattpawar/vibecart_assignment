import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';

const API_BASE = 'http://localhost:5000/api';

function Header({ user, cart, handleLogout }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <span>🛒</span>
          </div>
          <h1 onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Vibe Commerce</h1>
          <span className="welcome-user">Welcome, {user.username}!</span>
        </div>
        <div className="header-actions">
          {user.role === 'admin' && (
            <button className="admin-btn" onClick={() => navigate('/admin')}>
              Admin Panel
            </button>
          )}
          <button className="cart-button" onClick={() => navigate('/cart')}>
            <span className="cart-badge">{cart.items.length}</span>
            Cart - ₹{parseFloat(cart.total || 0).toFixed(2)}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function Chatbot({ showChat, setShowChat, chatMessages, chatInput, setChatInput, isTyping, sendChatMessage }) {
  return (
    <>
      <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
        {showChat ? '✕' : '💬'}
      </button>

      {showChat && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Shopping Assistant</h3>
            <button onClick={() => setShowChat(false)}>✕</button>
          </div>
          <div className="chatbot-messages">
            {chatMessages.length === 0 && (
              <div className="chat-welcome">
                <p>👋 Hi! I'm Sam, your shopping assistant. How can I help you today?</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isTyping && <div className="chat-message bot"><p>Typing...</p></div>}
          </div>
          <form className="chatbot-input" onSubmit={sendChatMessage}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '' });
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchCart();
    }
  }, [user]);

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/products`);
    setProducts(await res.json());
  };

  const fetchCart = async () => {
    if (!user) return;
    const res = await fetch(`${API_BASE}/cart/${user.userId}`);
    setCart(await res.json());
  };

  const addToCart = async (productId) => {
    await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, productId, quantity: 1 })
    });
    fetchCart();
  };

  const removeFromCart = async (id) => {
    await fetch(`${API_BASE}/cart/${id}`, { method: 'DELETE' });
    fetchCart();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/signup' : '/login';
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data);
        setShowLogin(false);
        setAuthForm({ username: '', password: '' });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Authentication failed');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user.userId, 
        cartItems: cart.items,
        customerInfo: checkoutForm
      })
    });
    const receiptData = await res.json();
    setReceipt(receiptData);
    setShowCheckout(false);
    setCheckoutForm({ name: '', email: '' });
    fetchCart();
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
    setCart({ items: [], total: 0 });
    setShowChat(false);
    setChatMessages([]);
    navigate('/');
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setNewProduct({ name: '', price: '' });
        fetchProducts();
      }
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMsg]);
    const userMessage = chatInput;
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await response.json();
      setChatMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
      
      // Handle navigation if provided
      if (data.navigate) {
        setTimeout(() => {
          navigate(data.navigate);
          setShowChat(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setChatMessages(prev => [...prev, { text: "Sorry, I'm having trouble right now. Please try again!", sender: 'bot' }]);
    }
    setIsTyping(false);
  };

  if (showLogin) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="auth-form">
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleAuth}>
              <input
                type="text"
                placeholder="Username"
                value={authForm.username}
                onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                required
              />
              <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
            </form>
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button type="button" onClick={() => setIsSignup(!isSignup)} className="toggle-auth">
                {isSignup ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header user={user} cart={cart} handleLogout={handleLogout} />
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} setShowCheckout={setShowCheckout} />} />
          <Route path="/admin" element={
            user.role === 'admin' ? (
              <Admin 
                products={products}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                addProduct={addProduct}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
              />
            ) : <Navigate to="/" />
          } />
        </Routes>
      </main>

      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon">
                  <span>💳</span>
                </div>
                <h3>Checkout</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowCheckout(false)}>×</button>
            </div>
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="order-summary">
                <h4>Order Summary</h4>
                {cart.items.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="order-total">
                  <span>Total:</span>
                  <span>₹{parseFloat(cart.total || 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCheckout(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Complete Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {receipt && (
        <div className="modal-overlay" onClick={() => setReceipt(null)}>
          <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon success">
                  <span>✅</span>
                </div>
                <h3>Order Confirmed!</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setReceipt(null)}>×</button>
            </div>
            <div className="receipt-content">
              <div className="receipt-header">
                <h2>VIBE COMMERCE</h2>
                <p>Electronics Store</p>
                <p>📧 support@vibecommerce.com | 📞 +91-9876543210</p>
              </div>
              
              <div className="receipt-section">
                <h4>Order Details</h4>
                <div className="receipt-row">
                  <span>Order ID:</span>
                  <span className="order-id">{receipt.orderId}</span>
                </div>
                <div className="receipt-row">
                  <span>Order Date:</span>
                  <span>{new Date(receipt.timestamp).toLocaleString()}</span>
                </div>
                <div className="receipt-row">
                  <span>Status:</span>
                  <span className="status-confirmed">{receipt.status}</span>
                </div>
              </div>

              <div className="receipt-section">
                <h4>Customer Information</h4>
                <div className="receipt-row">
                  <span>Name:</span>
                  <span>{receipt.customerInfo?.name}</span>
                </div>
                <div className="receipt-row">
                  <span>Email:</span>
                  <span>{receipt.customerInfo?.email}</span>
                </div>
              </div>

              <div className="receipt-section">
                <h4>Items Purchased</h4>
                <div className="receipt-items">
                  {receipt.items?.map((item, index) => (
                    <div key={index} className="receipt-item">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                      </div>
                      <div className="item-pricing">
                        <span className="unit-price">₹{item.unitPrice} each</span>
                        <span className="item-total">₹{item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="receipt-section">
                <h4>Payment Summary</h4>
                <div className="receipt-row">
                  <span>Subtotal:</span>
                  <span>₹{receipt.subtotal}</span>
                </div>
                <div className="receipt-row">
                  <span>GST (18%):</span>
                  <span>₹{receipt.tax}</span>
                </div>
                <div className="receipt-row total-row">
                  <span>Total Amount:</span>
                  <span className="amount">₹{receipt.total}</span>
                </div>
                <div className="receipt-row">
                  <span>Payment Method:</span>
                  <span>{receipt.paymentMethod}</span>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Thank you for shopping with Vibe Commerce!</p>
                <p>Your order will be delivered within 3-5 business days.</p>
                <p>For support, contact us at support@vibecommerce.com</p>
              </div>
              
              <div className="receipt-actions">
                <button className="continue-shopping-btn" onClick={() => setReceipt(null)}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Chatbot 
        showChat={showChat}
        setShowChat={setShowChat}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isTyping={isTyping}
        sendChatMessage={sendChatMessage}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
