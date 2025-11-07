# Vibe Commerce - E-Commerce Cart

A full-stack MERN shopping cart application with user authentication, role-based access control, and AI-powered shopping assistant.

## Features

### Core Features
- **User Authentication** - Sign up, login, and session management
- **Product Catalog** - 7 electronics products with prices in Indian Rupees
- **Shopping Cart** - User-specific cart with quantity management
- **Checkout Process** - Order confirmation with receipt
- **Admin Panel** - Product CRUD operations (admin role only)
- **AI Chatbot** - Google Gemini-powered shopping assistant with navigation
- **Modern UI** - Dark theme with glassmorphism and animations
- **Routing** - React Router with protected routes

### AI Assistant Features
- Product recommendations and information
- Intelligent navigation (cart, admin, home)
- Context-aware responses
- Friendly "Sam" persona

## Tech Stack

- **Frontend**: React 18, React Router DOM, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **API**: RESTful endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

## Quick Start

### 1. Backend Setup
```bash
cd be
npm install
```

Create `.env` file in `be/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Seed the database:
```bash
node seedProducts.js
```

Start backend server:
```bash
npm start
```
Server runs on http://localhost:5000

### 2. Frontend Setup
```bash
cd fe
npm install
npm start
```
App runs on http://localhost:3000

### 3. Create Admin User (Optional)
Admin role must be set in MongoDB:
```javascript
db.users.updateOne(
  { username: "your_username" },
  { $set: { role: "admin" } }
)
```

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user
- `POST /api/login` - Authenticate user

### Products
- `GET /api/products` - Get all products

### Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart/:userId` - Get user's cart
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/checkout` - Process order

### Admin (Protected)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### AI Chatbot
- `POST /api/chat` - Chat with AI assistant

## Project Structure

```
e-com cart/
├── be/                      # Backend
│   ├── server.js           # Express server with all routes
│   ├── seedProducts.js     # Database seeding script
│   ├── .env                # Environment variables
│   ├── mongodb-setup.md    # MongoDB setup guide
│   └── package.json        # Backend dependencies
├── fe/                      # Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx    # Product catalog
│   │   │   ├── Cart.jsx    # Shopping cart
│   │   │   └── Admin.jsx   # Admin panel
│   │   ├── App.jsx         # Main component with routing
│   │   ├── App.css         # Global styles
│   │   └── index.js        # React entry point
│   ├── public/
│   │   └── index.html      # HTML template
│   └── package.json        # Frontend dependencies
├── README.md                # Quick start guide
└── DOCUMENTATION.md         # Complete documentation
```

## User Roles

### User (Default)
- View products
- Manage shopping cart
- Checkout orders
- Use AI chatbot

### Admin
- All user permissions
- Access admin panel
- Add/edit/delete products

## Available Products

1. Wireless Headphones - ₹99.99
2. Smartphone Case - ₹24.99
3. Bluetooth Speaker - ₹79.99
4. USB Cable - ₹12.99
5. Power Bank - ₹49.99
6. Screen Protector - ₹9.99
7. Wireless Charger - ₹34.99

## AI Chatbot Usage

The AI assistant "Sam" can help with:
- Product information and recommendations
- Navigation to different pages
- Shopping assistance

Example commands:
- "Tell me about the headphones"
- "Navigate me to cart"
- "Show me the admin panel"
- "Take me home"

## Documentation

For detailed documentation including:
- Complete feature list
- Database schema
- API specifications
- Component architecture
- Security considerations
- Troubleshooting guide

See [DOCUMENTATION.md](./DOCUMENTATION.md)

## Security Note

This is a development/demo application. For production use:
- Implement password hashing (bcrypt)
- Add JWT authentication
- Enable HTTPS
- Add rate limiting
- Implement proper input sanitization

## Future Enhancements

- Product images and categories
- Search and filtering
- Order history
- Payment gateway integration
- Email notifications
- Product reviews
- Wishlist functionality

## License

Educational/Demo Project

---

Made with MERN Stack and Google Gemini AI
