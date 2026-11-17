'use client';

import React, { useEffect } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import { KpiCommandStrip } from '@/components/layout/KpiCommandStrip';
import { AssistantSidebar } from '@/components/assistant/AssistantSidebar';
import { EmailList } from '@/components/email/EmailList';
import { EmailDetail } from '@/components/email/EmailDetail';

export const AssistantDashboard: React.FC = () => {
  const {
    filteredEmails,
    selectedEmailId,
    setSelectedEmailId,
    archiveEmail,
    toggleEmailStar,
    viewMode,
    setViewMode,
    setIsShortcutsModalOpen,
    toggleCopilot,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    mobileShowDetail,
    setMobileShowDetail,
  } = useEmailContext();

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      // Cmd+K / Ctrl+K for Copilot
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCopilot();
        return;
      }

      // C to switch Client / Assistant view
      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setViewMode(viewMode === 'assistant' ? 'client' : 'assistant');
        return;
      }

      // J / Down for Next
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = filteredEmails.findIndex((email) => email.id === selectedEmailId);
        if (currentIndex < filteredEmails.length - 1) {
          setSelectedEmailId(filteredEmails[currentIndex + 1].id);
          setMobileShowDetail(true);
        }
      }
      // K / Up for Prev
      else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = filteredEmails.findIndex((email) => email.id === selectedEmailId);
        if (currentIndex > 0) {
          setSelectedEmailId(filteredEmails[currentIndex - 1].id);
          setMobileShowDetail(true);
        }
      }
      // E to Archive
      else if (e.key === 'e' && selectedEmailId) {
        e.preventDefault();
        archiveEmail(selectedEmailId);
      }
      // S to Star
      else if (e.key === 's' && selectedEmailId) {
        e.preventDefault();
        toggleEmailStar(selectedEmailId);
      }
      // 1 / 2 / 3 view switchers
      else if (e.key === '1') {
        setViewMode('assistant');
      } else if (e.key === '2') {
        setViewMode('client');
      } else if (e.key === '3') {
        setViewMode('splitscreen');
      } else if (e.key === '?') {
        setIsShortcutsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredEmails, selectedEmailId, setSelectedEmailId, archiveEmail, toggleEmailStar, viewMode, setViewMode, setIsShortcutsModalOpen, toggleCopilot, setMobileShowDetail]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-[calc(100vh-53px)]">
      {/* Sleek 1-Line Briefing Strip */}
      <KpiCommandStrip />

      {/* 3-PANE WORKSPACE (MOBILE RESPONSIVE COLLAPSE) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden relative">
        {/* Pane 1: Left Sidebar (Desktop: hidden on mobile, visible on lg) */}
        <div className="hidden lg:block lg:col-span-2 xl:col-span-2 h-full overflow-hidden">
          <AssistantSidebar />
        </div>

        {/* Mobile Slide-Over Drawer for Left Sidebar (< lg) */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            {/* Slide-over Drawer Content */}
            <div className="relative w-72 max-w-[85vw] h-full bg-[#F8F7F4] shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
              <AssistantSidebar onClose={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Pane 2: Center Pane (Search, Filters & Email Conversation List) */}
        <div
          className={`${
            mobileShowDetail ? 'hidden md:block' : 'block'
          } col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-4 h-full overflow-hidden w-full`}
        >
          <EmailList />
        </div>

        {/* Pane 3: Right Pane (Conversation Detail, AI Insights & Approval-Gated Reply Composer) */}
        <div
          className={`${
            mobileShowDetail ? 'block' : 'hidden md:block'
          } col-span-12 md:col-span-7 lg:col-span-6 xl:col-span-6 h-full overflow-hidden w-full`}
        >
          <EmailDetail />
        </div>
      </div>
    </div>
  );
};
