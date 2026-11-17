'use client';

import React, { useState } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import {
  X,
  ShieldCheck,
  Check,
  RefreshCw,
  Lock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { ProviderType } from '@/types/email';

export const ConnectionModal: React.FC = () => {
  const {
    isConnectionModalOpen,
    setIsConnectionModalOpen,
    clients,
    syncAccounts,
    isSyncing,
    connectNewAccount,
  } = useEmailContext();

  const [activeTab, setActiveTab] = useState<'manage' | 'connect'>('manage');
  const [connectStep, setConnectStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>('gmail');
  const [executiveName, setExecutiveName] = useState('Sarah Vance');
  const [executiveRole, setExecutiveRole] = useState('Chief Operating Officer');
  const [executiveCompany, setExecutiveCompany] = useState('Apex Dynamics');
  const [executiveEmail, setExecutiveEmail] = useState('sarah.vance@apexdynamics.ai');
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStepLog, setSyncStepLog] = useState('');

  if (!isConnectionModalOpen) return null;

  const handleStartOAuthSync = async () => {
    setConnectStep(3);
    setSyncProgress(15);
    setSyncStepLog('Initializing OAuth 2.0 PKCE handshake with token exchange...');

    await new Promise((r) => setTimeout(r, 700));
    setSyncProgress(45);
    setSyncStepLog('Validating scopes: https://mail.google.com/ & calendar.events.readwrite...');

    await new Promise((r) => setTimeout(r, 800));
    setSyncProgress(78);
    setSyncStepLog('Running classifier across 180 thread messages...');

    await new Promise((r) => setTimeout(r, 800));
    setSyncProgress(100);
    setSyncStepLog('All messages classified! Mailbox synchronized.');

    await new Promise((r) => setTimeout(r, 500));
    setConnectStep(4);
  };

  const handleFinishConnection = () => {
    connectNewAccount({
      name: executiveName,
      role: executiveRole,
      company: executiveCompany,
      email: executiveEmail,
      provider: selectedProvider,
    });
    setConnectStep(1);
    setActiveTab('manage');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E6E4DD] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#18181B]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E6E4DD] bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E4DD] flex items-center justify-center text-[#18181B]">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#18181B]">
                Connected Executive Mailboxes & OAuth Health
              </h2>
              <p className="text-xs text-[#71717A]">
                Manage live email connections and authenticate new client inboxes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsConnectionModalOpen(false)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E6E4DD] bg-[#FAF9F5] px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'manage'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Active Accounts ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'connect'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>+ Connect New Mailbox</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E4E4E7] text-[#52525B]">
              OAuth 2.0
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'manage' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-[#71717A]">
                  Live connection health for connected executive mailboxes:
                </span>
                <button
                  onClick={syncAccounts}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F5] border border-[#E6E4DD] text-[#18181B] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#71717A] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Synchronizing...' : 'Sync All Mailboxes Now'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 rounded-xl border border-[#E6E4DD] bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E6E4DD]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#18181B]">{client.name}</h4>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                              client.provider === 'gmail'
                                ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                                : 'bg-[#F0F9FF] text-[#0284C7] border border-[#E0F2FE]'
                            }`}
                          >
                            {client.provider}
                          </span>
                        </div>
                        <p className="text-xs text-[#71717A]">{client.email}</p>
                        <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                          {client.role} · {client.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E6E4DD]">
                      <div className="flex items-center gap-1.5 text-xs text-[#059669] font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#059669]" />
                        <span>Health: {client.health}%</span>
                      </div>
                      <span className="text-[11px] text-[#71717A] font-mono mt-0.5">
                        {client.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal Assistant Profile Card */}
              <div className="p-4 rounded-xl border border-[#DBEAFE] bg-[#F0F7FF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1D4ED8] flex items-center justify-center font-bold text-white text-sm">
                    DS
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#18181B]">Diya Sharma (Signed In)</h4>
                    <p className="text-[11px] text-[#1D4ED8]">Senior Personal Executive Assistant</p>
                    <p className="text-[10px] text-[#71717A] font-mono">Workspace Role: Master Delegate & Classifier</p>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-[#1D4ED8] border border-[#BFDBFE] font-medium">
                  Active PA Session
                </span>
              </div>
            </div>
          ) : (
            /* 3-STEP ANIMATED CONNECTION WIZARD */
            <div className="space-y-4">
              {/* Step indicator */}
              <div className="flex items-center justify-between px-2 text-xs">
                <span
                  className={`font-semibold ${
                    connectStep >= 1 ? 'text-[#18181B]' : 'text-[#A1A1AA]'
                  }`}
                >
                  1. Provider
                </span>
                <span className="h-px w-8 bg-[#E6E4DD]" />
                <span
                  className={`font-semibold ${
                    connectStep >= 2 ? 'text-[#18181B]' : 'text-[#A1A1AA]'
                  }`}
                >
                  2. Permissions & API
                </span>
                <span className="h-px w-8 bg-[#E6E4DD]" />
                <span
                  className={`font-semibold ${
                    connectStep >= 3 ? 'text-[#18181B]' : 'text-[#A1A1AA]'
                  }`}
                >
                  3. Ingestion Sync
                </span>
                <span className="h-px w-8 bg-[#E6E4DD]" />
                <span
                  className={`font-semibold ${
                    connectStep === 4 ? 'text-[#059669]' : 'text-[#A1A1AA]'
                  }`}
                >
                  4. Complete
                </span>
              </div>

              {/* STEP 1: SELECT PROVIDER */}
              {connectStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <p className="text-xs text-[#71717A] font-medium">
                    Choose the email service provider for your executive client:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedProvider('gmail')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedProvider === 'gmail'
                          ? 'bg-white border-[#18181B] ring-1 ring-[#18181B] shadow-sm'
                          : 'bg-[#FAF9F5] border-[#E6E4DD] hover:border-[#D4D2CA]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] flex items-center justify-center font-bold text-sm mb-2">
                        G
                      </div>
                      <h4 className="text-xs font-semibold text-[#18181B]">Google Workspace (Gmail)</h4>
                      <p className="text-[11px] text-[#71717A] mt-1">
                        Connect using official Google OAuth 2.0 with Calendar & Gmail scopes.
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedProvider('outlook')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedProvider === 'outlook'
                          ? 'bg-white border-[#18181B] ring-1 ring-[#18181B] shadow-sm'
                          : 'bg-[#FAF9F5] border-[#E6E4DD] hover:border-[#D4D2CA]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0284C7] border border-[#E0F2FE] flex items-center justify-center font-bold text-sm mb-2">
                        O
                      </div>
                      <h4 className="text-xs font-semibold text-[#18181B]">Microsoft 365 (Outlook)</h4>
                      <p className="text-[11px] text-[#71717A] mt-1">
                        Connect using Microsoft Graph API with Exchange & Outlook Calendar scopes.
                      </p>
                    </button>
                  </div>

                  {/* Client Info Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[#71717A]">Executive Full Name</label>
                      <input
                        type="text"
                        value={executiveName}
                        onChange={(e) => setExecutiveName(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#71717A]">Executive Email Address</label>
                      <input
                        type="text"
                        value={executiveEmail}
                        onChange={(e) => setExecutiveEmail(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#71717A]">Role / Title</label>
                      <input
                        type="text"
                        value={executiveRole}
                        onChange={(e) => setExecutiveRole(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#71717A]">Organization / Firm</label>
                      <input
                        type="text"
                        value={executiveCompany}
                        onChange={(e) => setExecutiveCompany(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setConnectStep(2)}
                      className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Continue to OAuth Permissions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERMISSIONS & API SCOPES */}
              {connectStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#18181B] font-semibold">
                      <Lock className="w-4 h-4 text-[#71717A]" />
                      <span>Required OAuth 2.0 Scopes Authorization:</span>
                    </div>
                    <div className="space-y-1.5 pl-6 text-[#52525B]">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Read message threads and headers (read-only for classification)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Create & send draft replies on behalf of executive</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Read Google/Outlook Calendar events for conflict detection</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setConnectStep(1)}
                      className="text-xs text-[#71717A] hover:text-[#18181B]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleStartOAuthSync}
                      className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#E4E4E7]" />
                      <span>Authorize with {selectedProvider.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: LIVE SYNC PROGRESS BAR */}
              {connectStep === 3 && (
                <div className="py-6 space-y-4 text-center animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-[#F0F7FF] border border-[#DBEAFE] text-[#1D4ED8] mx-auto flex items-center justify-center animate-pulse">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">
                      Connecting & Classifying Mailbox...
                    </h4>
                    <p className="text-xs text-[#71717A] font-mono mt-1">{syncStepLog}</p>
                  </div>

                  <div className="w-full max-w-md mx-auto space-y-1">
                    <div className="w-full h-2 rounded-full bg-[#E6E4DD] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#18181B] transition-all duration-300"
                        style={{ width: `${syncProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#71717A] font-mono">
                      <span>Syncing messages</span>
                      <span>{syncProgress}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONNECTED & CLASSIFIED! */}
              {connectStep === 4 && (
                <div className="py-6 space-y-4 text-center animate-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] mx-auto flex items-center justify-center">
                    <Check className="w-7 h-7" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#18181B]">
                      Connected & Classified!
                    </h4>
                    <p className="text-xs text-[#71717A] mt-1">
                      {executiveName} ({selectedProvider.toUpperCase()}) has been securely connected to your AetherMail PA dashboard.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] max-w-sm mx-auto text-xs text-[#52525B] space-y-1 text-left">
                    <p className="font-semibold text-[#18181B]">Sync Summary:</p>
                    <p>• 180 thread messages analyzed</p>
                    <p>• 4 action items flagged for Diya</p>
                    <p>• 2 executive decisions routed to Client View</p>
                  </div>

                  <button
                    onClick={handleFinishConnection}
                    className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Open Executive Mailbox in Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
