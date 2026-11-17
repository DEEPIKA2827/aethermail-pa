'use client';

import React from 'react';
import { useEmailContext } from '@/context/EmailContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEmailContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-[#2563EB] shrink-0" />;
        let borderClass = 'border-[#E6E4DD]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />;
          borderClass = 'border-[#A7F3D0]';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />;
          borderClass = 'border-[#FDE68A]';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-4 h-4 text-[#E11D48] shrink-0" />;
          borderClass = 'border-[#FECDD3]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} bg-white/95 shadow-xl backdrop-blur-md text-[#18181B] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
          >
            {icon}
            <div className="flex-1 text-xs">
              <p className="font-semibold text-[#18181B]">{toast.title}</p>
              <p className="text-[#71717A] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A1A1AA] hover:text-[#18181B] p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
