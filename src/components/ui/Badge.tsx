import React from 'react';
import { ResponsibilityType, SegmentType, ProviderType } from '@/types/email';

interface ResponsibilityBadgeProps {
  responsibility: ResponsibilityType;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const ResponsibilityBadge: React.FC<ResponsibilityBadgeProps> = ({
  responsibility,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-medium';

  switch (responsibility) {
    case 'Client to Reply':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#FFF4ED] text-[#C2410C] border border-[#FFEDD5] ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] shrink-0" />
          <span>Client to Reply</span>
        </span>
      );

    case 'Assistant to Reply':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F0F7FF] text-[#1D4ED8] border border-[#DBEAFE] ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
          <span>Assistant to Reply</span>
        </span>
      );

    case 'No Reply Needed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7] ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] shrink-0" />
          <span>No Reply Needed</span>
        </span>
      );

    case 'Needs Review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#FEFCE8] text-[#A16207] border border-dashed border-[#FDE047] ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04] shrink-0" />
          <span>Needs Review</span>
        </span>
      );

    default:
      return null;
  }
};

export const SegmentBadge: React.FC<{ segment: SegmentType; className?: string }> = ({
  segment,
  className = '',
}) => {
  switch (segment) {
    case 'Meetings & Appointments':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] ${className}`}
        >
          Meeting
        </span>
      );
    case 'Action Required':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6] ${className}`}
        >
          Action Req
        </span>
      );
    case 'Waiting for Response':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-[#ECFEFF] text-[#0E7490] border border-[#CFFAFE] ${className}`}
        >
          Waiting
        </span>
      );
    case 'Important':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-[#FEFCE8] text-[#A16207] border border-[#FEF08A] ${className}`}
        >
          Important
        </span>
      );
    case 'General':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7] ${className}`}
        >
          General
        </span>
      );
  }
};

export const ProviderPill: React.FC<{ provider: ProviderType; className?: string }> = ({
  provider,
  className = '',
}) => {
  if (provider === 'gmail') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] ${className}`}
        title="Connected via Gmail"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        Gmail
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-[#F0F9FF] text-[#0284C7] border border-[#E0F2FE] ${className}`}
      title="Connected via Outlook"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
      Outlook
    </span>
  );
};
