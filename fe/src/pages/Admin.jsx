import React from 'react';
import { useNavigate } from 'react-router-dom';

function Admin({ products, newProduct, setNewProduct, addProduct, editingProduct, setEditingProduct, updateProduct, deleteProduct }) {
  const navigate = useNavigate();

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <div className="add-product-form">
        <h3>Add New Product</h3>
        <form onSubmit={addProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            required
          />
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className="products-management">
        <h3>Manage Products</h3>
        {products.map(product => (
          <div key={product.id} className="admin-product-item">
            {editingProduct === product.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  defaultValue={product.name}
                  onBlur={(e) => updateProduct(product.id, { name: e.target.value, price: product.price })}
                />
                <input
                  type="number"
                  step="0.01"
                  defaultValue={product.price}
                  onBlur={(e) => updateProduct(product.id, { name: product.name, price: e.target.value })}
                />
                <button onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            ) : (
              <div className="product-info">
                <span>{product.name} - ₹{product.price}</span>
                <div className="admin-actions">
                  <button onClick={() => setEditingProduct(product.id)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button onClick={() => navigate('/')} className="back-btn">Back to Shop</button>
    </div>
  );
}

export default Admin;
