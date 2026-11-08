'use client';

import { useRouter } from 'next/navigation';
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

const categoryColors: Record<string, string> = {
  ADULT: 'bg-[#FDECEC] text-[#9E3547]',
  KID:   'bg-[#EAF3FA] text-[#2C628D]',
  PET:   'bg-[#F7EFE4] text-[#8C6239]',
};

export default function WishlistCard({ wishlist }: { wishlist: Wishlist }) {
  const router = useRouter();
  const { config } = useSiteConfig();
  const itemCount = wishlist.items?.length ?? 0;
  const categoryObj = config.categories?.find((c) => c.key.toUpperCase() === (wishlist.category || '').toUpperCase());
  const categoryLabel = categoryObj ? `${categoryObj.emoji} ${categoryObj.label}` : wishlist.category;
  const badgeClass = categoryColors[wishlist.category];
  const groupCount = new Set((wishlist.items || []).map((i) => i.groupNumber || 1)).size;

  return (
    <div
      onClick={() => router.push(`/wishlist/${wishlist.uniqueSlug}`)}
      className="group bg-white rounded-2xl p-5 cursor-pointer border border-[#EBE4D8] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99] flex flex-col justify-between"
    >
      <div>
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-holiday font-bold text-base md:text-lg text-[#1F1915] leading-snug break-words">
            {wishlist.ownerName}
          </h3>
          <span
            style={
              !badgeClass
                ? {
                    backgroundColor: `${config.colors.primary}18`,
                    color: config.colors.primary,
                  }
                : undefined
            }
            className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              badgeClass || ''
            }`}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Items preview */}
        <div className="space-y-1.5 mb-4">
          {itemCount > 0 ? (
            wishlist.items!.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <span
                  style={{ backgroundColor: config.colors.primary || '#8C2E3C' }}
                  className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                />
                <p className="text-xs md:text-sm text-[#4A3F35] truncate">{item.itemName}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#9E9182] italic">No items added yet</p>
          )}
          {itemCount > 4 && (
            <p
              style={{ color: config.colors.primary || '#8C2E3C' }}
              className="text-xs font-semibold pl-3.5"
            >
              +{itemCount - 4} more
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
        <span className="text-[10px] font-medium bg-[#FAF5EE] border border-[#E8DEC9] text-[#7A5B3E] px-2 py-0.5 rounded-md flex items-center gap-1">
          {groupCount > 1 ? '🏷️ Options 1, 2...' : '👕 Theme Outfit Needs'}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8A7C6E]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          <span
            style={{ color: config.colors.primary || '#8C2E3C' }}
            className="text-xs font-semibold group-hover:underline"
          >
            View →
          </span>
        </div>
      </div>
    </div>
  );
}
