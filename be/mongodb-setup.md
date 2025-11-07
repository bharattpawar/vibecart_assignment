# MongoDB Setup Instructions

## Option 1: Local MongoDB Installation

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download and install for Windows

2. **Start MongoDB Service**
   ```cmd
   net start MongoDB
   ```

3. **Verify Connection**
   ```cmd
   mongosh
   ```

## Option 2: MongoDB Atlas (Cloud)

1. **Create Free Account**
   - Visit: https://www.mongodb.com/atlas
   - Sign up for free tier

2. **Update Connection String**
   - Replace in server.js:
   ```javascript
   mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/vibecommerce')
   ```

## Option 3: Docker (Recommended for Development)

```cmd
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

The application will automatically create the database and collections on first run.