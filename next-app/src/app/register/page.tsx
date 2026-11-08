'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useSiteConfig } from '@/context/SiteConfigContext';

function RegisterPageContent() {
  const router = useRouter();
  const { config } = useSiteConfig();
  const [fullName, setFullName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = config.categories && config.categories.length > 0
    ? config.categories
    : [
        { key: 'ADULT', label: 'Adults', emoji: '👨' },
        { key: 'KID', label: 'Kids', emoji: '👶' },
        { key: 'PET', label: 'Pets', emoji: '🐾' },
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!category) {
      alert('Please select a category');
      return;
    }

    try {
      setLoading(true);
      await userAPI.register({
        fullName: fullName.trim(),
        category: category,
      });
      alert('Registration successful! You can now create your wishlist.');
      router.push('/create');
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Registration failed. This name might already exist.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10 px-4 transition-colors duration-300"
      style={{ backgroundColor: config.colors.bg || '#F7F3E8' }}
    >
      <div className="w-full max-w-md">
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
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#DFD7C7] shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{config.eventEmoji || '🎄'}</div>
            <h1
              className="font-holiday text-2xl md:text-3xl font-bold mb-1"
              style={{ color: config.colors.primary || '#581825' }}
            >
              Create Your Account
            </h1>
            <p className="text-[#6E5D4F] text-sm">Register to make your wishlist</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-900 bg-white/80 placeholder-gray-400 text-sm transition"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2.5">
                {categories.map((cat) => {
                  const isSelected = category === cat.key;
                  return (
                    <label
                      key={cat.key}
                      style={
                        isSelected
                          ? {
                              borderColor: config.colors.primary,
                              backgroundColor: `${config.colors.primary}0D`,
                            }
                          : undefined
                      }
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'shadow-xs'
                          : 'border-gray-100 bg-white/60 hover:bg-white/90 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.key}
                        checked={isSelected}
                        onChange={(e) => setCategory(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl">{cat.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{cat.label}</div>
                        <div className="text-xs text-gray-500">For {cat.label.toLowerCase()} wishlist</div>
                      </div>
                      {isSelected && (
                        <span
                          style={{
                            backgroundColor: config.colors.primary,
                          }}
                          className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                        >
                          Selected
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: config.colors.primary,
              }}
              className="w-full disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registering…
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <ProtectedRoute>
      <RegisterPageContent />
    </ProtectedRoute>
  );
}
