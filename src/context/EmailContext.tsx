'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Email,
  ClientAccount,
  ActivityNotification,
  ViewMode,
  FilterResponsibility,
  FilterSegment,
  ResponsibilityType,
  SegmentType,
} from '@/types/email';
import { INITIAL_CLIENTS, INITIAL_EMAILS, INITIAL_NOTIFICATIONS } from '@/data/initialData';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface KpiMetrics {
  total: number;
  unread: number;
  important: number;
  actionRequired: number;
  waitingForResponse: number;
  assistantToReply: number;
  clientToReply: number;
  clientAttention: number;
}

interface EmailContextType {
  // State
  clients: ClientAccount[];
  emails: Email[];
  selectedClientId: string; // 'all' | 'client-1' | 'client-2'
  selectedEmailId: string | null;
  selectedEmail: Email | null;
  viewMode: ViewMode;
  filterResponsibility: FilterResponsibility;
  filterSegment: FilterSegment;
  searchQuery: string;
  notifications: ActivityNotification[];
  isDarkMode: boolean;
  isSyncing: boolean;
  isAccountSwitching: boolean;
  toasts: Toast[];
  kpiMetrics: KpiMetrics;
  
  // Modals & Copilot
  isConnectionModalOpen: boolean;
  isSimulateModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  isCopilotOpen: boolean;
  isMobileSidebarOpen: boolean;
  mobileShowDetail: boolean;

  // Actions
  setIsMobileSidebarOpen: (open: boolean) => void;
  setMobileShowDetail: (show: boolean) => void;
  setSelectedClientId: (id: string) => void;
  setSelectedEmailId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setFilterResponsibility: (res: FilterResponsibility) => void;
  setFilterSegment: (seg: FilterSegment) => void;
  setSearchQuery: (q: string) => void;
  toggleDarkMode: () => void;
  setIsConnectionModalOpen: (open: boolean) => void;
  setIsSimulateModalOpen: (open: boolean) => void;
  setIsShortcutsModalOpen: (open: boolean) => void;
  setIsCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;

  // Email operations
  updateEmail: (id: string, updates: Partial<Email>) => void;
  toggleEmailStar: (id: string) => void;
  toggleEmailRead: (id: string) => void;
  archiveEmail: (id: string) => void;
  deleteEmail: (id: string) => void;
  setResponsibility: (id: string, resp: ResponsibilityType) => void;
  delegateToAssistant: (emailId: string, note: string) => void;
  assistantTakeOver: (emailId: string, note?: string) => void;
  markAsHandled: (emailId: string) => void;
  quickPersonalReply: (emailId: string, replyText?: string) => void;
  addTentativeHold: (emailId: string) => void;
  regenerateAIDraft: (emailId: string, tone?: string) => Promise<string>;
  delegateToClient: (emailId: string, note?: string) => void;
  sendDraftReply: (emailId: string, replyText: string) => void;
  simulateIncomingEmail: (custom?: Partial<Email>) => void;
  escalateThread: (emailId: string, escalationText?: string) => void;
  
  // Notifications & Sync
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  syncAccounts: () => Promise<void>;
  resetDemoData: () => void;
  connectNewAccount: (account: Partial<ClientAccount>) => void;
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Filtered lists
  filteredEmails: Email[];
  clientFilteredEmails: Email[];
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLIENTS: 'aethermail_clients_v2',
  EMAILS: 'aethermail_emails_v2',
  NOTIFS: 'aethermail_notifs_v2',
  THEME: 'aethermail_theme_v2',
  VIEW_MODE: 'aethermail_view_v2',
};

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clients state
  const [clients, setClients] = useState<ClientAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_CLIENTS;
  });

  // Emails state
  const [emails, setEmails] = useState<Email[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_EMAILS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) {
        return saved === 'dark';
      }
      return true; // dark by default
    }
    return true;
  });

  // Navigation & filter state
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>('email-1');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode;
      if (saved && ['assistant', 'client', 'splitscreen'].includes(saved)) {
        return saved;
      }
    }
    return 'assistant';
  });
  const [filterResponsibility, setFilterResponsibility] = useState<FilterResponsibility>('all');
  const [filterSegment, setFilterSegment] = useState<FilterSegment>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI status state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAccountSwitching, setIsAccountSwitching] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState<boolean>(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [mobileShowDetail, setMobileShowDetail] = useState<boolean>(false);

  const toggleCopilot = useCallback(() => {
    setIsCopilotOpen((prev) => !prev);
  }, []);

  const handleSetSelectedClientId = useCallback((id: string) => {
    setIsAccountSwitching(true);
    setSelectedClientId(id);
    setTimeout(() => {
      setIsAccountSwitching(false);
    }, 600);
  }, []);

  // Persistence effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    }
  }, [clients]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
    }
  }, [emails]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    }
  }, [viewMode]);

  // Toast helper
  const addToast = useCallback((title: string, message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Compute selected email object
  const selectedEmail = useMemo(() => {
    if (!selectedEmailId) return null;
    return emails.find((e) => e.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  // Compute KPI metrics based on client scope
  const kpiMetrics = useMemo<KpiMetrics>(() => {
    const clientScope = selectedClientId === 'all' 
      ? emails 
      : emails.filter((e) => e.clientId === selectedClientId);

    const activeList = clientScope.filter((e) => !e.archived);

    return {
      total: activeList.length,
      unread: activeList.filter((e) => e.unread).length,
      important: activeList.filter((e) => e.important).length,
      actionRequired: activeList.filter((e) => e.actionRequired || e.segment === 'Action Required').length,
      waitingForResponse: activeList.filter((e) => e.waitingForResponse || e.segment === 'Waiting for Response').length,
      assistantToReply: activeList.filter((e) => e.responsibility === 'Assistant to Reply').length,
      clientToReply: activeList.filter((e) => e.responsibility === 'Client to Reply').length,
      clientAttention: activeList.filter(
        (e) => e.responsibility === 'Client to Reply' || e.responsibility === 'Needs Review'
      ).length,
    };
  }, [emails, selectedClientId]);

  // Filtered emails for Assistant view
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Client account filter
      if (selectedClientId !== 'all' && email.clientId !== selectedClientId) {
        return false;
      }

      // Hide archived emails unless viewing the archived segment
      if (filterSegment === 'archived') {
        if (!email.archived) return false;
      } else {
        if (email.archived) return false;
      }

      // Segment & special status filter
      if (filterSegment === 'unread') {
        if (!email.unread) return false;
      } else if (filterSegment === 'important') {
        if (!email.important) return false;
      } else if (filterSegment === 'completed') {
        if (!email.completed) return false;
      } else if (filterSegment === 'Assistant to Reply') {
        if (email.responsibility !== 'Assistant to Reply') return false;
      } else if (filterSegment === 'Client to Reply') {
        if (email.responsibility !== 'Client to Reply') return false;
      } else if (filterSegment === 'No Reply Needed') {
        if (email.responsibility !== 'No Reply Needed') return false;
      } else if (filterSegment === 'Needs Review') {
        if (email.responsibility !== 'Needs Review') return false;
      } else if (filterSegment === 'Meetings & Appointments') {
        if (email.segment !== 'Meetings & Appointments' && !email.meetingDetails) return false;
      } else if (filterSegment === 'Action Required') {
        if (!email.actionRequired && email.segment !== 'Action Required') return false;
      } else if (filterSegment === 'Waiting for Response') {
        if (!email.waitingForResponse && email.segment !== 'Waiting for Response') return false;
      } else if (filterSegment !== 'all' && filterSegment !== 'archived') {
        if (email.segment !== filterSegment) return false;
      }

      // Secondary Responsibility filter (if applied concurrently via dropdown)
      if (filterResponsibility !== 'all' && email.responsibility !== filterResponsibility) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSubject = email.subject.toLowerCase().includes(query);
        const matchSender = email.senderName.toLowerCase().includes(query) || email.senderEmail.toLowerCase().includes(query);
        const matchSummary = email.aiSummary.toLowerCase().includes(query);
        const matchBody = email.messages.some((m) => m.body.toLowerCase().includes(query));
        const matchTags = email.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchSubject && !matchSender && !matchSummary && !matchBody && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [emails, selectedClientId, filterSegment, filterResponsibility, searchQuery]);

  // Filtered emails strictly for the Client Executive View (e.g. only non-archived items needing client attention or delegated)
  const clientFilteredEmails = useMemo(() => {
    return emails.filter((email) => {
      if (selectedClientId !== 'all' && email.clientId !== selectedClientId) {
        return false;
      }
      if (email.archived) return false;
      return true;
    });
  }, [emails, selectedClientId]);

  // Email state update helpers
  const updateEmail = useCallback((id: string, updates: Partial<Email>) => {
    setEmails((prev) =>
      prev.map((email) => (email.id === id ? { ...email, ...updates } : email))
    );
  }, []);

  const toggleEmailStar = useCallback((id: string) => {
    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = !e.important;
          return { ...e, important: updated };
        }
        return e;
      })
    );
  }, []);

  const toggleEmailRead = useCallback((id: string) => {
    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = !e.unread;
          return { ...e, unread: updated };
        }
        return e;
      })
    );
  }, []);

  const archiveEmail = useCallback((id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, archived: true, unread: false } : e))
    );
    addToast('Email Archived', 'Moved to archive folder successfully', 'info');
  }, [addToast]);

  const deleteEmail = useCallback((id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmailId === id) {
      setSelectedEmailId(null);
    }
    addToast('Email Removed', 'The conversation was permanently removed', 'warning');
  }, [selectedEmailId, addToast]);

  const setResponsibility = useCallback((id: string, resp: ResponsibilityType) => {
    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            responsibility: resp,
            whyResponsibility: `Manually reassigned to ${resp} by Executive Assistant Diya S.`,
          };
        }
        return e;
      })
    );
    addToast('Responsibility Updated', `Assigned to ${resp}`, 'success');
  }, [addToast]);

  // Client delegates to Assistant
  const delegateToAssistant = useCallback((emailId: string, note: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;

    const client = clients.find((c) => c.id === targetEmail.clientId);
    const clientName = client ? client.name : 'Client';

    const delegationMessage = {
      id: `msg-${Date.now()}`,
      from: `${clientName} <${targetEmail.provider === 'gmail' ? 'vikram@finedge.ai' : 'elena@horizonvc.com'}>`,
      senderEmail: targetEmail.provider === 'gmail' ? 'vikram@finedge.ai' : 'elena@horizonvc.com',
      to: 'Diya S. <diya.pa@aethermail.ai>',
      timestamp: 'Just now',
      body: `[Executive Delegation Note]\n"${note}"`,
      isClient: true,
    };

    const updatedDraft = `Hi ${targetEmail.senderName.split(' ')[0]},\n\nI reviewed this with ${clientName}. Here is our direction:\n\n${note}\n\nPlease proceed accordingly.\n\nBest regards,\nDiya S.\nExecutive Assistant to ${clientName}`;

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            responsibility: 'Assistant to Reply',
            clientDelegationNote: note,
            delegatedAt: 'Just now',
            actionRequired: true,
            suggestedDraft: updatedDraft,
            whyResponsibility: `Delegated by ${clientName}: "${note}"`,
            messages: [...e.messages, delegationMessage],
          };
        }
        return e;
      })
    );

    // Add activity notification
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: `🔁 ${clientName} delegated to Assistant`,
      description: `"${note}" on: ${targetEmail.subject}`,
      type: 'delegation',
      read: false,
      emailId: emailId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'Delegated to Assistant',
      `Instruction logged for Diya. AI reply draft auto-updated with client directive.`,
      'success'
    );
  }, [emails, clients, addToast]);

  // Assistant Take Over (1-click helper from Client View)
  const assistantTakeOver = useCallback((emailId: string, note?: string) => {
    const finalNote = note?.trim() || 'Please take over this conversation and coordinate full resolution.';
    delegateToAssistant(emailId, finalNote);
  }, [delegateToAssistant]);

  // Mark as Handled by Client
  const markAsHandled = useCallback((emailId: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;
    const client = clients.find((c) => c.id === targetEmail.clientId);
    const clientName = client ? client.name : 'Client';

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            completed: true,
            unread: false,
            actionRequired: false,
            waitingForResponse: false,
            responsibility: 'No Reply Needed',
            whyResponsibility: `Directly marked as Handled & Completed by ${clientName}.`,
          };
        }
        return e;
      })
    );

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: `✅ ${clientName} marked thread Handled`,
      description: `Subject: ${targetEmail.subject}`,
      type: 'email',
      read: false,
      emailId: emailId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Marked as Handled', `Removed from ${clientName}'s attention queue and archived as completed.`, 'success');
  }, [emails, clients, addToast]);

  // Quick Personal Reply from Client View
  const quickPersonalReply = useCallback((emailId: string, replyText?: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;
    const client = clients.find((c) => c.id === targetEmail.clientId);
    const clientName = client ? client.name : 'Client';

    const textToSend = replyText?.trim() || `Hi ${targetEmail.senderName.split(' ')[0]},\n\nThanks for your note. We have reviewed and approved this on our end. Please coordinate the remaining logistics with my executive assistant Diya.\n\nBest regards,\n${clientName}`;

    const clientReplyMessage = {
      id: `msg-${Date.now()}`,
      from: `${clientName} <${targetEmail.provider === 'gmail' ? 'vikram@finedge.ai' : 'elena@horizonvc.com'}>`,
      senderEmail: targetEmail.provider === 'gmail' ? 'vikram@finedge.ai' : 'elena@horizonvc.com',
      to: targetEmail.senderEmail,
      timestamp: 'Just now',
      body: textToSend,
      isClient: true,
    };

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            completed: true,
            actionRequired: false,
            waitingForResponse: true,
            responsibility: 'No Reply Needed',
            whyResponsibility: `Direct personal response dispatched by ${clientName}.`,
            messages: [...e.messages, clientReplyMessage],
          };
        }
        return e;
      })
    );

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: `✍️ ${clientName} sent personal reply`,
      description: `Replied to ${targetEmail.senderName} on "${targetEmail.subject}"`,
      type: 'email',
      read: false,
      emailId: emailId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Personal Reply Dispatched', `Direct message sent from ${clientName} to ${targetEmail.senderName}.`, 'success');
  }, [emails, clients, addToast]);

  // Add Tentative Hold to Calendar
  const addTentativeHold = useCallback((emailId: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail || !targetEmail.meetingDetails) return;
    const client = clients.find((c) => c.id === targetEmail.clientId);
    const clientName = client ? client.name : 'Client';

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId && e.meetingDetails) {
          return {
            ...e,
            meetingDetails: {
              ...e.meetingDetails,
              conflictStatus: 'clear',
              conflictNote: `Tentative calendar hold locked on ${clientName}'s schedule by Diya.`,
            },
          };
        }
        return e;
      })
    );

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: '📅 Tentative Calendar Hold Reserved',
      description: `Hold placed for "${targetEmail.meetingDetails.title}" (${targetEmail.meetingDetails.proposedTime})`,
      type: 'meeting',
      read: false,
      emailId: emailId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Hold Reserved', `Tentative calendar hold locked on ${clientName}'s schedule.`, 'success');
  }, [emails, clients, addToast]);

  // Regenerate AI Draft via /api/ai
  const regenerateAIDraft = useCallback(async (emailId: string, tone = 'Professional'): Promise<string> => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return '';
    const client = clients.find((c) => c.id === targetEmail.clientId);
    const clientName = client ? client.name : 'Client';

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'draft',
          contextEmail: targetEmail,
          tone,
          clientName,
          delegationNote: targetEmail.clientDelegationNote,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setEmails((prev) =>
            prev.map((e) => (e.id === emailId ? { ...e, suggestedDraft: data.reply } : e))
          );
          addToast('AI Draft Regenerated', `Generated using ${data.provider} (${tone} tone)`, 'success');
          return data.reply;
        }
      }
    } catch (err) {
      console.error('Failed to call /api/ai:', err);
    }

    const fallback = `Hi ${targetEmail.senderName.split(' ')[0]},\n\nThank you for reaching out regarding ${targetEmail.subject}. Confirmed on behalf of ${clientName}—we have reviewed and approved proceeding.\n\nBest regards,\nDiya S.`;
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, suggestedDraft: fallback } : e))
    );
    return fallback;
  }, [emails, clients, addToast]);

  // Assistant delegates to Client
  const delegateToClient = useCallback((emailId: string, note?: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;

    const client = clients.find((c) => c.id === targetEmail.clientId);
    const clientName = client ? client.name : 'Client';

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            responsibility: 'Client to Reply',
            actionRequired: true,
            whyResponsibility: note
              ? `Re-routed to ${clientName} by Diya: "${note}"`
              : `High-level decision routed to ${clientName} for personal input.`,
          };
        }
        return e;
      })
    );

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: `Escalated to ${clientName}`,
      description: `Subject: ${targetEmail.subject}`,
      type: 'ai',
      read: false,
      emailId: emailId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Escalated to Client', `Routed to ${clientName}'s Executive Attention queue.`, 'info');
  }, [emails, clients, addToast]);

  // Assistant sends draft reply
  const sendDraftReply = useCallback((emailId: string, replyText: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      from: 'Diya S. <diya.pa@aethermail.ai>',
      senderEmail: 'diya.pa@aethermail.ai',
      to: targetEmail.senderEmail,
      timestamp: 'Just now',
      body: replyText,
      isAssistant: true,
    };

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            completed: true,
            actionRequired: false,
            waitingForResponse: true,
            responsibility: 'No Reply Needed',
            whyResponsibility: 'Reply sent by Executive Assistant Diya S. Waiting for counterparty response.',
            messages: [...e.messages, newMessage],
          };
        }
        return e;
      })
    );

    addToast('Reply Sent', `Message dispatched to ${targetEmail.senderName}. Email marked completed!`, 'success');
  }, [emails, addToast]);

  // Simulate Incoming Email
  const simulateIncomingEmail = useCallback((custom?: Partial<Email>) => {
    const isClientOne = Math.random() > 0.5;
    const client = isClientOne ? clients[0] : clients[1];

    const templates = [
      {
        senderName: 'Alexandra Hayes',
        senderEmail: 'a.hayes@goldmansachs.example.com',
        senderAvatar: 'AH',
        subject: 'Confidential: Series B Pre-emptive Term Sheet Discussion & Q3 Financial Model',
        receivedAt: 'Just now',
        responsibility: 'Client to Reply' as ResponsibilityType,
        aiConfidence: 98,
        aiSummary: 'Goldman Sachs Growth Fund requests a 30-min confidential discussion on leading the Series B round with an indicative $120M valuation.',
        whyResponsibility: 'Major corporate financing event and direct fund partner engagement requiring CEO/Partner strategic evaluation.',
        segment: 'Important' as SegmentType,
        body: `Dear ${client.name.split(' ')[0]},\n\nOur Growth Equity committee reviewed your Q3 metrics yesterday and we are extremely impressed. We are prepared to discuss terms for leading your Series B with an indicative valuation of $120M.\n\nCould we jump on a call tomorrow afternoon?\n\nBest,\nAlexandra Hayes\nManaging Director, Goldman Sachs`,
        suggestedDraft: `Dear Alexandra,\n\nThank you for reaching out and for your confidence in our trajectory. I would welcome a conversation regarding the Series B. My assistant Diya (cc’d) will coordinate a 30-min window for tomorrow.\n\nBest regards,\n${client.name}`,
      },
      {
        senderName: 'Bloomberg Technology',
        senderEmail: 'press@bloomberg.example.com',
        senderAvatar: 'BT',
        subject: 'Media Request: Live TV Interview on Bloomberg Tech regarding AI Agent Infrastructure',
        receivedAt: 'Just now',
        responsibility: 'Assistant to Reply' as ResponsibilityType,
        aiConfidence: 95,
        aiSummary: 'Producer from Bloomberg Technology invites client for an 8-minute live satellite segment on Thursday at 4:15 PM EST.',
        whyResponsibility: 'Standard media scheduling and logistics request suitable for executive assistant calendar management.',
        segment: 'Meetings & Appointments' as SegmentType,
        meetingDetails: {
          title: 'Bloomberg Technology Live TV Interview',
          proposedDate: 'This Thursday',
          proposedTime: '4:15 PM - 4:45 PM EST',
          duration: '30 mins (8 min on air)',
          conflictStatus: 'clear' as const,
          conflictNote: 'Clear on calendar after 3:30 PM.',
          suggestedAlternative: 'Confirmed clear slot at 4:15 PM EST',
          location: 'Bloomberg SF Studio / Satellite Feed',
        },
        body: `Hello,\n\nWe would love to feature ${client.name} live on Bloomberg Technology this Thursday at 4:15 PM EST to discuss recent enterprise adoption trends.\n\nPlease confirm availability and technical contact.\n\nWarmly,\nBloomberg Tech Booking Desk`,
        suggestedDraft: `Hi Bloomberg Team,\n\nDiya here, executive assistant to ${client.name}. ${client.name.split(' ')[0]} would be thrilled to join the live segment on Thursday at 4:15 PM EST. His calendar is clear.\n\nPlease send over the studio dial-in and rundown.\n\nBest,\nDiya S.`,
      },
    ];

    const pick = custom?.subject 
      ? {
          senderName: custom.senderName || 'Enterprise Lead',
          senderEmail: custom.senderEmail || 'vip@enterprise.example.com',
          senderAvatar: custom.senderAvatar || 'EL',
          subject: custom.subject,
          receivedAt: 'Just now',
          responsibility: custom.responsibility || 'Assistant to Reply',
          aiConfidence: custom.aiConfidence || 94,
          aiSummary: custom.aiSummary || 'New high priority incoming correspondence processed by AetherMail AI.',
          whyResponsibility: custom.whyResponsibility || 'Automated classification assigned by AetherMail Neural Engine.',
          segment: custom.segment || 'Important',
          body: custom.messages?.[0]?.body || 'Automated simulation message body.',
          suggestedDraft: custom.suggestedDraft || 'Thank you for your message. We have received your inquiry.',
          meetingDetails: custom.meetingDetails,
        }
      : templates[Math.floor(Math.random() * templates.length)];

    const newId = `email-sim-${Date.now()}`;
    const newEmail: Email = {
      id: newId,
      clientId: client.id,
      provider: client.provider,
      senderName: pick.senderName,
      senderEmail: pick.senderEmail,
      senderAvatar: pick.senderAvatar,
      subject: pick.subject,
      receivedAt: 'Just now',
      unread: true,
      important: true,
      archived: false,
      completed: false,
      waitingForResponse: false,
      actionRequired: true,
      responsibility: pick.responsibility,
      aiConfidence: pick.aiConfidence,
      aiSummary: pick.aiSummary,
      whyResponsibility: pick.whyResponsibility,
      segment: pick.segment,
      meetingDetails: pick.meetingDetails,
      messages: [
        {
          id: `msg-${Date.now()}`,
          from: `${pick.senderName} <${pick.senderEmail}>`,
          senderEmail: pick.senderEmail,
          to: `${client.name} <${client.email}>`,
          timestamp: 'Just now',
          body: pick.body,
        },
      ],
      suggestedDraft: pick.suggestedDraft,
      tags: ['Simulated', 'Realtime', 'AI-Classified'],
    };

    setEmails((prev) => [newEmail, ...prev]);
    setSelectedEmailId(newId);

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: `⚡ Incoming: ${pick.senderName}`,
      description: `${pick.subject} — AI classified: "${pick.responsibility}" (${pick.aiConfidence}% confidence)`,
      type: 'email',
      read: false,
      emailId: newId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'New Email Simulated',
      `Received from ${pick.senderName} for ${client.name}. Classified as "${pick.responsibility}".`,
      'success'
    );
  }, [clients, addToast]);

  // Dynamic Thread Escalation Simulator (Tab B)
  const escalateThread = useCallback((emailId: string, escalationText?: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;
    const client = clients.find((c) => c.id === targetEmail.clientId);
    const clientName = client ? client.name : 'Client';

    const escalationBody =
      escalationText ||
      "Actually, before we lock the call, I need Vikram's personal approval on the revised $40,000 advisory retainer fee.";

    const escalationMsg = {
      id: `msg-${Date.now()}`,
      from: `${targetEmail.senderName} <${targetEmail.senderEmail}>`,
      senderEmail: targetEmail.senderEmail,
      to: `${clientName} <${targetEmail.provider === 'gmail' ? 'vikram@finedge.ai' : 'elena@horizonvc.com'}>`,
      timestamp: 'Just now',
      body: escalationBody,
    };

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            responsibility: 'Client to Reply',
            aiConfidence: 99,
            unread: true,
            actionRequired: true,
            waitingForResponse: false,
            whyResponsibility: `Dynamic AI Re-classification: Counterparty introduced high-stakes financial term requiring ${clientName}'s personal sign-off ($40,000 advisory retainer).`,
            aiSummary: `${targetEmail.senderName} escalated: requires ${clientName}'s personal sign-off on the revised $40,000 advisory fee before proceeding.`,
            messages: [...e.messages, escalationMsg],
          };
        }
        return e;
      })
    );

    setSelectedEmailId(emailId);

    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: `⚡ Dynamic Escalation: ${targetEmail.senderName}`,
      description: `Thread re-classified from "Assistant to Reply" to "Client to Reply" ($40,000 fee approval).`,
      type: 'ai',
      read: false,
      emailId: emailId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'Dynamic Escalation: Flipped to Client to Reply!',
      `AI re-evaluated thread history: $40,000 retainer fee requires ${clientName}'s direct sign-off.`,
      'warning'
    );
  }, [emails, clients, addToast]);

  // Sync Mailboxes action
  const syncAccounts = useCallback(async () => {
    setIsSyncing(true);
    addToast('Syncing Inboxes', 'Connecting to Google Workspace & Microsoft Graph APIs...', 'info');
    
    await new Promise((resolve) => setTimeout(resolve, 1400));

    setClients((prev) =>
      prev.map((c) => ({
        ...c,
        status: 'Synced just now',
        health: 100,
      }))
    );

    setIsSyncing(false);
    addToast('Sync Complete', 'All client accounts are 100% up to date with 0 sync latency.', 'success');
  }, [addToast]);

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CLIENTS);
      localStorage.removeItem(STORAGE_KEYS.EMAILS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFS);
    }
    setClients(INITIAL_CLIENTS);
    setEmails(INITIAL_EMAILS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedEmailId('email-1');
    setSelectedClientId('all');
    setFilterResponsibility('all');
    setFilterSegment('all');
    setSearchQuery('');
    addToast('Demo Reset', 'Sample accounts, emails, and threads restored to factory state.', 'info');
  }, [addToast]);

  // Add new connected account
  const connectNewAccount = useCallback((account: Partial<ClientAccount>) => {
    const newClient: ClientAccount = {
      id: `client-${Date.now()}`,
      name: account.name || 'Alex Morgan',
      role: account.role || 'Partner',
      company: account.company || 'Venture Capital',
      email: account.email || 'alex@venture.com',
      provider: account.provider || 'gmail',
      avatar: account.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Synced just now',
      health: 100.0,
      color: account.provider === 'gmail' ? '#ea4335' : '#0078d4',
    };

    setClients((prev) => [...prev, newClient]);
    addToast('Account Connected', `Successfully authorized ${newClient.name} (${newClient.provider.toUpperCase()}).`, 'success');
  }, [addToast]);

  // Notifications helpers
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All activity marked as read', 'info');
  }, [addToast]);

  return (
    <EmailContext.Provider
      value={{
        clients,
        emails,
        selectedClientId,
        selectedEmailId,
        selectedEmail,
        viewMode,
        filterResponsibility,
        filterSegment,
        searchQuery,
        notifications,
        isDarkMode,
        isSyncing,
        isAccountSwitching,
        toasts,
        kpiMetrics,
        isConnectionModalOpen,
        isSimulateModalOpen,
        isShortcutsModalOpen,
        isCopilotOpen,
        setSelectedClientId: handleSetSelectedClientId,
        setSelectedEmailId,
        setViewMode,
        setFilterResponsibility,
        setFilterSegment,
        setSearchQuery,
        toggleDarkMode,
        setIsConnectionModalOpen,
        setIsSimulateModalOpen,
        setIsShortcutsModalOpen,
        setIsCopilotOpen,
        toggleCopilot,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        mobileShowDetail,
        setMobileShowDetail,
        updateEmail,
        toggleEmailStar,
        toggleEmailRead,
        archiveEmail,
        deleteEmail,
        setResponsibility,
        delegateToAssistant,
        assistantTakeOver,
        markAsHandled,
        quickPersonalReply,
        addTentativeHold,
        regenerateAIDraft,
        delegateToClient,
        sendDraftReply,
        simulateIncomingEmail,
        escalateThread,
        markNotificationRead,
        clearNotifications,
        syncAccounts,
        resetDemoData,
        connectNewAccount,
        addToast,
        removeToast,
        filteredEmails,
        clientFilteredEmails,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};
