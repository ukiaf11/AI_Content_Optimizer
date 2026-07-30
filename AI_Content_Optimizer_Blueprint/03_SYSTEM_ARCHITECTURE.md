# System Architecture

## 1. High-level architecture

```text
Browser / Mobile Web
        |
        v
     CDN/WAF
        |
        v
   Next.js Web App
        |
        +----------------------+
        |                      |
        v                      v
 Django REST API         Object Storage
        |                 (direct upload)
        |
   PostgreSQL
        |
      Redis
        |
     Celery
        |
  +-----+---------------------------+
  |             |          |        |
Media Worker  AI Worker  Report   Notifications
  |             |        Worker      Worker
 FFmpeg      AI Gateway
                |
        Provider adapters
  (vision / speech / language models)
```

## 2. Why asynchronous jobs

Video processing includes decoding, frame extraction, transcription, OCR, multimodal inference, and report generation. These can exceed normal HTTP timeouts and should be independently retryable.

Use:
- API: validation/orchestration
- Queue: task delivery
- Workers: CPU/AI work
- DB: durable job state
- Object storage: media/artifacts
- Redis: broker/cache/short-lived coordination

## 3. Upload flow

Preferred production flow:

1. `POST /uploads/initiate`
2. API validates quota and creates upload record.
3. API returns signed multipart upload instructions.
4. Browser uploads directly to object storage.
5. Browser calls `/uploads/{id}/complete`.
6. Backend verifies object metadata.
7. User submits analysis request.
8. API creates job and queues preprocessing.

This prevents large files from flowing through Django workers.

## 4. Analysis orchestration

```text
analysis.created
   |
   v
probe_media
   |
   +--> extract_audio --> transcribe
   |
   +--> detect_scenes --> sample_frames --> OCR
   |                               \----> vision analysis
   |
   +--> technical_quality
                   |
                   v
            aggregate_features
                   |
                   v
            creative_reasoning
                   |
          +--------+---------+
          |        |         |
       caption   SEO     hashtag/CTA
          \        |         /
           \-------+--------/
                   |
              build_report
                   |
              job.completed
```

Independent branches can execute in parallel.

## 5. AI Gateway

Application code should not depend directly on one model vendor.

Interface examples:
- `transcribe(media)`
- `describe_frames(frames, context)`
- `extract_ocr(frame)`
- `analyze_creative(features, objective)`
- `generate_packaging(report_context)`
- `embed(text)`

Provider adapter responsibilities:
- API credentials
- Model selection
- Timeouts
- Retries
- Rate limits
- Structured-output validation
- Cost tracking
- Safety handling
- Provider-specific payloads

## 6. Progress

Persist stage state in PostgreSQL.

Example:
```json
{
  "status": "processing",
  "current_stage": "creative_analysis",
  "completed_stages": [
    "media_probe",
    "transcription",
    "scene_detection",
    "ocr"
  ]
}
```

SSE is sufficient for one-way progress updates. WebSockets are useful later for collaborative workspaces.

## 7. Scaling

Scale independently:
- Web/API replicas
- CPU-heavy media workers
- AI/I/O workers
- Scheduled/background workers

Use queue routing:
- `media`
- `ai`
- `reports`
- `notifications`

Set worker concurrency based on workload, not a single global number.

## 8. Caching/idempotency

Generate a SHA-256 content fingerprint after upload.

If the same user analyzes the same file with the same analysis configuration, optionally reuse expensive preprocessing artifacts.

Every task must be idempotent. Retries must not create duplicate reports or charges.
