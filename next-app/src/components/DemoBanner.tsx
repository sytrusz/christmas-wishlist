'use client';

export default function DemoBanner() {
  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO_MODE === 'true';

  if (!isDemo) return null;

  return (
    <aside aria-label="Demo notice" className="bg-[#2E1F18] text-[#F3EFE6] px-4 py-2 text-xs md:text-sm text-center font-medium shadow-sm flex items-center justify-center gap-2 border-b border-[#3D2C22]">
      <span>🧪 <strong>Portfolio Demo Sandbox:</strong> Feel free to test creating wishlists & items (test data auto-resets after 5 mins). Default sample data is protected and cannot be edited or deleted in User or Admin roles.</span>
    </aside>
  );
}
