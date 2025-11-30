import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI, userAPI } from '../services/api';

export default function CreateWishlistPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([{ itemName: '', shopLink: '' }]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSelect = (e) => {
    const userName = e.target.value;
    setSelectedUser(userName);
    
    // Find the user's category
    const user = users.find(u => u.fullName === userName);
    if (user) {
      setSelectedCategory(user.category);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { itemName: '', shopLink: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert('Please select your name');
      return;
    }

    const validItems = items.filter((item) => item.itemName.trim());

    if (validItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      setLoading(true);
      const response = await wishlistAPI.create({
        ownerName: selectedUser,
        note: note.trim(),
        category: selectedCategory,
        items: validItems,
      });
      navigate(`/wishlist/${response.data.uniqueSlug}`);
    } catch (err) {
      alert('Failed to create wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Form Card */}
        <div className="bg-white border-2 border-gray-800 shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Create Wishlist</h1>

          {loadingUsers ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Select Your Name *
                </label>
                <div className="relative">
                  <select
                    value={selectedUser}
                    onChange={handleUserSelect}
                    className="w-full border-2 border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="">-- Select your name --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.fullName}>
                        {user.fullName} ({user.category})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Don't see your name?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </p>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Wishlist Items *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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

                <div className="border-2 border-gray-300 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-2/5">
                          Item Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-2/5">
                          Shop Link
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-1/5">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) =>
                                handleItemChange(index, 'itemName', e.target.value)
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="e.g., Bottle, Pencil"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="url"
                              value={item.shopLink}
                              onChange={(e) =>
                                handleItemChange(index, 'shopLink', e.target.value)
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="https://..."
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              disabled={items.length === 1}
                              className="text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed"
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
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="e.g., PLS COLOR BLUE"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-3 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed border-2 border-gray-800 shadow-lg"
              >
                {loading ? 'Creating...' : 'Create Wishlist'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}