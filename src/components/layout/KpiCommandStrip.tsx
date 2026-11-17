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
  } = useEmailContext();

  const isTotalActive = filterSegment === 'all' && filterResponsibility === 'all';
  const isUnreadActive = filterSegment === 'unread';
  const isAssistantActive = filterSegment === 'Assistant to Reply' || filterResponsibility === 'Assistant to Reply';
  const isClientActive = filterSegment === 'Client to Reply' || filterResponsibility === 'Client to Reply';
  const isActionActive = filterSegment === 'Action Required';
  const isWaitingActive = filterSegment === 'Waiting for Response';
  const isImportantActive = filterSegment === 'important';

  return (
    <div className="h-11 px-4 sm:px-5 bg-white border-b border-[#E6E4DD] flex items-center justify-between text-xs sm:text-sm select-none">
      {/* Left side: Clean clickable metric pills separated by subtle dividers */}
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1">
        {/* All */}
        <button
          onClick={() => {
            setFilterSegment('all');
            setFilterResponsibility('all');
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            isTotalActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          All ({kpiMetrics.total})
        </button>

        <span className="text-[#D4D4D8] text-xs">·</span>

        {/* Unread */}
        <button
          onClick={() => {
            setFilterSegment(isUnreadActive ? 'all' : 'unread');
            setFilterResponsibility('all');
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            isUnreadActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Unread ({kpiMetrics.unread})
        </button>

        <span className="text-[#D4D4D8] text-xs">·</span>

        {/* Assistant to Reply */}
        <button
          onClick={() => {
            setFilterSegment('Assistant to Reply');
            setFilterResponsibility('all');
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isAssistantActive
              ? 'bg-[#F0F7FF] text-[#1D4ED8] font-semibold border border-[#DBEAFE]'
              : 'text-[#71717A] hover:text-[#1D4ED8] hover:bg-[#F0F7FF]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>Assistant to Reply ({kpiMetrics.assistantToReply})</span>
        </button>

        <span className="text-[#D4D4D8] text-xs">·</span>

        {/* Client to Reply */}
        <button
          onClick={() => {
            setFilterSegment('Client to Reply');
            setFilterResponsibility('all');
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isClientActive
              ? 'bg-[#FFF4ED] text-[#C2410C] font-semibold border border-[#FFEDD5]'
              : 'text-[#71717A] hover:text-[#C2410C] hover:bg-[#FFF4ED]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
          <span>Client to Reply ({kpiMetrics.clientToReply})</span>
        </button>

        <span className="text-[#D4D4D8] text-xs">·</span>

        {/* Action Required */}
        <button
          onClick={() => {
            setFilterSegment(isActionActive ? 'all' : 'Action Required');
            setFilterResponsibility('all');
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            isActionActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Action Required ({kpiMetrics.actionRequired})
        </button>

        <span className="text-[#D4D4D8] text-xs">·</span>

        {/* Waiting */}
        <button
          onClick={() => {
            setFilterSegment(isWaitingActive ? 'all' : 'Waiting for Response');
            setFilterResponsibility('all');
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            isWaitingActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Waiting ({kpiMetrics.waitingForResponse})
        </button>

        <span className="text-[#D4D4D8] text-xs">·</span>

        {/* Important */}
        <button
          onClick={() => {
            setFilterSegment(isImportantActive ? 'all' : 'important');
            setFilterResponsibility('all');
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            isImportantActive
              ? 'bg-[#18181B] text-white'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]'
          }`}
        >
          Important ({kpiMetrics.important})
        </button>
      </div>

      {/* Right side: Quiet status indicator */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-[#71717A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        <span className="font-mono text-[11px]">Synced · Zero latency</span>
      </div>
    </div>
  );
};
