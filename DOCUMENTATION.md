# Vibe Commerce - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [AI Chatbot Integration](#ai-chatbot-integration)
9. [Setup Instructions](#setup-instructions)
10. [User Roles](#user-roles)
11. [Security Considerations](#security-considerations)

---

## Overview

Vibe Commerce is a full-stack e-commerce shopping cart application built with the MERN stack (MongoDB, Express, React, Node.js). It features user authentication, role-based access control, product management, shopping cart functionality, checkout process, and an AI-powered shopping assistant.

**Live URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **CSS3** - Styling with modern dark theme
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Google Generative AI (Gemini 2.5 Flash)** - AI chatbot

### Database
- **MongoDB Atlas** - Cloud database
- **Connection String**: `mongodb+srv://bhara:bhara@cart.gafghwk.mongodb.net/vibecommerce`

---

## Features

### 1. User Authentication
- **Sign Up**: Create new user account with username and password
- **Login**: Authenticate existing users
- **Session Management**: User data persisted in state
- **Logout**: Clear session and redirect to login

### 2. Product Catalog
- Display 7 pre-seeded electronics products
- Product information: Name, Price (in ₹), Description
- Grid layout with modern card design
- Add to cart functionality from product cards

**Available Products:**
1. Wireless Headphones - ₹99.99
2. Smartphone Case - ₹24.99
3. Bluetooth Speaker - ₹79.99
4. USB Cable - ₹12.99
5. Power Bank - ₹49.99
6. Screen Protector - ₹9.99
7. Wireless Charger - ₹34.99

### 3. Shopping Cart
- **Add Items**: Add products with quantity tracking
- **Remove Items**: Delete items from cart
- **Quantity Management**: Automatic quantity increment for duplicate items
- **Real-time Total**: Calculate and display cart total
- **Cart Badge**: Show item count in header
- **User-Specific**: Each user has their own cart

### 4. Checkout Process
- **Modal Form**: Name and email collection
- **Order Summary**: Review items and total before purchase
- **Order Confirmation**: Receipt with Order ID, total, and timestamp
- **Cart Clearing**: Automatic cart reset after successful checkout

### 5. Admin Panel (Admin Role Only)
- **Add Products**: Create new products with name and price
- **Edit Products**: Update existing product details
- **Delete Products**: Remove products from catalog
- **Protected Route**: Only accessible to admin users

### 6. AI Shopping Assistant
- **Chatbot Interface**: Floating chat widget
- **Google Gemini AI**: Powered by gemini-2.5-flash model
- **Product Recommendations**: AI suggests products based on queries
- **Navigation Capability**: AI can redirect users to cart/admin/home pages
- **Persona**: "Sam" - friendly human shopping assistant
- **Context-Aware**: Knows all product details and prices

### 7. Responsive Design
- Modern dark theme with purple accents
- Mobile-friendly layout
- Smooth animations and transitions
- Glassmorphism effects
- Hover states and visual feedback

### 8. Routing System
- **/** - Home page with product catalog
- **/cart** - Shopping cart page
- **/admin** - Admin panel (protected route)

---

## Architecture

### Frontend Architecture
```
fe/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.jsx             # Main component with routing
│   ├── App.css             # Global styles
│   ├── index.js            # React entry point
│   └── pages/
│       ├── Home.jsx        # Product catalog page
│       ├── Cart.jsx        # Shopping cart page
│       └── Admin.jsx       # Admin panel page
└── package.json            # Frontend dependencies
```

### Backend Architecture
```
be/
├── server.js               # Express server with all routes
├── seedProducts.js         # Database seeding script
├── .env                    # Environment variables
├── mongodb-setup.md        # Database setup guide
└── package.json            # Backend dependencies
```

### Component Hierarchy
```
App (BrowserRouter)
└── AppContent
    ├── Header
    │   ├── Logo
    │   ├── Welcome Message
    │   ├── Admin Button (conditional)
    │   ├── Cart Button
    │   └── Logout Button
    ├── Routes
    │   ├── Home (/)
    │   ├── Cart (/cart)
    │   └── Admin (/admin)
    ├── Checkout Modal (conditional)
    ├── Receipt Modal (conditional)
    └── Chatbot
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  password: String (required),
  role: String (enum: ['user', 'admin'], default: 'user')
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  productId: Number (required, unique),
  name: String (required),
  price: Number (required)
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  productId: Number (required),
  quantity: Number (required, default: 1)
}
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/signup
Create new user account
```json
Request: { "username": "john", "password": "pass123" }
Response: { "message": "User created successfully", "userId": "...", "role": "user" }
```

#### POST /api/login
Authenticate user
```json
Request: { "username": "john", "password": "pass123" }
Response: { "message": "Login successful", "userId": "...", "username": "john", "role": "user" }
```

### Product Endpoints

#### GET /api/products
Get all products
```json
Response: [
  { "id": 1, "name": "Wireless Headphones", "price": 99.99 },
  ...
]
```

### Cart Endpoints

#### POST /api/cart
Add item to cart
```json
Request: { "userId": "...", "productId": 1, "quantity": 1 }
Response: { "message": "Item added to cart" }
```

#### GET /api/cart/:userId
Get user's cart
```json
Response: {
  "items": [
    { "id": "...", "name": "...", "price": 99.99, "quantity": 2, "subtotal": 199.98 }
  ],
  "total": "199.98"
}
```

#### DELETE /api/cart/:id
Remove item from cart
```json
Response: { "message": "Item removed from cart" }
```

### Checkout Endpoint

#### POST /api/checkout
Process checkout
```json
Request: { "userId": "...", "cartItems": [...] }
Response: {
  "message": "Checkout successful",
  "total": "199.98",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "orderId": "abc123xyz"
}
```

### Admin Endpoints

#### POST /api/admin/products
Create new product (Admin only)
```json
Request: { "name": "New Product", "price": 49.99 }
Response: { "message": "Product created", "product": {...} }
```

#### PUT /api/admin/products/:id
Update product (Admin only)
```json
Request: { "name": "Updated Name", "price": 59.99 }
Response: { "message": "Product updated" }
```

#### DELETE /api/admin/products/:id
Delete product (Admin only)
```json
Response: { "message": "Product deleted" }
```

### AI Chatbot Endpoint

#### POST /api/chat
Chat with AI assistant
```json
Request: { "message": "Tell me about headphones" }
Response: { 
  "reply": "Our Wireless Headphones are great...",
  "navigate": "/cart" (optional)
}
```

---

## Frontend Components

### 1. App.jsx (Main Component)
**State Management:**
- `user` - Current logged-in user
- `products` - Product catalog
- `cart` - Shopping cart items and total
- `showLogin` - Toggle login/signup screen
- `showCheckout` - Toggle checkout modal
- `receipt` - Order confirmation data
- `showChat` - Toggle chatbot
- `chatMessages` - Chat history

**Key Functions:**
- `fetchProducts()` - Load products from API
- `fetchCart()` - Load user's cart
- `addToCart(productId)` - Add product to cart
- `removeFromCart(id)` - Remove item from cart
- `handleAuth()` - Login/signup handler
- `handleCheckout()` - Process order
- `handleLogout()` - Clear session
- `sendChatMessage()` - Send message to AI

### 2. Header Component
**Features:**
- Logo with home navigation
- Welcome message with username
- Admin panel button (admin only)
- Cart button with badge and total
- Logout button

### 3. Home.jsx (Product Catalog)
**Features:**
- Grid layout of products
- Product cards with name, price, description
- Add to cart buttons
- Hover animations

### 4. Cart.jsx (Shopping Cart)
**Features:**
- List of cart items
- Quantity and subtotal display
- Remove item buttons
- Total calculation
- Checkout button
- Empty cart message

### 5. Admin.jsx (Admin Panel)
**Features:**
- Add product form
- Product list with edit/delete actions
- Inline editing
- Confirmation dialogs

### 6. Chatbot Component
**Features:**
- Floating toggle button
- Chat window with messages
- User/bot message styling
- Typing indicator
- Input form
- Auto-navigation capability

---

## AI Chatbot Integration

### Technology
- **Model**: Google Gemini 2.5 Flash
- **API Key**: Stored in `.env` file
- **Library**: `@google/generative-ai`

### Chatbot Persona
- **Name**: Sam
- **Role**: Human shopping assistant (not AI)
- **Tone**: Friendly and helpful
- **Knowledge**: All product details and prices

### Navigation Feature
The AI can intelligently detect when users want to navigate and respond with special syntax:

**AI Response Format:**
```
"Sure, let me take you there! NAVIGATE:/cart"
```

**Backend Processing:**
1. AI generates response with `NAVIGATE:/path`
2. Backend parses using regex: `/NAVIGATE:(\/[\w]*)/i`
3. Extracts path and removes navigation tag
4. Returns: `{ reply: "Sure, let me take you there!", navigate: "/cart" }`

**Frontend Handling:**
1. Receives response with `navigate` field
2. Displays AI message
3. Waits 1 second
4. Navigates to specified path
5. Closes chatbot

**Supported Navigation:**
- `/cart` - Shopping cart page
- `/admin` - Admin panel
- `/` - Home/products page

### AI Prompt Structure
```
Context: You are Sam, a human shopping assistant at Vibe Commerce electronics store.

Products Available:
[Product list with prices and descriptions]

Navigation Instructions:
- If customer wants to go to cart page, end your response with: NAVIGATE:/cart
- If customer wants to go to admin panel, end your response with: NAVIGATE:/admin
- If customer wants to go to home/shop/products page, end your response with: NAVIGATE:/

Guidelines:
- You're human, not AI
- Keep answers brief and helpful
- Focus on product recommendations and store info
- Never mention AI systems
```

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account OR local MongoDB
- Google Gemini API key

### Backend Setup
```bash
cd be
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibecommerce
GEMINI_API_KEY=your_gemini_api_key
```

Seed database:
```bash
node seedProducts.js
```

Start server:
```bash
npm start
```

### Frontend Setup
```bash
cd fe
npm install
npm start
```

### Database Setup
See `be/mongodb-setup.md` for detailed MongoDB setup instructions.

---

## User Roles

### User Role (Default)
**Permissions:**
- View products
- Add/remove items from cart
- Checkout
- Use AI chatbot
- Navigate to home and cart pages

**Restrictions:**
- Cannot access admin panel
- Cannot add/edit/delete products

### Admin Role
**Permissions:**
- All user permissions
- Access admin panel
- Add new products
- Edit existing products
- Delete products
- Navigate to admin panel via chatbot

**How to Create Admin:**
Admin role cannot be assigned via signup. Must be set directly in MongoDB:
```javascript
db.users.updateOne(
  { username: "adminuser" },
  { $set: { role: "admin" } }
)
```

---

## Security Considerations

### Current Implementation
⚠️ **Note**: This is a development/demo application. Production use requires additional security measures.

**Current Security:**
- User authentication (basic)
- Role-based access control
- Protected admin routes
- Input validation on forms
- MongoDB injection prevention (via Mongoose)

**Missing Security (Required for Production):**
- Password hashing (bcrypt)
- JWT tokens for authentication
- HTTPS/SSL encryption
- CORS configuration
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Environment variable protection
- API key rotation
- Session management
- Secure cookie handling

### Recommendations for Production
1. Implement bcrypt for password hashing
2. Use JWT for stateless authentication
3. Add helmet.js for security headers
4. Implement rate limiting (express-rate-limit)
5. Use HTTPS in production
6. Sanitize all user inputs
7. Add CSRF protection
8. Implement proper session management
9. Use environment-specific configs
10. Add logging and monitoring

---

## File Structure

```
e-com cart/
├── be/                          # Backend
│   ├── node_modules/
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server
│   ├── seedProducts.js          # Database seeding
│   ├── mongodb-setup.md         # Setup guide
│   └── package.json
├── fe/                          # Frontend
│   ├── node_modules/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Admin.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── README.md                    # Quick start guide
└── DOCUMENTATION.md             # This file
```

---

## Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "mongoose": "^7.0.0",
  "dotenv": "^16.0.3",
  "@google/generative-ai": "^0.1.0"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "react-scripts": "5.0.1"
}
```

---

## Currency

All prices are displayed in **Indian Rupees (₹)**.

---

## Future Enhancements

### Potential Features
1. Product images
2. Product categories/filtering
3. Search functionality
4. Product reviews and ratings
5. Wishlist
6. Order history
7. Payment gateway integration
8. Email notifications
9. Inventory management
10. Discount codes/coupons
11. Multi-language support
12. Product recommendations
13. Advanced analytics
14. Social media integration
15. Mobile app version

### AI Chatbot Enhancements
1. Product search via chat
2. Add to cart via chat commands
3. Order tracking via chat
4. Personalized recommendations
5. Multi-language support
6. Voice input/output
7. Image recognition for products
8. Chat history persistence
9. Sentiment analysis
10. Proactive assistance

---

## Troubleshooting

### Common Issues

**Issue**: Cannot connect to MongoDB
- Check MongoDB URI in `.env`
- Verify network access in MongoDB Atlas
- Ensure IP whitelist includes your IP

**Issue**: AI chatbot not responding
- Verify Gemini API key in `.env`
- Check API quota/limits
- Review console for errors

**Issue**: Products not showing
- Run `node seedProducts.js` to seed database
- Check MongoDB connection
- Verify products collection exists

**Issue**: Admin panel not accessible
- Verify user role is 'admin' in database
- Check protected route logic
- Clear browser cache

**Issue**: Cart not updating
- Check userId is being passed correctly
- Verify cart API endpoints
- Check browser console for errors

---

## Support

For issues or questions:
1. Check this documentation
2. Review console logs (browser and server)
3. Verify environment variables
4. Check MongoDB connection
5. Ensure all dependencies are installed

---

## License

This project is for educational/demonstration purposes.

---

## Credits

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **AI**: Google Gemini AI
- **Design**: Custom CSS with modern dark theme

---

**Last Updated**: 2024
**Version**: 1.0.0
