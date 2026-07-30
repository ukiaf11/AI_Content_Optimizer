# UX/UI Design System

## 1. UX philosophy

The interface should feel like a creative intelligence workspace, not an AI chat wrapper.

Key principles:
- One obvious primary action per screen
- Progressive disclosure
- Evidence before generic advice
- Timestamped recommendations
- Never hide processing state
- Never show fabricated precision
- Fast copy/export workflows
- Mobile usable; desktop optimized for deep analysis

## 2. Information architecture

Public:
- Home
- How it works
- Features
- Pricing
- Examples
- Sign in / Sign up

App:
- Dashboard
- New Analysis
- Analysis Report
- History
- Content Library
- Insights (V2)
- Brand Kit (V2)
- Integrations (V2)
- Billing
- Settings

## 3. Home page

Hero:
- Headline: optimize creative before you publish
- Upload/drop-zone demo
- Supported platforms
- Example report preview
- Primary CTA

Below hero:
- How it works: Upload → Analyze → Improve
- Report capabilities
- Before/after example
- Trust/privacy section
- Pricing
- FAQ

Avoid a noisy dashboard aesthetic on the marketing page.

## 4. Dashboard

Desktop layout:
- Left navigation rail
- Top search/account bar
- Main area
  - New Analysis card
  - Recent projects
  - Usage
  - Improvement highlights (when outcome data exists)

Do not fill the dashboard with meaningless charts before users have data.

## 5. New Analysis screen

Use a focused 2-column flow.

Left:
- Drag/drop upload
- Media preview
- Replace/remove

Right:
- Platform
- Goal
- Audience
- Niche
- Language
- Existing caption
- Advanced options collapsed

Primary action: `Analyze content`

Persist form state during upload.

## 6. Processing screen

Show real pipeline stages:
- Upload complete
- Preparing media
- Transcribing
- Reading on-screen text
- Understanding scenes
- Evaluating creative
- Building recommendations

Include:
- Preview thumbnail
- Elapsed state
- Safe navigation away
- Notification when finished (later)

Do not use fake percentage increments. Stage progress is better than invented precision.

## 7. Analysis report

Desktop:
- Sticky media player on left (approximately 40%)
- Scrollable report on right (approximately 60%)

Top summary:
- Content type
- Target audience
- Goal
- 3 strongest qualities
- 3 highest-impact fixes
- Scorecard

Tabs:
1. Overview
2. Timeline
3. Hook & Retention
4. Visual & Audio
5. Caption & SEO
6. Hashtags
7. Cover & CTA
8. Next Ideas

### Timeline
Recommendations should link to video timestamps:
- 00:00–00:02: opening lacks immediate proposition
- 00:08–00:12: repeated idea; shorten
- 00:18: payoff appears here; consider moving earlier

Clicking an observation seeks the player.

### Recommendation cards

Each card:
- Finding
- Evidence
- Why it matters
- Suggested change
- Expected objective affected
- Confidence: high/medium/low

## 8. Mobile

Use:
- Bottom navigation
- Full-width player
- Collapsible report sections
- Sticky copy buttons only where useful

Avoid reproducing desktop sidebars on small screens.

## 9. Visual system

- 8px spacing grid
- 12–16px card radii
- Strong type hierarchy
- Neutral base palette with one brand accent
- WCAG AA contrast
- Visible focus states
- 44px minimum touch targets
- Skeletons only while actual content is pending
- Reduced-motion support
- Captions/transcript accessible by keyboard

## 10. Important states

Design explicitly:
- Empty
- Uploading
- Processing
- Partial analysis
- Failed stage
- Unsupported file
- Quota exceeded
- Offline/retry
- Deleted/expired media
- No speech detected
- Low-confidence transcript/OCR
