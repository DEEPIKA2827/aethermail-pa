'use client';

import React from 'react';
import { useEmailContext } from '@/context/EmailContext';
import { EmailList } from '@/components/email/EmailList';
import { EmailDetail } from '@/components/email/EmailDetail';
import { ClientExecutiveView } from '@/components/client/ClientExecutiveView';
import { Zap } from 'lucide-react';

export const SplitScreenView: React.FC = () => {
  const { clients, selectedClientId, setSelectedClientId, simulateIncomingEmail } = useEmailContext();

  return (
    <div className="flex flex-col h-[calc(100vh-53px)] overflow-hidden bg-[#F8F7F4] text-[#18181B]">
      {/* Live Sync Banner */}
      <div className="px-4 py-2 bg-[#FAF9F5] border-b border-[#E6E4DD] flex items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#C2410C] border border-[#FFEDD5] text-[10px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-ping" />
            Live Reactive Sync
          </div>
          <span className="text-[#71717A] font-medium hidden md:inline">
            Side-by-Side Dual View: Any action taken by the Client on the right reflects instantly in the Assistant's workspace on the left.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateIncomingEmail()}
            className="px-2.5 py-1 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-[11px] font-medium transition-colors flex items-center gap-1 shadow-xs"
          >
            <Zap className="w-3 h-3 text-[#E4E4E7]" />
            <span>Trigger Live Inbound Test</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E4DD] overflow-hidden">
        {/* LEFT PANE: ASSISTANT COMMAND CENTER */}
        <div className="flex flex-col h-full overflow-hidden bg-white">
          <div className="px-4 py-2.5 border-b border-[#E6E4DD] bg-[#FAF9F5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#18181B] flex items-center justify-center text-white font-bold text-[10px]">
                PA
              </div>
              <div>
                <p className="font-semibold text-[#18181B]">Diya S. — Assistant Workspace</p>
                <p className="text-[10px] text-[#71717A]">Full Neural Triage & Calendar Ops</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#1D4ED8] border border-[#BFDBFE] font-mono">
              Command Center
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            <div className="md:col-span-5 h-full overflow-hidden border-r border-[#E6E4DD]">
              <EmailList />
            </div>
            <div className="md:col-span-7 h-full overflow-hidden">
              <EmailDetail />
            </div>
          </div>
        </div>

        {/* RIGHT PANE: CLIENT MINIMALIST VIEW */}
        <div className="flex flex-col h-full overflow-hidden bg-[#F8F7F4]">
          <div className="px-4 py-2.5 border-b border-[#E6E4DD] bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#C2410C] flex items-center justify-center text-white font-bold text-[10px]">
                CXO
              </div>
              <div>
                <p className="font-semibold text-[#18181B]">Executive Minimalist Interface</p>
                <p className="text-[10px] text-[#71717A]">Distraction-Free Strategic View</p>
              </div>
            </div>

            {/* Quick client select inside right pane */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#71717A]">Viewing as:</span>
              <select
                value={selectedClientId === 'all' ? 'client-1' : selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-white border border-[#E6E4DD] text-[#18181B] text-xs rounded-md px-2 py-0.5 cursor-pointer focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.provider.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ClientExecutiveView />
          </div>
        </div>
      </div>
    </div>
  );
};
