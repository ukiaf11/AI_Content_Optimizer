# AI & Media Analysis Pipeline

## 1. Principle

Treat the report as a synthesis of observable signals, model reasoning, and platform/user context.

Do not claim that a model knows Instagram's ranking algorithm. Recommendations should be phrased as optimization hypotheses and creative best practices, not guaranteed outcomes.

## 2. Preprocessing

Use ffprobe:
- duration
- codec
- resolution
- FPS
- bitrate
- audio tracks

Use FFmpeg:
- normalized proxy
- waveform/audio extraction
- thumbnails
- representative frames
- optional low-resolution analysis proxy

## 3. Scene analysis

Detect shot boundaries, then sample frames based on scene duration and visual change rather than blindly sending every Nth frame.

Derive:
- shot length
- visual change rate
- faces/subjects where appropriate
- composition
- lighting/readability
- text density
- blank/dead frames
- format/safe-area issues

## 4. Audio

Derive:
- speech transcript + timestamps
- silence windows
- speech rate
- clipping/low-volume heuristics
- music/speech balance where technically measurable

Avoid inferring sensitive personal traits from voice/appearance.

## 5. OCR

Extract:
- on-screen hook
- subtitles
- title cards
- CTA
- brand/product text

Store timestamps and confidence.

## 6. Semantic understanding

Structured model output:
```json
{
  "primary_topic": "",
  "subtopics": [],
  "content_format": "",
  "content_intent": "",
  "audience_hypotheses": [],
  "value_proposition": "",
  "payoff": "",
  "tone": "",
  "language": ""
}
```

If user-supplied audience/objective exists, distinguish it from model inference.

## 7. Hook analysis

Evaluate approximately the first 1–3 seconds contextually:
- immediate subject clarity
- proposition
- visual movement
- text hook
- curiosity
- mismatch between hook and payoff
- intro/dead time

## 8. Pacing/retention heuristics

Signals:
- long silence
- static shots
- repeated transcript concepts
- delayed payoff
- scene cadence
- information density
- abrupt/unreadable text
- unnecessary outro

Do not present heuristic retention as measured viewer retention unless actual platform analytics are connected.

## 9. Packaging generation

Use a normalized `ContentBrief` assembled from transcript, OCR, visual description, user objective, findings, and platform context.

Generate:
- 3 captions with materially different strategies
- primary and secondary keywords
- small, relevant hashtag groups rather than spam
- 3–5 cover options
- 3 CTA options
- 5 follow-up ideas

Validate generated output against JSON schemas.

## 10. Scoring

If scores are shown, use versioned rubric-based scoring.

Example overall:
```text
overall =
  hook * W1 +
  clarity * W2 +
  pacing * W3 +
  visual * W4 +
  audio * W5 +
  accessibility * W6 +
  searchability * W7 +
  engagement * W8
```

Weights depend on platform/content format/objective.

Show score explanations. Never display "92% chance to go viral."

## 11. Learning loop (later)

Once social integrations exist:
- capture performance snapshots
- normalize by account baseline
- compare recommendations with actual outcomes
- build user/account-specific priors
- train ranking/calibration models only on consented, appropriately governed data

This is where the product can become substantially more defensible than a generic multimodal prompt.
