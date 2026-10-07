import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#222222] text-[#F8F6F1] px-4 py-2.5 rounded-md shadow-lg border border-[#444444] text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <CheckCircle2 className="w-4 h-4 text-[#7C8B70] shrink-0" />
      <span>{message}</span>
    </div>
  );
};
