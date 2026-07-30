# Subscriptions and Notifications Plan

## Goal

Allow users to subscribe to products, clubs, and leagues, and receive notifications when discounts match their criteria.

## Scope

- MVP includes subscription management and email notifications.
- Admin and normal users can both create subscriptions.
- Scraping and data mutation permissions remain admin-only.

## Data Model

### User

- Existing auth users are credentials-based via env vars.
- Future expansion can move users into Prisma for dynamic account management.

### Subscription

- id
- userId
- targetType (`product` | `club` | `league`)
- targetId (integer FK by target type)
- minDiscountPercent (nullable)
- channel (`email` initially)
- active (boolean)
- createdAt
- updatedAt

Constraints:

- Unique active subscription key: `(userId, targetType, targetId, channel, active)`

### NotificationEvent

- id
- subscriptionId
- productId
- detectedAt
- discountPercent
- currentPrice
- previousPrice
- dedupeKey (unique)

### NotificationDelivery

- id
- eventId
- channel
- status (`pending` | `sent` | `failed`)
- attempts
- lastError
- sentAt
- createdAt
- updatedAt

## Event Detection

Use the existing discounted products flow as the detection source.

Recommended integration points:

- During scrape processing when products are upserted and price changes are known.
- Optional fallback cron that computes new discount states for missed events.

Detection pipeline:

1. Identify products with valid discount in current snapshot.
2. Resolve matching subscriptions by product, then by club, then by league.
3. Apply filters like `minDiscountPercent`.
4. Generate idempotent `NotificationEvent` entries using `dedupeKey`.
5. Enqueue `NotificationDelivery` with `pending` status.

## Notification Worker

Background worker responsibilities:

- Pull pending deliveries in batches.
- Send emails.
- Mark success/failure.
- Retry failed jobs with capped exponential backoff.

MVP behavior:

- Max retries: 5.
- Dead-letter strategy: keep `failed` rows with final error.

## API Design (MVP)

- `GET /api/subscriptions` -> list current user subscriptions.
- `POST /api/subscriptions` -> create subscription.
- `DELETE /api/subscriptions/:id` -> deactivate subscription.
- `PATCH /api/subscriptions/:id` -> update criteria/channel/active.

Authorization:

- Any authenticated user can manage only their own subscriptions.
- Admin-only endpoints are not required for MVP.

## UI Plan

- Add "My Subscriptions" page.
- Add subscribe actions from:
  - product history/detail pages
  - clubs page
  - leagues page
- Show active state and last notification timestamp.

## Idempotency and Dedupe

- `dedupeKey` should include: subscriptionId + productId + normalized discount bucket + effective date window.
- Prevent duplicate sends by unique key at `NotificationEvent` level.

## Rollout Steps

1. Add Prisma models and migrations.
2. Build subscription CRUD API and page.
3. Build detection + event creation logic.
4. Add email delivery worker.
5. Add observability dashboards and retry tooling.

## Open Questions

- Should users receive immediate alerts or digest summaries?
- Do we need timezone-aware notification windows?
- Should web push/webhook be part of phase 2 or phase 3?
