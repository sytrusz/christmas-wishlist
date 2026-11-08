'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { wishlistAPI } from '@/services/api';
import SearchBar from '@/components/SearchBar';
import WishlistCard from '@/components/WishlistCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface WishlistItem {
  id: number;
  itemName: string;
  description?: string;
  shopLink?: string;
  groupNumber?: number;
}

interface Wishlist {
  id: number;
  ownerName: string;
  uniqueSlug: string;
  category: string;
  note?: string | null;
  groupNotes?: string | null;
  items?: WishlistItem[];
}

function HomePageContent() {
  const router = useRouter();
  const { config } = useSiteConfig();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [filteredWishlists, setFilteredWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => {
    fetchWishlists();

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
      setWishlists(response.data || []);
      setFilteredWishlists(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load wishlists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasWishlists = wishlists.length > 0;
  const categoriesList = config.categories && config.categories.length > 0
    ? config.categories
    : [
        { key: 'ADULT', label: 'Adults', emoji: '👨' },
        { key: 'KID', label: 'Kids', emoji: '👶' },
        { key: 'PET', label: 'Pets', emoji: '🐾' },
      ];

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: config.colors.bg || '#F7F3E8' }}
    >
      <div className="flex-grow py-6 md:py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8 animate-fade-in">
            <h1
              className="font-holiday text-3xl md:text-5xl font-bold mb-2 leading-tight tracking-tight transition-colors"
              style={{ color: config.colors.headerText || '#4A1521' }}
            >
              {config.eventEmoji} {config.eventTitle} {config.eventEmoji}
            </h1>
            {config.eventSubtitle && (
              <p
                className="text-sm md:text-base font-holiday italic transition-colors"
                style={{ color: config.colors.subtitleText || '#6E5D4F' }}
              >
                {config.eventSubtitle}
              </p>
            )}
          </div>

          {/* Family Event Dress Theme: Banner */}
          {config.banner.enabled && (
            <div className="mb-6 md:mb-8 max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto animate-slide-up">
              <div
                onClick={() => config.banner.modalEnabled && setShowThemeModal(true)}
                className={`group relative overflow-hidden rounded-2xl border-2 shadow-sm transition-all duration-300 ${
                  config.banner.modalEnabled ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''
                }`}
                style={{
                  borderColor: config.colors.cardBorder || '#C9AE8D',
                  backgroundColor: '#FAF5EE',
                }}
                title={config.banner.modalEnabled ? 'Click to view full style guide' : ''}
              >
                <img
                  src={config.banner.imageUrl || '/holiday-plaid-theme-banner.jpg'}
                  alt={config.banner.altText || 'Event Dress Theme Banner'}
                  className="w-full h-auto object-contain block"
                />
                {config.banner.modalEnabled && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-end p-2.5">
                    <span className="text-[10px] md:text-xs font-semibold text-[#581825] bg-white/90 px-2.5 py-1 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-sm">
                      <span>👗 View Full Dress Theme Guide</span>
                      <span>→</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search and Add Buttons */}
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-3 md:gap-4 mb-8 md:mb-12 animate-slide-up">
            <SearchBar onSearch={handleSearch} />

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
              {/* Register Name Button */}
              <button
                onClick={() => router.push('/register')}
                style={{ backgroundColor: config.colors.primary || '#581825' }}
                className="flex-1 text-white font-medium py-3 px-4 md:px-6 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm md:text-base cursor-pointer rounded-xl filter hover:brightness-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                <span>Register Name</span>
              </button>

              {/* Add Wishlist Button */}
              <button
                onClick={() => router.push('/create')}
                style={{ backgroundColor: config.colors.secondary || '#1E4D38' }}
                className="flex-1 text-white font-medium py-3 px-4 md:px-6 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg text-sm md:text-base cursor-pointer rounded-xl filter hover:brightness-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                <span>Add Wishlist</span>
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
            <EmptyState onRegisterClick={() => router.push('/register')} />
          ) : filteredWishlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-base md:text-lg">No wishlists match your search</p>
            </div>
          ) : (
            categoriesList.map(({ key, label, emoji }) => {
              const categoryWishlists = filteredWishlists.filter((w) => w.category === key);
              if (categoryWishlists.length === 0) return null;

              return (
                <div key={key} className="mb-8 md:mb-12 animate-fade-in">
                  <div className="flex items-center gap-2.5 mb-4 md:mb-6">
                    <span className="text-2xl md:text-3xl">{emoji}</span>
                    <h2 className="font-holiday text-2xl md:text-3xl font-bold text-[#1F1915]">{label}</h2>
                    <span className="bg-[#FDE8E8] text-[#9E3547] text-xs font-bold px-2.5 py-0.5 rounded-full">
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
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#581825] hover:bg-[#43111B] text-white p-3.5 rounded-full shadow-lg transition-all transform hover:scale-110 z-40 cursor-pointer animate-fade-in"
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

      {/* Plaid Tartan Ribbon Banner */}
      {config.banner.ribbonEnabled && (
        <div
          className="w-full h-8 md:h-10 border-t border-b border-[#2C1014] shadow-xs"
          style={{
            backgroundImage: `url('${config.banner.ribbonTileUrl || '/tartan-tile.png'}')`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
          }}
        />
      )}

      {/* Footer */}
      <footer
        className="text-white py-6 md:py-8 px-4 transition-colors"
        style={{ backgroundColor: config.colors.footerBg || '#144730' }}
      >
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center md:grid md:grid-cols-3 gap-4">
          
          {/* Left - Developer Social Links & Mobile Copyright */}
          <div className="flex flex-col items-start gap-1.5 sm:gap-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-4 md:gap-6">
              <a
                href="https://github.com/sytrusz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#D4B896] transition-all transform hover:scale-105"
                title="Author Profile"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-xs sm:text-sm md:text-base font-medium">@sytrusz</span>
              </a>

              <a
                href="https://nathanm.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#D4B896] transition-all transform hover:scale-105"
                title="Portfolio"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="text-xs sm:text-sm md:text-base font-medium">nathanm.dev</span>
              </a>
            </div>

            {/* Mobile Copyright */}
            <div className="text-[11px] sm:text-xs text-white/80 font-medium md:hidden">
              © 2026 • All Rights Reserved
            </div>
          </div>

          {/* Center - Desktop Copyright */}
          <div className="hidden md:flex flex-col items-center justify-center text-center">
            <div className="text-xs md:text-sm text-white/90 font-medium">
              © 2026 • All Rights Reserved
            </div>
          </div>

          {/* Right - Repository Link & Admin Login (Far Right on Mobile & Desktop) */}
          <div className="flex flex-col items-end justify-center md:justify-end gap-1.5 sm:gap-2">
            <a
              href="https://github.com/sytrusz/christmas-wishlist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 hover:text-white hover:bg-white/20 transition-all transform hover:scale-105 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-sm border border-white/10 text-white"
              title="View Repository"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-xs sm:text-sm md:text-base font-medium">View Repository</span>
            </a>

            {/* Admin Login Link */}
            <button
              onClick={() => {
                const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
                if (isAdmin) {
                  router.push('/admin');
                } else {
                  router.push('/login?admin=true');
                }
              }}
              className="text-[10px] text-white/50 hover:text-white uppercase tracking-widest transition-colors font-medium cursor-pointer"
            >
              LOG IN AS ADMIN
            </button>
          </div>
        </div>
      </footer>

      {/* Style Theme Modal */}
      {showThemeModal && config.banner.modalEnabled && (
        <div
          onClick={() => setShowThemeModal(false)}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F0] border-2 border-[#C9AE8D] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 md:p-7 shadow-2xl animate-bounce-in relative"
          >
            <button
              onClick={() => setShowThemeModal(false)}
              className="absolute top-4 right-4 text-[#7A5B3E] hover:text-[#4A1521] text-xl font-bold bg-[#EFE6D8] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <span className="text-xs uppercase tracking-widest text-[#7A5B3E] font-semibold">Event Dress Theme</span>
              <h3 className="font-holiday text-2xl md:text-3xl font-black text-[#581825] mt-1">{config.banner.modalTitle}</h3>
              {config.banner.modalSubtitle && (
                <p className="text-xs md:text-sm text-[#581825] font-medium mt-1">{config.banner.modalSubtitle}</p>
              )}
            </div>

            {config.banner.modalImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-[#D8C6B0] shadow-sm mb-4">
                <img
                  src={config.banner.modalImageUrl}
                  alt={config.banner.modalTitle || 'Style Inspiration'}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
