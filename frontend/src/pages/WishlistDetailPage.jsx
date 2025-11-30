import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';

export default function WishlistDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, [slug]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getBySlug(slug);
      setWishlist(response.data);
      setNote(response.data.note || '');
      setError(null);
    } catch (err) {
      setError('Wishlist not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    try {
      await wishlistAPI.update(slug, { note });
      setIsEditing(false);
      fetchWishlist();
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const handleDeleteWishlist = async () => {
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      try {
        await wishlistAPI.delete(slug);
        navigate('/');
      } catch (err) {
        alert('Failed to delete wishlist');
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Delete this item?')) {
      try {
        await wishlistAPI.deleteItem(itemId);
        fetchWishlist();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-2 hover:bg-red-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        {/* Wishlist Card */}
        <div className="bg-white border-2 border-gray-800 shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-gray-900">{wishlist.ownerName}</h1>
            <button
              onClick={handleDeleteWishlist}
              className="text-red-600 hover:text-red-800"
              title="Delete Wishlist"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Wishlist Items</h2>
            {wishlist.items && wishlist.items.length > 0 ? (
              <div className="space-y-3">
                {wishlist.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-900">{item.itemName}</p>
                      {item.shopLink && (
                        <a
                          href={item.shopLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all"
                        >
                          {item.shopLink}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                      title="Delete Item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No items in this wishlist yet</p>
            )}
          </div>

          {/* Note Section */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-gray-800">Note</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-300 rounded p-3 mb-3"
                  rows="3"
                  placeholder="Add a note (e.g., PLS COLOR BLUE)"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateNote}
                    className="bg-green-600 text-white px-4 py-2 hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNote(wishlist.note || '');
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {wishlist.note || 'No note added'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}