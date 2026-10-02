# Texora — Textile & Garments Industry (MERN Stack)

A complete, animated MERN-stack web application inspired by the **Texora** textile & garment industry design, with a public **frontend**, a **backend** REST API, and a separate **admin** dashboard for content management.

## 🗂 Project Structure

```
texora/
├── frontend/     # React + Vite + Tailwind CSS + Framer Motion (public website)
├── backend/      # Node.js + Express + MongoDB (REST API)
└── admin/        # React + Vite + Tailwind CSS (admin dashboard)
```

Each app has its own `package.json` and can be run independently.

## ✨ Features

### Frontend (Public Website)
- Fully animated UI using **Framer Motion** (hero parallax, scroll-reveal, counters, sliders)
- Pages: Home, About, Services, Projects, Blog, Contact, Login, Register
- Tailwind CSS + PostCSS styling matching the Texora navy & gold design
- Reusable component library (`src/components`), pages (`src/pages`), utilities (`src/utils`), and auth context
- Axios-based API layer with JWT auto-attach
- Contact form wired to the backend `/api/contact` endpoint
- Toast notifications, animated page transitions, responsive design

### Backend (REST API)
- Express.js + MongoDB (Mongoose) with a clean MVC structure:
  `models/`, `controllers/`, `routes/`, `middleware/`, `utils/`
- JWT authentication (register/login) with role-based access (`user` / `admin`)
- CRUD APIs for: Products, Services, Projects, Blogs, Testimonials, Contact Messages, Orders, Users
- Image upload endpoint (Multer)
- Centralized error handling, CORS, request logging (Morgan)
- Database seeder script (`npm run seed`) to populate sample data + an admin account

### Admin Dashboard
- Separate React app secured by JWT + role check (`admin` only)
- Sidebar navigation, animated active-link indicator
- Dashboard with live stat cards + orders chart (Recharts)
- Full CRUD screens (with modals) for Products, Services, Projects, Blog Posts, Testimonials
- Contact messages inbox (mark as read / delete)
- User management (change role / delete)

## 🚀 Getting Started

### 1. Backend
```bash
cd backend
cp .env.example .env      # update MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed               # optional: seed sample data + admin user
npm run dev                # starts on http://localhost:5000
```
Default seeded admin login: `admin@texora.com` / `admin123`

### 2. Frontend (public site)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # starts on http://localhost:5173
```

### 3. Admin Dashboard
```bash
cd admin
cp .env.example .env
npm install
npm run dev                # starts on http://localhost:5174
```

## 🛠 Tech Stack
- **Frontend/Admin:** React 18, Vite, Tailwind CSS, PostCSS, Framer Motion, React Router, Axios, React Icons, React Toastify, Recharts / React CountUp
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Morgan

## 📌 Notes
- Update `MONGO_URI` in `backend/.env` to point to your local MongoDB or a MongoDB Atlas cluster.
- The frontend and admin apps talk to the backend through `VITE_API_URL` in their respective `.env` files.
- Replace the placeholder gradient blocks in the UI with real product/factory photography for production use.
