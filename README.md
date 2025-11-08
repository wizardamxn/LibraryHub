---

# 📚 LibraryHub

A full-stack web application built with **React (TypeScript)**, **Node.js**, **Express**, and **MongoDB**.
It provides a complete authentication flow, protected routes, and CRUD operations for managing books.
The project demonstrates clean architecture, responsive UI, and secure API integration using JWT.

---

## 🚀 Features

* 🔐 **JWT Authentication** (Register / Login / Logout)
* 🧠 **Protected Dashboard** accessible only after login
* 📖 **CRUD Operations** for books
* 👤 **User Profile** fetch and update
* 🔎 **Search & Filter** functionality
* ⚙️ **Error Handling** and form validation
* 🎨 **Responsive UI** with TailwindCSS
* 🧩 **Modular and scalable** project structure

---

## 🛠️ Tech Stack

| Layer              | Technologies                          |
| ------------------ | ------------------------------------- |
| **Frontend**       | React, TypeScript, TailwindCSS, Vite  |
| **Backend**        | Node.js, Express                      |
| **Database**       | MongoDB                               |
| **Authentication** | JWT, bcrypt                           |
| **Validation**     | Express-validator / Custom middleware |

---

## 📂 Project Structure

```bash
root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   └── main.tsx
│   ├── public/
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── Routes/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI and JWT_SECRET
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🧩 API Endpoints

| Method   | Endpoint      | Description                               |
| -------- | ------------- | ----------------------------------------- |
| **POST** | `/register`   | Register a new user                       |
| **POST** | `/login`      | Login user                                |
| **POST** | `/logout`     | Logout user                               |
| **GET**  | `/profile`    | Get logged-in user profile *(protected)*  |
| **GET**  | `/`           | Fetch all available books *(public)*      |
| **POST** | `/add`        | Add a new book *(protected)*              |
| **PUT**  | `/borrow/:id` | Borrow a book *(protected)*               |
| **PUT**  | `/return/:id` | Return a borrowed book *(protected)*      |
| **GET**  | `/mybooks`    | Fetch user’s borrowed books *(protected)* |

---

## 🧰 Postman Collection

All API routes are pre-configured in the Postman collection file:

```
/docs/LibraryHub.postman_collection.json
```

You can import it directly into **Postman** for testing and exploration.

---

## 🧙🏻 Author

**Aman Ahmad**
📧 [amank225566@gmail.com](mailto:amank225566@gmail.com)
🔗 [GitHub](https://github.com/wizardamxn) • [Portfolio](https://amanahmad.vercel.app)

---
