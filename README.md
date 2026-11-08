# Wishlist Web App

A web application for organizing gift wishlists and gift exchanges (Manito-Manita).

## Features

- **Role-Based Access** - User and Admin authentication modes.
- **Wishlist Wall** - Centralized dashboard displaying wishlists categorized by group.
- **Categories** - Oganized list by customizable categories (Adults 👨, Kids 👶, Pets 🐾).
- **Item Management** - Add specific items with descriptions (e.g., "Size M", "Color Blue") and direct shop links.
- **Theme Customizer** - Admins can update site colors, header titles, style banners, and presets directly from the dashboard.
- **Admin Dashboard** - Complete management suite to create, edit, or remove users and wishlists.

## Tech Stack

**Fullstack**: Next.js 16 (App Router) → Vercel  
**Database**: SQLite (local) / Turso LibSQL
**ORM**: Prisma 6  
**Styling**: Tailwind CSS v4  

## Getting Started

### 1. Run Locally
```bash
cd next-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Default Credentials
- **User password**: `user`
- **Admin password**: `admin`

### 3. Visual Database GUI
```bash
cd next-app
npx prisma studio
```
Opens Prisma Studio at [http://localhost:5555](http://localhost:5555).

---

## Deploy to Vercel + Turso

### 1. Create a Turso Database
```bash
# Create the portfolio database
turso db create wishlist-portfolio

# Get connection URL
turso db show --url wishlist-portfolio

# Generate access token
turso db tokens create wishlist-portfolio
```

### 2. Apply Schema & Demo Seed
From `next-app/`:
```bash
cd next-app
npm run db:push:portfolio   # Creates database tables in Turso
npm run db:seed:portfolio   # Populates demo users and sample wishlists
```

### 3. Deploy to Vercel
1. Import this repository on [Vercel](https://vercel.com).
2. Under **Configure Project**:
   - Set **Root Directory** to `next-app`
   - Set **Project Name** (e.g. `christmas-wishlist-portfolio`)
3. Add the **Environment Variables**:
   - `TURSO_DATABASE_URL`: `libsql://wishlist-portfolio-<org>.turso.io`
   - `TURSO_AUTH_TOKEN`: `<your-turso-auth-token>`
   - `USER_PASSWORD`: `user`
   - `ADMIN_PASSWORD`: `admin`
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Holidays! 🎅🎄🎁**
