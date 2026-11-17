'use client';

import React, { useState } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import {
  Check,
  CheckCircle2,
  Send,
  MessageSquare,
  X,
  Bot,
  UserCheck,
} from 'lucide-react';
import { ProviderPill } from '@/components/ui/Badge';
import { Email } from '@/types/email';

export const ClientView: React.FC = () => {
  const {
    clients,
    emails,
    selectedClientId,
    markAsHandled,
    assistantTakeOver,
    quickPersonalReply,
  } = useEmailContext();

  // Active client: defaults to Vikram Mehta if 'all' is selected
  const activeClient =
    selectedClientId === 'all'
      ? clients[0]
      : clients.find((c) => c.id === selectedClientId) || clients[0];

  const [showHandled, setShowHandled] = useState(false);
  const [activeModalEmail, setActiveModalEmail] = useState<Email | null>(null);
  const [inlineNoteEmailId, setInlineNoteEmailId] = useState<string | null>(null);
  const [inlineNoteText, setInlineNoteText] = useState('');
  const [quickReplyEmailId, setQuickReplyEmailId] = useState<string | null>(null);
  const [quickReplyText, setQuickReplyText] = useState('');

  // Client emails
  const clientEmails = emails.filter((e) => e.clientId === activeClient.id);

  // Conversations requiring Client personal attention
  const clientPendingEmails = clientEmails.filter(
    (e) => !e.archived && !e.completed && (e.responsibility === 'Client to Reply' || e.responsibility === 'Needs Review')
  );

  // Recently handled items
  const clientHandledEmails = clientEmails.filter(
    (e) => e.completed || e.responsibility === 'No Reply Needed' || e.responsibility === 'Assistant to Reply'
  );

  const displayedList = showHandled ? clientHandledEmails : clientPendingEmails;

  const handleOpenTakeOver = (email: Email) => {
    setInlineNoteEmailId(email.id);
    setInlineNoteText('');
    setQuickReplyEmailId(null);
  };

  const handleConfirmTakeOver = (emailId: string) => {
    assistantTakeOver(emailId, inlineNoteText);
    setInlineNoteEmailId(null);
    setInlineNoteText('');
  };

  const handleOpenQuickReply = (email: Email) => {
    setQuickReplyEmailId(email.id);
    setQuickReplyText(email.suggestedDraft || '');
    setInlineNoteEmailId(null);
  };

  const handleConfirmQuickReply = (emailId: string) => {
    quickPersonalReply(emailId, quickReplyText);
    setQuickReplyEmailId(null);
    setQuickReplyText('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8F7F4] text-[#18181B] min-h-[calc(100vh-53px)]">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ZERO CLUTTER HEADER */}
        <div className="pb-5 border-b border-[#E6E4DD] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeClient.avatar}
                alt={activeClient.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E6E4DD]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B]">
                    Good Morning, {activeClient.name.split(' ')[0]}
                  </h1>
                  <ProviderPill provider={activeClient.provider} />
                </div>
                <p className="text-xs text-[#71717A]">
                  {activeClient.role} · {activeClient.company}
                </p>
              </div>
            </div>

            {/* Toggle Handled Items */}
            <button
              onClick={() => setShowHandled(!showHandled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showHandled
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-white text-[#71717A] border-[#E6E4DD] hover:text-[#18181B] hover:bg-[#FAF9F5]'
              }`}
            >
              {showHandled ? '← Back to Pending Attention' : `View Handled (${clientHandledEmails.length})`}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
            {!showHandled ? (
              <>
                Here are the <span className="font-semibold text-[#C2410C]">{clientPendingEmails.length} email{clientPendingEmails.length === 1 ? '' : 's'}</span> requiring your personal attention today.
              </>
            ) : (
              <>
                Viewing <span className="font-semibold text-[#18181B]">{clientHandledEmails.length} handled conversations</span> resolved or managed by Assistant Diya.
              </>
            )}
          </p>
        </div>

        {/* FEED */}
        <div className="space-y-4">
          {displayedList.length === 0 ? (
            <div className="p-10 rounded-2xl border border-[#E6E4DD] bg-white text-center space-y-4 shadow-sm relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#18181B]">
                  🎉 Inbox Zero for {activeClient.name.split(' ')[0]}!
                </h3>
                <p className="text-sm font-medium text-[#71717A]">
                  All client-critical decisions are handled.
                </p>
                <p className="text-xs text-[#A1A1AA] max-w-md mx-auto pt-1 leading-relaxed">
                  Your executive shield is active. Assistant Diya S. is managing all remaining operational, administrative, and calendar scheduling matters in the background.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  100% Handled · 0 Pending Fiduciary Items
                </span>
              </div>
            </div>
          ) : (
            displayedList.map((email) => {
              const isNoteOpen = inlineNoteEmailId === email.id;
              const isReplyOpen = quickReplyEmailId === email.id;

              return (
                <div
                  key={email.id}
                  className="rounded-xl border border-[#E6E4DD] bg-white shadow-sm overflow-hidden transition-all hover:border-[#D4D2CA]"
                >
                  {/* Card Main Body */}
                  <div className="p-5 space-y-3">
                    {/* Sender, Role, Subject & Timestamp */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[#18181B]">
                            {email.senderName}
                          </span>
                          <span className="text-[11px] text-[#71717A]">
                            ({email.senderEmail})
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-[#18181B]">
                          {email.subject}
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#71717A] font-mono shrink-0">
                        {email.receivedAt}
                      </span>
                    </div>

                    {/* Short AI Summary (2 lines max, high signal) */}
                    <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed bg-[#FAF9F5] p-2.5 rounded-lg border border-[#E6E4DD]">
                      <span className="font-semibold text-[#18181B]">Summary: </span>
                      {email.aiSummary}
                    </p>

                    {/* "Why Your Personal Response is Needed" Callout Box */}
                    <div className="p-3 rounded-lg bg-[#FFF4ED] border-l-2 border-[#EA580C] text-xs text-[#C2410C] leading-relaxed font-medium">
                      <span className="font-bold text-[#9A3412] uppercase tracking-wider text-[10px] block mb-0.5">
                        Why Your Personal Response is Needed:
                      </span>
                      {email.whyResponsibility}
                    </div>

                    {/* View Original Conversation Trigger */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setActiveModalEmail(email)}
                        className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>View Original Conversation ({email.messages.length} message{email.messages.length === 1 ? '' : 's'})</span>
                      </button>

                      <span className="text-[11px] text-[#A1A1AA] font-mono">
                        Confidence: {email.aiConfidence}%
                      </span>
                    </div>
                  </div>

                  {/* INLINE ASSISTANT TAKE OVER DRAWER */}
                  {isNoteOpen && (
                    <div className="p-4 bg-[#FAF9F5] border-t border-[#DBEAFE] space-y-2.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1D4ED8] flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          <span>Delegate to Assistant Diya S.</span>
                        </span>
                        <button
                          onClick={() => setInlineNoteEmailId(null)}
                          className="text-[#71717A] hover:text-[#18181B] text-xs"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Quick chips */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setInlineNoteText('Approve up to $15k and request standard countersigned bundle.')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-[#F4F4F5] text-[10px] text-[#52525B] border border-[#E6E4DD]"
                        >
                          "Approve up to $15k"
                        </button>
                        <button
                          onClick={() => setInlineNoteText('Please ask to move this meeting to next week Friday morning.')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-[#F4F4F5] text-[10px] text-[#52525B] border border-[#E6E4DD]"
                        >
                          "Ask to move to next week"
                        </button>
                        <button
                          onClick={() => setInlineNoteText('Please decline politely. Our schedule is full for this quarter.')}
                          className="px-2 py-0.5 rounded bg-white hover:bg-[#F4F4F5] text-[10px] text-[#52525B] border border-[#E6E4DD]"
                        >
                          "Decline politely"
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inlineNoteText}
                          onChange={(e) => setInlineNoteText(e.target.value)}
                          placeholder="Optional quick note for your assistant, e.g. 'Approve up to $15k' or 'Ask to move to next week'..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#E6E4DD] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleConfirmTakeOver(email.id);
                          }}
                        />
                        <button
                          onClick={() => handleConfirmTakeOver(email.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-sm transition-all shrink-0"
                        >
                          Hand Over
                        </button>
                      </div>
                    </div>
                  )}

                  {/* INLINE QUICK PERSONAL REPLY DRAWER */}
                  {isReplyOpen && (
                    <div className="p-4 bg-[#FAF9F5] border-t border-[#E6E4DD] space-y-2.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Send Personal Reply as {activeClient.name}</span>
                        </span>
                        <button
                          onClick={() => setQuickReplyEmailId(null)}
                          className="text-[#71717A] hover:text-[#18181B] text-xs"
                        >
                          Cancel
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={quickReplyText}
                        onChange={(e) => setQuickReplyText(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-white border border-[#E6E4DD] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B] font-sans"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setQuickReplyEmailId(null)}
                          className="px-3 py-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmQuickReply(email.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Direct Reply</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* THREE 1-CLICK EXECUTIVE ACTIONS */}
                  {!isNoteOpen && !isReplyOpen && (
                    <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#E6E4DD] flex items-center justify-between gap-2 flex-wrap">
                      {/* Action 1: Mark as Handled */}
                      <button
                        onClick={() => markAsHandled(email.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4F4F5] text-[#18181B] text-xs font-medium border border-[#E6E4DD] transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Mark as Handled</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Action 2: Assistant to Take Over */}
                        <button
                          onClick={() => handleOpenTakeOver(email)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F0F7FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-semibold transition-colors"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Assistant to Take Over</span>
                        </button>

                        {/* Action 3: Quick Personal Reply */}
                        <button
                          onClick={() => handleOpenQuickReply(email)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Quick Personal Reply</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FULL THREAD HISTORY MODAL */}
      {activeModalEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-[#E6E4DD] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-[#E6E4DD] bg-[#FAF9F5]">
              <div>
                <h3 className="text-sm font-semibold text-[#18181B]">
                  {activeModalEmail.subject}
                </h3>
                <p className="text-[11px] text-[#71717A] font-mono">
                  From: {activeModalEmail.senderName} ({activeModalEmail.senderEmail})
                </p>
              </div>
              <button
                onClick={() => setActiveModalEmail(null)}
                className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {activeModalEmail.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    m.isClient
                      ? 'bg-[#FFF4ED] border-[#FFEDD5]'
                      : m.isAssistant
                      ? 'bg-[#F0F7FF] border-[#DBEAFE]'
                      : 'bg-[#FAF9F5] border-[#E6E4DD]'
                  }`}
                >
                  <div className="flex justify-between items-center pb-1.5 border-b border-[#E6E4DD]/60">
                    <span className="font-semibold text-[#18181B]">{m.from}</span>
                    <span className="text-[10px] text-[#71717A] font-mono">{m.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-[#3F3F46]">{m.body}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#E6E4DD] bg-[#FAF9F5] flex justify-end">
              <button
                onClick={() => setActiveModalEmail(null)}
                className="px-4 py-1.5 rounded-lg bg-white border border-[#E6E4DD] hover:bg-[#F4F4F5] text-xs font-medium text-[#18181B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
