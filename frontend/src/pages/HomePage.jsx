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
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <span className="text-2xl md:text-4xl">{emoji}</span>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {categoryWishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
        <div className="mt-6 md:mt-8 border-t-2 border-gray-300"></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-lg md:text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 py-4 md:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
            🎄Malagapo Christmas Wishlist🎄
          </h1>
          <p className="text-sm md:text-base text-gray-600 px-4">
            Tis’ the season… to politely ask for gifts.
          </p>
        </div>

        {/* Search and Add Buttons */}
        <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-12">
          <SearchBar onSearch={handleSearch} />

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
            {/* Register Name Button */}
            <button
              onClick={() => navigate('/register')}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 md:px-6 flex items-center justify-center gap-2 transition-colors border-2 border-gray-800 shadow-lg text-sm md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Register Name
            </button>

            {/* Create Wishlist Button */}
            <button
              onClick={() => navigate('/create')}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 md:px-6 flex items-center justify-center gap-2 transition-colors border-2 border-gray-800 shadow-lg text-sm md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base">
            {error}
          </div>
        )}

        {/* Categories */}
        {filteredWishlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base md:text-lg">No wishlists found</p>
          </div>
        ) : (
          <>
            <CategorySection title="Adults" category="ADULT" emoji="👦🏻" />
            <CategorySection title="Kids" category="KID" emoji="👶🏻" />
            <CategorySection title="Pets" category="PET" emoji="🐾" />
          </>
        )}
      </div>
    </div>
  );
}