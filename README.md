# Wishlist Web App

A web app for organizing gift wishlists and gift exchanges (Manito-Manita).

> 🔑 **Demo Credentials:**
> - **User Login**: `user` *(Browse wishlists, register names, create & edit wishlists)*
> - **Admin Login**: `admin` *(Access admin dashboard & theme customizer via "Login as Admin" in the footer)*

## Features

- **Role-Based Access** - User and Admin authentication modes.
- **Wishlist Wall** - Centralized dashboard displaying wishlists categorized by group.
- **Categories** - Organized lists by customizable categories (Adults 👨, Kids 👶, Pets 🐾).
- **Item Management** - Add specific items with notes/descriptions (e.g., "Size M", "Color Blue") and direct shop links.
- **Theme Customizer** - Admin can update site colors, event titles, banner styles, and presets directly from the dashboard.
- **Admin Dashboard** - Create, edit, or remove users and wishlists.

## Tech Stack

- **Fullstack Framework**: Next.js 16 (App Router + Turbopack) → Vercel  
- **Database**: SQLite (Local development) / Turso LibSQL (Production)
- **ORM**: Prisma 6  

---

## Getting Started Locally

### 1. Run Development Server
```bash
cd next-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Default Local Credentials
- **User password**: `user`
- **Admin password**: `admin`

### 3. Visual Database GUI
```bash
cd next-app
npx prisma studio
```
Opens Prisma Studio at [http://localhost:5555](http://localhost:5555).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Holidays! 🎅🎄🎁**
