import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import WishlistCard from '../components/WishlistCard';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState([]);
  const [filteredWishlists, setFilteredWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getAll();
      setWishlists(response.data);
      setFilteredWishlists(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load wishlists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredWishlists(wishlists);
    } else {
      const filtered = wishlists.filter((wishlist) =>
        wishlist.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWishlists(filtered);
    }
  };

  const getWishlistsByCategory = (category) => {
    return filteredWishlists.filter((w) => w.category === category);
  };

  const CategorySection = ({ title, category, emoji }) => {
    const categoryWishlists = getWishlistsByCategory(category);

    if (categoryWishlists.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{emoji}</span>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryWishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
        <div className="mt-8 border-t-2 border-gray-300"></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            🎄 MALAGAPO CHRISTMAS WISHLIST🎄
          </h1>
          <p className="text-gray-600">Share your Christmas wishes with loved ones</p>
        </div>

{/* Search and Add Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <SearchBar onSearch={handleSearch} />

          <div className="flex gap-4">
            {/* Register Name Button */}
            <button
              onClick={() => navigate('/register')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 flex items-center gap-2 transition-colors border-2 border-gray-800 shadow-lg whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
              Register Name
            </button>

            {/* Create Wishlist Button */}
            <button
              onClick={() => navigate('/create')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 flex items-center gap-2 transition-colors border-2 border-gray-800 shadow-lg whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Wishlist
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Categories */}
        {filteredWishlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No wishlists found</p>
          </div>
        ) : (
          <>
            <CategorySection title="Adults" category="ADULT" emoji="👨" />
            <CategorySection title="Kids" category="KID" emoji="👶" />
            <CategorySection title="Pets" category="PET" emoji="🐾" />
          </>
        )}
      </div>
    </div>
  );
}