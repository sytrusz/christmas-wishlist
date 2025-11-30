import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';

export default function WishlistDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit states
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  
  // Form data
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingItemData, setEditingItemData] = useState({
    itemName: '',
    description: '',
    shopLink: ''
  });

  useEffect(() => {
    fetchWishlist();
  }, [slug]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getBySlug(slug);
      setWishlist(response.data);
      setNote(response.data.note || '');
      setTitle(response.data.title || '');
      setDescription(response.data.description || '');
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
      setIsEditingNote(false);
      fetchWishlist();
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const handleUpdateInfo = async () => {
    try {
      await wishlistAPI.update(slug, { title, description });
      setIsEditingInfo(false);
      fetchWishlist();
    } catch (err) {
      alert('Failed to update wishlist info');
    }
  };

  const handleAddItem = async () => {
    if (!editingItemData.itemName.trim()) {
      alert('Please enter an item name');
      return;
    }
    
    try {
      await wishlistAPI.addItem(slug, editingItemData);
      setEditingItemId(null);
      setEditingItemData({ itemName: '', description: '', shopLink: '' });
      fetchWishlist();
    } catch (err) {
      alert('Failed to add item');
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

  const startEditingItem = (item) => {
    setEditingItemId(item.id);
    setEditingItemData({
      itemName: item.itemName,
      description: item.description || '',
      shopLink: item.shopLink || ''
    });
  };

  const cancelEditingItem = () => {
    setEditingItemId(null);
    setEditingItemData({ itemName: '', description: '', shopLink: '' });
  };

  const handleUpdateItem = async (itemId) => {
    try {
      await wishlistAPI.updateItem(itemId, editingItemData);
      setEditingItemId(null);
      setEditingItemData({ itemName: '', description: '', shopLink: '' });
      fetchWishlist();
    } catch (err) {
      alert('Failed to update item');
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
          {/* Header with Delete button */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-gray-900">{wishlist.ownerName}</h1>
            <button
              onClick={handleDeleteWishlist}
              className="text-red-600 hover:text-red-800 p-2"
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Wishlist Items</h2>
              <button
                onClick={() => setEditingItemId('new')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 flex items-center gap-2"
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
                Add Item
              </button>
            </div>

            {/* Add New Item Form */}
            {editingItemId === 'new' && (
              <div className="border-2 border-green-500 p-4 mb-3 bg-green-50">
                <h3 className="font-bold text-gray-900 mb-3">Add New Item</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingItemData.itemName}
                    onChange={(e) => setEditingItemData({ ...editingItemData, itemName: e.target.value })}
                    className="w-full border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="Item name"
                  />
                  <textarea
                    value={editingItemData.description}
                    onChange={(e) => setEditingItemData({ ...editingItemData, description: e.target.value })}
                    className="w-full border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="Description (color blue, size M) (optional)"
                    rows="2"
                  />
                  <input
                    type="url"
                    value={editingItemData.shopLink}
                    onChange={(e) => setEditingItemData({ ...editingItemData, shopLink: e.target.value })}
                    className="w-full border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="Shop link (optional)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddItem}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={cancelEditingItem}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {wishlist.items && wishlist.items.length > 0 ? (
              <div className="space-y-3">
                {wishlist.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 p-4"
                  >
                    {editingItemId === item.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingItemData.itemName}
                          onChange={(e) => setEditingItemData({ ...editingItemData, itemName: e.target.value })}
                          className="w-full border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500"
                          placeholder="Item name"
                        />
                        <textarea
                          value={editingItemData.description}
                          onChange={(e) => setEditingItemData({ ...editingItemData, description: e.target.value })}
                          className="w-full border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500"
                          placeholder="Description (e.g., color blue, size M)"
                          rows="2"
                        />
                        <input
                          type="url"
                          value={editingItemData.shopLink}
                          onChange={(e) => setEditingItemData({ ...editingItemData, shopLink: e.target.value })}
                          className="w-full border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500"
                          placeholder="Shop link"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateItem(item.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditingItem}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-lg text-gray-900">{item.itemName}</p>
                          {item.description && (
                            <p className="text-gray-600 text-sm mt-2 mb-2 whitespace-pre-wrap">
                              📝 {item.description}
                            </p>
                          )}
                          {item.shopLink && (
                            <a
                              href={item.shopLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm break-all block"
                            >
                              🔗 {item.shopLink}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEditingItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Item"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-800"
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
                      </div>
                    )}
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
              {!isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditingNote ? (
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
                      setIsEditingNote(false);
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