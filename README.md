# LibraryHub
# 📚 Library Management App

A full-stack web application built with **React (TypeScript)**, **Node.js**, **Express**, and **MongoDB**.  
It provides a complete authentication flow, protected routes, and CRUD operations for managing books.  
The project demonstrates clean architecture, responsive UI, and secure API integration using JWT.

---

## 🚀 Features

- 🔐 **JWT Authentication** (Signup / Login / Logout)
- 🧠 **Protected Dashboard** accessible only after login
- 📖 **CRUD Operations** for books
- 👤 **User Profile** fetch and update
- 🔎 **Search & Filter** functionality
- ⚙️ **Error Handling** and form validation
- 🎨 **Responsive UI** with TailwindCSS
- 🧩 **Modular project structure** for scalability

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| Frontend | React, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express |
| Database | MongoDB |
| Authentication | JWT, bcrypt |
| Validation | Express-validator / Custom middleware |

---


## 📂 Project Structure

root/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── lib/
│ │ ├── pages/
│ │ ├── store/
│ │ └── main.tsx
│ ├── public/
│ ├── tailwind.config.ts
│ └── vite.config.ts
│
├── backend/
│ ├── src/
│ │ ├── controller/
│ │ ├── database/
│ │ ├── middlewares/
│ │ ├── models/
│ │ └── Routes/
│ ├── .env
│ └── package.json
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

##Backend
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI and JWT_SECRET
npm run dev

##Frontend
cd ../frontend
npm install
npm run dev
```

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | `/auth/signup` | Register new user |
| POST   | `/auth/login`  | Login user        |
| GET    | `/profile`     | Get user profile  |
| PUT    | `/profile`     | Update profile    |
| GET    | `/books`       | Fetch all books   |
| POST   | `/books`       | Add a new book    |
| PUT    | `/books/:id`   | Update book       |
| DELETE | `/books/:id`   | Delete book       |


