import type { Metadata } from 'next';
import './globals.css';
import { EmailProvider } from '@/context/EmailContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { ConnectionModal } from '@/components/modals/ConnectionModal';
import { SimulateEmailModal } from '@/components/modals/SimulateEmailModal';
import { ShortcutsModal } from '@/components/modals/ShortcutsModal';
import { CopilotDrawer } from '@/components/copilot/CopilotDrawer';

export const metadata: Metadata = {
  title: 'AetherMail PA — AI-Powered Personal Assistant Email Dashboard',
  description: 'AI Executive Shield & Personal Assistant Email Management System with Superhuman speed and multi-client orchestration.',
  icons: {
    icon: '/icon.svg?v=2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8F7F4] text-[#18181B] min-h-screen antialiased selection:bg-[#E0E7FF] selection:text-[#1E1B4B]">
        <EmailProvider>
          {children}
          <ToastContainer />
          <ConnectionModal />
          <SimulateEmailModal />
          <ShortcutsModal />
          <CopilotDrawer />
        </EmailProvider>
      </body>
    </html>
  );
}
