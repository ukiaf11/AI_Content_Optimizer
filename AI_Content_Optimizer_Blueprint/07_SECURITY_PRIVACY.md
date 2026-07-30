# Security, Privacy & Trust

## Media privacy

Creator uploads may be unpublished and commercially sensitive.

Requirements:
- Private object storage
- Short-lived signed URLs
- Encryption in transit and at rest
- Strict workspace authorization
- No public predictable media URLs
- Configurable retention
- Permanent delete workflow
- Separate original/proxy/artifact lifecycle policies

## Upload security

- Allowlist MIME types
- Verify magic bytes server-side
- Enforce file-size/duration limits
- Sanitize filenames
- Never execute uploaded content
- Isolate FFmpeg processing
- Resource/time limits to reduce decompression/decoder abuse
- Malware scanning where appropriate

## Application security

- CSRF protection for cookie auth
- Secure/HttpOnly/SameSite cookies
- Password hashing using framework-recommended algorithms
- MFA-ready design
- Rate limiting
- Brute-force protection
- Object-level authorization
- Audit log for team/billing/security actions
- Secret manager in production
- Dependency and container scanning

## AI security

Uploaded captions, OCR, transcript, and metadata are untrusted input.

- Treat media-derived text as data, not instructions
- System prompts must explicitly ignore embedded prompt injection
- Schema-validate outputs
- Cap tokens and model calls
- Redact secrets from logs
- Separate user content from internal control instructions

## Privacy product requirements

Provide:
- What is stored
- How long it is stored
- Whether content is sent to subprocessors/model providers
- Whether content is used for model improvement
- Delete controls
- Data export/account deletion where legally required

Before launch, obtain appropriate legal/privacy review for target markets.

## Social integrations

Use official APIs and least-privilege OAuth scopes. Do not store access tokens in plaintext database columns. Encrypt or store credentials through a dedicated secrets mechanism.
