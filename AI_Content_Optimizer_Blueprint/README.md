# AI Content Optimizer — Product & Architecture Blueprint

## 1. Product vision

Build a web platform where a creator uploads a video (or image/carousel post), chooses the target platform and objective, and receives an evidence-based content optimization package.

The product should not merely "generate hashtags." It should understand the asset, infer or collect the intended audience, analyze creative quality and likely distribution signals, and produce actionable recommendations.

### Core promise

**Upload content → understand what works/doesn't → improve it → publish with stronger packaging → learn from results.**

### Primary users

- Individual creators
- Influencers
- Social media managers
- Agencies
- Small businesses
- Brands
- Educators and coaches

### Initial platform scope

Start with Instagram Reels/posts, but keep the domain model platform-agnostic so TikTok, YouTube Shorts, LinkedIn, X, Facebook, and Pinterest can be added later.

## 2. Core output

For every analyzed asset, generate:

- Content/topic classification
- Intended/likely audience
- Content intent and format
- Hook analysis
- Retention/pacing analysis
- Scene/timeline observations
- Speech transcript
- OCR/on-screen text
- Audio observations
- Visual quality observations
- Strengths and weaknesses
- Actionable editing recommendations
- Caption options
- SEO/search keywords
- Hashtag groups
- Cover/title options
- CTA options
- Suggested posting strategy
- Content-pillar classification
- Follow-up content ideas
- Optional predicted score with transparent sub-scores
- Version comparison after the creator uploads an edited revision

## 3. Recommended implementation stack

### Frontend
- Next.js + TypeScript
- Tailwind CSS
- Accessible component primitives (e.g. Radix-style architecture)
- TanStack Query for server state
- React Hook Form + schema validation
- Video.js/native video element for timeline playback

### Backend
- Django + Django REST Framework
- PostgreSQL
- Redis
- Celery workers
- Object storage compatible with S3
- FFmpeg/ffprobe
- AI provider abstraction for multimodal analysis, transcription, OCR/vision, and generation

### Infrastructure
- Docker for local/dev
- CDN in front of media
- Managed PostgreSQL/Redis/object storage in production
- Separate API and worker deployments
- Observability: structured logs, tracing, error monitoring, metrics

## 4. Architecture principle

Never make a long-running AI/video job synchronous.

The API should accept an upload, create an `AnalysisJob`, enqueue work, and immediately return a job identifier. Workers then extract media features and run analysis stages. The UI receives progress using SSE/WebSockets or polls the job endpoint.

See the other documents for detailed product requirements, UX, architecture, data model, API, AI pipeline, security, and roadmap.
