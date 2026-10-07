import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  placeholder = 'მოძებნე კერძი, ინგრედიენტი (მაგ. ქათამი, შოკოლადი, ოსპი)...'
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F6A62] dark:text-[#A09B90]">
        <Search className="w-4 h-4 text-[#7C8B70] dark:text-[#8F9E84]" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#201E1B] border border-[#E7E2D9] dark:border-[#2F2C27] rounded-md text-sm text-[#222222] dark:text-[#ECE8E1] placeholder-[#A49F96] dark:placeholder-[#6E6A62] focus:outline-none focus:border-[#7C8B70] dark:focus:border-[#8F9E84] focus:ring-1 focus:ring-[#7C8B70] transition-all shadow-2xs"
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-[#6F6A62] dark:text-[#A09B90] hover:text-[#222222] dark:hover:text-[#ECE8E1] transition-colors"
          aria-label="ძიების გასუფთავება"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
