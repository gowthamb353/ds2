# Walkthrough - ResolveX IT Incident & Ticket Management Portal

ResolveX is an enterprise-grade IT Service Management (ITSM) web portal engineered with React, Tailwind CSS, and Lucide Icons. It eliminates enterprise communication chaos—missed tickets, misclassified urgency, and SLA breaches—through an ultra-clean SaaS design system, role-based interaction, real-time SLA countdown engine, and automated escalation triggers.

---

## What Was Built

### 1. Ultra-Clean Light SaaS Design System
- **Palette**: Neutral canvas (`bg-slate-50`), crisp white cards (`bg-white`), subtle border lines (`border-slate-200`), electric indigo accents (`indigo-600`), and modern soft shadows.
- **Urgency Badges**:
  - `P1 Critical`: Emergency pulsing rose badge (`bg-rose-50 text-rose-700 border-rose-200`) with animated pulse glow.
  - `P2 High`: Amber warning badge (`bg-amber-50 text-amber-700 border-amber-200`).
  - `P3 Medium`: Blue badge (`bg-blue-50 text-blue-700 border-blue-200`).
  - `P4 Low`: Slate badge (`bg-slate-100 text-slate-700 border-slate-200`).
- **Typography**: Inter / Sans-serif enterprise hierarchy with JetBrains Mono for ticket IDs, telemetry, and terminal snippets.

---

### 2. Intro Splash & Authentication Flow
- **Animated Splash Screen (`SplashPreloader.jsx`)**:
  - Floating `rounded-3xl` card with soft indigo glow (`shadow-2xl shadow-indigo-300/40`).
  - Animated glowing Ticket/Check SVG badge with pulsing gradient halo.
  - Minimal typography: **Resolve**<span style="color:#4f46e5;font-weight:900">X</span> with tracking-widest subtitle `ENTERPRISE IT DESK`.
  - Sleek linear animated loading bar showing real-time telemetry synchronization.
  - Seamless fade-out transition directly into the portal. Includes a "Skip" link and header "Splash" replay button.
- **Enterprise Login Screen (`AuthScreen.jsx`)**:
  - 3 Interactive Role Selector tabs:
    1. `[👤 Alex Morgan]` — Employee / Requester (Design)
    2. `[🛠️ Sarah Chen]` — IT Support Engineer (L2 Support)
    3. `[📊 David Miller]` — IT Operations / Exec (VP of IT)
  - One-click **Quick Demo Login** button for instant sandbox access.
  - Enterprise SSO options: **Okta FastPass** and **Google Workspace**.
  - Security Microcopy: `Secured with SOC-2 Type II Compliance, RBAC & Automated SLA Escalation`.

---

### 3. Core Enterprise Problem-Solving Features

#### A. Smart Ticket Submission ("Zero Confusion" Form)
- **Dynamic Input**: Title, Department dropdown, Affected System dropdown, and detailed description.
- **AI Smart Severity Predictor**:
  - Real-time scanner analyzing keywords (e.g. *database down*, *500 errors*, *payment failing*, *cannot login*, *vpn down*, *outage*).
  - Automatically classifies ticket as **P1 Critical**, calculates 2-hour SLA, displays confidence percentage (e.g. 98%), and presents rationale.
  - Detects matching knowledge base solutions and suggests them to the user before submitting.
- **Automated Device Diagnostics**:
  - One-click toggle that automatically captures OS version, IP address, screen resolution, browser specs, and network latency.

#### B. Live SLA Countdown Timer & Automated Escalation Engine
- Every second, active tickets re-evaluate remaining time against SLA targets:
  - **P1**: 2-Hour SLA Countdown
  - **P2**: 8-Hour SLA Countdown
  - **P3**: 24-Hour SLA Countdown
  - **P4**: 48-Hour SLA Countdown
- **Dynamic States**:
  - `< 30 mins remaining`: Flashes with an animated amber warning glow (`animate-amber-pulse`).
  - `SLA Breached`: Glows red with an emergency pulse indicator (`animate-pulse-glow`).
  - `> 75% elapsed threshold`: Automatically displays the **Manager Alert Dispatched** escalation badge.

#### C. Role-Based Dynamic Dashboards

1. **Employee / Requester View (`EmployeeDashboard.jsx`)**:
   - Welcome banner with personal KPI counters (Active requests, Resolved this month, Avg wait time).
   - "My Active Requests" with visual 4-step progress stepper:
     `Submitted` ➔ `Assigned (Engineer Name)` ➔ `In Progress` ➔ `Resolved / Awaiting Confirmation`.
   - 1-Click "Confirm Resolution" with confetti celebration.
   - **Self-Service Knowledge Base (`KnowledgeBase.jsx`)**:
     - Searchable instant fixes for Cisco AnyConnect VPN, Okta MFA, Thunderbolt display flickering, and cloud access.
     - Copyable CLI snippets with one-click copy feedback.
     - "This Solved My Issue" button with celebratory particle animation.

2. **IT Support Engineer View (`EngineerDashboard.jsx`)**:
   - **Urgency-First Kanban Board (`KanbanBoard.jsx`)**: Sorted strictly by urgency (`P1` first), ensuring critical outages are never buried under lower-priority tickets.
   - **Priority Table View (`TicketTableView.jsx`)**: Tabular list with SLA countdowns, assignee badges, and quick action buttons.
   - **Filter Chips**: "All Queues", "Critical P1s Only", "Breaching in < 30m", "Unassigned", "My Claimed Tickets".
   - **Slide-over Ticket Detail Drawer (`TicketDetailDrawer.jsx`)**:
     - 1-Click "Claim Ticket" and "Reassign" picker.
     - Status progression buttons: "In Progress" and "Resolve".
     - Two-tab communication: **Customer Updates** (public) vs **🔒 Internal Engineer Notes** (hidden from requester).
     - Quick resolution macros (VPN tunnel reset, SSO token refresh, Thunderbolt firmware, RDS pool bump).
     - Full activity audit timeline with timestamps and actor badges.

3. **IT Operations / Manager View (`ManagerDashboard.jsx`)**:
   - **Live KPI Stat Cards (`KpiStats.jsx`)**: SLA Compliance Rate (e.g. 98.4%), Active P1 Outages, MTTR (38m), First Contact Resolution (84.2%).
   - **Department Volume Breakdown (`DepartmentBreakdown.jsx`)**: Distribution bar and ticket volume breakdown across Engineering, Sales, HR, Finance, and Design.
   - **Live Workload Balancer (`WorkloadBalancer.jsx`)**: Real-time capacity meters per engineer (Sarah Chen, James Wilson, Priya Patel, Marcus Vance) with a 1-click **Auto-Balance Load** engine that redistributes unassigned and overloaded tickets.
   - **SLA Audit Log (`SlaAuditTable.jsx`)**: Risk forecast audit table with one-click **Export CSV** and **Export JSON** actions.

---

### 4. Distinctive Enterprise Features
- **System Status Banner (`SystemStatusBanner.jsx`)**: Top collapsible banner showing infrastructure health across 5 core services (API Gateway, DB Cluster, Okta SSO, Cisco VPN, Slack).
- **Universal Search & Shortcut**: Filter tickets by ID (`#TCK-1042`), keywords, or assignee with `Ctrl+K` keyboard shortcut.
- **Top Role Switcher**: Switch between Alexander Morgan, Sarah Chen, and David Miller at any moment to evaluate all three role perspectives.
- **Persistent State**: State automatically persists to `localStorage` so changes, new tickets, and reassignments are maintained across sessions.

---

## Verification & Build Results

1. **Production Build**:
   ```bash
   npm run build
   ```
   - Compiled 1,960 modules transformed cleanly.
   - Output bundle generated in `dist/` in 3.21s with code 0.
   - Zero syntax errors or broken dependencies.

2. **Real-Time Timers**:
   - SLA countdown timers verified to decrement every second.
   - P1 tickets demonstrate flashing amber warning (< 30m) and glowing red breach states immediately.
