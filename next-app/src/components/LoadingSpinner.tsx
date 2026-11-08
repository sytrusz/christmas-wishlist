'use client';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-6 animate-bounce-slow">🎁</div>
        <p className="text-xl font-semibold text-gray-700 mb-1">Loading wishlists…</p>
        <p className="text-sm text-gray-400 mb-6">Just a moment ☕</p>
        <div className="flex gap-2 justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-bounce" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-bounce animation-delay-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-bounce animation-delay-400" />
        </div>
      </div>
    </div>
  );
}
