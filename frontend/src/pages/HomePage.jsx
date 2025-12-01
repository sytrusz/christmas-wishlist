import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import WishlistCard from '../components/WishlistCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function HomePage() {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState([]);
  const [filteredWishlists, setFilteredWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchWishlists();
    
    // Scroll to top button visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWishlistsByCategory = (category) => {
    return filteredWishlists.filter((w) => w.category === category);
  };

  const CategorySection = ({ title, category, emoji }) => {
    const categoryWishlists = getWishlistsByCategory(category);

    if (categoryWishlists.length === 0) return null;

    return (
      <div className="mb-8 md:mb-12 animate-fade-in">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <span className="text-2xl md:text-4xl animate-bounce-slow">{emoji}</span>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <span className="ml-2 bg-red-100 text-red-800 text-xs md:text-sm font-semibold px-3 py-1 rounded-full">
            {categoryWishlists.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {categoryWishlists.map((wishlist, index) => (
            <div
              key={wishlist.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <WishlistCard wishlist={wishlist} />
            </div>
          ))}
        </div>
        <div className="mt-6 md:mt-8 border-t-2 border-gray-300"></div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasWishlists = wishlists.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex flex-col">
      <div className="flex-grow py-4 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8 animate-fade-in">
            <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
              🎄 Malagapo Christmas Wishlist 🎄
            </h1>
            <p className="text-sm md:text-base text-gray-600 px-4">
              Tis' the season… to politely ask for gifts.
            </p>
          </div>

          {/* Search and Add Buttons */}
          <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-12 animate-slide-up">
            <SearchBar onSearch={handleSearch} />

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
              {/* Register Name Button */}
              <button
                onClick={() => navigate('/register')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 md:px-6 flex items-center justify-center gap-2 transition-all transform hover:scale-105 border-2 border-gray-800 shadow-lg text-sm md:text-base"
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 md:px-6 flex items-center justify-center gap-2 transition-all transform hover:scale-105 border-2 border-gray-800 shadow-lg text-sm md:text-base"
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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base animate-shake">
              {error}
            </div>
          )}

          {/* Categories or Empty State */}
          {!hasWishlists ? (
            <EmptyState onRegisterClick={() => navigate('/register')} />
          ) : filteredWishlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-base md:text-lg">No wishlists match your search</p>
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-red-600 hover:bg-red-700 text-white p-3 md:p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-50 animate-bounce-in"
          aria-label="Scroll to top"
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-900 via-emerald-900 to-green-900 text-white py-6 md:py-8 px-4 mt-12 border-t-4 border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left - Credits */}
            <div className="text-center md:text-left">
              <p className="text-sm md:text-base font-semibold mb-3">
                Created by: Nathan Rener Malagapo
              </p>
              
              {/* Social Links */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* GitHub */}
                <a
                  href="https://github.com/sytrusz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gray-300 transition-all transform hover:scale-105"
                  title="GitHub Profile"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm md:text-base">@sytrusz</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/nathan-rener-malagapo-60b4a72a5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gray-300 transition-all transform hover:scale-105"
                  title="LinkedIn Profile"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span className="text-sm md:text-base">Nathan Malagapo</span>
                </a>
              </div>
            </div>

            {/* Right - Repository Link */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://github.com/sytrusz/christmas-wishlist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-300 transition-all transform hover:scale-105 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
                title="View Repository"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm md:text-base">View Source Code</span>
              </a>
              
              <div className="text-xs md:text-sm text-gray-300">
                © {new Date().getFullYear()} • All Rights Reserved
              </div>
            </div>
          </div>

          {/* Bottom - Tech Stack */}
          <div className="mt-6 pt-4 border-t border-white/20 text-center">
            <p className="text-xs md:text-sm text-gray-300 mb-2">
              Developed using:
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {['Spring Boot', 'React', 'MySQL', 'Tailwind CSS'].map((tech) => (
                <span
                  key={tech}
                  className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}