# Data Model

## Core entities

### User
- id UUID
- email
- password/auth provider fields
- display_name
- locale
- timezone
- created_at

### Workspace
Supports future teams without rewriting ownership.
- id
- name
- owner_id
- plan
- created_at

### Membership
- workspace_id
- user_id
- role: owner/admin/editor/viewer

### MediaAsset
- id
- workspace_id
- uploaded_by
- type: video/image/carousel
- original_filename
- object_key
- mime_type
- size_bytes
- sha256
- duration_ms
- width
- height
- fps
- status
- created_at
- deleted_at

### Analysis
- id
- workspace_id
- media_asset_id
- revision_group_id nullable
- platform
- objective
- niche
- target_audience
- language
- current_caption
- config_json
- status
- model_bundle_version
- created_at
- completed_at

### AnalysisStage
- id
- analysis_id
- stage
- status
- started_at
- completed_at
- retry_count
- error_code
- error_message

### TranscriptSegment
- id
- analysis_id
- start_ms
- end_ms
- text
- speaker nullable
- confidence nullable

### Scene
- id
- analysis_id
- start_ms
- end_ms
- representative_frame_key
- description
- technical_metrics_json

### OCRSpan
- id
- scene_id
- start_ms
- end_ms
- text
- bounding_box_json
- confidence

### Finding
- id
- analysis_id
- category
- severity
- start_ms nullable
- end_ms nullable
- title
- evidence
- explanation
- recommendation
- confidence
- objective_impact_json

### GeneratedAsset
- id
- analysis_id
- type: caption/hashtag_set/cover/cta/keyword/idea
- variant
- content_json
- model_metadata_json

### Score
- analysis_id
- hook
- clarity
- pacing
- visual
- audio
- accessibility
- searchability
- engagement
- overall
- scoring_version

### UsageEvent
- workspace_id
- user_id
- analysis_id
- event_type
- units
- estimated_cost
- created_at

### SocialConnection (V2)
- workspace_id
- provider
- encrypted_credentials_reference
- status
- scopes
- expires_at

### PublishedPost (V2)
- analysis_id nullable
- social_connection_id
- external_post_id
- published_at
- metadata_json

### PerformanceSnapshot (V2)
- published_post_id
- captured_at
- impressions
- views
- reach
- watch_time
- average_watch_time
- likes
- comments
- saves
- shares
- follows_attributed nullable

## Indexes

Important:
- MediaAsset(workspace_id, created_at desc)
- Analysis(workspace_id, created_at desc)
- Analysis(status)
- AnalysisStage(analysis_id, stage)
- Finding(analysis_id, category)
- PublishedPost(external_post_id)
- PerformanceSnapshot(published_post_id, captured_at desc)

Use UUIDs externally. Avoid exposing sequential database IDs.
