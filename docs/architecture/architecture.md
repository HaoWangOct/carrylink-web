# CarryLink production architecture

2026-09-08 · Research Architect · **Proposed, not approved for implementation**.

## Scope and evidence

Synthesize the [existing benchmark](../research/open-source-benchmark.md) into a small web marketplace. The continuation brief specifies **China ↔ Germany**, superseding the earlier one-direction scope; neither direction establishes approved item or payment eligibility. Preserve the working Next.js 16.3.4 / React 19 / strict TypeScript / Tailwind 4 homepage. It has one route, local UI state and sample records, no backend. The [implementation report](../implementation-report.md) supplies historical browser/build evidence, not current backend validation.

Figma Make `UlMimbPJrGzAYss4ohiJyd`, node `0:1`, is the visual reference. Previously inspected Home, CreateTrip and OrderPage provide composition patterns. Do not restore its local page switcher or Vite. Future sender, auth, admin and dispute screens need design guidance. Current assets, theme, buttons, modal accessibility and translations should be reused.

## Architecture choices and boundaries

| Area | Proposal and why | Alternative / trigger to reconsider |
| --- | --- | --- |
| Frontend | Retain App Router, server-rendered public pages and focused client form/dialog boundaries. This preserves validated work and supports real URLs. | A SPA rewrite adds no MVP benefit. Narrow the current HomeExperience client boundary only when measured or needed by new data flows. |
| Backend | Modular monolith in the existing repository: thin Route Handlers → authorization/validation → application services → repositories. Separate worker process from the same codebase for durable jobs. | NestJS adds another deployment/API integration surface now. Extract services into Nest or another runtime when independent teams, scaling or additional clients justify it. |
| Database | Managed PostgreSQL, one application database with module ownership, foreign keys, constraints and transactions. Capacity and financial consistency need relational transactions. | Document DB complicates these invariants; do not import Ever Demand's mixed persistence stack. |
| ORM | Prefer Prisma for typed ordinary CRUD and schema review, subject to a version compatibility spike against installed TS/Next/Node. Keep transaction and conditional-write capability explicit; ORM is not the invariant. | Drizzle/SQL query builder is reasonable if the team prefers direct SQL. Do not choose a version or install it in this task. |
| Authentication | Managed OIDC authentication with verified email, secure server session cookies and provider-managed account recovery; choose a provider after regional delivery/reachability/privacy assessment. No custom password system. | Email OTP is a candidate onboarding method; verify Chinese mailbox delivery and abuse controls before selecting it. Social login must not be the only entry path. |
| Authorization | One User can be sender and traveler. Service-level participant/owner checks and scoped operator permissions on every read/mutation; deny by default. | Role-only checks are insufficient for order/message/document ownership. Separate organizations are unnecessary initially. |
| Storage | Private object storage for item/custody evidence, restricted identity documents; public sanitized avatar derivatives only. DB stores object keys and metadata. | DB blobs complicate backups; public uploads expose private evidence. Prefer provider-hosted identity collection over copying passports. |
| Messaging | Persist plain-text, order-bound messages; HTTP cursor polling while page visible, initially a tunable 5–10 seconds with backoff. No presence/typing promise. | WebSockets/SSE only after measured freshness/load needs; durable history remains authoritative. |
| Jobs | PostgreSQL outbox/job records plus worker leases/retries, avoiding Redis until necessary. Needed for notifications, hold expiry, webhooks, reconciliation, upload scanning and retention. | In-process timers/fire-and-forget cannot survive request termination. Adopt a managed queue when operational load warrants it. |
| Caching | Cache static content and public listings conservatively; invalidate on listing change. Never authorize, reserve capacity or release money from cache. Private views default no-store. | Shared cache infrastructure only after measuring repeated expensive reads. |
| API | Same-origin HTTP JSON routes, explicit commands and cursor pagination. Server-rendered pages call services directly, not their own HTTP endpoints. | GraphQL and multiple API styles increase surface area without an MVP requirement. |
| Validation | Runtime schemas at boundaries; normalized city/airport IDs, UTC instants plus IANA time zones, integer grams/cm³ and money minor units. Validate again in domain commands. | TypeScript/client input constraints cannot protect external requests. |
| Errors | Stable codes, field errors, correlation ID; 401 unauthenticated, 403 forbidden, 404 concealed/unavailable object, 409 stale version/capacity conflict, 422 input, 429 rate limit. | Never return raw DB/provider exceptions or silently report success after uncertain provider effects. |
| Observability | Structured redacted logs, request/job/provider correlation, error monitoring, metrics and alerts for stuck payments, outbox age, capacity conflict and webhook failures. | Full distributed tracing stack is unnecessary initially; provider timeout visibility is essential. |
| Admin | Protected `/admin` in same application using the same command services, MFA, scoped support/risk/finance permissions, reason and audit for actions. | A second dashboard application duplicates security and release work. |
| Payments | Provider adapter plus independent payment, refund, transfer/payout and accounting records. Hosted checkout/onboarding candidates; no funds held by application code. | No PSP selected; geography, business model and custody structure require provider/professional confirmation. |
| KYC | Verification attempts linked to User, provider reference/status/expiry, separate payout-account eligibility. | A verified email or profile badge is not identity verification or permission to carry an item. |
| Risk | Versioned deterministic policy evaluation with reason codes, evidence and human-review queue. Unknown category/policy holds the transaction. | No automated legal/customs verdict or LLM monetary/risk decision. |

These are CarryLink proposals informed by benchmark M2–M10 (modular commerce, account eligibility, commission snapshots) and E2–E9 (delivery actor/status separation and reactive services). Avoid importing vendor catalogs, multi-order carts, warehouse preparation, cash-on-delivery semantics, GPS fleet dispatch or source code.

## Proposed module and API layout

New paths below are implementation proposals; none exist yet. Keep UI primitives under `src/components/ui`, established theme in `src/app/globals.css` and copy under `src/content`.

| Module under `src/server/` | Owns | Proposed public surface |
| --- | --- | --- |
| identity | Account mapping, sessions, capabilities, verification references | `/api/session`, `/api/me`, auth callback |
| trips | Trips, flight segments, capacity/reservations | `/api/trips`, `/api/trips/{id}`, publish/cancel commands |
| requests | Sender drafts, item details, approved category references | `/api/requests`, publish/withdraw commands |
| matching | Candidate queries, proposals and consent | `/api/requests/{id}/matches`, `/api/matches/{id}/accept` |
| orders | Contract snapshots, guarded lifecycle, custody | `/api/orders/{id}`, `/commands/{command}` beneath order |
| messaging | Conversations, membership, ordered messages | `/api/orders/{id}/messages?after=cursor` |
| payments | Collection, refunds, accounts, transfers, reconciliation ledger | Order checkout command; `/api/webhooks/payments/{provider}` |
| trust | Reviews, verification, risk decisions | Own verification endpoint; moderated review endpoints |
| operations | Disputes, privileged commands, audit | `/api/admin/cases`, scoped command endpoints |
| infrastructure | DB, object store, outbox/jobs, logging, provider adapters | Internal only; authenticated scheduled trigger if hosting requires it |

Each module exposes commands/queries; no handler directly edits another module's tables. Shared transaction coordinator composes necessary writes atomically. Keep provider/ORM types out of client props. Validate authentication inside services even if middleware or page layout also checks it. Job/webhook actors have narrow service credentials, not an invented human session.

Mutation contract: caller-generated idempotency key for effectful commands, request hash and actor binding; expected aggregate version for edits. Same key/body returns original result; changed body returns conflict. Result contains resource/version/status; async effects return accepted/pending rather than fabricated completion. Bound page size, message size and upload size; rate-limit authentication, listing search, proposals and messaging independently. Never accept arbitrary user-supplied status assignment.

## Consistency, jobs and external effects

The [domain model](domain-model.md) specifies authority. Accepting a match locks/rechecks the Request and Trip capacity in one transaction, persists both consent and one Order, consumes an exclusive request commitment and creates a capacity hold. Unique/conditional constraints prevent concurrent acceptances. Retry serialization conflicts with a bounded policy. Never call a PSP inside a database lock.

Store domain mutation, audit event and outbox event together. Worker claims with lease/attempt/next-attempt metadata; crash recovery reclaims expired leases. Consumers deduplicate by event/effect key. Backoff with jitter, bounded retries, dead-letter/operator queue and observable replay are required. “Exactly once” is not assumed across providers.

Webhook entry verifies raw-body signature, stores unique provider event ID and minimal encrypted/restricted evidence, then acknowledges after durable receipt. Worker rechecks canonical provider state where events are stale/out of order. A reconciliation job repairs missed notifications. A timeout becomes UNKNOWN/PENDING_RECONCILIATION, never an automatic new charge or payout. Keep immutable accounting entries; corrections use compensating entries.

## Payment, identity and risk sequencing

Match acceptance → server-priced contract/temporary reservation → hosted collection → provider-confirmed capture → committed capacity → custody. Capture timing and reservation duration are **unapproved parameters**; long travel lead times may exceed authorization windows. Do not assume a card authorization can last until delivery.

Release eligibility requires completed delivery policy, no active dispute/refund/risk hold, sufficient reconciled available funds, approved payee account and unique settlement obligation. Transfer to a connected account and bank payout are separate provider operations; track both rather than label a successful transfer “bank paid.” Refunds may require transfer reversal/recovery and chargeback handling; liability and reserves need human agreement. No fixed fee, exchange rate, currency or escrow representation is selected here.

KYC runs at an approved gate (before listing, acceptance or payment as policy requires), and expiry/restriction can block new commitments and payout. After custody has begun, restrictions create an operational case; they do not erase the obligation or the item's whereabouts. Risk evaluates request publication, acceptance, payment and release using the relevant policy version; admin decisions record authority/reason/evidence and never rewrite a provider's status.

## Privacy and security

Keep precise addresses/contact details visible only to authorized participants at the approved stage; public listings expose coarse geography. Store only required contract snapshots with explicit retention classes. Require authorization for signed upload/download URLs, randomized keys, size/type checks, malware scanning/quarantine and removal of image metadata before publication. Do not serve identity documents from `public/` or store them in messages.

Use secure HttpOnly session cookies, CSRF/origin protection for cookie-authenticated mutations, session revocation, operator MFA and reauthentication for sensitive account changes. Validate provider callbacks separately from browser CSRF flows. Protect against object-reference attacks, injection, upload abuse, spam and account takeover. Logs omit tokens, full documents and payment details. Audit records have restricted append-only application access, minimal PII and an approved retention/deletion policy; “immutable” does not mean unlimited personal-data retention.

## Deployment and validation

Start with a managed Node host supporting Next.js plus worker, managed PostgreSQL and private storage in an approved region. Keep web/worker near DB; measure China and Germany page/auth/upload performance before pilot. Use separate staging/provider sandbox, secret management, least-privilege DB credentials, verified backups/restore, TLS, migration review and rollback/runbook. Founder approves availability targets, recovery targets, hosting budget and region. No deployment or migration is performed by this research task.

Retain existing lint/typecheck/build/browser checks; backend stages add real-DB concurrency tests, authorization matrix tests, webhook replay/reordering, failed effect recovery and end-to-end custody/refund scenarios. Historical frontend checks do not establish production readiness. See [roadmap](roadmap.md).

## Human decision gates

All pending. Record named approver/date/evidence in task record and relevant ADR before implementing dependent behavior.

| Gate | Human decision | Blocks |
| --- | --- | --- |
| H1 | Founder + legal/customs advisers: operating entity, directional corridor rules, eligibility, prohibited/restricted items and documentary responsibilities | Live listing and acceptance policy |
| H2 | Founder + PSP/financial/legal advisers: provider, supported payer/payee residency and bank countries, custody/transfer structure, fee/currency/rounding/refund/chargeback policy | Real collection and release |
| H3 | Founder + privacy/KYC advisers: identity provider, verification gate, consent, retention, data hosting/transfers and access | Real identity collection and personal-data launch |
| H4 | Founder + legal/insurance advisers: liability, insurance, truthful protection claims, custody proof, cancellation/no-show/dispute windows and resolution powers | Contract and automated lifecycle decisions |
| H5 | Founder: ranking preferences, pricing presentation, language and launch scope, operational staffing/SLA, architecture and hosting budget | Product acceptance and pilot launch |
| H6 | Founder + counsel: commercial licensing and exact-file reuse if later proposed | Any open-source code reuse; this design copies none |

No technical proposal here establishes legal compliance. Evidence gaps are preserved in the [task record](../research/research-task-record.md). [ADR-001](../decisions/ADR-001-production-architecture.md) records the architecture decision proposal.
