'use client';

import { useSiteConfig } from '@/context/SiteConfigContext';

interface EmptyStateProps {
  onRegisterClick: () => void;
}

export default function EmptyState({ onRegisterClick }: EmptyStateProps) {
  const { config } = useSiteConfig();

  return (
    <div className="text-center py-20 px-4">
      <div className="text-7xl mb-5 animate-bounce-slow">{config.eventEmoji || '🎅'}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No Wishlists Yet!</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
        Be the first to create a wishlist and let everyone know what you&apos;d love this season!
      </p>
      <button
        onClick={onRegisterClick}
        style={{ backgroundColor: config.colors.primary || '#DC2626' }}
        className="inline-flex items-center gap-2 text-white font-semibold py-3 px-7 rounded-xl shadow-md transition-all hover:shadow-lg hover:brightness-95 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create First Wishlist
      </button>
    </div>
  );
}
