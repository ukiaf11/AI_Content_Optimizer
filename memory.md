# AI Content Optimizer — Project Memory

## 1. Project Overview & Goal
Build the **AI Content Optimizer**, a creative intelligence workspace where creators can upload videos (or images/carousels), define their publishing platform and objectives (e.g., views, shares, saves), and receive evidence-based, timestamped analysis and optimized copy-ready assets.

## 2. Tech Stack & Environment
- **OS**: Linux
- **Tools Available**: Node.js (v24.16.0), Python (v3.14.4), `uv` (v0.11.18), FFmpeg (v8.0.1), ffprobe (v8.0.1).
- **Backend Architecture**: Python (FastAPI) + Supabase PostgreSQL (Production pooler `aws-1-ap-northeast-2.pooler.supabase.com:5432`) + FFmpeg/ffprobe for media probes.
- **Frontend Architecture**: React (Vite) + TypeScript + Vanilla CSS (crafted for premium dark-themed glassmorphism).
- **AI Integration**: Multimodal analysis using the Gemini API (Python/JS SDKs).

## 3. Core Features Checklist

### Phase 1–5: Foundation (All Complete ✅)
- [x] Monorepo, Backend, Frontend setup
- [x] Media processing pipeline (FFmpeg, ffprobe, keyframe extraction)
- [x] AI analysis pipeline (Gemini API + mock fallback)
- [x] Dashboard, NewAnalysis, ProcessingView, ReportView, RevisionCompare
- [x] Database schema, production deployment (Vercel + Render + Supabase)

### Phase 6: UI Modals & Settings (Complete ✅)
- [x] Custom Confirmation Modal (Dashboard.tsx — `deleteTargetId` state, glassmorphic overlay)
- [x] Settings Modal (App.tsx — default platform/objective/language, saved to localStorage)
- [x] Help & Support Modal (App.tsx — FAQ guide with metric explanations)
- [x] Profile Modal (App.tsx — creator profile card with workspace info)

### Phase 7: Bug Fixes (Complete ✅)
- [x] Fixed `from .database import SessionLocal` relative import error
- [x] Fixed Supabase IPv6 → IPv4 pooler connection
- [x] Added `psycopg2-binary` dependency
- [x] Live API verified: `POST /api/v1/analyses` → 200 OK

### Phase 8: UI/UX Polish & Dark/Light Theme (In-Progress)
- [ ] **Dark/Light Theme Toggle**: Add a theme toggle button to sidebar. Implement CSS `[data-theme="light"]` variable overrides in `index.css`. Store preference in `localStorage`. Toggle applies globally.
- [ ] **UI/UX Polish — Settings Modal**: Add visual icons to each setting row, improve spacing, add "Reset to Defaults" button.
- [ ] **UI/UX Polish — Help Modal**: Add accordion-style expandable FAQ sections, add contact/support link.
- [ ] **UI/UX Polish — Profile Modal**: Add dynamic analysis count fetched from API, add logout button placeholder, improve avatar styling.
- [ ] **UI/UX Polish — Delete Confirmation Modal**: Add danger icon, animate entrance with scale transform.
- [ ] **General Polish**: Add hover micro-animations to sidebar icons, improve glass panel hover glows, add smooth page transition animations.

## 4. Current Status
- **Backend**: Live on Render (`dep-d9locrqjnfac73avas3g`), verified 200 OK.
- **Frontend**: Live on Vercel (`ai-content-optimizer-six.vercel.app`).
- **Next Step**: Implement Phase 8 — Dark/Light theme toggle + UI/UX polish across all modals.
