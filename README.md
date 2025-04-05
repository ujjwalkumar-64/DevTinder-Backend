
# 💻 DevTinder Backend

This is the **backend** of the DevTinder project — a Node.js + Express.js server that powers authentication, profiles, matches, chat, and subscription via Razorpay.

👉 **Live Site**: [http://13.232.143.33](http://13.232.143.33)

---

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **Socket.IO** for real-time chat
- **Razorpay** for subscriptions
- **CORS**, **dotenv**, **Morgan**

---

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
```
```
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
```
📂 Folder Structure
routes/ – API endpoints (auth, user, connection, chat, payments)

controllers/ – Business logic

models/ – Mongoose schemas (User, Chat, Messages, Subscription)

middleware/ – Auth and error handlers

utils/ – Razorpay utilities
```

🔗 Frontend Reference
This backend is built to power the frontend of DevTinder:

👉 DevTinder Frontend Repository
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

Let me know if you’d like help publishing these to GitHub directly or want a zipped copy of both `README.md` files!
