'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { wishlistAPI, itemAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface WishlistItem {
  id: number;
  itemName: string;
  description?: string | null;
  shopLink?: string | null;
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

interface GroupConfig {
  titles: Record<string, string>;
  fallbacks: Record<string, string>;
}

function parseGroupConfig(raw?: string | null): GroupConfig {
  if (!raw) return { titles: {}, fallbacks: {} };
  try {
    const parsed = JSON.parse(raw);
    return {
      titles: parsed.titles || {},
      fallbacks: parsed.fallbacks || {},
    };
  } catch {
    return { titles: {}, fallbacks: {} };
  }
}

const categoryConfig: Record<string, { badge: string; emoji: string }> = {
  ADULT: { badge: 'bg-rose-100 text-rose-700', emoji: '👨' },
  KID: { badge: 'bg-sky-100 text-sky-700', emoji: '👶' },
  PET: { badge: 'bg-amber-100 text-amber-700', emoji: '🐾' },
};

function WishlistDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const { config } = useSiteConfig();
  const slug = params?.slug as string;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [editingGroupModal, setEditingGroupModal] = useState<{
    groupNum: number;
    title: string;
    fallback: string;
  } | null>(null);

  const [note, setNote] = useState('');
  const [editingItemData, setEditingItemData] = useState({
    itemName: '',
    description: '',
    shopLink: '',
    groupNumber: 1,
  });
  const [newItemData, setNewItemData] = useState({
    itemName: '',
    description: '',
    shopLink: '',
    groupNumber: 1,
  });

  useEffect(() => {
    if (slug) {
      fetchWishlist();
    }
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
      setIsEditingNote(false);
      fetchWishlist();
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const handleAddItem = async () => {
    if (!newItemData.itemName.trim()) {
      alert('Please enter an item name');
      return;
    }

    try {
      await itemAPI.add(slug, newItemData);
      setIsAddingItem(false);
      setNewItemData({ itemName: '', description: '', shopLink: '', groupNumber: 1 });
      fetchWishlist();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleSaveGroupConfig = async (groupNum: number, title: string, fallback: string) => {
    if (!wishlist) return;
    const currentConfig = parseGroupConfig(wishlist.groupNotes);
    currentConfig.titles[String(groupNum)] = title.trim();
    if (fallback.trim()) {
      currentConfig.fallbacks[String(groupNum)] = fallback.trim();
    } else {
      delete currentConfig.fallbacks[String(groupNum)];
    }

    try {
      await wishlistAPI.update(slug, { groupNotes: JSON.stringify(currentConfig) });
      setEditingGroupModal(null);
      fetchWishlist();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update group guidance');
    }
  };

  const handleDeleteWishlist = async () => {
    if (!wishlist) return;
    if (window.confirm('Are you sure you want to delete this entire wishlist?')) {
      try {
        await wishlistAPI.delete(wishlist.id);
        router.push('/');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to delete wishlist');
      }
    }
  };

  const startEditingItem = (item: WishlistItem) => {
    setEditingItemId(item.id);
    setEditingItemData({
      itemName: item.itemName,
      description: item.description || '',
      shopLink: item.shopLink || '',
      groupNumber: item.groupNumber || 1,
    });
  };

  const cancelEditingItem = () => {
    setEditingItemId(null);
    setEditingItemData({ itemName: '', description: '', shopLink: '', groupNumber: 1 });
  };

  const handleUpdateItem = async (itemId: number) => {
    if (!editingItemData.itemName.trim()) {
      alert('Item name cannot be empty');
      return;
    }

    try {
      await itemAPI.update(itemId, editingItemData);
      setEditingItemId(null);
      setEditingItemData({ itemName: '', description: '', shopLink: '', groupNumber: 1 });
      fetchWishlist();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemAPI.delete(itemId);
        fetchWishlist();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to delete item');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-10 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2 text-gray-900">Wishlist Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The wishlist you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition hover:-translate-y-0.5 shadow-sm hover:shadow-md cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const categoryInfo = config.categories?.find(
    (c) => c.key.toUpperCase() === (wishlist.category || '').toUpperCase()
  );
  const cat = categoryInfo
    ? { emoji: categoryInfo.emoji, label: categoryInfo.label }
    : {
        emoji: categoryConfig[wishlist.category]?.emoji || '🎁',
        label: wishlist.category,
      };

  return (
    <div
      className="min-h-screen py-10 px-4 transition-colors duration-300"
      style={{ backgroundColor: config.colors.bg || '#F7F3E8' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Top Nav */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors cursor-pointer group"
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
            All Wishlists
          </button>

          <button
            onClick={handleDeleteWishlist}
            className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Wishlist
          </button>
        </div>

        {process.env.NEXT_PUBLIC_IS_DEMO_MODE === 'true' &&
          (wishlist.uniqueSlug.endsWith('-demo') ||
            ['alex-doe-demo', 'charlie-demo', 'buddy-demo'].includes(wishlist.uniqueSlug)) && (
            <div className="mb-5 p-4 rounded-2xl bg-[#FFF9EC] border border-[#E8D4B0] text-[#6E4B1F] text-xs sm:text-sm flex items-start gap-3 shadow-xs">
              <span className="text-lg shrink-0">🔒</span>
              <div>
                <p className="font-bold text-[#543815] mb-0.5">Sample Showcase Wishlist</p>
                <p className="leading-relaxed">
                  This default demo wishlist and its items are protected and cannot be modified or deleted. To test adding, editing, or deleting items, feel free to create a new wishlist from the home page!
                </p>
              </div>
            </div>
          )}

        {/* Wishlist Header Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-5 border border-[#DFD7C7] shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <span
                style={{
                  backgroundColor: `${config.colors.primary}15`,
                  color: config.colors.primary,
                }}
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2"
              >
                {cat.emoji} {cat.label}
              </span>
              <h1
                className="font-holiday text-2xl md:text-3xl font-bold"
                style={{ color: config.colors.primary || '#4A1521' }}
              >
                {wishlist.ownerName}&apos;s Wishlist
              </h1>
            </div>
          </div>

          {/* Personal Note */}
          <div className="pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Personal Note</p>
            {isEditingNote ? (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900 bg-white/80 resize-none transition"
                  rows={3}
                  placeholder="Add a personal note…"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateNote}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 cursor-pointer transition"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-4">
                <p className="text-gray-600 italic text-sm leading-relaxed">
                  &ldquo;{wishlist.note || 'No note added yet.'}&rdquo;
                </p>
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-xs text-red-500 hover:text-red-700 shrink-0 font-semibold cursor-pointer transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Items Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#DFD7C7] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-holiday text-xl font-bold text-[#1F1915]">Items</h2>
              <p className="text-xs text-gray-400 mt-0.5">{wishlist.items?.length || 0} item{(wishlist.items?.length || 0) !== 1 ? 's' : ''}</p>
            </div>
            {!isAddingItem && (
              <button
                onClick={() => setIsAddingItem(true)}
                style={{ backgroundColor: config.colors.secondary || '#1E4D38' }}
                className="text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all hover:brightness-95 hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Item
              </button>
            )}
          </div>

          {/* Add New Item Form */}
          {isAddingItem && (
            <div className="mb-6 p-4 bg-[#FAF5EE] border border-[#D4B896] rounded-xl space-y-3">
              <p className="text-xs font-semibold text-[#581825] uppercase tracking-wide">Add New Wishlist Item</p>
              
              <input
                type="text"
                placeholder="Item name *"
                value={newItemData.itemName}
                onChange={(e) => setNewItemData({ ...newItemData, itemName: e.target.value })}
                className="w-full border border-[#DFD7C7] rounded-lg p-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#581825] placeholder-gray-400 transition"
              />
              
              <input
                type="text"
                placeholder="Description (optional, e.g. Size M, Burgundy rib-knit)"
                value={newItemData.description}
                onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                className="w-full border border-[#DFD7C7] rounded-lg p-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#581825] placeholder-gray-400 transition"
              />
              
              <input
                type="url"
                placeholder="Shop link (optional, e.g. https://...)"
                value={newItemData.shopLink}
                onChange={(e) => setNewItemData({ ...newItemData, shopLink: e.target.value })}
                className="w-full border border-[#DFD7C7] rounded-lg p-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#581825] placeholder-gray-400 transition"
              />

              <div className="flex flex-col sm:flex-row gap-2 items-center bg-white/70 p-2.5 rounded-lg border border-[#E8DEC9]">
                <label className="text-xs font-semibold text-[#7A5B3E] uppercase tracking-wide shrink-0">
                  Wish Option:
                </label>
                <select
                  value={newItemData.groupNumber}
                  onChange={(e) => setNewItemData({ ...newItemData, groupNumber: Number(e.target.value) })}
                  className="w-full border border-[#DFD7C7] rounded-md p-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#581825] cursor-pointer"
                >
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
                  <option value={3}>Option 3</option>
                  <option value={4}>Option 4</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-1.5 border border-[#DFD7C7] rounded-lg text-sm text-[#7A5B3E] bg-white hover:bg-gray-50 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  style={{ backgroundColor: config.colors.secondary || '#1E4D38' }}
                  className="px-4 py-1.5 text-white rounded-lg text-sm font-semibold cursor-pointer transition shadow-xs hover:brightness-95"
                >
                  Save Item
                </button>
              </div>
            </div>
          )}

          {/* Grouped Items List */}
          {(() => {
            const groupConfig = parseGroupConfig(wishlist.groupNotes);
            const groupedItems: Record<number, WishlistItem[]> = {};
            (wishlist.items || []).forEach((item) => {
              const g = item.groupNumber || 1;
              if (!groupedItems[g]) groupedItems[g] = [];
              groupedItems[g].push(item);
            });
            const groupNums = Object.keys(groupedItems).map(Number).sort((a, b) => a - b);

            if (groupNums.length === 0) {
              return (
                <div className="text-center py-10">
                  <div className="text-3xl mb-2">🎁</div>
                  <p className="text-gray-400 text-sm">No items yet. Add your first wish!</p>
                </div>
              );
            }

            let globalItemIndex = 0;

            return (
              <div className="space-y-8">
                {groupNums.map((groupNum, gIdx) => {
                  const itemsInGroup = groupedItems[groupNum];
                  const defaultTitle = `Option ${groupNum}`;
                  const groupTitle = groupConfig.titles[String(groupNum)] || defaultTitle;

                  return (
                    <div key={groupNum} className="space-y-3">
                      {/* Group Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFE8DC]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#FAF5EE] border border-[#E8DEC9] text-[#581825]">
                            🏷️ Option {groupNum}
                          </span>
                          <h3 className="font-holiday font-bold text-base md:text-lg text-[#261E17]">
                            {groupTitle}
                          </h3>
                          <span className="text-xs text-[#8A7C6E] bg-[#F5EFE6] px-2 py-0.5 rounded-full font-medium">
                            {itemsInGroup.length} {itemsInGroup.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        <button
                          onClick={() => setEditingGroupModal({
                            groupNum,
                            title: groupTitle,
                            fallback: groupConfig.fallbacks[String(groupNum)] || (groupNums[gIdx + 1] ? `If Option ${groupNum} is not available, proceed with Option ${groupNums[gIdx + 1]}` : '')
                          })}
                          className="text-xs text-[#8C2E3C] hover:text-[#581825] font-semibold cursor-pointer underline flex items-center gap-1"
                        >
                          <span>✏️ Edit Option Guidance</span>
                        </button>
                      </div>

                      {/* Items in this group */}
                      <div className="space-y-3">
                        {itemsInGroup.map((item) => {
                          globalItemIndex++;
                          const itemNumberDisplay = String(globalItemIndex).padStart(2, '0');

                          return (
                            <div
                              key={item.id}
                              className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE9DF] hover:border-[#DFD7C7] transition group"
                            >
                              {editingItemId === item.id ? (
                                <div className="space-y-2.5">
                                  <input
                                    type="text"
                                    value={editingItemData.itemName}
                                    onChange={(e) =>
                                      setEditingItemData({ ...editingItemData, itemName: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581825] transition"
                                    placeholder="Item name"
                                  />
                                  <input
                                    type="text"
                                    value={editingItemData.description}
                                    onChange={(e) =>
                                      setEditingItemData({ ...editingItemData, description: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581825] transition"
                                    placeholder="Description"
                                  />
                                  <input
                                    type="url"
                                    value={editingItemData.shopLink}
                                    onChange={(e) =>
                                      setEditingItemData({ ...editingItemData, shopLink: e.target.value })
                                    }
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581825] transition"
                                    placeholder="Shop link"
                                  />
                                  <div className="flex flex-col sm:flex-row gap-2 items-center bg-white/70 p-2 rounded-lg border border-gray-100">
                                    <label className="text-xs font-semibold text-[#7A5B3E] uppercase tracking-wide shrink-0">
                                      Wish Option:
                                    </label>
                                    <select
                                      value={editingItemData.groupNumber}
                                      onChange={(e) =>
                                        setEditingItemData({ ...editingItemData, groupNumber: Number(e.target.value) })
                                      }
                                      className="w-full border border-gray-200 rounded-md p-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#581825] transition cursor-pointer"
                                    >
                                      <option value={1}>Option 1</option>
                                      <option value={2}>Option 2</option>
                                      <option value={3}>Option 3</option>
                                      <option value={4}>Option 4</option>
                                    </select>
                                  </div>
                                  <div className="flex gap-2 justify-end pt-1">
                                    <button
                                      onClick={cancelEditingItem}
                                      className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleUpdateItem(item.id)}
                                      style={{ backgroundColor: config.colors.secondary || '#1E4D38' }}
                                      className="px-4 py-1.5 text-white rounded-lg text-sm font-semibold cursor-pointer transition hover:brightness-95"
                                    >
                                      Update
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-[#A89887]">{itemNumberDisplay}</span>
                                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                                        {item.itemName}
                                      </h4>
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-[#5C4F42] ml-6">{item.description}</p>
                                    )}
                                    {item.shopLink && (
                                      <div className="ml-6 pt-0.5">
                                        <a
                                          href={item.shopLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C2E3C] hover:text-[#581825] bg-[#FDE8E8] hover:bg-[#FCD8D8] px-2.5 py-1 rounded-full transition"
                                        >
                                          View in Shop
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                          </svg>
                                        </a>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => startEditingItem(item)}
                                      className="text-xs text-gray-500 hover:text-gray-800 font-medium cursor-pointer transition-colors px-2.5 py-1 rounded-lg hover:bg-gray-200"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="text-xs text-red-400 hover:text-red-600 font-medium cursor-pointer transition-colors px-2.5 py-1 rounded-lg hover:bg-red-50"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Fallback Transition Banner connecting to next group */}
                      {gIdx < groupNums.length - 1 && (
                        <div className="py-5 my-3">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t-2 border-dashed border-[#D4B896]" />
                            </div>
                            <div className="relative flex justify-center">
                              <div className="bg-[#FAF5EE] border-2 border-[#CBB396] px-5 py-3 rounded-2xl shadow-sm max-w-xl w-full text-center flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                                <div className="flex items-center gap-3 text-left">
                                  <span className="text-2xl animate-bounce-slow">❄️</span>
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B3E] block">
                                      Alternative Selection Rule
                                    </span>
                                    <p className="text-xs md:text-sm font-semibold text-[#581825]">
                                      &ldquo;{groupConfig.fallbacks[String(groupNum)] || `If Option ${groupNum} is not available, proceed with Option ${groupNums[gIdx + 1]}`}&rdquo;
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setEditingGroupModal({
                                    groupNum,
                                    title: groupTitle,
                                    fallback: groupConfig.fallbacks[String(groupNum)] || `If Option ${groupNum} is not available, proceed with Option ${groupNums[gIdx + 1]}`
                                  })}
                                  className="text-xs text-[#8C2E3C] hover:text-[#581825] font-semibold underline shrink-0 cursor-pointer"
                                >
                                  Edit Rule
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Edit Group Guidance Modal */}
      {editingGroupModal && (
        <div
          onClick={() => setEditingGroupModal(null)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F0] border-2 border-[#C9AE8D] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-bounce-in relative space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#E8DEC9]">
              <h3 className="font-holiday text-xl font-bold text-[#581825]">
                Option {editingGroupModal.groupNum} Guidance & Fallback
              </h3>
              <button
                onClick={() => setEditingGroupModal(null)}
                className="text-[#7A5B3E] hover:text-[#4A1521] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A5B3E] mb-1">
                Option Title / Label
              </label>
              <input
                type="text"
                value={editingGroupModal.title}
                onChange={(e) => setEditingGroupModal({ ...editingGroupModal, title: e.target.value })}
                placeholder="e.g. Option 1"
                className="w-full border border-[#DFD7C7] rounded-xl p-2.5 text-sm bg-white text-[#261E17] focus:outline-none focus:ring-2 focus:ring-[#581825]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A5B3E] mb-1">
                Fallback Rule (Connecting to Next Option)
              </label>
              <textarea
                value={editingGroupModal.fallback}
                onChange={(e) => setEditingGroupModal({ ...editingGroupModal, fallback: e.target.value })}
                placeholder="e.g. If Option 1 is not available, proceed with Option 2"
                rows={3}
                className="w-full border border-[#DFD7C7] rounded-xl p-2.5 text-sm bg-white text-[#261E17] focus:outline-none focus:ring-2 focus:ring-[#581825] resize-none"
              />
              <p className="text-[11px] text-[#8A7C6E] mt-1">
                This rule will show on the banner between options to guide gifters on what to do if these items are sold out.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingGroupModal(null)}
                className="px-4 py-2 border border-[#DFD7C7] rounded-xl text-sm text-[#7A5B3E] hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveGroupConfig(editingGroupModal.groupNum, editingGroupModal.title, editingGroupModal.fallback)}
                style={{ backgroundColor: config.colors.secondary || '#1E4D38' }}
                className="px-5 py-2 text-white rounded-xl text-sm font-semibold shadow-sm transition hover:brightness-95 cursor-pointer"
              >
                Save Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WishlistDetailPage() {
  return (
    <ProtectedRoute>
      <WishlistDetailPageContent />
    </ProtectedRoute>
  );
}
