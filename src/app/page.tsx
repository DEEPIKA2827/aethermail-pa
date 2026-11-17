'use client';

import React from 'react';
import { useEmailContext } from '@/context/EmailContext';
import { Navbar } from '@/components/layout/Navbar';
import { AssistantDashboard } from '@/components/assistant/AssistantDashboard';
import { ClientExecutiveView } from '@/components/client/ClientExecutiveView';
import { SplitScreenView } from '@/components/splitscreen/SplitScreenView';

export default function Home() {
  const { viewMode } = useEmailContext();

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-[#F8F7F4]">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        {viewMode === 'assistant' && <AssistantDashboard />}
        {viewMode === 'client' && <ClientExecutiveView />}
        {viewMode === 'splitscreen' && <SplitScreenView />}
      </div>
    </main>
  );
}
