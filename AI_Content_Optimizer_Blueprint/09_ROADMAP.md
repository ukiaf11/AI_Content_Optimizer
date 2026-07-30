# Delivery Roadmap

## Phase 0 — Validation (1–2 weeks)

Before building expensive infrastructure:
- Prototype analysis on 20–50 diverse creator videos
- Define report schema
- Interview creators
- Identify which recommendations they actually use
- Establish cost per analysis

Deliverable: clickable UX + working analysis prototype.

## Phase 1 — Foundation (2 weeks)

- Monorepo
- Auth
- PostgreSQL
- Redis/Celery
- S3-compatible storage
- Direct upload
- Media model
- Analysis job/state machine
- Base dashboard

## Phase 2 — Media intelligence (2–3 weeks)

- ffprobe/FFmpeg pipeline
- Proxy generation
- Transcription
- Scene detection
- OCR
- Frame descriptions
- Structured feature aggregation

## Phase 3 — Creative intelligence (2–3 weeks)

- Hook
- Pacing
- Timeline findings
- Visual/audio observations
- Content classification
- Audience/objective reasoning
- Scoring rubric

## Phase 4 — Packaging & report (2 weeks)

- Captions
- Keywords
- Hashtags
- Covers
- CTAs
- Follow-up ideas
- Copy/export
- Revision comparison

## Phase 5 — Production hardening (2 weeks)

- Billing/quotas
- Rate limits
- Observability
- Cost controls
- Failure/retry UX
- Retention/delete controls
- Security testing
- Load testing

## Phase 6 — Growth intelligence

- Official social integrations
- Performance imports
- Account baselines
- Recommendation outcome tracking
- Personalized optimization

## MVP team

Possible lean team:
- 1 full-stack/backend engineer
- 1 frontend/product engineer
- 1 product/UI designer (part-time possible)
- AI/media engineering can initially be owned by backend engineer if experienced

## Build order

Do not start with all social integrations or a complicated ML model.

Build this vertical slice first:

```text
Upload one Reel
→ preprocess
→ transcript + scenes + OCR
→ structured analysis
→ excellent report
→ captions/keywords/hashtags/covers/CTA
→ history
```

Make that experience exceptional before expanding.
