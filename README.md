# 🛒 GadgetHub — E-Commerce Gadget Store

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, full-stack e-commerce platform for gadgets and electronics with multi-role access, Google OAuth, dark/light theme, and a powerful admin dashboard.

[🌐 Live Demo](https://gadget-hub-frontend-lime.vercel.app)

[🌐 Backend_Repo ](https://github.com/yeasinrahman26/GadgetHub-Backend)


</div>

## Login credentials
- Admin 
 Email: admin@gadgethub.com
 Password: admin123

-Moderator
Email: mod@gadgethub.com
Password: mod12345
---

## ✨ Features

### Shopping
- 🔍 Search, filter (category, brand, price, rating), and sort products
- 🛒 Persistent cart (localStorage)
- 📦 Checkout as **Guest** or **Registered User**
- 📋 Order tracking with visual status progress
- ⭐ Product reviews & ratings (one per user)

### Authentication
- 🔐 Custom JWT authentication (no Firebase)
- 🔑 Google OAuth one-click sign-in
- 📧 Forgot/Reset password via email
- 🛡️ Role-based access control (Guest, User, Mod, Admin)

### User Dashboard
- 👤 Edit profile & upload avatar
- 📜 View order history with detailed status tracking
- 🔒 Change password with strength indicator

### Admin Panel
- 📊 Dashboard with stats (users, products, orders, revenue)
- 📦 Manage all orders & update status
- 👥 Manage users & change roles
- 🏷️ Manage categories (with delete protection)
- 🛍️ Add/edit/delete any product

### UI/UX
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔔 Toast notifications for all actions
- ⏳ Loading states & skeletons

---

## 👥 Roles & Permissions

| Action | Guest | User | Mod | Admin |
|--------|:-----:|:----:|:---:|:-----:|
| Browse & search products | ✅ | ✅ | ✅ | ✅ |
| Add to cart & checkout | ✅ | ✅ | ✅ | ✅ |
| Profile & order history | ─ | ✅ | ✅ | ✅ |
| Write reviews | ─ | ✅ | ✅ | ✅ |
| Add/edit own products | ─ | ─ | ✅ | ✅ |
| Manage categories | ─ | ─ | ✅ | ✅ |
| Admin dashboard | ─ | ─ | ─ | ✅ |
| Manage all orders/users | ─ | ─ | ─ | ✅ |
| Delete any product/user | ─ | ─ | ─ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, Shadcn/UI, Redux Toolkit, RTK Query |
| **Backend** | Express.js, Node.js (ES Modules), Mongoose |
| **Database** | MongoDB Atlas |
| **Auth** | JWT + bcrypt + Google OAuth |
| **Email** | Nodemailer + Gmail |
| **Images** | ImgBB API |
| **Deployment** | Vercel |

---

## 📄 Pages

**Public:** Home, Shop, Product Detail, About, Login, Register, Forgot/Reset Password

**User:** Profile, Order History, Settings, Checkout

**Mod/Admin:** Add Product, Manage Products

**Admin Only:** Dashboard, Manage Orders, Manage Users, Manage Categories

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Frontend
git clone https://github.com/yeasinrahman26/GadgetHub-Frontend
cd gadgethub-frontend && npm install

# Backend
git clone https://github.com/yeasinrahman26/GadgetHub-Backend
cd gadgethub-backend && npm install