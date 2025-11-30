# 🎁 Wishlist

A web application for Christmas wishlists for family and friends.

## ✨ Features

- **User Registration** - Family members can register with their name and category (Adults, Kids, Pets)
- **Wishlist Creation** - Each user can create one personalized wishlist
- **Item Management** - Add multiple items with descriptions and shop links
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Category-based Organization** - Wishlists are automatically categorized by user type

## 🏗️ Architecture

**Backend**: Spring Boot (Java 17) → Render  
**Frontend**: Vite + ReactJS → Vercel  
**Database**: MySQL → Railway  
**Styling**: Tailwind CSS

## 🚀 Getting Started

### Prerequisites

**Backend:**
- Springboot (Java 17, Maven)
- MySQL 8.0+

**Frontend:**
- Vite + ReactJS

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/wishlist.git
cd wishlist/backend
```

2. Configure `application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/wishlist_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

3. Run
```bash
mvn clean install
mvn spring-boot:run
```

Backend starts on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend
```bash
cd wishlist/frontend
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

### Creating a Wishlist

1. Click "Create Wishlist"
2. Select your name
3. Add items (name required, description and link optional)
4. Submit

### Registering a New User

1. Click "Register here"
2. Enter full name and category
3. Submit

## 📄 License



---

**Happy Holidays! 🎅🎄🎁**
