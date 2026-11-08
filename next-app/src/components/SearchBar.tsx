'use client';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7E70] pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search by name…"
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#DFD7C7] text-sm md:text-base text-[#3A3026] placeholder-[#9C8F80] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#581825] focus:border-transparent transition"
      />
    </div>
  );
}
