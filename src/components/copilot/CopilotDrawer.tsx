'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Email } from '@/types/email';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  referencedEmails?: Email[];
  provider?: string;
}

export const CopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    emails,
    selectedEmail,
    setSelectedEmailId,
    clients,
    selectedClientId,
  } = useEmailContext();

  const activeClient =
    selectedClientId === 'all'
      ? clients[0]
      : clients.find((c) => c.id === selectedClientId) || clients[0];

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AetherMail Inbox Copilot, indexing all inbox traffic across Gmail and Outlook. Ask me anything about ${activeClient.name}'s emails, request executive drafts, or tap any prompt chip below!`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      scrollToBottom();
    }
  }, [messages, isCopilotOpen]);

  if (!isCopilotOpen) return null;

  const PROMPT_CHIPS = [
    'Show me emails that need my attention',
    'Summarize this conversation',
    'What am I waiting for a response on?',
    "Which emails require the client's attention?",
    'Why has this email been assigned to the client?',
    'Draft a reply to this conversation',
  ];

  const handleSendQuery = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: q,
          contextEmail: selectedEmail,
          emails,
          clientName: activeClient.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const referencedEmails: Email[] = [];
        if (data.referencedEmailIds && Array.isArray(data.referencedEmailIds)) {
          data.referencedEmailIds.forEach((id: string) => {
            const found = emails.find((e) => e.id === id);
            if (found) referencedEmails.push(found);
          });
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply || 'Analysis completed.',
          timestamp: 'Just now',
          referencedEmails,
          provider: data.provider,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API response not ok');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Analysis: We have ${emails.filter((e) => !e.archived).length} active threads across ${activeClient.name}'s mailboxes. You have items flagged for personal client sign-off.`,
        timestamp: 'Just now',
        referencedEmails: emails.slice(0, 2),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] max-w-full bg-white border-l border-[#E6E4DD] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-[#18181B]">
      {/* Header */}
      <div className="p-4 border-b border-[#E6E4DD] bg-[#FAF9F5] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#18181B] flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
              <span>AetherMail Copilot</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E4E4E7] text-[#52525B] font-mono">
                ⌘K
              </span>
            </h3>
            <p className="text-[11px] text-[#71717A]">
              Live Inbox Intelligence & Fast Triage
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#18181B] text-white rounded-br-none shadow-sm'
                  : 'bg-[#FAF9F5] border border-[#E6E4DD] text-[#18181B] rounded-bl-none shadow-xs'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1.5 text-[10px] text-[#71717A] font-semibold mb-1 pb-1 border-b border-[#E6E4DD]/60">
                  <Bot className="w-3 h-3 text-[#2563EB]" />
                  <span>AetherMail Assistant</span>
                  {msg.provider && (
                    <span className="text-[#A1A1AA] font-mono text-[9px]">({msg.provider})</span>
                  )}
                </div>
              )}

              <p className="whitespace-pre-line text-[#27272A]">{msg.text}</p>

              {/* REFERENCED CLICKABLE EMAIL CARDS */}
              {msg.referencedEmails && msg.referencedEmails.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#E6E4DD] space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-[#71717A]">
                    Referenced Email Threads ({msg.referencedEmails.length}):
                  </p>
                  {msg.referencedEmails.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => {
                        setSelectedEmailId(e.id);
                        setIsCopilotOpen(false);
                      }}
                      className="p-2.5 rounded-lg bg-white border border-[#E6E4DD] hover:border-[#18181B] cursor-pointer transition-all group flex items-center justify-between gap-2 shadow-xs"
                      title="Click to jump to this conversation"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#18181B] truncate text-xs group-hover:text-[#2563EB] transition-colors">
                          {e.subject}
                        </p>
                        <p className="text-[10px] text-[#71717A] truncate">
                          {e.senderName} · {e.receivedAt}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#18181B] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] text-[#A1A1AA] font-mono mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#52525B] max-w-[80%] animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
            <span>Consulting inbox index...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 1-Tap Prompt Chips */}
      <div className="p-3 border-t border-[#E6E4DD] bg-[#FAF9F5]">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-1.5 px-0.5">
          Suggested Prompts
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(chip)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#F4F4F5] border border-[#E6E4DD] text-[11px] text-[#52525B] hover:text-[#18181B] shrink-0 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-[#E6E4DD] bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery(inputQuery);
            }}
            placeholder="Ask about emails, summarize, or draft responses..."
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B] font-sans"
          />
          <button
            onClick={() => handleSendQuery(inputQuery)}
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] disabled:opacity-40 text-white transition-colors"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
