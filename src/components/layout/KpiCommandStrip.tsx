'use client';

import React from 'react';
import { useEmailContext } from '@/context/EmailContext';

export const KpiCommandStrip: React.FC = () => {
  const {
    kpiMetrics,
    filterSegment,
    setFilterSegment,
    filterResponsibility,
    setFilterResponsibility,
    setMobileShowDetail,
  } = useEmailContext();

  const isTotalActive = filterSegment === 'all' && filterResponsibility === 'all';
  const isUnreadActive = filterSegment === 'unread';
  const isAssistantActive = filterSegment === 'Assistant to Reply' || filterResponsibility === 'Assistant to Reply';
  const isClientActive = filterSegment === 'Client to Reply' || filterResponsibility === 'Client to Reply';
  const isActionActive = filterSegment === 'Action Required';
  const isWaitingActive = filterSegment === 'Waiting for Response';
  const isImportantActive = filterSegment === 'important';

  const handlePillClick = (segment: any) => {
    setFilterSegment(segment);
    setFilterResponsibility('all');
    setMobileShowDetail(false);
  };

  return (
    <div className="h-11 px-3 sm:px-5 bg-white border-b border-[#E6E4DD] flex items-center justify-between text-xs sm:text-sm select-none overflow-hidden">
      {/* Scrollable Metric Pills Container */}
      <div className="flex items-center gap-2 sm:gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar py-1 w-full shrink-0">
        {/* All */}
        <button
          onClick={() => handlePillClick('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            isTotalActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          All ({kpiMetrics.total})
        </button>

        <span className="text-[#D4D4D8] text-xs shrink-0">·</span>

        {/* Unread */}
        <button
          onClick={() => handlePillClick(isUnreadActive ? 'all' : 'unread')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            isUnreadActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Unread ({kpiMetrics.unread})
        </button>

        <span className="text-[#D4D4D8] text-xs shrink-0">·</span>

        {/* Assistant to Reply */}
        <button
          onClick={() => handlePillClick('Assistant to Reply')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            isAssistantActive
              ? 'bg-[#F0F7FF] text-[#1D4ED8] font-semibold border border-[#DBEAFE]'
              : 'text-[#71717A] hover:text-[#1D4ED8] hover:bg-[#F0F7FF]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>Assistant to Reply ({kpiMetrics.assistantToReply})</span>
        </button>

        <span className="text-[#D4D4D8] text-xs shrink-0">·</span>

        {/* Client to Reply */}
        <button
          onClick={() => handlePillClick('Client to Reply')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
            isClientActive
              ? 'bg-[#FFF4ED] text-[#C2410C] font-semibold border border-[#FFEDD5]'
              : 'text-[#71717A] hover:text-[#C2410C] hover:bg-[#FFF4ED]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
          <span>Client to Reply ({kpiMetrics.clientToReply})</span>
        </button>

        <span className="text-[#D4D4D8] text-xs shrink-0">·</span>

        {/* Action Required */}
        <button
          onClick={() => handlePillClick(isActionActive ? 'all' : 'Action Required')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            isActionActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Action Required ({kpiMetrics.actionRequired})
        </button>

        <span className="text-[#D4D4D8] text-xs shrink-0">·</span>

        {/* Waiting */}
        <button
          onClick={() => handlePillClick(isWaitingActive ? 'all' : 'Waiting for Response')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            isWaitingActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Waiting ({kpiMetrics.waitingForResponse})
        </button>

        <span className="text-[#D4D4D8] text-xs shrink-0">·</span>

        {/* Important */}
        <button
          onClick={() => handlePillClick(isImportantActive ? 'all' : 'important')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            isImportantActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Important ({kpiMetrics.important})
        </button>
      </div>

      {/* Right side: Quiet status indicator (hidden on smaller screens) */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-[#71717A] shrink-0 pl-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        <span className="font-mono text-[11px]">Synced · Zero latency</span>
      </div>
    </div>
  );
};
