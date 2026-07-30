# AI Content Optimizer — Project Memory

## 1. Project Overview & Goal
Build the **AI Content Optimizer**, a creative intelligence workspace where creators can upload videos (or images/carousels), define their publishing platform and objectives (e.g., views, shares, saves), and receive evidence-based, timestamped analysis and optimized copy-ready assets.

## 2. Tech Stack & Environment
- **OS**: Linux
- **Tools Available**: Node.js (v24.16.0), Python (v3.14.4), `uv` (v0.11.18), FFmpeg (v8.0.1), ffprobe (v8.0.1).
- **Backend Architecture**: Python (FastAPI) + SQLite (for zero-setup dev deployment) + FFmpeg/ffprobe for media probes. Background tasks managed asynchronously within FastAPI or simple thread/process pools.
- **Frontend Architecture**: React (Vite) + TypeScript + Vanilla CSS (crafted for premium dark-themed glassmorphism, smooth animations, and high visual appeal).
- **AI Integration**: Multimodal analysis using the Gemini API (Python/JS SDKs) to extract transcript, OCR text, visual descriptions, pacing metrics, hook analysis, and content copy.

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
- [x] Implement SQLite schema and migrations
- [x] Add error fallback states and empty states
- [x] Deploy to production: **Vercel** (Frontend) + **Render** (Docker backend) + **Supabase** (Postgres DB)

### Phase 6: UI Modals & Settings Completeness (In-Progress)
- [ ] **Custom Confirmation Modal**: Replace browser's native `window.confirm` delete warning in `Dashboard.tsx` with a premium glassmorphic overlay modal.
- [ ] **Settings Modal**: Connect the "Settings" sidebar button in `App.tsx` to a modal configuring default values (niche, language, target platform) and workspace presets.
- [ ] **Help & Support Modal**: Connect the "?" button in `App.tsx` to an onboarding modal explaining optimization metrics (Hook, Pacing, Clarity) and platform safe-zones.
- [ ] **Profile Modal**: Connect the user avatar button in `App.tsx` to a creator profile summary containing workspace metrics (number of analyses, database connection status, email).

## 4. Current Status
- **Backend Service**: Deploying build with `psycopg2-binary` on Render.
- **Frontend App**: Active at `https://ai-content-optimizer-six.vercel.app` (Vercel).
- **Next Step**: Build out Phase 6 features to complete product completeness and UX modals.
