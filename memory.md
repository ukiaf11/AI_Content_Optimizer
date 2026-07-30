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
- [x] Initialize monorepo directory structure:
  - `apps/api/` (FastAPI backend)
  - `apps/web/` (React Vite frontend)
- [x] Initialize Python backend with `uv` virtual environment and FastAPI.
- [x] Initialize React Vite app with TypeScript.

### Phase 2: Media Processing & Storage
- [x] Implement backend upload endpoints with file type validation (MP4, MOV, WebM, JPEG, PNG).
- [x] Write media probing service using `ffprobe` (extract resolution, duration, frame rate, audio presence).
- [x] Write media preprocessor using `ffmpeg` (audio extraction to MP3/WAV, frame sampling for scene analysis).
- [x] Store uploaded media assets and extracted files in a local directory (simulating private object storage bucket).
- [x] **New Visual Feature**: Write mid-scene keyframe extraction using `ffmpeg` to capture real JPEG thumbnails for each video segment.

### Phase 3: AI Analysis Pipeline
- [x] Integrate Gemini API client (with structured JSON outputs and schema enforcement).
- [x] Build processing steps:
  1. **Transcription**: Extract speech audio and convert to text with timestamps.
  2. **OCR / Screen-Text**: Parse title cards and hook texts from sampled frames.
  3. **Visual / Scene Description**: Describe visual pacing, shot composition, lighting.
  4. **Creative Synthesis**: Combine findings into actionable recommendations (hook, pacing, timeline observations, scorecards).
  5. **Packaging Generation**: Generate captions, hashtags, cover/title ideas, CTAs, follow-ups.
- [x] Implement robust mock analysis flow if Gemini API credentials are not configured.

### Phase 4: Frontend Development
- [x] Build sleek dashboard showing past analyses and "New Analysis" launcher.
- [x] Create double-column "New Analysis" form: drag-and-drop upload zone on the left, platform/goal/audience metadata inputs on the right.
  - [x] **New UI Feature**: Added platform-matching dynamic gradient backgrounds (Instagram, TikTok, YouTube colors) on the drag-and-drop area.
- [x] Implement live-updating progress screen showing stages (Preparing Media, Transcribing, Scene Understanding, Creative Analysis, Generating Report).
- [x] Build the interactive **Analysis Report View**:
  - Sticky synchronized video player on the left.
    - [x] **New Graph Accent**: Added a custom, pure-SVG interactive **Radar Chart** visual fingerprint showing metrics balance.
  - Multi-tab report on the right (Overview, Timeline, Hook & Pacing, Visual & Audio, Caption & SEO, Covers & CTAs, Next Ideas).
    - [x] **New visual layout**: Timelines dynamically render the keyframe JPEGs extracted by FFmpeg during the backend pipeline.
    - [x] Sync timeline recommendations so clicking a recommendation seeks the video player to that timestamp.
- [x] Create **Revision Comparison View** to upload a new version of the video and visually compare improvements.

### Phase 5: Hardening & Testing
- [x] Implement SQLite schema and migrations (MediaAsset, Analysis, Findings, GeneratedAssets, Scores).
- [x] Add error fallback states and empty states (Offline, Unsupported file, Low-confidence transcription).
- [x] Conduct end-to-end verification tests.

## 4. Current Status
- **Phase**: Visual Enhancements and Testing Completed.
- **Backend Port**: 8000 (running in task: task-135)
- **Frontend Port**: 5173 (running in task: task-139)
- **Next Action**: Showcase the final features to the user.
