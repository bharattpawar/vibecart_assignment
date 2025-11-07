const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Product Schema
const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);



// POST /api/signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const user = await User.create({ username, password });
    res.json({ message: 'User created successfully', userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful', userId: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0, __v: 0 }).lean();
    const formattedProducts = products.map(p => ({ id: p.productId, name: p.name, price: p.price }));
    res.json(formattedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart
app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const existingItem = await Cart.findOne({ userId, productId });
    
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      res.json({ message: 'Cart updated' });
    } else {
      await Cart.create({ userId, productId, quantity });
      res.json({ message: 'Item added to cart' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cart/:userId
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId });
    const items = [];
    
    for (const cartItem of cartItems) {
      const product = await Product.findOne({ productId: cartItem.productId });
      if (product) {
        const subtotal = cartItem.quantity * product.price;
        items.push({
          id: cartItem._id,
          quantity: cartItem.quantity,
          name: product.name,
          price: product.price,
          subtotal
        });
      }
    }
    
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items, total: total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/checkout
app.post('/api/checkout', async (req, res) => {
  try {
    const { userId, cartItems, customerInfo } = req.body;
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = total * 0.18; // 18% GST
    const finalTotal = total + tax;
    
    // Clear user's cart after checkout
    await Cart.deleteMany({ userId });
    
    res.json({
      message: 'Checkout successful',
      orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerInfo,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.subtotal
      })),
      subtotal: total.toFixed(2),
      tax: tax.toFixed(2),
      total: finalTotal.toFixed(2),
      timestamp: new Date().toISOString(),
      paymentMethod: 'Cash on Delivery',
      status: 'Confirmed'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Product Management APIs
// POST /api/admin/products
app.post('/api/admin/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    const lastProduct = await Product.findOne().sort({ productId: -1 });
    const newProductId = lastProduct ? lastProduct.productId + 1 : 1;
    
    const product = await Product.create({ productId: newProductId, name, price });
    res.json({ message: 'Product created', product: { id: product.productId, name: product.name, price: product.price } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/products/:id
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    
    await Product.findOneAndUpdate({ productId: id }, { name, price });
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/products/:id
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({ productId: id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Context: You are Sam, a human shopping assistant at Vibe Commerce electronics store. Be friendly and helpful.

Products Available:
- Wireless Headphones - ₹99.99 (Noise cancelling, 20hr battery)
- Smartphone Case - ₹24.99 (Durable protection, multiple colors)
- Bluetooth Speaker - ₹79.99 (Waterproof, great sound)
- USB Cable - ₹12.99 (Fast charging, durable)
- Power Bank - ₹49.99 (10000mAh, portable)
- Screen Protector - ₹9.99 (Tempered glass, easy install)
- Wireless Charger - ₹34.99 (Fast charging, compatible)

Navigation Instructions:
- If customer wants to go to cart page, end your response with: NAVIGATE:/cart
- If customer wants to go to admin panel, end your response with: NAVIGATE:/admin
- If customer wants to go to home/shop/products page, end your response with: NAVIGATE:/
- Only add NAVIGATE: when customer explicitly asks to go somewhere

Guidelines:
- You're human, not AI
- Keep answers brief and helpful
- Focus on product recommendations and store info
- Never mention AI systems

Customer: ${message}
Sam:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Parse navigation from AI response
    const navMatch = text.match(/NAVIGATE:(\/[\w]*)/i);
    if (navMatch) {
      const cleanText = text.replace(/NAVIGATE:\/[\w]*/i, '').trim();
      return res.json({ reply: cleanText, navigate: navMatch[1] });
    }
    
    res.json({ reply: text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});