'use client';

import React from 'react';
import { useEmailContext } from '@/context/EmailContext';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useEmailContext();

  if (!isShortcutsModalOpen) return null;

  const SHORTCUTS = [
    { key: '⌘K / Ctrl+K', label: 'Open AI Copilot Drawer' },
    { key: 'J / ↓', label: 'Next conversation thread' },
    { key: 'K / ↑', label: 'Previous conversation thread' },
    { key: 'C', label: 'Toggle between Client & Assistant View' },
    { key: 'E', label: 'Archive active thread' },
    { key: 'R', label: 'Focus draft reply composer' },
    { key: 'S', label: 'Toggle important star flag' },
    { key: 'D', label: 'Delegate thread to Client' },
    { key: '1', label: 'Switch to Assistant Dashboard' },
    { key: '2', label: 'Switch to Client Executive View' },
    { key: '3', label: 'Switch to Split-Screen Live Sync' },
    { key: '?', label: 'Open keyboard cheatsheet' },
    { key: 'Esc', label: 'Dismiss modal or clear focus' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-[95vw] sm:max-w-md rounded-2xl border border-[#E6E4DD] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#18181B]">
        <div className="flex items-center justify-between p-4 border-b border-[#E6E4DD] bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#71717A]" />
            <h3 className="text-sm font-semibold text-[#18181B]">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1 rounded text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 divide-y divide-[#E6E4DD] text-xs">
          {SHORTCUTS.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <span className="text-[#3F3F46]">{item.label}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E6E4DD] text-[#18181B] font-mono text-[11px] shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#FAF9F5] border-t border-[#E6E4DD] text-center text-[11px] text-[#71717A]">
          Press <kbd className="px-1 text-[#18181B] bg-white border border-[#E6E4DD] rounded">?</kbd> anywhere to toggle this panel
        </div>
      </div>
    </div>
  );
};
