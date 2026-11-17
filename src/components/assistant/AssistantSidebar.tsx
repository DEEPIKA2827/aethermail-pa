'use client';

import React from 'react';
import { useEmailContext } from '@/context/EmailContext';
import { FilterSegment } from '@/types/email';

export const AssistantSidebar: React.FC = () => {
  const {
    emails,
    selectedClientId,
    clients,
    filterSegment,
    setFilterSegment,
    setFilterResponsibility,
    setSelectedEmailId,
    selectedEmailId,
  } = useEmailContext();

  // Active client scope for count calculations
  const clientScopeEmails = emails.filter((e) =>
    selectedClientId === 'all' ? true : e.clientId === selectedClientId
  );
  const activeEmails = clientScopeEmails.filter((e) => !e.archived);

  // Compute live badge counts for the segments
  const counts = {
    all: activeEmails.length,
    assistant: activeEmails.filter((e) => e.responsibility === 'Assistant to Reply').length,
    client: activeEmails.filter((e) => e.responsibility === 'Client to Reply').length,
    noReply: activeEmails.filter((e) => e.responsibility === 'No Reply Needed').length,
    needsReview: activeEmails.filter((e) => e.responsibility === 'Needs Review').length,
    actionRequired: activeEmails.filter((e) => e.actionRequired || e.segment === 'Action Required').length,
    waiting: activeEmails.filter((e) => e.waitingForResponse || e.segment === 'Waiting for Response').length,
    meetings: activeEmails.filter((e) => e.meetingDetails || e.segment === 'Meetings & Appointments').length,
    important: activeEmails.filter((e) => e.important).length,
    general: activeEmails.filter((e) => e.segment === 'General').length,
    completed: activeEmails.filter((e) => e.completed).length,
    archived: clientScopeEmails.filter((e) => e.archived).length,
  };

  // Extract upcoming meetings from active emails
  const upcomingMeetings = activeEmails
    .filter((e) => e.meetingDetails)
    .map((e) => {
      const client = clients.find((c) => c.id === e.clientId);
      return {
        emailId: e.id,
        clientName: client ? client.name.split(' ')[0] : 'Client',
        meeting: e.meetingDetails!,
      };
    });

  const NAV_ITEMS: {
    id: FilterSegment;
    label: string;
    count: number;
    dotColor?: string;
  }[] = [
    { id: 'all', label: 'All Inbox', count: counts.all },
    { id: 'Assistant to Reply', label: 'Assistant to Reply', count: counts.assistant, dotColor: 'bg-[#2563EB]' },
    { id: 'Client to Reply', label: 'Client to Reply', count: counts.client, dotColor: 'bg-[#EA580C]' },
    { id: 'No Reply Needed', label: 'No Reply Needed', count: counts.noReply, dotColor: 'bg-[#71717A]' },
    { id: 'Needs Review', label: 'Needs Review', count: counts.needsReview, dotColor: 'bg-[#CA8A04]' },
    { id: 'Action Required', label: 'Action Required', count: counts.actionRequired },
    { id: 'Waiting for Response', label: 'Waiting for Response', count: counts.waiting },
    { id: 'Meetings & Appointments', label: 'Meetings & Appointments', count: counts.meetings },
    { id: 'important', label: 'Important', count: counts.important },
    { id: 'General', label: 'General', count: counts.general },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'archived', label: 'Archived', count: counts.archived },
  ];

  return (
    <aside className="w-full h-full flex flex-col bg-[#F8F7F4] border-r border-[#E6E4DD] overflow-y-auto no-scrollbar select-none text-xs">
      {/* Clean compact list */}
      <div className="p-3 space-y-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = filterSegment === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setFilterSegment(item.id);
                setFilterResponsibility('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-white text-[#18181B] shadow-sm font-semibold'
                  : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#EFECE6]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {item.dotColor ? (
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor} shrink-0`} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>
              <span
                className={`font-mono text-[11px] ${
                  isActive ? 'text-[#18181B] font-bold' : 'text-[#A1A1AA]'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* UPCOMING MEETINGS (MINIMALIST ROWS) */}
      <div className="p-3.5 border-t border-[#E6E4DD] bg-[#F8F7F4] space-y-2">
        <div className="flex items-center justify-between text-[#71717A] px-1 font-semibold text-[11px]">
          <span>Upcoming Meetings</span>
          <span>{upcomingMeetings.length}</span>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
          {upcomingMeetings.map((item) => {
            const isSelected = selectedEmailId === item.emailId;
            const isConflict = item.meeting.conflictStatus === 'conflict';
            return (
              <div
                key={item.emailId}
                onClick={() => setSelectedEmailId(item.emailId)}
                className={`p-2 rounded-md border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#18181B] shadow-sm'
                    : 'bg-white/70 border-[#E6E4DD] hover:bg-white hover:border-[#D4D4D8]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-medium text-[#18181B] truncate text-[11px]">
                    {item.meeting.title}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-semibold uppercase ${
                      isConflict
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                        : 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]'
                    }`}
                  >
                    {isConflict ? 'Conflict' : 'Free'}
                  </span>
                </div>
                <p className="text-[10px] text-[#71717A] font-mono truncate">
                  {item.meeting.proposedDate} · {item.meeting.proposedTime}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
