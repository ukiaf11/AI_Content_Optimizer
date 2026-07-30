# Repository Structure

A monorepo is practical for the initial team.

```text
content-optimizer/
├── apps/
│   ├── web/                       # Next.js
│   │   ├── app/
│   │   │   ├── (marketing)/
│   │   │   ├── (auth)/
│   │   │   └── dashboard/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── upload/
│   │   │   ├── player/
│   │   │   ├── report/
│   │   │   └── charts/
│   │   ├── features/
│   │   │   ├── analyses/
│   │   │   ├── media/
│   │   │   ├── auth/
│   │   │   └── billing/
│   │   └── lib/
│   │
│   └── api/                       # Django
│       ├── config/
│       ├── apps/
│       │   ├── accounts/
│       │   ├── workspaces/
│       │   ├── media/
│       │   ├── analyses/
│       │   ├── ai_gateway/
│       │   ├── billing/
│       │   ├── integrations/
│       │   └── usage/
│       └── manage.py
│
├── packages/
│   ├── contracts/                 # generated API types/schemas
│   └── design-tokens/
│
├── infra/
│   ├── docker/
│   └── deployment/
│
├── docs/
├── docker-compose.yml
└── README.md
```

## Django app boundaries

`media`
- upload lifecycle
- object storage
- metadata/proxies

`analyses`
- jobs
- stages
- transcript/scenes/findings
- reports/revisions

`ai_gateway`
- provider interfaces
- prompts
- schemas
- cost accounting

`usage`
- quotas
- metering

Do not create a single `core` app containing all business logic.

## Service layer

Views/ViewSets should remain thin.

```text
HTTP -> serializer -> application service -> domain/storage/queue
```

Example:
```python
create_analysis(user, media_id, config)
enqueue_analysis(analysis_id)
complete_stage(analysis_id, stage, result)
```

Workers call the same service layer where practical.
