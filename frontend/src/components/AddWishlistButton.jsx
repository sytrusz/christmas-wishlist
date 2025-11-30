import { useNavigate } from 'react-router-dom';

export default function AddWishlistButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/create')}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 flex items-center gap-2 transition-colors border-2 border-gray-800 shadow-lg"
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
  );
}