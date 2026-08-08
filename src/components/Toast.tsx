import React from 'react';
import { Check, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-[#341F22] backdrop-blur-2xl border border-[#F3B8C2] dark:border-[#522930] text-[#5C2830] dark:text-[#F9E3E6] text-xs sm:text-sm font-bold rounded-2xl shadow-xl animate-bounce transition-colors duration-300">
      <div className="p-1 rounded-full bg-[#E892A0] text-white">
        <Check className="w-4 h-4 text-white stroke-[3]" />
      </div>
      <span>{message}</span>
    </div>
  );
};
