# Product Requirements Document

## 1. User journey

1. User lands on the marketing page.
2. User signs up or uses a deliberately limited guest/demo flow.
3. User starts a new analysis.
4. User uploads video/image/carousel.
5. User selects:
   - Platform
   - Content objective: views, follows, saves, shares, comments, leads, sales
   - Optional niche
   - Optional target audience
   - Optional location/language
   - Optional current caption
6. Upload completes independently from analysis.
7. Processing page shows real stage progress.
8. Results page presents an executive summary first, then detailed evidence.
9. User can copy/export recommendations.
10. User can upload a revised version and compare.
11. Later, connected social accounts can import published performance and close the feedback loop.

## 2. MVP requirements

### Authentication
- Email/password
- OAuth-ready design
- Email verification
- Password reset
- Session/device management

### Uploads
- Video: MP4/MOV/WebM initially
- Image: JPEG/PNG/WebP
- Configurable size/duration limits
- Direct-to-object-storage multipart upload
- Client and server MIME validation
- Upload progress, cancel, retry
- Signed URLs; private buckets

### Analysis
- Media metadata
- Audio extraction
- Transcript with timestamps
- Scene/shot segmentation
- Representative frames
- OCR
- Visual description
- Hook analysis
- Pacing/retention heuristics
- Topic/niche classification
- Audience hypothesis
- Caption/keyword/hashtag/cover/CTA generation
- Recommendations tied to timestamps where possible

### Results
- Overall score is optional and must be decomposable
- Hook
- Clarity
- Pacing
- Visual quality
- Audio
- Accessibility
- Searchability
- Engagement potential
- Actionable fixes
- Copy-ready assets

### History
- Previous analyses
- Search/filter
- Status
- Re-open report
- Delete asset/report
- Revision groups

## 3. V2

- Social account connections
- Post-performance import
- Account-level analytics
- Brand voice
- Content calendar
- Team workspaces
- Comments/approvals
- A/B packaging variants
- Competitor/public trend research where platform terms permit it
- Multi-platform recommendations
- API/webhooks for agencies

## 4. Non-goals for MVP

- Automatic publishing
- Promising "viral" results
- Training proprietary ranking models before enough consented outcome data exists
- Full browser-based video editor
- Scraping platforms in violation of their terms

## 5. Success metrics

Product:
- Upload → completed analysis conversion
- Time to first useful insight
- Recommendation copy/use rate
- Revision upload rate
- Weekly returning creators
- Paid conversion

Quality:
- Analysis failure rate
- Transcript/OCR confidence
- User rating of usefulness
- Percentage of recommendations with evidence
- Regeneration rate

Business:
- Cost per analysis
- Gross margin per plan
- Storage cost/user
- Worker utilization
