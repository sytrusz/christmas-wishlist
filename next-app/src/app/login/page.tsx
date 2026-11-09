'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/services/api';
import { useSiteConfig } from '@/context/SiteConfigContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTimedOut = searchParams.get('reason') === 'timeout';
  const requestedAdmin = searchParams.get('admin') === 'true' || searchParams.get('role') === 'admin';
  const { config } = useSiteConfig();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(requestedAdmin);

  useEffect(() => {
    setIsAdminLogin(requestedAdmin);
  }, [requestedAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      alert('Please enter the password');
      return;
    }

    setLoading(true);

    try {
      const username = isAdminLogin ? 'admin' : 'user';
      const success = await authAPI.login(username, password.trim());

      if (success) {
        if (isAdminLogin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        alert('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4 transition-colors duration-300"
      style={{ backgroundColor: config.colors.bg || '#F7F3E8' }}
    >
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white border border-[#DFD7C7] shadow-md p-8 transform transition-all hover:scale-[1.01] duration-300 rounded-2xl">
          {/* Timeout Alert Banner */}
          {isTimedOut && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-900 text-xs font-medium animate-fade-in shadow-2xs">
              <span className="text-xl shrink-0">⏱️</span>
              <div>
                <p className="font-bold text-amber-950">Session Timed Out</p>
                <p className="text-amber-800">Your session expired due to inactivity. Please enter your password to continue.</p>
              </div>
            </div>
          )}

          {/* Animated Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              {/* Main Icon */}
              <div className="text-6xl animate-bounce">
                {isAdminLogin ? '👑' : (config.eventEmoji || '🎄')}
              </div>

              {/* Decorative Animated Elements */}
              <div className="absolute -top-2 -left-6 text-2xl animate-spin-slow">❄️</div>
              <div className="absolute -top-4 -right-4 text-xl animate-spin-slow animation-delay-300">⭐</div>
              <div className="absolute bottom-0 -right-8 text-xl animate-spin-slow animation-delay-600">✨</div>
            </div>

            {/* Web Name */}
            <h1
              className="font-holiday text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 tracking-tight"
              style={{ color: config.colors.primary || '#4A1521' }}
            >
              {config.eventTitle || 'Christmas Wishlist 2026'}
            </h1>

            {/* Login Mode Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5EFE6] text-[#7A5B3E] border border-[#E8DEC9] mb-2 shadow-2xs">
              <span>{isAdminLogin ? 'Admin Login' : 'User Login'}</span>
            </div>

            <p className="text-[#6E5D4F] text-xs sm:text-sm">
              {isAdminLogin
                ? 'Enter admin password to manage the system'
                : 'Enter password to access wishlists'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#261E17]">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#DFD7C7] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#581825] transition-all text-[#261E17] bg-white placeholder-[#9C8F80]"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Login Type Toggle */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  const nextMode = !isAdminLogin;
                  setIsAdminLogin(nextMode);
                  setPassword('');
                  router.replace(nextMode ? '/login?admin=true' : '/login');
                }}
                className="text-sm text-[#581825] hover:text-[#43111B] font-medium underline decoration-dashed underline-offset-4 hover:scale-105 transition-transform cursor-pointer"
              >
                {isAdminLogin ? 'Switch to User Login' : 'Login as Admin'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: isAdminLogin
                  ? config.colors.secondary || '#1E4D38'
                  : config.colors.primary || '#581825',
              }}
              className="w-full font-bold py-3.5 shadow-md transition-all transform hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer rounded-xl text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">❄️</span> Verifying...
                </span>
              ) : isAdminLogin ? (
                'Admin Login'
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6">
            {/* Password Hint */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex gap-3 items-center">
              <span className="text-xl">🔑</span>
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Ask admin for the password.
              </p>
            </div>
          </div>

          {/* Copyright Footer */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
              nathanm.dev © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
