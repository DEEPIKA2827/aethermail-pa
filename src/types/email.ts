export type ProviderType = 'gmail' | 'outlook';

export type ResponsibilityType = 
  | 'Assistant to Reply'
  | 'Client to Reply'
  | 'No Reply Needed'
  | 'Needs Review';

export type SegmentType =
  | 'Meetings & Appointments'
  | 'Action Required'
  | 'Waiting for Response'
  | 'Important'
  | 'General';

export type ConflictStatus = 'clear' | 'conflict';

export interface MeetingDetails {
  title: string;
  proposedDate: string;
  proposedTime: string;
  duration: string;
  conflictStatus: ConflictStatus;
  conflictNote?: string;
  suggestedAlternative?: string;
  location?: string;
}

export interface ThreadMessage {
  id: string;
  from: string;
  senderEmail: string;
  to: string;
  timestamp: string;
  body: string;
  avatar?: string;
  isClient?: boolean;
  isAssistant?: boolean;
}

export interface Email {
  id: string;
  clientId: string; // 'client-1' | 'client-2'
  provider: ProviderType;
  senderName: string;
  senderEmail: string;
  senderAvatar: string;
  subject: string;
  receivedAt: string;
  unread: boolean;
  important: boolean;
  archived: boolean;
  completed: boolean;
  waitingForResponse: boolean;
  actionRequired: boolean;
  responsibility: ResponsibilityType;
  aiConfidence: number; // e.g. 96, 92, 61
  aiSummary: string;
  whyResponsibility: string;
  segment: SegmentType;
  meetingDetails?: MeetingDetails;
  clientDelegationNote?: string;
  delegatedAt?: string;
  messages: ThreadMessage[];
  suggestedDraft: string;
  tags?: string[];
}

export interface ClientAccount {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  provider: ProviderType;
  avatar: string;
  status: string; // e.g. 'Synced 1m ago'
  health: number; // e.g. 99.8
  unreadCount?: number;
  actionCount?: number;
  color: string;
}

export interface ActivityNotification {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'email' | 'delegation' | 'sync' | 'ai' | 'meeting';
  read: boolean;
  emailId?: string;
}

export type ViewMode = 'assistant' | 'client' | 'splitscreen';

export type FilterResponsibility = 'all' | ResponsibilityType;
export type FilterSegment =
  | 'all'
  | SegmentType
  | 'unread'
  | 'important'
  | 'archived'
  | 'completed'
  | 'Assistant to Reply'
  | 'Client to Reply'
  | 'No Reply Needed'
  | 'Needs Review';
