
### 📗 `DevTinder-Backend` – `README.md`

```markdown
# DevTinder - Backend

This is the backend API for **DevTinder**, built using Node.js, Express, and MongoDB.

## 🚀 Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS and Helmet for security

## 📁 Project Structure

```
src/
├── controllers/     # Business logic (auth, user actions)
├── models/          # Mongoose schemas (User)
├── routes/          # Express routes (auth, user)
├── middlewares/     # Authentication & error handlers
├── config/          # DB connection
├── utils/           # Utility functions (JWT, etc.)
├── app.js           # Express app setup
└── index.js         # Server entry point
```

## 🔑 Features
- 🔐 JWT-based authentication
- 👤 User registration & login
- 🧑 Profile update
- 📤 Send and receive connection requests
- 🤝 Accept or reject requests
- 📋 View mutual connections

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/ujjwalkumar-64/DevTinder-Backend.git
   cd DevTinder-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/devtinder
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## 🔄 API Endpoints (Example)
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user
- `GET /api/user/profile` – Get own profile (auth required)
- `POST /api/user/request/:id` – Send request to user
- `POST /api/user/accept/:id` – Accept incoming request
- `GET /api/user/connections` – Get all connections

## 📄 License
[MIT](./LICENSE)
```

---
