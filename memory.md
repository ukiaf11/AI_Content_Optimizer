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

### Phase 1: Project Setup & Structure
- [x] Initialize monorepo directory structure
- [x] Initialize Python backend with `uv` and FastAPI
- [x] Initialize React Vite app with TypeScript

### Phase 2: Media Processing & Storage
- [x] Implement backend upload endpoints with file type validation
- [x] Write media probing service using `ffprobe`
- [x] Write media preprocessor using `ffmpeg`
- [x] Store uploaded media assets and database files locally
- [x] **New Visual Feature**: Extract mid-scene keyframes using `ffmpeg` as JPEGs

### Phase 3: AI Analysis Pipeline
- [x] Integrate Gemini API client (with structured JSON schemas)
- [x] Build multi-stage processing steps (Transcription, OCR, Scenes, Scores, Generated Copy)
- [x] Implement robust mock analysis flow fallback

### Phase 4: Frontend Development
- [x] Build sleek dashboard showing past analyses and metrics
- [x] Create double-column "New Analysis" launcher
  - [x] **New UI Feature**: Dynamic platform-themed drag-and-drop backdrop colors
- [x] Implement live-updating progress checker
- [x] Build interactive **Analysis Report View**
  - [x] Synchronized media player syncing timeline clicks
  - [x] **New Graph Accent**: Pure-SVG interactive **Radar Chart** fingerprint
  - [x] Visual timeline presenting extracted scene keyframes
- [x] Create version comparison layout

### Phase 5: Hardening & Testing
- [x] Implement database schema and migrations
- [x] Add error fallback states and empty states
- [x] Deploy to production: **Vercel** (Frontend) + **Render** (Docker backend) + **Supabase** (Postgres DB)

### Phase 6: UI Modals & Settings Completeness
- [x] **Custom Confirmation Modal**: Replaced native `window.confirm` delete warning in `Dashboard.tsx` with a premium glassmorphic overlay modal.
- [x] **Settings Modal**: Connected "Settings" sidebar button in `App.tsx` to a modal configuring default upload values (platform, objective, language) saved in `localStorage`.
- [x] **Help & Support Modal**: Connected "?" button in `App.tsx` to an onboarding guide modal explaining metrics and safe-zone overlays.
- [x] **Profile Modal**: Connected user avatar button in `App.tsx` to a creator profile card.

### Phase 7: Bug Fix & Endpoint Stability (In-Progress)
- [ ] **Fix Relative Import in main.py**: Fix `ImportError: attempted relative import with no known parent package` caused by `from .database import SessionLocal` on line 160 in `main.py`.
- [ ] **Deploy & Verify**: Commit fix, trigger deployment on Render, and verify `POST /api/v1/analyses` succeeds without 500 or CORS error.

## 4. Current Status
- **Root Cause Identified**: `POST /api/v1/analyses` returned HTTP 500 due to invalid relative import `from .database import SessionLocal` in `main.py`. The resulting 500 error bypassed FastAPI CORS headers, causing the browser to block the response.
- **Next Step**: Remove the relative import dot (`from database import SessionLocal`), push to main, and trigger Render deployment.
