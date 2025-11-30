import { useNavigate } from 'react-router-dom';

export default function WishlistCard({ wishlist }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/wishlist/${wishlist.uniqueSlug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border-2 border-gray-800 p-4 md:p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 active:bg-gray-50"
    >
      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900 break-words">
        {wishlist.ownerName}
      </h3>
      <div className="space-y-1">
        {wishlist.items && wishlist.items.length > 0 ? (
          wishlist.items.slice(0, 3).map((item) => (
            <p key={item.id} className="text-xs md:text-sm text-gray-600 truncate">
              • {item.itemName}
            </p>
          ))
        ) : (
          <p className="text-xs md:text-sm text-gray-400">No items yet</p>
        )}
        {wishlist.items && wishlist.items.length > 3 && (
          <p className="text-xs md:text-sm text-gray-500 font-semibold">
            +{wishlist.items.length - 3} more items
          </p>
        )}
      </div>
    </div>
  );
}