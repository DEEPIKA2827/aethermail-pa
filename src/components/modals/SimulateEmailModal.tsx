'use client';

import React, { useState } from 'react';
import { useEmailContext } from '@/context/EmailContext';
import {
  X,
  Zap,
  Sparkles,
  Mail,
  RefreshCw,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { ResponsibilityType, SegmentType } from '@/types/email';

export const SimulateEmailModal: React.FC = () => {
  const {
    isSimulateModalOpen,
    setIsSimulateModalOpen,
    simulateIncomingEmail,
    escalateThread,
    clients,
    emails,
  } = useEmailContext();

  const [activeTab, setActiveTab] = useState<'tabA' | 'tabB'>('tabA');

  // Tab A state
  const [targetClientId, setTargetClientId] = useState<string>('client-1');
  const [customSender, setCustomSender] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState('Analyzing Intent & Conversation History...');

  // Tab B state
  const assistantThreads = emails.filter(
    (e) => !e.archived && e.responsibility === 'Assistant to Reply'
  );
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    assistantThreads[0]?.id || emails[1]?.id || 'email-2'
  );
  const [escalationNote, setEscalationNote] = useState(
    "Actually, before we lock the call, I need Vikram's personal approval on the revised $40,000 advisory retainer fee."
  );
  const [isEscalating, setIsEscalating] = useState(false);

  if (!isSimulateModalOpen) return null;

  // 3 REALISTIC PRESET SCENARIOS FOR TAB A
  const PRESETS_TAB_A = [
    {
      title: 'Urgent M&A Term Sheet Approval',
      category: 'Strategic Governance',
      expectedBadge: 'Client to Reply' as ResponsibilityType,
      senderName: 'Jonathan Sterling',
      senderEmail: 'j.sterling@sterling-ma.example.com',
      subject: 'Strictly Confidential: $85M Acquisition Term Sheet — Board Approval Required',
      body: 'Hi Vikram,\n\nOur M&A committee has finalized the non-binding term sheet for the $85M asset acquisition of DataStream. We require your personal review and sign-off on section 6 (indemnity escrow cap) before 5:00 PM EST.\n\nPlease confirm agreement.\n\nBest,\nJonathan Sterling\nManaging Director, Sterling M&A',
      summary: 'Confidential $85M M&A term sheet requiring Vikram’s personal sign-off on indemnity escrow provisions before 5 PM EST.',
      why: 'Corporate M&A governance and high-stakes legal acquisition agreement requiring direct CEO personal sign-off.',
      segment: 'Important' as SegmentType,
      confidence: 99,
    },
    {
      title: 'Reschedule Dentist Appointment',
      category: 'Personal Calendar Ops',
      expectedBadge: 'Assistant to Reply' as ResponsibilityType,
      senderName: 'Dr. Evelyn Reed DDS',
      senderEmail: 'care@reeddentalstudio.com',
      subject: 'Reschedule Notice: Vikram’s routine cleaning on Thursday at 2:00 PM',
      body: 'Hi Vikram,\n\nDr. Reed had a brief scheduling shift for Thursday. Could we move your routine cleaning appointment to Friday at 10:30 AM, or next Monday at 3:00 PM? Please have your assistant confirm which slot works.\n\nWarmly,\nFront Desk, Reed Dental Studio',
      summary: 'Dental studio requesting to reschedule Vikram’s routine cleaning to Friday 10:30 AM or Monday 3:00 PM.',
      why: 'Routine personal calendar logistics and health appointment scheduling handled by Personal Assistant.',
      segment: 'Meetings & Appointments' as SegmentType,
      confidence: 97,
      meetingDetails: {
        title: 'Dental Cleaning — Dr. Evelyn Reed',
        proposedDate: 'Friday, Nov 20',
        proposedTime: '10:30 AM - 11:30 AM',
        duration: '60 mins',
        conflictStatus: 'clear' as const,
        conflictNote: 'Clear on personal calendar slot.',
        suggestedAlternative: 'Friday, Nov 20 at 10:30 AM',
        location: 'Reed Dental Studio, SF',
      },
    },
    {
      title: 'Weekly SaaS Metrics Newsletter',
      category: 'Informational Blast',
      expectedBadge: 'No Reply Needed' as ResponsibilityType,
      senderName: 'SaaS Pulse Digest',
      senderEmail: 'weekly@saaspulse.example.com',
      subject: 'SaaS Pulse #142: B2B Multiples Expansion & AI Agent Benchmark Q4',
      body: 'Welcome to this week’s SaaS Pulse.\n\nHighlights:\n• Enterprise median ARR multiples rose 1.2x to 9.4x.\n• Autonomous Agent startups seeing 300% YoY customer growth.\n\nRead the full report on our website. You are receiving this because you subscribed at saaspulse.com.',
      summary: 'Automated weekly research newsletter covering B2B SaaS multiples and AI agent industry benchmarks.',
      why: 'Automated informational marketing newsletter. No human correspondence or reply needed.',
      segment: 'General' as SegmentType,
      confidence: 99,
    },
  ];

  const handleApplyPreset = (idx: number) => {
    const p = PRESETS_TAB_A[idx];
    setCustomSender(p.senderName);
    setCustomSubject(p.subject);
    setCustomBody(p.body);
  };

  const handleRunAiTriageTabA = async (presetIdx?: number) => {
    setIsAnalyzing(true);
    setAnalysisText('Analyzing Intent & Conversation History...');

    await new Promise((r) => setTimeout(r, 600));
    setAnalysisText('Evaluating Fiduciary, Financial & Calendar Parameters...');

    await new Promise((r) => setTimeout(r, 600));
    setAnalysisText('Classification Complete: Injecting into Inbox...');

    await new Promise((r) => setTimeout(r, 300));

    let emailToInject;
    if (typeof presetIdx === 'number') {
      const p = PRESETS_TAB_A[presetIdx];
      emailToInject = {
        clientId: targetClientId,
        senderName: p.senderName,
        senderEmail: p.senderEmail,
        subject: p.subject,
        responsibility: p.expectedBadge,
        aiConfidence: p.confidence,
        aiSummary: p.summary,
        whyResponsibility: p.why,
        segment: p.segment,
        meetingDetails: p.meetingDetails,
        messages: [
          {
            id: `msg-${Date.now()}`,
            from: `${p.senderName} <${p.senderEmail}>`,
            senderEmail: p.senderEmail,
            to: targetClientId === 'client-1' ? 'vikram@finedge.ai' : 'elena@horizonvc.com',
            timestamp: 'Just now',
            body: p.body,
          },
        ],
      };
    } else if (customSubject.trim() || customSender.trim()) {
      const isClientCritical =
        customSubject.toLowerCase().includes('term sheet') ||
        customSubject.toLowerCase().includes('m&a') ||
        customSubject.toLowerCase().includes('retainer') ||
        customSubject.toLowerCase().includes('confidential') ||
        customSubject.toLowerCase().includes('wire');

      const isRoutine =
        customSubject.toLowerCase().includes('appointment') ||
        customSubject.toLowerCase().includes('calendar') ||
        customSubject.toLowerCase().includes('reschedule') ||
        customSubject.toLowerCase().includes('interview');

      const responsibility: ResponsibilityType = isClientCritical
        ? 'Client to Reply'
        : isRoutine
        ? 'Assistant to Reply'
        : 'No Reply Needed';

      emailToInject = {
        clientId: targetClientId,
        senderName: customSender.trim() || 'Executive Contact',
        senderEmail: 'contact@partner.example.com',
        subject: customSubject.trim() || 'New Inbound Communication',
        responsibility,
        aiConfidence: 96,
        aiSummary: `Inbound message from ${customSender || 'Executive Contact'}: "${customSubject || 'Discussion'}".`,
        whyResponsibility: isClientCritical
          ? 'Requires CEO/Managing Partner direct decision and strategic input.'
          : isRoutine
          ? 'Calendar coordination and logistical task managed by Assistant Diya S.'
          : 'Informational correspondence processed by triage filter.',
        segment: (isRoutine ? 'Meetings & Appointments' : isClientCritical ? 'Important' : 'General') as SegmentType,
        messages: [
          {
            id: `msg-${Date.now()}`,
            from: `${customSender || 'Executive'} <contact@partner.example.com>`,
            senderEmail: 'contact@partner.example.com',
            to: targetClientId === 'client-1' ? 'vikram@finedge.ai' : 'elena@horizonvc.com',
            timestamp: 'Just now',
            body: customBody.trim() || 'Custom simulated message content.',
          },
        ],
      };
    } else {
      const p = PRESETS_TAB_A[0];
      emailToInject = {
        clientId: targetClientId,
        senderName: p.senderName,
        senderEmail: p.senderEmail,
        subject: p.subject,
        responsibility: p.expectedBadge,
        aiConfidence: p.confidence,
        aiSummary: p.summary,
        whyResponsibility: p.why,
        segment: p.segment,
        messages: [
          {
            id: `msg-${Date.now()}`,
            from: `${p.senderName} <${p.senderEmail}>`,
            senderEmail: p.senderEmail,
            to: 'vikram@finedge.ai',
            timestamp: 'Just now',
            body: p.body,
          },
        ],
      };
    }

    simulateIncomingEmail(emailToInject);
    setIsAnalyzing(false);
    setIsSimulateModalOpen(false);
  };

  const handleRunEscalationTabB = async () => {
    setIsEscalating(true);
    await new Promise((r) => setTimeout(r, 1000));
    escalateThread(selectedThreadId, escalationNote);
    setIsEscalating(false);
    setIsSimulateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E6E4DD] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#18181B]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E6E4DD] bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E6E4DD] flex items-center justify-center text-[#18181B]">
              <Zap className="w-4 h-4 text-[#C2410C]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#18181B]">
                AetherMail Live AI Simulator
              </h2>
              <p className="text-xs text-[#71717A]">
                Simulate inbound traffic & watch triage & dynamic re-classification in real time
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSimulateModalOpen(false)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E6E4DD] bg-[#FAF9F5] px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('tabA')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tabA'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Tab A — New Incoming Email (Live AI Triage)</span>
          </button>
          <button
            onClick={() => setActiveTab('tabB')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tabB'
                ? 'border-[#18181B] text-[#18181B] font-semibold'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Tab B — Thread Dynamic Re-Classification Demo</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#FFF4ED] text-[#C2410C] border border-[#FFEDD5] uppercase font-mono">
              Live Flip
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'tabA' ? (
            /* TAB A: NEW INCOMING EMAIL */
            <div className="space-y-4">
              {/* Target Client Switcher */}
              <div>
                <label className="text-xs font-semibold text-[#18181B]">Deliver To Client Mailbox:</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {clients.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setTargetClientId(c.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition-all ${
                        targetClientId === c.id
                          ? 'bg-white border-[#18181B] ring-1 ring-[#18181B] text-[#18181B] font-semibold shadow-xs'
                          : 'bg-[#FAF9F5] border-[#E6E4DD] text-[#71717A] hover:border-[#D4D2CA]'
                      }`}
                    >
                      <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <p className="text-[#18181B]">{c.name}</p>
                        <p className="text-[10px] text-[#71717A] uppercase font-mono">{c.provider}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Realistic Preset Scenarios */}
              <div>
                <label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                  Choose 1 of 3 Realistic Preset Scenarios:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESETS_TAB_A.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyPreset(idx)}
                      className="p-3 rounded-xl border border-[#E6E4DD] bg-[#FAF9F5] hover:bg-white hover:border-[#D4D2CA] text-left transition-all group flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider bg-white border border-[#E6E4DD] text-[#71717A]">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-semibold text-[#18181B] group-hover:text-[#2563EB] mt-1.5 line-clamp-1">
                          {p.title}
                        </h4>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-[#E6E4DD] flex items-center justify-between">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            p.expectedBadge === 'Client to Reply'
                              ? 'bg-[#FFF4ED] text-[#C2410C] border border-[#FFEDD5]'
                              : p.expectedBadge === 'Assistant to Reply'
                              ? 'bg-[#F0F7FF] text-[#1D4ED8] border border-[#DBEAFE]'
                              : 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]'
                          }`}
                        >
                          → {p.expectedBadge}
                        </span>
                        <span className="text-[11px] text-[#2563EB] font-medium group-hover:underline">
                          Select
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Or Custom Fields */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] space-y-2.5">
                <p className="text-xs font-semibold text-[#18181B]">Or Type Custom Email Details:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-[#71717A]">Sender Name</label>
                    <input
                      type="text"
                      value={customSender}
                      onChange={(e) => setCustomSender(e.target.value)}
                      placeholder="e.g. Rachel Green (Partner, Cooley LLP)"
                      className="w-full mt-0.5 p-2 rounded-lg bg-white border border-[#E6E4DD] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#71717A]">Subject Line</label>
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="e.g. Urgent: Series A Term Sheet cap revision"
                      className="w-full mt-0.5 p-2 rounded-lg bg-white border border-[#E6E4DD] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#71717A]">Message Body</label>
                  <textarea
                    rows={2}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    placeholder="Enter message body..."
                    className="w-full mt-0.5 p-2 rounded-lg bg-white border border-[#E6E4DD] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#18181B] font-sans"
                  />
                </div>
              </div>

              {/* Analyzing State Animation */}
              {isAnalyzing && (
                <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#DBEAFE] flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-[#2563EB] animate-spin" />
                  <div>
                    <p className="text-xs font-semibold text-[#1D4ED8]">{analysisText}</p>
                    <p className="text-[10px] text-[#71717A]">
                      Extracting entities, checking calendar conflicts & predicting reply responsibility...
                    </p>
                  </div>
                </div>
              )}

              {/* Button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleRunAiTriageTabA()}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E4E4E7]" />
                  <span>Simulate & Run AI Triage</span>
                </button>
              </div>
            </div>
          ) : (
            /* TAB B: NEW REPLY IN EXISTING THREAD (DYNAMIC RE-CLASSIFICATION DEMO) */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#FFF4ED] border border-[#FFEDD5] text-xs text-[#C2410C] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-[#9A3412] mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Dynamic Re-Classification Demo</span>
                </div>
                Demonstrates how AetherMail monitors continuing conversation threads. When a sender introduces an unexpected high-stakes term (like an advisory fee, board seat, or valuation condition) into what was previously a routine assistant task, the AI immediately re-evaluates and flips the classification to <strong>"Client to Reply"</strong>!
              </div>

              {/* Pick Assistant Thread */}
              <div>
                <label className="text-xs font-semibold text-[#18181B] mb-1 block">
                  1. Select an Existing "Assistant to Reply" Thread:
                </label>
                <select
                  value={selectedThreadId}
                  onChange={(e) => setSelectedThreadId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#18181B] cursor-pointer"
                >
                  {assistantThreads.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.senderName}: "{e.subject}" (Currently: {e.responsibility})
                    </option>
                  ))}
                </select>
              </div>

              {/* Escalation Reply Content */}
              <div>
                <label className="text-xs font-semibold text-[#18181B] mb-1 block">
                  2. Inbound Escalation Reply from Counterparty:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={escalationNote}
                    onChange={(e) => setEscalationNote(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#C2410C] font-sans"
                  />
                  <div className="absolute right-2.5 bottom-2.5 text-[10px] text-[#C2410C] font-mono flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Financial Condition Trigger</span>
                  </div>
                </div>
              </div>

              {/* Visual Preview of Expected Flip */}
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E4DD] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#F0F7FF] text-[#1D4ED8] border border-[#DBEAFE] font-medium text-[11px]">
                    Assistant to Reply
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#C2410C] border border-[#FFEDD5] font-semibold text-[11px] animate-pulse">
                    ⚡ Client to Reply
                  </span>
                </div>
                <span className="text-[11px] text-[#71717A] font-mono">
                  Trigger: $40,000 fee approval
                </span>
              </div>

              {/* Loading State */}
              {isEscalating && (
                <div className="p-4 rounded-xl bg-[#FFF4ED] border border-[#FFEDD5] flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-[#C2410C] animate-spin" />
                  <div>
                    <p className="text-xs font-semibold text-[#9A3412]">
                      Re-evaluating Conversation History & Escalating...
                    </p>
                    <p className="text-[10px] text-[#71717A]">
                      Detected financial sign-off requirement. Rerouting to Executive Attention queue.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleRunEscalationTabB}
                  disabled={isEscalating}
                  className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Simulate Incoming Escalation Message</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
