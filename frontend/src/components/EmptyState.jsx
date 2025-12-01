export default function EmptyState({ onRegisterClick }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-8xl mb-6 animate-bounce">🎅</div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        No Wishlists Yet!
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Be the first to create a Christmas wishlist and let everyone know what you'd like this holiday season!
      </p>
      <button
        onClick={onRegisterClick}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
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
        Create Your Wishlist
      </button>
    </div>
  );
}