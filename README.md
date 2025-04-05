[
 
# 💻 DevTinder Backend

This is the **backend** of the DevTinder project — a Node.js + Express.js server that powers authentication, profiles, matches, chat, and subscription via Razorpay.

👉 **Live Site**: [http://13.232.143.33](http://13.232.143.33)
```
```

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **Socket.IO** for real-time chat
- **Razorpay** for subscriptions
- **CORS**, **dotenv**, **Morgan**

```
```

## 🎯 Features

- 👤 User authentication and profile management
- 🔐 JWT-based session protection
- 🤝 Match request system
- 💬 **Chat support via Socket.IO** after a successful match
- 💳 **Subscription and payment via Razorpay**
- 📊 Admin-level subscription validation logic

---

## 🛠️ Installation

```bash
git clone https://github.com/ujjwalkumar-64/DevTinder-Backend.git
cd DevTinder-Backend
npm install
npm run dev

📌 .env Configuration
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

```
📂 Folder Structure
routes/ – API endpoints (auth, user, connection, chat, payments)

controllers/ – Business logic

models/ – Mongoose schemas (User, Chat, Messages, Subscription)

middleware/ – Auth and error handlers

utils/ – Razorpay utilities

```
```

🔗 Frontend Reference
This backend is built to power the frontend of DevTinder:

👉 [DevTinder Frontend Repository](https://github.com/ujjwalkumar-64/DevTinder-Frontend)
```
```

🧠 Future Improvements
Rate-limiting & IP logging

Admin dashboard for user management

Payment history endpoints
```
```

🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss any large changes before contributing.

yaml
Copy
Edit

---

``
Let me know if you’d like help publishing these to GitHub directly or want a zipped copy of both `README.md` files!
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
](https://github.com/ujjwalkumar-64/DevTinder-Frontend)
