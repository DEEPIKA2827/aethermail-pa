# AetherMail PA — AI-Powered Personal Assistant Email Management Dashboard

> **Superhuman & Linear aesthetic AI executive shield** for top-tier Personal Assistants (PAs) and high-profile executives (CEOs, Managing Partners). 
> Built with Next.js 14 (App Router, TypeScript), Tailwind CSS, and `lucide-react`.

---

## 🌟 Key Architecture & Capabilities

### 1. Visual Design System
- **Superhuman / Linear / Notion Adaptive Theme**: High-contrast dark default palette (`bg-slate-950`, `bg-slate-900/80` glassmorphism, `border-slate-800/80`, `text-slate-100` typography).
- **Light/Dark Mode**: Built-in toggle in the top navigation bar with seamless Tailwind `dark` class transitions.
- **Semantic AI Classification Badges**:
  - `Assistant to Reply`: Indigo/Blue pill (`bg-indigo-500/15 text-indigo-300 border border-indigo-500/30`) with bot icon.
  - `Client to Reply`: Amber/Rose urgent pill (`bg-amber-500/15 text-amber-300 border border-amber-500/30`) with user-star icon.
  - `No Reply Needed`: Emerald/Slate subtle pill (`bg-emerald-500/10 text-emerald-300 border border-emerald-500/20`) with check-circle icon.
  - `Needs Review`: Purple/Orange dashed pill (`bg-purple-500/15 text-purple-300 border border-dashed border-purple-400/50`) with alert triangle icon for low-confidence classifications.

---

### 2. Assistant Dashboard — 3-Pane Workspace
1. **Left Sidebar (`AssistantSidebar.tsx`)**:
   - Navigation links with live badge counts for all 9 required segments:
     1. `All Inbox`
     2. `Assistant to Reply`
     3. `Client to Reply`
     4. `No Reply Needed`
     5. `Needs Review (Low Confidence)`
     6. `Action Required`
     7. `Waiting for Response`
     8. `Meetings & Appointments`
     9. `Important` & `Archived / Completed`
   - **Upcoming Meetings Identified via Email Card**: Compact sidebar card listing extracted meetings with date/time, client name, conflict status badges (`Clear` or `Conflict`), and 1-click jump to email.
2. **Center Pane (`EmailList.tsx`)**:
   - Instant search input (filters sender, subject, or AI summary).
   - Quick filter pills: `All`, `Unread`, `Important`, `Has Meeting`.
   - Each card displays:
     - Sender name, client tag (`For: Vikram` or `For: Elena`), timestamp, unread dot, star toggle.
     - Subject line + 1-line AI summary preview.
     - **Prominent AI Classification Badge with Inline Override Dropdown**: Reassign classification directly from the list item!
     - **Highlighted Delegation Banner**: Displays `"🔁 Delegated by Client: [Note]"` when delegated from the Client View.
3. **Right Pane (`EmailDetail.tsx`)**:
   - Quick action header (`Mark Completed`, `Star/Important`, `Mark Read/Unread`, `Archive`, `Delete`).
   - **AI Triage & X-Ray Card**: Reply Responsibility badge, AI Confidence percentage (e.g., `94% Confidence`), manual override selector, AI Executive Summary, and Why Assigned reasoning.
   - **Extracted Dates, Deadlines & Conflicts**: Meeting widget with 1-click `"Add Tentative Hold to Calendar"`.
   - **Full Thread History**: Clean collapsible/expandable cards showing chronological message history.
   - **Approval-Gated AI Reply Composer**:
     - Tone selector pills: `Professional`, `Warm & Concise`, `Firm Follow-Up`, `Schedule Meeting`.
     - `"✨ Regenerate with AI"` button calling the `/api/ai` Groq backend.
     - Pre-filled editable textarea (auto-incorporates client delegation notes).
     - Explicit safety banner: `"🔒 AI Drafts require Assistant Review & Approval before sending"` with an `"Approve & Send Reply"` button.

---

### 3. Minimalistic Client-Facing View (`ClientView.tsx`)
Ultra-clean, distraction-free executive interface specifically for Vikram Mehta or Elena Rostova:
- **Zero-Clutter Header**: `"Good Morning, [Client Name] — Here are the [N] emails requiring your personal attention today."`
- **Filtered Feed**: Displays ONLY conversations currently classified as `Client to Reply` (plus a toggle to view recently handled items).
- **Each Minimalist Client Card includes**:
  1. Sender name, company/role, subject line, and received timestamp.
  2. **Short AI Summary** (2 lines max, high-signal).
  3. **"Why Your Personal Response is Needed"** callout box (`bg-amber-500/10 border-l-2 border-amber-400`).
  4. **"View Original Conversation"** button (opens full raw email thread in a clean modal).
  5. **Three 1-Click Executive Actions** (syncs immediately with Assistant Dashboard and logs an event in Assistant's Notification Bell):
     - `✅ Mark as Handled` (marks completed and removes from Client queue).
     - `🤝 Assistant to Take Over` (opens inline input: *"Optional quick note for your assistant, e.g., 'Approve up to $15k' or 'Ask to move to next week'"* → flips classification to `Assistant to Reply`, attaches note, and auto-updates the Assistant's AI draft!).
     - `✍️ Quick Personal Reply` (sends a 1-click AI-assisted personal response directly).

---

### 4. Groq AI Backend Route (`/api/ai/route.ts`) & Copilot Drawer (`CopilotDrawer.tsx`)
- **API Route (`/api/ai/route.ts`)**:
  - Supports `process.env.GROQ_API_KEY` (using `llama-3.3-70b-versatile` via Groq API).
  - Includes a smart deterministic fallback so every copilot query, summary, explanation, and draft generation works 100% reliably even without an API key configured.
- **Floating AI Copilot Drawer (`CopilotDrawer.tsx`)**:
  - Opened via top navbar button or <kbd>Cmd+K</kbd> / <kbd>Ctrl+K</kbd>.
  - Features 1-tap prompt chips:
    - *"Show me emails that need my attention"*
    - *"Summarize this conversation"*
    - *"What am I waiting for a response on?"*
    - *"Which emails require the client's attention?"*
    - *"Why has this email been assigned to the client?"*
    - *"Draft a reply to this conversation"*
  - Every answer references the live state of the inbox and includes **clickable email cards to jump straight to the referenced thread**!

---

### 5. Multi-Client Orchestration & Centralized Reactive State
- Backed by `localStorage` persistence with one-click **"Reset Demo Data"** in the navigation bar.
- **Two Real-World Executive Client Accounts**:
  1. **Vikram Mehta (CEO & Co-Founder, FinEdge AI)** — Connected via **Gmail** (`vikram@finedge.ai`, status: `Synced 1m ago`, 99.8% health).
  2. **Elena Rostova (Managing Partner, Horizon Ventures)** — Connected via **Microsoft Outlook** (`elena@horizonvc.com`, status: `Synced just now`, 100% health).
- **Split-Screen Live Sync Mode**: Side-by-side live demonstration showing both the Assistant and Client views in real-time. Actions taken on either side immediately sync with instant reactive feedback!

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or pnpm

### Running in Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: Configuring Groq API Key
To enable live `llama-3.3-70b-versatile` queries:
1. Create a `.env.local` file in the project root:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```
2. Restart the dev server. If no key is provided, AetherMail automatically operates using its built-in deterministic neural engine fallback.

### Building for Production
```bash
npm run build
npm run start
```

---

## ⌨️ Superhuman Keyboard Shortcuts
Press <kbd>?</kbd> anywhere inside the dashboard to view the shortcuts cheatsheet:
- <kbd>Cmd+K</kbd> or <kbd>Ctrl+K</kbd>: Open AI Command Copilot Drawer
- <kbd>J</kbd> or <kbd>↓</kbd>: Next thread
- <kbd>K</kbd> or <kbd>↑</kbd>: Previous thread
- <kbd>E</kbd>: Archive active thread
- <kbd>S</kbd>: Star / Mark important
- <kbd>R</kbd>: Focus reply composer
- <kbd>1</kbd>: Switch to Assistant Dashboard
- <kbd>2</kbd>: Switch to Client Minimalist View
- <kbd>3</kbd>: Switch to Split-Screen Live Sync
- <kbd>Esc</kbd>: Dismiss modal or close overlay
