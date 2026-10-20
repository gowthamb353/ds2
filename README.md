# ResolveX — Enterprise IT Incident & Service Desk Portal

ResolveX is an enterprise-grade IT Service Management (ITSM) web portal built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## ⚡ Why Double-Clicking `index.html` Showed a White Screen

When you directly double-click `index.html` in File Explorer, Google Chrome loads the page using the `file:///` protocol instead of a local web server (`http://localhost`).

Modern web applications built with **React** and **Vite** rely on JavaScript ES Modules (`<script type="module" src="/src/main.jsx">`) and JSX component compilation. Chrome blocks ES modules from executing over `file:///` due to strict **CORS security policies** (origin `null`), causing the root element to remain blank.

### ✅ How It Has Been Solved:
1. **Added `start.bat`**: A 1-click Windows launcher that starts the local Vite server and automatically opens Google Chrome.
2. **Auto-open configured in `vite.config.js`**: Running `npm run dev` or `npm start` automatically opens your default browser at `http://localhost:5173`.
3. **Smart protocol fallback in `index.html`**: If someone accidentally opens `index.html` via `file:///`, they are greeted with a branded diagnostic card with 1-click launch instructions instead of an empty white screen.
4. **Pristine codebase**: 0 lint errors, 0 warnings, verified production build.

---

## 🚀 Step-by-Step Instructions to Run the Website

### Option 1: 1-Click Launch (Easiest for Windows)
1. In your project folder (`C:\Users\Gopi\Desktop\ds project`), simply double-click **`start.bat`**.
2. The Vite development server will start, and Google Chrome will open automatically to:
   **`http://localhost:5173`**

---

### Option 2: Running via Terminal

1. Open PowerShell, Command Prompt, or VS Code terminal in the project directory:
   ```powershell
   cd "C:\Users\Gopi\Desktop\ds project"
   ```

2. (Optional, if packages were not yet installed):
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the application:
   ```bash
   npm run dev
   # or
   npm start
   ```

4. Google Chrome will automatically open to **`http://localhost:5173`**. If it doesn't open automatically, simply click the link in your terminal or paste `http://localhost:5173` into Chrome.

---

## 🛠️ Available Scripts

- **`npm run dev`** / **`npm start`**: Runs the development server with Hot Module Replacement (HMR) and automatically launches Chrome.
- **`npm run build`**: Compiles the optimized production bundle into the `dist/` folder.
- **`npm run preview`**: Runs a local static preview server of the production build on port 5173.
- **`npm run lint`**: Checks all files with Oxlint (currently 0 errors and 0 warnings).

---

## 🌟 Key Features in ResolveX

- **3 Role Personas (Switchable anytime in top navigation)**:
  - 👤 **Alex Morgan** (Employee / Requester): Zero-confusion ticket submission with AI Smart Severity Predictor, 4-step live progress stepper, and searchable Self-Service Knowledge Base.
  - 🛠️ **Sarah Chen** (IT Support Engineer L2): Urgency-first Kanban & Table views, 1-click Claim/Reassign, customer-facing updates vs private internal engineer notes, and quick macro templates.
  - 📊 **David Miller** (IT Operations / Exec VP): Executive KPI stat cards (SLA compliance, MTTR, P1 outages), department breakdown chart, live engineer capacity workload balancer, and SLA audit log with CSV/JSON exports.
- **Real-Time SLA Countdown Engine**: Second-by-second countdown with flashing amber warning (< 30m) and glowing red breach indicators.
- **Infrastructure Status Banner**: Real-time health across 5 core services (Gateway, DB Cluster, Okta SSO, Cisco VPN, Slack).
