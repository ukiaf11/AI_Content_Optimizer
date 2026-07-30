# REST API Blueprint

Base: `/api/v1`

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/password/forgot
POST /auth/password/reset
GET  /me
```

## Uploads

```text
POST /uploads/initiate
POST /uploads/{upload_id}/part-url
POST /uploads/{upload_id}/complete
DELETE /media/{media_id}
GET /media/{media_id}
```

Initiate:
```json
{
  "filename": "reel.mp4",
  "mime_type": "video/mp4",
  "size_bytes": 48120933
}
```

## Analyses

```text
POST /analyses
GET  /analyses
GET  /analyses/{id}
DELETE /analyses/{id}
POST /analyses/{id}/retry
GET  /analyses/{id}/events
```

Create:
```json
{
  "media_id": "uuid",
  "platform": "instagram",
  "objective": "follows",
  "niche": "software education",
  "target_audience": "beginner Python developers",
  "language": "en"
}
```

## Report

```text
GET /analyses/{id}/summary
GET /analyses/{id}/timeline
GET /analyses/{id}/findings
GET /analyses/{id}/transcript
GET /analyses/{id}/generated-assets
```

Filters:
```text
/findings?category=hook
/findings?severity=high
/generated-assets?type=caption
```

## Generation

Avoid a generic unrestricted prompt endpoint in MVP.

```text
POST /analyses/{id}/regenerate/captions
POST /analyses/{id}/regenerate/hashtags
POST /analyses/{id}/regenerate/covers
POST /analyses/{id}/regenerate/ctas
POST /analyses/{id}/regenerate/ideas
```

## Revision comparison

```text
POST /analyses/{id}/revision
GET  /revision-groups/{id}
GET  /revision-groups/{id}/comparison
```

## Usage/billing

```text
GET /usage
GET /plans
POST /billing/checkout
POST /billing/portal
POST /billing/webhook
```

## V2 social

```text
POST /integrations/{provider}/connect
GET  /integrations
DELETE /integrations/{id}
GET  /posts
GET  /posts/{id}/performance
```

## API rules

- JSON error envelope with stable error codes
- Cursor pagination
- Idempotency key for chargeable POST operations
- Per-user/workspace rate limits
- Request IDs
- OpenAPI schema generated from backend
- API versioning from day one
