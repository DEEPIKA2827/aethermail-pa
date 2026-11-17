'use client';

import React, { useState } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import {
  Star,
  Archive,
  Trash2,
  MailOpen,
  Mail,
  Send,
  ChevronDown,
  Check,
  RotateCcw,
  CheckCheck,
  CalendarPlus,
  ArrowLeft,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { ResponsibilityBadge, ProviderPill } from '@/components/ui/Badge';
import { ResponsibilityType } from '@/types/email';

export const EmailDetail: React.FC = () => {
  const {
    selectedEmail,
    clients,
    toggleEmailStar,
    toggleEmailRead,
    archiveEmail,
    deleteEmail,
    setResponsibility,
    sendDraftReply,
    addTentativeHold,
    regenerateAIDraft,
    setSelectedEmailId,
    addToast,
  } = useEmailContext();

  const [draftReplyText, setDraftReplyText] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<'Concise' | 'Formal' | 'Schedule'>('Formal');
  const [isCopied, setIsCopied] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Sync draft text when selected email changes
  React.useEffect(() => {
    if (selectedEmail) {
      setDraftReplyText(selectedEmail.suggestedDraft || '');
    }
  }, [selectedEmail?.id, selectedEmail?.suggestedDraft]);

  if (!selectedEmail) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#71717A] p-8 text-center bg-[#F8F7F4]">
        <Mail className="w-10 h-10 text-[#D4D4D8] mb-2" />
        <p className="text-sm font-medium text-[#18181B]">No conversation selected</p>
        <p className="text-xs text-[#A1A1AA] mt-0.5">
          Select an email from the center pane to inspect summary and reply.
        </p>
      </div>
    );
  }

  const client = clients.find((c) => c.id === selectedEmail.clientId);

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftReplyText);
    setIsCopied(true);
    addToast('Copied', 'Draft copied to clipboard', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToneChange = async (tone: 'Concise' | 'Formal' | 'Schedule') => {
    setSelectedTone(tone);
    setIsRegenerating(true);
    const toneMap = {
      Concise: 'Warm & Concise',
      Formal: 'Professional',
      Schedule: 'Schedule Meeting',
    };
    const newDraft = await regenerateAIDraft(selectedEmail.id, toneMap[tone]);
    setDraftReplyText(newDraft);
    setIsRegenerating(false);
  };

  const handleApproveAndSend = () => {
    if (!draftReplyText.trim()) return;
    sendDraftReply(selectedEmail.id, draftReplyText);
  };

  const RESPONSIBILITIES: ResponsibilityType[] = [
    'Client to Reply',
    'Assistant to Reply',
    'No Reply Needed',
    'Needs Review',
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F7F4] overflow-y-auto">
      {/* 1. TOP HEADER & QUICK ACTIONS */}
      <div className="sticky top-0 z-20 flex items-center justify-between p-3 border-b border-[#E6E4DD] bg-white text-[#18181B]">
        {/* Left: Mobile Back button + Client tag */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedEmailId(null)}
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded bg-[#F4F4F5] border border-[#E6E4DD] text-xs font-medium text-[#18181B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inbox</span>
          </button>

          <img
            src={client?.avatar}
            alt={client?.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs font-medium text-[#18181B]">{client?.name}</span>
          <ProviderPill provider={selectedEmail.provider} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 text-xs text-[#71717A]">
          <button
            onClick={() => sendDraftReply(selectedEmail.id, draftReplyText || 'Marked handled')}
            className="px-2 py-1 rounded border border-[#E6E4DD] bg-white hover:bg-[#F4F4F5] text-[#18181B] font-medium flex items-center gap-1 transition-colors"
            title="Mark Completed"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="hidden sm:inline">Handled</span>
          </button>

          <button
            onClick={() => toggleEmailStar(selectedEmail.id)}
            className={`p-1.5 rounded hover:bg-[#F4F4F5] transition-colors ${
              selectedEmail.important ? 'text-[#F59E0B]' : 'text-[#A1A1AA] hover:text-[#18181B]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${selectedEmail.important ? 'fill-[#F59E0B]' : ''}`} />
          </button>

          <button
            onClick={() => toggleEmailRead(selectedEmail.id)}
            className="p-1.5 rounded hover:bg-[#F4F4F5] text-[#A1A1AA] hover:text-[#18181B] transition-colors"
          >
            {selectedEmail.unread ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => archiveEmail(selectedEmail.id)}
            className="p-1.5 rounded hover:bg-[#F4F4F5] text-[#A1A1AA] hover:text-[#18181B] transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => deleteEmail(selectedEmail.id)}
            className="p-1.5 rounded hover:bg-[#F4F4F5] text-[#A1A1AA] hover:text-[#DC2626] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-4 max-w-4xl">
        {/* Subject & Sender Meta */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <ResponsibilityBadge responsibility={selectedEmail.responsibility} size="sm" />
            <span className="text-xs text-[#71717A]">
              From: <span className="font-semibold text-[#18181B]">{selectedEmail.senderName}</span> ({selectedEmail.senderEmail})
            </span>
            <span className="text-xs text-[#A1A1AA]">· {selectedEmail.receivedAt}</span>
          </div>

          <h1 className="text-base sm:text-lg font-bold text-[#18181B] leading-snug">
            {selectedEmail.subject}
          </h1>
        </div>

        {/* 2. SLIM 2-LINE WARM CONTEXT CALLOUT STRIP */}
        <div className="bg-[#FAF9F5] border border-[#E6E4DD] rounded-lg px-4 py-2.5 flex items-start justify-between gap-4 text-xs">
          {/* Left side: Summary + Why assigned */}
          <div className="space-y-1 flex-1 leading-relaxed">
            <p className="text-[#18181B]">
              <span className="font-semibold text-[#71717A]">Summary: </span>
              {selectedEmail.aiSummary}
            </p>
            <p className="text-[#52525B]">
              <span className="font-semibold text-[#71717A]">Why assigned to {selectedEmail.responsibility.replace(' to Reply', '')}: </span>
              {selectedEmail.whyResponsibility}
            </p>
          </div>

          {/* Right side: Clean Reassign Dropdown */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsReassignOpen(!isReassignOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#E6E4DD] hover:bg-[#F4F4F5] text-xs font-medium text-[#18181B] transition-colors"
            >
              <span>Owner: {selectedEmail.responsibility}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
            </button>

            {isReassignOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white border border-[#E6E4DD] shadow-lg p-1 z-30 animate-in fade-in zoom-in-95 text-xs">
                {RESPONSIBILITIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setResponsibility(selectedEmail.id, r);
                      setIsReassignOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                      selectedEmail.responsibility === r
                        ? 'bg-[#F4F4F5] text-[#18181B] font-semibold'
                        : 'hover:bg-[#FAF9F5] text-[#52525B]'
                    }`}
                  >
                    <span>{r}</span>
                    {selectedEmail.responsibility === r && <Check className="w-3.5 h-3.5 text-[#18181B]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Meeting conflict banner if applicable */}
        {selectedEmail.meetingDetails && (
          <div className="px-3.5 py-2 rounded-lg bg-white border border-[#E6E4DD] flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2 text-[#52525B]">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedEmail.meetingDetails.conflictStatus === 'conflict' ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                }`}
              />
              <span className="font-medium text-[#18181B]">{selectedEmail.meetingDetails.title}:</span>
              <span className="font-mono text-[#71717A]">
                {selectedEmail.meetingDetails.proposedDate} at {selectedEmail.meetingDetails.proposedTime}
              </span>
            </div>
            <button
              onClick={() => addTentativeHold(selectedEmail.id)}
              className="px-2.5 py-1 rounded bg-[#F4F4F5] hover:bg-[#E4E4E7] text-xs font-medium text-[#18181B] flex items-center gap-1 transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Add Tentative Hold</span>
            </button>
          </div>
        )}

        {/* Client Delegation Note if present */}
        {selectedEmail.clientDelegationNote && (
          <div className="p-3 rounded-lg bg-[#FAF5FF] border border-[#F3E8FF] text-xs text-[#6B21A8] space-y-1">
            <div className="flex items-center gap-1 font-semibold text-[#7E22CE]">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Client Directive from {client?.name.split(' ')[0]}:</span>
            </div>
            <p className="italic font-medium leading-relaxed">"{selectedEmail.clientDelegationNote}"</p>
          </div>
        )}

        {/* 3. EMAIL MESSAGE THREAD IN CRISP WHITE CARD */}
        <div className="space-y-3">
          {selectedEmail.messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-xl border border-[#E6E4DD] bg-white shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#F4F4F5]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#18181B]">{msg.from}</span>
                  <span className="text-[#A1A1AA]">To: {msg.to}</span>
                </div>
                <span className="text-[#A1A1AA] font-mono text-[11px]">{msg.timestamp}</span>
              </div>
              <div className="text-xs text-[#27272A] leading-relaxed whitespace-pre-line font-sans pt-1">
                {msg.body}
              </div>
            </div>
          ))}
        </div>

        {/* 4. REPLY DRAFT BOX (IMMEDIATELY VISIBLE ON SAME SCREEN) */}
        <div className="p-4 rounded-xl border border-[#E6E4DD] bg-white shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F4F4F5]">
            <span className="text-xs font-bold text-[#18181B]">Reply Draft</span>

            {/* Tone selector pills */}
            <div className="flex items-center gap-1 text-[11px]">
              {(['Concise', 'Formal', 'Schedule'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleToneChange(t)}
                  className={`px-2 py-0.5 rounded transition-colors font-medium ${
                    selectedTone === t
                      ? 'bg-[#18181B] text-white'
                      : 'text-[#71717A] hover:bg-[#F4F4F5]'
                  }`}
                >
                  {t}
                </button>
              ))}

              <button
                onClick={() => handleToneChange(selectedTone)}
                disabled={isRegenerating}
                className="px-2 py-0.5 rounded text-[#2563EB] hover:bg-[#F0F7FF] transition-colors flex items-center gap-1 font-medium ml-1"
                title="Regenerate draft"
              >
                <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Drafting...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={5}
              value={draftReplyText}
              onChange={(e) => setDraftReplyText(e.target.value)}
              placeholder="Edit response..."
              className="w-full p-3 rounded-lg bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] font-sans leading-relaxed"
            />
            <button
              onClick={handleCopyDraft}
              className="absolute right-2.5 top-2.5 p-1 rounded hover:bg-[#E4E4E7] text-[#71717A] hover:text-[#18181B] text-xs"
              title="Copy to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#A1A1AA]">
              Review draft & approve before dispatch
            </span>
            <button
              onClick={handleApproveAndSend}
              className="px-4 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Approve & Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
