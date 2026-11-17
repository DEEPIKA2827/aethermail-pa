'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import {
  ChevronDown,
  Check,
  Bell,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { ProviderPill } from '@/components/ui/Badge';

export const Navbar: React.FC = () => {
  const {
    clients,
    selectedClientId,
    setSelectedClientId,
    viewMode,
    setViewMode,
    notifications,
    markNotificationRead,
    clearNotifications,
    setIsConnectionModalOpen,
    setIsSimulateModalOpen,
    toggleCopilot,
    resetDemoData,
  } = useEmailContext();

  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target as Node)) {
        setIsClientDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const currentClient = clients.find((c) => c.id === selectedClientId);

  return (
    <header className="sticky top-0 z-40 w-full h-13 border-b border-[#E6E4DD] bg-white text-[#18181B] select-none">
      <div className="flex items-center justify-between px-4 sm:px-5 h-full gap-2">
        {/* ZONE 1: LEFT — Minimalist Logo + Client Switcher + 2 Connected pill */}
        <div className="flex items-center gap-3">
          {/* Minimalist Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setViewMode('assistant')}
          >
            <div className="w-7 h-7 rounded-md bg-[#18181B] flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-sm">
              AM
            </div>
            <span className="font-bold text-base tracking-tight text-[#18181B]">
              AetherMail
            </span>
          </div>

          <div className="h-4 w-px bg-[#E6E4DD] hidden sm:block" />

          {/* Client Switcher Dropdown */}
          <div className="relative" ref={clientDropdownRef}>
            <button
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E6E4DD] bg-[#FAF9F5] hover:bg-[#F4F4F5] transition-colors text-xs font-medium text-[#18181B]"
            >
              {selectedClientId === 'all' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                  <span>All Clients (Unified)</span>
                </>
              ) : (
                <>
                  <img
                    src={currentClient?.avatar}
                    alt={currentClient?.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{currentClient?.name}</span>
                  <ProviderPill provider={currentClient?.provider || 'gmail'} />
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
            </button>

            {isClientDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-[#E6E4DD] bg-white shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Select Mailbox
                </div>

                <button
                  onClick={() => {
                    setSelectedClientId('all');
                    setIsClientDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedClientId === 'all'
                      ? 'bg-[#F4F4F5] text-[#18181B] font-semibold'
                      : 'hover:bg-[#FAF9F5] text-[#52525B]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#18181B]" />
                    <span>All Clients (Unified)</span>
                  </div>
                  {selectedClientId === 'all' && <Check className="w-3.5 h-3.5 text-[#18181B]" />}
                </button>

                <div className="h-px bg-[#E6E4DD] my-1" />

                {clients.map((client) => {
                  const isSelected = selectedClientId === client.id;
                  return (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setIsClientDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#F4F4F5] text-[#18181B] font-semibold'
                          : 'hover:bg-[#FAF9F5] text-[#52525B]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <p className="font-medium text-[#18181B]">{client.name}</p>
                          <p className="text-[10px] text-[#71717A]">{client.provider === 'gmail' ? 'Gmail' : 'Outlook'}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#18181B]" />}
                    </button>
                  );
                })}

                <div className="h-px bg-[#E6E4DD] my-1" />

                <button
                  onClick={() => {
                    setIsClientDropdownOpen(false);
                    setIsConnectionModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#2563EB] hover:bg-[#F0F7FF] rounded-lg transition-colors font-medium"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Manage Connections</span>
                </button>
              </div>
            )}
          </div>

          {/* Subtle green dot 2 Connected pill */}
          <button
            onClick={() => setIsConnectionModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
            title="Connected Accounts Health"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>2 Connected</span>
          </button>
        </div>

        {/* ZONE 2: CENTER — Clean 2-Way Segmented Toggle (Assistant View | Client View) */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#F4F4F5] border border-[#E6E4DD]">
          <button
            onClick={() => setViewMode('assistant')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'assistant'
                ? 'bg-white text-[#18181B] shadow-sm font-semibold'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Assistant View
          </button>
          <button
            onClick={() => setViewMode('client')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'client'
                ? 'bg-white text-[#18181B] shadow-sm font-semibold'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Client View
          </button>
        </div>

        {/* ZONE 3: RIGHT — Subtle ghost button "+ Test Email", "Ask Inbox" (Cmd+K), Bell, Avatar */}
        <div className="flex items-center gap-2">
          {/* Subtle Ghost Button + Test Email */}
          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E6E4DD] bg-white hover:bg-[#F4F4F5] text-xs font-medium text-[#18181B] transition-colors"
            title="Simulate Inbound Email or Escalation"
          >
            + Test Email
          </button>

          {/* Ask Inbox (Cmd+K) */}
          <button
            onClick={toggleCopilot}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F4F4F5] border border-[#E6E4DD] text-xs font-medium text-[#18181B] transition-colors"
            title="Ask Inbox Assistant (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#71717A]" />
            <span className="hidden sm:inline">Ask Inbox</span>
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-[#E4E4E7] text-[10px] text-[#52525B] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
              title="Activity Log"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EA580C]" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#E6E4DD] bg-white shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6E4DD] px-2">
                  <span className="text-xs font-semibold text-[#18181B]">Activity Log</span>
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-[#2563EB] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#F0F7FF] text-[#1E3A8A]' : 'hover:bg-[#FAF9F5] text-[#52525B]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-[#18181B]">{n.title}</span>
                        <span className="text-[10px] text-[#A1A1AA] font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#71717A] leading-relaxed">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Diya S. Avatar Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#F4F4F5] transition-colors"
              title="Diya S. — Senior Personal Assistant"
            >
              <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs font-semibold">
                DS
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E6E4DD] bg-white shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3 py-2 border-b border-[#E6E4DD] mb-1">
                  <p className="font-bold text-[#18181B]">Diya Sharma</p>
                  <p className="text-[11px] text-[#71717A]">Senior Executive Assistant</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsConnectionModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#52525B] flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Mailbox Connections</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    resetDemoData();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#FEF2F2] text-[#DC2626] flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
