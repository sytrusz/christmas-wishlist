# 🎁 Christmas Wishlist Web App (Next.js + Prisma + SQLite / Turso)

A lightweight, modern fullstack web application for organizing gift wishlists and gift exchanges (such as Secret Santa or Manito-Manita).

---

## ⚡ Why this architecture?
- **Unified Fullstack**: Next.js App Router handles both the UI and REST API. One single command (`npm run dev`) runs the entire stack.
- **Zero Local Setup Hassle**: SQLite database runs directly on your disk (`prisma/dev.db`). No MySQL servers, Docker containers, or separate backend services to configure.
- **Instant Wakeups & Seasonal-Proof**: Never spins down or gets paused after 7 days of inactivity (unlike Supabase or Render free tiers).
- **Production-Ready for Turso**: Deploying to Vercel with a free serverless Turso database requires only adding `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
- **Prisma Studio**: Free visual GUI in your browser to view and edit database records.

---

## 🚀 Quick Start

### 1. Navigate to `next-app`
```bash
cd next-app
```

### 2. Configure Environment (`.env`)
The `.env` file is pre-configured for local development:
```env
DATABASE_URL="file:./dev.db"
USER_PASSWORD="user"
ADMIN_PASSWORD="admin"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 Visual Database GUI (Prisma Studio)
To visually view, add, or edit users and wishlists in your browser:
```bash
npx prisma studio
```
Opens Prisma Studio on [http://localhost:5555](http://localhost:5555).

---

## 🌐 Deploying to Production (Vercel + Turso)

Deploy a live showcase instance on Vercel linked to a free serverless Turso database.

### 1. Create a Turso Database
Ensure Turso CLI is installed (`turso auth login`), then create the portfolio database:
```bash
# Create database
turso db create wishlist-portfolio

# Retrieve database URL
turso db show --url wishlist-portfolio

# Generate access token
turso db tokens create wishlist-portfolio
```

### 2. Push Schema & Seed Demo Data
From within `next-app`, push the database schema and sample seed data directly to Turso:
```bash
# Push schema to portfolio database
npm run db:push:portfolio

# Seed sample wishlists, items, and demo users
npm run db:seed:portfolio
```

### 3. Deploy to Vercel

1. In Vercel, click **Add New...** > **Project** and select this repository.
2. Under **Configure Project**:
   - Set **Root Directory** to `next-app` (crucial since the Next.js app is located here).
   - Set **Project Name** to `christmas-wishlist-portfolio`.
3. Add the **Environment Variables**:
   - `TURSO_DATABASE_URL`: `libsql://wishlist-portfolio-xxxx.turso.io`
   - `TURSO_AUTH_TOKEN`: `<your database auth token>`
   - `USER_PASSWORD`: `user`
   - `ADMIN_PASSWORD`: `admin`
4. Click **Deploy**.

---

## 🔑 Default Credentials
- **User Login**: password `user` (or value of `USER_PASSWORD`)
- **Admin Login**: password `admin` (or value of `ADMIN_PASSWORD`)
