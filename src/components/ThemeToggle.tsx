import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = ''
}) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      className={`cursor-pointer relative p-2 rounded-md border transition-all duration-200 select-none ${
        isDark
          ? 'bg-[#201E1B] border-[#2F2C27] text-[#EDEAE3] hover:bg-[#282622] hover:border-[#3D3933]'
          : 'bg-white border-[#E7E2D9] text-[#222222] hover:bg-[#F2EFE8] hover:border-[#D1C9BC]'
      } ${className}`}
      aria-label={isDark ? 'დღის რეჟიმზე გადართვა' : 'ღამის რეჟიმზე გადართვა'}
      title={isDark ? 'დღის რეჟიმი' : 'ღამის რეჟიმი'}
    >
      <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E6AF2E] transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#7C8B70] transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </div>
    </button>
  );
};
