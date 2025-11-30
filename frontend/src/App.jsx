import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateWishlistPage from './pages/CreateWishlistPage';
import WishlistDetailPage from './pages/WishlistDetailPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateWishlistPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/wishlist/:slug" element={<WishlistDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;