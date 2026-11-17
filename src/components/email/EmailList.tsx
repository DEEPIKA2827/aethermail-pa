'use client';

import React, { useState } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import {
  Search,
  Star,
  ChevronDown,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ResponsibilityBadge } from '@/components/ui/Badge';
import { ResponsibilityType } from '@/types/email';

export const EmailList: React.FC = () => {
  const {
    filteredEmails,
    selectedEmailId,
    setSelectedEmailId,
    clients,
    searchQuery,
    setSearchQuery,
    toggleEmailStar,
    setResponsibility,
    setIsSimulateModalOpen,
    isSyncing,
    isAccountSwitching,
    setMobileShowDetail,
  } = useEmailContext();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<'all' | 'unread' | 'important' | 'meeting'>('all');

  // Quick pill filtered
  const displayedEmails = filteredEmails.filter((e) => {
    if (quickFilter === 'unread' && !e.unread) return false;
    if (quickFilter === 'important' && !e.important) return false;
    if (quickFilter === 'meeting' && !e.meetingDetails) return false;
    return true;
  });

  const RESPONSIBILITIES: ResponsibilityType[] = [
    'Client to Reply',
    'Assistant to Reply',
    'No Reply Needed',
    'Needs Review',
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#E6E4DD] overflow-hidden">
      {/* Top Search & Filter Bar */}
      <div className="p-3 border-b border-[#E6E4DD] space-y-2 bg-white">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emails or summaries..."
            className="w-full pl-8 pr-6 py-1.5 rounded-md bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#18181B] text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setQuickFilter('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              quickFilter === 'all'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:bg-[#F4F4F5]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setQuickFilter('unread')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              quickFilter === 'unread'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:bg-[#F4F4F5]'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setQuickFilter('important')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              quickFilter === 'important'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:bg-[#F4F4F5]'
            }`}
          >
            Important
          </button>
          <button
            onClick={() => setQuickFilter('meeting')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              quickFilter === 'meeting'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:bg-[#F4F4F5]'
            }`}
          >
            Meetings
          </button>
        </div>
      </div>

      {/* Email Items Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E6E4DD]">
        {isSyncing || isAccountSwitching ? (
          <div className="p-3 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-[#E6E4DD] bg-[#FAF9F5] animate-pulse space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="w-24 h-3 rounded bg-[#E4E4E7]" />
                  <div className="w-10 h-3 rounded bg-[#E4E4E7]" />
                </div>
                <div className="w-3/4 h-3.5 rounded bg-[#E4E4E7]" />
                <div className="w-full h-2.5 rounded bg-[#E4E4E7]/60" />
              </div>
            ))}
          </div>
        ) : displayedEmails.length === 0 ? (
          <div className="p-8 text-center text-[#71717A] text-xs space-y-2">
            <p className="font-medium text-[#18181B]">No emails found</p>
            <p className="text-[11px] text-[#A1A1AA]">Try switching filters or simulating a new email.</p>
            <button
              onClick={() => setIsSimulateModalOpen(true)}
              className="mt-2 px-2.5 py-1 rounded bg-[#18181B] text-white text-xs font-medium"
            >
              + Test Email
            </button>
          </div>
        ) : (
          displayedEmails.map((email) => {
            const isSelected = selectedEmailId === email.id;
            const client = clients.find((c) => c.id === email.clientId);
            const isDropdownOpen = openDropdownId === email.id;

            return (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmailId(email.id);
                  setMobileShowDetail(true);
                }}
                className={`group relative p-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#F4F4F5]'
                    : email.unread
                    ? 'bg-white hover:bg-[#FAF9F5]'
                    : 'bg-[#FAF9F5]/40 hover:bg-[#FAF9F5]'
                }`}
              >
                {/* Row 1: Unread dot + Sender Name + client tag on left; timestamp + star on right */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {email.unread ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" title="Unread" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                    )}
                    <span className={`text-xs truncate ${email.unread ? 'font-bold text-[#18181B]' : 'font-medium text-[#27272A]'}`}>
                      {email.senderName}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA] shrink-0">
                      · {client ? client.name.split(' ')[0] : 'Client'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-[#A1A1AA]">
                    <span className="text-[11px] font-mono">{email.receivedAt}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmailStar(email.id);
                      }}
                      className={`p-0.5 rounded hover:text-[#18181B] transition-colors ${
                        email.important ? 'text-[#F59E0B]' : 'text-[#D4D4D8]'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${email.important ? 'fill-[#F59E0B]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Delegation Note Highlight (if delegated) */}
                {email.clientDelegationNote && (
                  <div className="ml-3 mb-1 px-2 py-0.5 rounded bg-[#FAF5FF] border border-[#F3E8FF] text-[10px] text-[#6B21A8] flex items-center gap-1">
                    <RotateCcw className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate italic">"{email.clientDelegationNote}"</span>
                  </div>
                )}

                {/* Row 2: Subject line in medium weight */}
                <h4 className={`text-xs ml-3 line-clamp-1 mb-1 ${email.unread ? 'font-semibold text-[#18181B]' : 'font-medium text-[#27272A]'}`}>
                  {email.subject}
                </h4>

                {/* Row 3: 1-line truncated summary in muted grey */}
                <p className="text-[11px] text-[#71717A] ml-3 line-clamp-1 leading-relaxed mb-2">
                  {email.aiSummary}
                </p>

                {/* Row 4: Single clickable classification pill */}
                <div className="ml-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdownId(isDropdownOpen ? null : email.id)}
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                      title="Click to reassign classification"
                    >
                      <ResponsibilityBadge responsibility={email.responsibility} size="sm" />
                      <ChevronDown className="w-3 h-3 text-[#71717A]" />
                    </button>

                    {/* Inline Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-44 rounded-lg bg-white border border-[#E6E4DD] shadow-lg p-1 z-30 animate-in fade-in zoom-in-95 text-xs">
                        {RESPONSIBILITIES.map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setResponsibility(email.id, r);
                              setOpenDropdownId(null);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between text-xs transition-colors ${
                              email.responsibility === r
                                ? 'bg-[#F4F4F5] text-[#18181B] font-semibold'
                                : 'hover:bg-[#FAF9F5] text-[#52525B]'
                            }`}
                          >
                            <span>{r}</span>
                            {email.responsibility === r && (
                              <Check className="w-3 h-3 text-[#18181B]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
