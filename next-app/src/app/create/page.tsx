'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { wishlistAPI, userAPI } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface User {
  id: number;
  fullName: string;
  category: string;
}

interface ItemInput {
  itemName: string;
  description: string;
  shopLink: string;
  groupNumber?: number;
}

function CreateWishlistPageContent() {
  const router = useRouter();
  const { config } = useSiteConfig();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<ItemInput[]>([
    { itemName: '', description: '', shopLink: '', groupNumber: 1 },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [existingWishlists, setExistingWishlists] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchExistingWishlists();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userAPI.getAll();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchExistingWishlists = async () => {
    try {
      const response = await wishlistAPI.getAll();
      const ownerNames = (response.data || []).map((w: any) => (w.ownerName || '').trim());
      setExistingWishlists(ownerNames);
    } catch (err) {
      console.error('Failed to load existing wishlists:', err);
    }
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userName = e.target.value;
    if (!userName) {
      setSelectedUser('');
      setSelectedCategory('');
      return;
    }

    const hasWishlist = existingWishlists.some(
      (name) => name.toLowerCase() === userName.trim().toLowerCase()
    );

    if (hasWishlist) {
      alert(`${userName} already has a wishlist. Each user can only create one wishlist.`);
      setSelectedUser('');
      setSelectedCategory('');
      return;
    }

    setSelectedUser(userName);

    const user = users.find((u) => u.fullName === userName);
    if (user) {
      setSelectedCategory(user.category);
    }
  };

  const handleAddItem = () => {
    // Default next item to the group of the last item or Group 1
    const lastGroup = items.length > 0 ? (items[items.length - 1].groupNumber || 1) : 1;
    setItems([...items, { itemName: '', description: '', shopLink: '', groupNumber: lastGroup }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof ItemInput, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        items: validItems.map((item) => ({
          ...item,
          groupNumber: Number(item.groupNumber) || 1,
        })),
        groupNotes: JSON.stringify({
          titles: {
            "1": "Option 1",
            "2": "Option 2",
            "3": "Option 3",
            "4": "Option 4"
          },
          fallbacks: {
            "1": "If Option 1 is not available, proceed with Option 2",
            "2": "If Option 2 is not available, proceed with Option 3"
          }
        }),
      });

      alert('Wishlist created successfully!');
      router.push(`/wishlist/${response.data.uniqueSlug}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-10 px-4 transition-colors duration-300"
      style={{ backgroundColor: config.colors.bg || '#F7F3E8' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium cursor-pointer group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Wishlists
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-[#DFD7C7] shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{config.eventEmoji || '🎁'}</div>
            <h1
              className="font-holiday text-2xl md:text-3xl font-bold mb-1"
              style={{ color: config.colors.primary || '#4A1521' }}
            >
              Create Your Wishlist
            </h1>
            <p className="text-[#6E5D4F] text-sm">Tell everyone what you&apos;d love this season!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                Who are you? <span className="text-red-500">*</span>
              </label>
              {loadingUsers ? (
                <div className="flex items-center gap-2 text-gray-400 py-3 text-sm">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading registered names…
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedUser}
                    onChange={handleUserSelect}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900 bg-white/80 text-sm transition cursor-pointer"
                    required
                  >
                    <option value="">Select your name…</option>
                    {users.map((user) => {
                      const hasWishlist = existingWishlists.some(
                        (name) => name.toLowerCase() === user.fullName.trim().toLowerCase()
                      );
                      return (
                        <option
                          key={user.id}
                          value={user.fullName}
                          disabled={hasWishlist}
                          className={hasWishlist ? 'text-gray-400 bg-gray-100 italic' : 'text-gray-900'}
                        >
                          {user.fullName} ({user.category}){hasWishlist ? ' — (Already listed)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1.5">
                Don&apos;t see your name?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  style={{ color: config.colors.primary }}
                  className="font-semibold cursor-pointer transition-opacity hover:opacity-80"
                >
                  Register here first →
                </button>
              </p>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                Personal Note{' '}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Happy holidays! I appreciate any gift, but here are some ideas…"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900 bg-white/80 placeholder-gray-400 text-sm transition resize-none"
              />
            </div>

            {/* Items Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Wishlist Items <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="relative p-4 bg-gray-50/80 rounded-xl border border-gray-100 hover:border-gray-200 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Item {index + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        placeholder="Item name *"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825] text-gray-900 bg-white placeholder-gray-400 transition"
                        required
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Description (e.g., Size M, Blue color, Brand)"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825] text-gray-900 bg-white placeholder-gray-400 transition"
                      />
                      <input
                        type="url"
                        value={item.shopLink}
                        onChange={(e) => handleItemChange(index, 'shopLink', e.target.value)}
                        placeholder="Shopee/Lazada link (Optional)"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825] text-gray-900 bg-white placeholder-gray-400 transition"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <label className="text-xs font-semibold text-[#7A5B3E] uppercase tracking-wide shrink-0">
                          Wish Option:
                        </label>
                        <select
                          value={item.groupNumber || 1}
                          onChange={(e) => handleItemChange(index, 'groupNumber' as any, Number(e.target.value) as any)}
                          className="border border-[#DFD7C7] rounded-md px-2 py-1 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#581825] cursor-pointer"
                        >
                          <option value={1}>Option 1</option>
                          <option value={2}>Option 2</option>
                          <option value={3}>Option 3</option>
                          <option value={4}>Option 4</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="mt-3 w-full border-2 border-dashed border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50/50 transition-all cursor-pointer text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Another Item
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: config.colors.secondary || '#1E4D38' }}
              className="w-full disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Wishlist…
                </span>
              ) : (
                '✨ Create Wishlist'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateWishlistPage() {
  return (
    <ProtectedRoute>
      <CreateWishlistPageContent />
    </ProtectedRoute>
  );
}
