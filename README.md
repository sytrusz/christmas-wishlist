# 🎁 Wishlist Web App

A web application for Christmas wishlists for family and friends. Perfect for **Manito-Manita** or general exchange gifts!

## ✨ Features

- **Secure Login** - Role-based authentication (User || Admin).
- **Wishlist Wall** - View everyone's wishlist in one place.
- **Smart Categories** - Automatically organizes lists by Adults 👨, Kids 👶, and Pets 🐾.
- **Item Management** - Add specific items with descriptions (e.g., "Size M", "Color Blue") and direct shop links.
- **Admin Dashboard** - Overview of all registered users and active wishlists.
- **Admin User Management** - Create, Edit, or Delete users directly.
- **Admin Content Control** - Monitor and delete wishlists if needed.
- **Global Site Settings** - Update the **Homepage Header Title** (e.g., change "Christmas 2025" to "Family Reunion") directly from the dashboard.

## 🏗️ Architecture

**Backend**: Spring Boot (Java 17) → Render  
**Frontend**: Vite + ReactJS → Vercel  
**Database**: MySQL → Railway  
**Styling**: Tailwind CSS

## 🚀 Getting Started

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/sytrusz/christmas-wishlist
cd wishlist/backend 
```

2. Configure `application.properties`
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

USER_PASSWORD=${APP_USER_PASSWORD:user}
ADMIN_PASSWORD=${APP_ADMIN_PASSWORD:admin}

cors.allowed-origins=${ALLOWED_ORIGINS:http://localhost:5173}
```

3. Run
```bash
./mvnw spring-boot:run
```

Backend starts on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure `.env`
```env
VITE_API_URL=http://localhost:8080/api
```

4. Run
```bash
npm run dev
```

Frontend starts on `http://localhost:5173`

## 📝 Usage

### For Users
1. **Login**: Sign in using the password provided by the host.

   * **Password**: `user`
2. **Register Name**: Click **"Register Name"** to add your name.


### For Admin
1. **Login:**
   - Toggle the "Login as Admin" switch and enter the admin password.
3. **Dashboard Controls**
   - **Users Tab:** Add new family members manually or edit existing profiles.
   - **Wishlists Tab:** Monitor all active lists and delete specific ones if needed.
   - **Settings Tab:** Update the **Header Name** of the website globally (e.g., change "Christmas" to "Manito-Manita").

### Creating a Wishlist
1. Click "Create Wishlist"
2. Select your name
3. Add items (name required, description and link optional)
4. Submit

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Holidays! 🎅🎄🎁**
