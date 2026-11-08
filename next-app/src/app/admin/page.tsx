'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI, wishlistAPI, authAPI, settingsAPI, uploadAPI } from '@/services/api';
import { AdminRoute } from '@/components/ProtectedRoute';
import { SiteConfig, SiteCategory } from '@/types/config';
import { DEFAULT_SITE_CONFIG, THEME_PRESETS } from '@/lib/defaultConfig';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface User {
  id: number;
  fullName: string;
  category: string;
}

interface Wishlist {
  id: number;
  ownerName: string;
  uniqueSlug: string;
  category: string;
  items?: any[];
}

function AdminPageContent() {
  const router = useRouter();
  const { refreshConfig } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'users' | 'wishlists' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Full Site Configuration
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  // New Category Form State
  const [newCatEmoji, setNewCatEmoji] = useState('🎁');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatKey, setNewCatKey] = useState('');

  // Image Upload State & Refs
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingModal, setUploadingModal] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);

  // User Management
  const [userForm, setUserForm] = useState({ fullName: '', category: 'ADULT' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchWishlists();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await settingsAPI.getConfig();
      if (res.data) {
        setSiteConfig(res.data);
        if (res.data.categories?.length > 0 && !userForm.category) {
          setUserForm((prev) => ({ ...prev, category: res.data.categories[0].key }));
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      if (err.response && err.response.status === 401) authAPI.logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getAll();
      setWishlists(response.data || []);
    } catch (err) {
      console.error('Failed to fetch wishlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.delete(id);
      alert('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const handleDeleteWishlist = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this wishlist?')) return;
    try {
      await wishlistAPI.delete(id);
      alert('Wishlist deleted successfully');
      fetchWishlists();
    } catch (err) {
      console.error(err);
      alert('Failed to delete wishlist');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({ fullName: user.fullName, category: user.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setUserForm({
      fullName: '',
      category: siteConfig.categories[0]?.key || 'ADULT',
    });
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName.trim()) return;

    try {
      if (editingUser) {
        await userAPI.update(editingUser.id, userForm);
        alert('User updated successfully');
      } else {
        await userAPI.register(userForm);
        alert('User created successfully');
      }
      handleCancelEdit();
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save user');
    }
  };

  // --- Setting Handlers ---
  const handleSaveAllSettings = async () => {
    setSavingSettings(true);
    setSaveSuccess(false);
    try {
      await settingsAPI.updateConfig(siteConfig);
      await refreshConfig();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    setSiteConfig((prev) => ({
      ...prev,
      themePreset: presetKey,
      colors: { ...prev.colors, ...preset.colors },
    }));
  };

  const handleResetToDefault = () => {
    if (!window.confirm('Reset all configuration, colors, and branding to Holiday Plaid defaults?')) return;
    setSiteConfig(DEFAULT_SITE_CONFIG);
  };

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return;
    const key = (newCatKey.trim() || newCatLabel.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_'));
    if (siteConfig.categories.some((c) => c.key === key)) {
      alert('Category key already exists! Please use a unique key.');
      return;
    }
    const newCat: SiteCategory = {
      key,
      label: newCatLabel.trim(),
      emoji: newCatEmoji || '🎁',
    };
    setSiteConfig((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
    setNewCatLabel('');
    setNewCatKey('');
    setNewCatEmoji('🎁');
  };

  const handleDeleteCategory = (key: string) => {
    if (siteConfig.categories.length <= 1) {
      alert('You must have at least one category.');
      return;
    }
    if (!window.confirm(`Delete category "${key}"?`)) return;
    setSiteConfig((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.key !== key),
    }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingBanner(true);
      const res = await uploadAPI.uploadImage(file, 'banner');
      if (res.data?.url) {
        setSiteConfig((prev) => ({
          ...prev,
          banner: { ...prev.banner, imageUrl: res.data.url },
        }));
      }
    } catch (err: any) {
      console.error('Banner upload failed:', err);
      alert(err.response?.data?.error || 'Failed to upload banner image');
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const handleModalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingModal(true);
      const res = await uploadAPI.uploadImage(file, 'modal');
      if (res.data?.url) {
        setSiteConfig((prev) => ({
          ...prev,
          banner: { ...prev.banner, modalImageUrl: res.data.url },
        }));
      }
    } catch (err: any) {
      console.error('Modal image upload failed:', err);
      alert(err.response?.data?.error || 'Failed to upload modal image');
    } finally {
      setUploadingModal(false);
      if (modalInputRef.current) modalInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-holiday text-3xl md:text-4xl font-bold text-[#4A1521]">
              ⚙️ Admin Dashboard
            </h1>
            <p className="text-sm text-[#6E5D4F] mt-1">
              Manage users, wishlists, and full site branding & colors.
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => router.push('/')}
              className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 transition shadow-xs cursor-pointer"
            >
              ← Back to Site
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-[#581825] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <span>👥</span> Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlists')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wishlists'
                ? 'bg-[#581825] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <span>🎁</span> Wishlists ({wishlists.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#581825] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <span>🎨</span> Theme & Customization
          </button>
        </div>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl p-6 shadow-sm">
                <h2 className="font-holiday text-xl font-bold mb-4 text-[#4A1521]">
                  {editingUser ? '✏️ Edit User' : '➕ Register User'}
                </h2>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5D4F] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5D4F] mb-1">
                      Category
                    </label>
                    <select
                      value={userForm.category}
                      onChange={(e) => setUserForm({ ...userForm, category: e.target.value })}
                      className="w-full bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825]"
                    >
                      {siteConfig.categories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.emoji} {c.label} ({c.key})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#581825] hover:bg-[#43111B] text-white py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer"
                    >
                      {editingUser ? 'Update User' : 'Register User'}
                    </button>
                    {editingUser && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#D8C6B0] flex justify-between items-center bg-white/40">
                  <h3 className="font-semibold text-sm text-[#4A1521]">Registered Names ({users.length})</h3>
                </div>
                <div className="divide-y divide-[#EAE0D2] max-h-[600px] overflow-y-auto">
                  {users.map((u) => {
                    const catObj = siteConfig.categories.find((c) => c.key === u.category);
                    return (
                      <div key={u.id} className="p-4 flex items-center justify-between hover:bg-white/50 transition">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{catObj?.emoji || '👤'}</span>
                          <div>
                            <p className="font-semibold text-sm text-[#1F1915]">{u.fullName}</p>
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5EDE1] text-[#7A5B3E] uppercase mt-0.5">
                              {catObj?.label || u.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(u)}
                            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {users.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-12">No registered users yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WISHLISTS TAB */}
        {activeTab === 'wishlists' && (
          <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#D8C6B0] bg-white/40 flex justify-between items-center">
              <h3 className="font-semibold text-sm text-[#4A1521]">Active Wishlists ({wishlists.length})</h3>
            </div>
            <div className="divide-y divide-[#EAE0D2]">
              {wishlists.map((w) => (
                <div key={w.id} className="p-4 flex items-center justify-between hover:bg-white/50 transition">
                  <div>
                    <h4 className="font-bold text-sm text-[#1F1915]">{w.ownerName}</h4>
                    <p className="text-xs text-[#7A5B3E] mt-0.5">
                      Slug: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E0D3C1]">{w.uniqueSlug}</code> • Category: {w.category} • Items: {w.items?.length || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/wishlist/${w.uniqueSlug}`)}
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteWishlist(w.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {wishlists.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-12">No wishlists created yet.</p>
              )}
            </div>
          </div>
        )}

        {/* THEME & CUSTOMIZATION TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Top notification */}
            {saveSuccess && (
              <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between animate-fade-in">
                <span>✅ All theme, banner, and branding settings saved globally!</span>
                <span className="text-xs">Live update applied.</span>
              </div>
            )}

            {/* Quick Theme Presets */}
            <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-holiday text-lg font-bold text-[#4A1521]">🎨 Theme Presets</h3>
                  <p className="text-xs text-[#6E5D4F]">Click a preset to quickly apply a coordinated color scheme.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-xs font-semibold text-[#581825] hover:underline cursor-pointer"
                >
                  ↺ Reset to Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                  const isActive = siteConfig.themePreset === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleApplyPreset(key)}
                      className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                        isActive
                          ? 'border-[#581825] bg-white shadow-sm ring-2 ring-[#581825]/20'
                          : 'border-[#E2D4C3] bg-white/70 hover:bg-white hover:border-[#C4B099]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-xs"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-xs"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-xs"
                          style={{ backgroundColor: preset.colors.bg }}
                        />
                      </div>
                      <p className="font-bold text-xs text-[#2A1810]">{preset.name}</p>
                      {isActive && (
                        <span className="absolute top-2 right-2 text-[10px] bg-[#581825] text-white px-1.5 py-0.5 rounded-full font-bold">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Branding & Titles */}
            <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-holiday text-lg font-bold text-[#4A1521] mb-1">🎄 Event Branding</h3>
              <p className="text-xs text-[#6E5D4F] mb-5">Customize the title, subtitle, and icons displayed at the top of the homepage.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5D4F] mb-1.5">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={siteConfig.eventTitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, eventTitle: e.target.value })}
                    className="w-full bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825]"
                    placeholder="e.g. Christmas Wishlist 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5D4F] mb-1.5">
                    Header Emoji
                  </label>
                  <input
                    type="text"
                    value={siteConfig.eventEmoji}
                    onChange={(e) => setSiteConfig({ ...siteConfig, eventEmoji: e.target.value })}
                    className="w-full bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825]"
                    placeholder="e.g. 🎄 or 🎁"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5D4F] mb-1.5">
                    Event Subtitle
                  </label>
                  <input
                    type="text"
                    value={siteConfig.eventSubtitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, eventSubtitle: e.target.value })}
                    className="w-full bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#581825]"
                    placeholder="e.g. Tis' the season… to politely ask for gifts."
                  />
                </div>
              </div>
            </div>

            {/* Custom Color Palette */}
            <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-holiday text-lg font-bold text-[#4A1521] mb-1">🎨 Custom Color Palette</h3>
              <p className="text-xs text-[#6E5D4F] mb-5">Fine-tune individual hex colors across buttons, header, and footer.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Background */}
                <div className="bg-white p-3 rounded-xl border border-[#D8C6B0]">
                  <label className="block text-[11px] font-semibold text-[#5C4F42] mb-1">Page Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.bg}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: { ...siteConfig.colors, bg: e.target.value },
                      })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={siteConfig.colors.bg}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: { ...siteConfig.colors, bg: e.target.value },
                      })}
                      className="text-xs font-mono w-20 border border-gray-200 rounded px-1.5 py-1"
                    />
                  </div>
                </div>

                {/* Primary Button */}
                <div className="bg-white p-3 rounded-xl border border-[#D8C6B0]">
                  <label className="block text-[11px] font-semibold text-[#5C4F42] mb-1">Primary Button</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.primary}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: {
                          ...siteConfig.colors,
                          primary: e.target.value,
                          primaryHover: e.target.value,
                        },
                      })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={siteConfig.colors.primary}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: {
                          ...siteConfig.colors,
                          primary: e.target.value,
                          primaryHover: e.target.value,
                        },
                      })}
                      className="text-xs font-mono w-20 border border-gray-200 rounded px-1.5 py-1"
                    />
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="bg-white p-3 rounded-xl border border-[#D8C6B0]">
                  <label className="block text-[11px] font-semibold text-[#5C4F42] mb-1">Secondary Button</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.secondary}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: {
                          ...siteConfig.colors,
                          secondary: e.target.value,
                          secondaryHover: e.target.value,
                        },
                      })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={siteConfig.colors.secondary}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: {
                          ...siteConfig.colors,
                          secondary: e.target.value,
                          secondaryHover: e.target.value,
                        },
                      })}
                      className="text-xs font-mono w-20 border border-gray-200 rounded px-1.5 py-1"
                    />
                  </div>
                </div>

                {/* Header Title Color */}
                <div className="bg-white p-3 rounded-xl border border-[#D8C6B0]">
                  <label className="block text-[11px] font-semibold text-[#5C4F42] mb-1">Header Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.headerText}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: { ...siteConfig.colors, headerText: e.target.value },
                      })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={siteConfig.colors.headerText}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: { ...siteConfig.colors, headerText: e.target.value },
                      })}
                      className="text-xs font-mono w-20 border border-gray-200 rounded px-1.5 py-1"
                    />
                  </div>
                </div>

                {/* Footer Background */}
                <div className="bg-white p-3 rounded-xl border border-[#D8C6B0]">
                  <label className="block text-[11px] font-semibold text-[#5C4F42] mb-1">Footer Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={siteConfig.colors.footerBg}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: { ...siteConfig.colors, footerBg: e.target.value },
                      })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={siteConfig.colors.footerBg}
                      onChange={(e) => setSiteConfig({
                        ...siteConfig,
                        themePreset: 'custom',
                        colors: { ...siteConfig.colors, footerBg: e.target.value },
                      })}
                      className="text-xs font-mono w-20 border border-gray-200 rounded px-1.5 py-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Banner & Style Guide */}
            <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-holiday text-lg font-bold text-[#4A1521] mb-1">🖼️ Event Banner & Theme Modal</h3>
              <p className="text-xs text-[#6E5D4F] mb-5">Configure the hero banner image and the clickable dress code/outfit modal.</p>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bannerEnabled"
                    checked={siteConfig.banner.enabled}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      banner: { ...siteConfig.banner, enabled: e.target.checked },
                    })}
                    className="w-4 h-4 text-[#581825] rounded"
                  />
                  <label htmlFor="bannerEnabled" className="text-sm font-semibold text-[#2A1810]">
                    Enable Event Banner on Homepage
                  </label>
                </div>

                {siteConfig.banner.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 border-l-2 border-[#D8C6B0]">
                    {/* Banner Image Uploader & URL */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-semibold text-[#6E5D4F]">
                        Banner Image
                      </label>

                      {/* Image Preview if available */}
                      {siteConfig.banner.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-[#D8C6B0] bg-white p-2.5 flex items-center justify-between gap-4 shadow-2xs">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img
                              src={siteConfig.banner.imageUrl}
                              alt="Banner preview"
                              className="h-14 w-28 object-cover rounded-lg border border-[#D8C6B0] shrink-0 bg-[#F7F3E8]"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#4A1521]">Active Banner Image</p>
                              <p className="text-[11px] font-mono text-gray-500 truncate max-w-xs">{siteConfig.banner.imageUrl}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => bannerInputRef.current?.click()}
                              disabled={uploadingBanner}
                              className="bg-[#FAF5EE] hover:bg-[#F2ECE1] text-[#581825] border border-[#D8C6B0] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition disabled:opacity-50"
                            >
                              {uploadingBanner ? 'Uploading…' : 'Change Image'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Upload Button + URL Input */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="file"
                          ref={bannerInputRef}
                          onChange={handleBannerUpload}
                          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          disabled={uploadingBanner}
                          className="inline-flex items-center justify-center gap-2 bg-[#581825] hover:bg-[#43111B] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {uploadingBanner ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Uploading…
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Upload Banner
                            </>
                          )}
                        </button>
                        <input
                          type="text"
                          value={siteConfig.banner.imageUrl}
                          onChange={(e) => setSiteConfig({
                            ...siteConfig,
                            banner: { ...siteConfig.banner, imageUrl: e.target.value },
                          })}
                          className="flex-1 bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2 text-sm placeholder-gray-400"
                          placeholder="Or paste image URL (e.g. /holiday-plaid-theme-banner.jpg or https://...)"
                        />
                      </div>
                      <p className="text-[11px] text-[#7A5B3E]">
                        Recommended: Wide hero banner (e.g. 1920×400 or 1200×300). Supports JPG, PNG, WebP up to 5MB.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                      <input
                        type="checkbox"
                        id="modalEnabled"
                        checked={siteConfig.banner.modalEnabled}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          banner: { ...siteConfig.banner, modalEnabled: e.target.checked },
                        })}
                        className="w-4 h-4 text-[#581825] rounded"
                      />
                      <label htmlFor="modalEnabled" className="text-sm font-semibold text-[#2A1810]">
                        Enable Clickable Style Guide Modal (Pop-up on banner click)
                      </label>
                    </div>

                    {siteConfig.banner.modalEnabled && (
                      <>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#6E5D4F] mb-1">Modal Title</label>
                          <input
                            type="text"
                            value={siteConfig.banner.modalTitle}
                            onChange={(e) => setSiteConfig({
                              ...siteConfig,
                              banner: { ...siteConfig.banner, modalTitle: e.target.value },
                            })}
                            className="w-full bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2 text-sm"
                            placeholder="e.g. HOLIDAY PLAID"
                          />
                        </div>

                        {/* Modal Image Uploader & URL */}
                        <div className="sm:col-span-2 space-y-2">
                          <label className="block text-xs font-semibold text-[#6E5D4F]">Modal Image (Style Guide / Outfit Mood Board)</label>

                          {siteConfig.banner.modalImageUrl && (
                            <div className="rounded-xl overflow-hidden border border-[#D8C6B0] bg-white p-2.5 flex items-center justify-between gap-4 shadow-2xs">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                  src={siteConfig.banner.modalImageUrl}
                                  alt="Modal preview"
                                  className="h-14 w-20 object-cover rounded-lg border border-[#D8C6B0] shrink-0 bg-[#F7F3E8]"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#4A1521]">Active Modal Guide</p>
                                  <p className="text-[11px] font-mono text-gray-500 truncate max-w-xs">{siteConfig.banner.modalImageUrl}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => modalInputRef.current?.click()}
                                  disabled={uploadingModal}
                                  className="bg-[#FAF5EE] hover:bg-[#F2ECE1] text-[#581825] border border-[#D8C6B0] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition disabled:opacity-50"
                                >
                                  {uploadingModal ? 'Uploading…' : 'Change Image'}
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="file"
                              ref={modalInputRef}
                              onChange={handleModalUpload}
                              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => modalInputRef.current?.click()}
                              disabled={uploadingModal}
                              className="inline-flex items-center justify-center gap-2 bg-[#1E4D38] hover:bg-[#153A2A] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {uploadingModal ? (
                                <>
                                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Uploading…
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  Upload Guide Image
                                </>
                              )}
                            </button>
                            <input
                              type="text"
                              value={siteConfig.banner.modalImageUrl}
                              onChange={(e) => setSiteConfig({
                                ...siteConfig,
                                banner: { ...siteConfig.banner, modalImageUrl: e.target.value },
                              })}
                              className="flex-1 bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2 text-sm placeholder-gray-400"
                              placeholder="Or paste image URL (e.g. /holiday-plaid-full-guide.jpg or https://...)"
                            />
                          </div>
                          <p className="text-[11px] text-[#7A5B3E]">
                            Recommended: Style guide photo, collage, or color swatches. JPG, PNG, WebP up to 5MB.
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#6E5D4F] mb-1">Modal Subtitle / Color Notes</label>
                          <input
                            type="text"
                            value={siteConfig.banner.modalSubtitle}
                            onChange={(e) => setSiteConfig({
                              ...siteConfig,
                              banner: { ...siteConfig.banner, modalSubtitle: e.target.value },
                            })}
                            className="w-full bg-white border border-[#D8C6B0] rounded-xl px-3.5 py-2 text-sm"
                            placeholder="e.g. Burgundy • Hunter Green • Ivory • Camel • Plaid"
                          />
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                      <input
                        type="checkbox"
                        id="ribbonEnabled"
                        checked={siteConfig.banner.ribbonEnabled}
                        onChange={(e) => setSiteConfig({
                          ...siteConfig,
                          banner: { ...siteConfig.banner, ribbonEnabled: e.target.checked },
                        })}
                        className="w-4 h-4 text-[#581825] rounded"
                      />
                      <label htmlFor="ribbonEnabled" className="text-sm font-semibold text-[#2A1810]">
                        Enable Plaid Tartan Ribbon Divider above Footer
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Categories Manager */}
            <div className="bg-[#FAF5EE] border border-[#D8C6B0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-holiday text-lg font-bold text-[#4A1521] mb-1">📂 Category Management</h3>
              <p className="text-xs text-[#6E5D4F] mb-5">Define the groups used to categorize wishlists (e.g. Adults, Kids, Pets, or custom teams).</p>

              <div className="space-y-4">
                <div className="divide-y divide-[#EAE0D2] bg-white rounded-xl border border-[#D8C6B0] overflow-hidden">
                  {siteConfig.categories.map((c) => (
                    <div key={c.key} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.emoji}</span>
                        <div>
                          <p className="font-bold text-sm text-[#1F1915]">{c.label}</p>
                          <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            Key: {c.key}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.key)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold px-2.5 py-1 rounded hover:bg-red-50 cursor-pointer transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Category Form */}
                <div className="p-4 bg-white/70 rounded-xl border border-[#E2D4C3]">
                  <p className="font-semibold text-xs text-[#4A1521] mb-2.5">Add New Category</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <input
                        type="text"
                        value={newCatEmoji}
                        onChange={(e) => setNewCatEmoji(e.target.value)}
                        placeholder="Emoji (e.g. 🎁)"
                        className="w-full bg-white border border-[#D8C6B0] rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newCatLabel}
                        onChange={(e) => setNewCatLabel(e.target.value)}
                        placeholder="Label (e.g. Friends)"
                        className="w-full bg-white border border-[#D8C6B0] rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="w-full bg-[#1E4D38] hover:bg-[#153A2A] text-white py-1.5 px-3 rounded-lg text-sm font-semibold transition cursor-pointer"
                      >
                        + Add Category
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Save Button Bar */}
            <div className="sticky bottom-6 bg-[#FAF5EE]/95 backdrop-blur-md border-2 border-[#581825] rounded-2xl p-4 shadow-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#4A1521]">Ready to apply changes?</p>
                <p className="text-xs text-[#7A5B3E]">Saved settings update live across all pages.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveAllSettings}
                  disabled={savingSettings}
                  className="bg-[#581825] hover:bg-[#43111B] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {savingSettings ? 'Saving…' : '💾 Save All Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
}
