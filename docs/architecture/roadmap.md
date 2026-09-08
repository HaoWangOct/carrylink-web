# CarryLink implementation roadmap

2026-09-08 · **Proposed** · Owner for future code: Implementation Engineer; review: Reviewer/Historian. This document authorizes no feature implementation, installation, deployment or migration.

Read [architecture](architecture.md), [domain/state/matching specification](domain-model.md), [benchmark](../research/open-source-benchmark.md) and [ADR-001](../decisions/ADR-001-production-architecture.md). Current baseline is one homepage; there are no product/API routes, auth, database or `tests/` directory. Existing browser validation is `scripts/check-browser.mjs`. New paths below are proposed, not existing files.

## Priority and sequencing

**P0 before first real transaction:** complete the minimum slices of all 13 phases, including staffed dispute handling, identity/risk policy, payment reconciliation, security checks and deployment recovery. Phase numbers organize delivery; they do not defer safeguards until after live payments. Investigate H1–H4 operating/provider feasibility before committing to backend integration, and develop phases 9–11 in sandbox only until approved. Every phase must leave the existing homepage regressions passing.

**P1 immediately after early validation:** public transaction-backed reviews and moderation, better operator filters/exports, improved notifications, locale persistence and measured query/performance improvements. Manual P0 operations must already be accountable and staffed.

**P2 after product-market validation:** additional city/airport coverage, weighted ranking experiments, richer messaging, provider automation and service extraction only when measured needs justify them.

**P3 future scale:** multi-leg/multi-carrier fulfillment, organization accounts, native apps, ML ranking, live fleet tracking and multi-region services. These are outside the current web-only MVP. No carts/catalog, multi-vendor split checkout, generalized workflow engine, microservices or Redis cluster for first launch.

Each phase is a reviewable increment with objective, dependencies, expected changes, data/API impact, tests, risks, acceptance and Founder gate. H numbers refer to [human decision gates](architecture.md#human-decision-gates). Founder acceptance records include name/date/evidence; professional decisions cannot be replaced by a technical sign-off.

## 1. Frontend production foundation — P0

- **Objective/why:** retain reusable Figma-derived homepage while establishing honest, stable presentation contracts; avoid rebuilding validated layout.
- **Dependencies:** current benchmark; distinguish geography/types from sample data first. Claims changes require approved wording.
- **Modules/changes:** `src/content/sample-trips.ts`, proposed `src/content/geography.ts`, imports in home controls/cards/dialog/language components; later `translations.json`, `ui-copy.ts`, `trip-card.tsx` for truthful preview/verification/payment wording. Preserve `globals.css`, logo and UI primitives.
- **DB/API:** none in the first increment; later introduce explicit sample/live view adapters, not fake API persistence.
- **Tests:** existing lint/typecheck/build/browser; en/zh/de stable selection, default route consistency, preview labels and keyboard behavior. Do not reinterpret current 32 kg/200 L controls as policy.
- **Risks:** fixture type mistaken for backend schema; protection claims untrue; request to change direction confused with approved eligibility.
- **Acceptance:** fixture-neutral shared geography/types, no layout/navigation regression, all unimplemented actions remain clearly previews; before live presentation, approved claims replace unconditional verification/escrow language.
- **Founder:** first structural extraction needs no business-rule decision, only normal task authorization. H4/H5 approve later copy/scope changes; preserve both country directions as the current UI allows.

## 2. Database — P0

- **Objective/why:** create transaction boundaries for inventory/agreements before persistence-backed features.
- **Dependencies:** ADR-001 acceptance, reviewed domain model, environment strategy and ORM compatibility spike.
- **Modules/changes:** proposed `src/server/infrastructure/db`, repository interfaces and `prisma/` schema/migration proposals; future dependency/config updates are Implementation Engineer work only.
- **DB/API:** implement approved core entities incrementally; unique identity mapping, request commitment, match/order linkage, provider effect keys and capacity constraints. No generic table CRUD API.
- **Tests:** isolated development DB constraints, serialization conflict recovery, fixture isolation and restore rehearsal; migrations reviewed, production execution reserved for human-authorized process.
- **Risks:** ORM/version incompatibility, accidental prototype seeding, schema implies unapproved policy.
- **Acceptance:** reviewed relational model and successful isolated DB transaction tests; demo data cannot appear in production; migration/recovery instructions concrete.
- **Founder:** H3 region/retention and H5 hosting/architecture; approve schema policy assumptions. No production DB mutation by research agents.

## 3. Authentication — P0

- **Objective/why:** establish one verifiable account for both marketplace roles.
- **Dependencies:** identity table; approved provider evaluation and privacy plan.
- **Modules/changes:** proposed auth callback/login route, `src/server/identity`, account UI; replace Navigation's account preview only when flow works.
- **DB/API:** issuer/subject mapping, sessions/revocation and capability references; `/api/session`, `/api/me`, provider callback. Do not let profile update assign verification/admin status.
- **Tests:** login/logout/recovery, expiry/revocation, tampered callback, CSRF, session isolation, email delivery/reachability from both markets.
- **Risks:** China connectivity, account takeover, confusing email verification with KYC.
- **Acceptance:** protected endpoints reject unauthenticated users and cross-user access; account recovery and operator MFA demonstrated.
- **Founder:** H3 provider/privacy; H5 onboarding/language requirements. Authentication does not approve transactional eligibility.

## 4. Traveler Trip flow — P0

- **Objective/why:** turn spare capacity into owned, publishable inventory.
- **Dependencies:** phases 2–3, H1 listing policy; minimum trust gate from phase 10 before real publication.
- **Modules/changes:** proposed `/trips/new`, `/trips/[id]`, `src/server/trips`, form components; Figma CreateTrip is layout reference, existing route-search controls/IDs are reusable.
- **DB/API:** Trip, Flight segments, Capacity and versions; trip draft/edit/publish/pause/cancel commands with owner checks.
- **Tests:** route direction, date/time-zone boundaries, units/dimensions, owner isolation, edit against existing commitment and cancellation with custody.
- **Risks:** copying Figma category list as eligibility, confusing flight baggage allowance with available capacity.
- **Acceptance:** drafts persist, only eligible current trips publish, incompatible edits fail; no fabricated airline verification.
- **Founder:** H1 categories/routes/eligibility; H4 itinerary change/cancellation; H5 pricing presentation.

## 5. Sender Request flow — P0

- **Objective/why:** collect a transport need with sufficient facts for matching and review.
- **Dependencies:** phases 2–3, private storage/scanning and H1/H3 policies; request screen design guidance (not present in current homepage).
- **Modules/changes:** proposed `/requests/new`, `/requests/[id]`, `src/server/requests`, reusable route fields, approved translations and upload adapter.
- **DB/API:** Request, item measurements/value/photo metadata/recipient reference; owned draft/edit/publish/withdraw commands and scoped upload URLs.
- **Tests:** missing/invalid measurements, unsupported categories, expiry, file spoofing/oversize/quarantine and cross-account downloads.
- **Risks:** unreviewed item claims, private addresses/photos exposed, units incorrectly normalized.
- **Acceptance:** complete validated requests persist; unknown eligibility blocks publication/booking as policy specifies; files remain private and scanned.
- **Founder:** H1 item/document policy, H3 recipient/photo retention and privacy, H4 declaration wording.

## 6. Matching — P0

- **Objective/why:** replace illustrative rows with explainable eligible candidates.
- **Dependencies:** published Trip/Request, approved domain hard filters and H5 ranking order; payment quote policy before financial comparison.
- **Modules/changes:** `matching-preview.tsx` remains demo until approved live view exists; proposed matches page and `src/server/matching`; reuse cards with explicit view models.
- **DB/API:** indexed candidate query, versioned Match proposals/consent; request matches and proposal accept/reject endpoints.
- **Tests:** deterministic ties, no candidates, opposite direction, deadline/time zones, insufficient capacity/dimension fit, stale proposals and missing reputation.
- **Risks:** false percentages, stale availability, discriminatory/unexplained ranking.
- **Acceptance:** reason breakdown matches domain rules, no forbidden candidate becomes bookable, no claim of guaranteed match probability.
- **Founder:** H1 eligibility and H5 ranking preference; H2 quote currency/fee comparison.

## 7. Order state machine — P0

- **Objective/why:** make consent, custody and inventory transitions atomic and auditable.
- **Dependencies:** phase 6, approved transition/evidence table H4; payment provider mocked in sandbox until phase 9.
- **Modules/changes:** proposed `/orders/[id]`, `src/server/orders`, custody components using Figma OrderPage timeline composition.
- **DB/API:** Order snapshot, Reservation, OrderEvent, Handover/Delivery attempts, AuditLog and outbox; explicit order commands.
- **Tests:** every allowed edge/denied actor, duplicate consent, two concurrent accepts, hold expiry/capture race, recipient refusal/loss/late payment, no post-custody reset.
- **Risks:** overselling, premature delivery/capture claims, monetary status hiding location.
- **Acceptance:** one request has one active commitment; inventory never negative; custody/financial/case histories independent; stale commands return conflict.
- **Founder:** H4 commitment point, proof, cancellation, no-show, completion/dispute windows and exception outcomes; H2 hold/capture timing.

## 8. Messaging — P0 minimum; P1 enhancements

- **Objective/why:** give actual order participants a durable coordination channel.
- **Dependencies:** authenticated orders, membership and retention policy.
- **Modules/changes:** proposed order message panel, `src/server/messaging`; Figma OrderPage messages is visual reference, not functioning chat.
- **DB/API:** Conversation/Membership/Message; cursor GET and idempotent POST; visible-tab polling and reconnect deduplication.
- **Tests:** unauthorized reads/writes, retry duplicates, cursor ordering, malicious text, rate limits and offline reconnect.
- **Risks:** privacy leakage, spam, polling load and misleading presence indicators.
- **Acceptance:** authorized messages persist across reload/devices, retries do not duplicate, no HTML injection; no unsupported online/read status.
- **Founder:** H3 retention/moderation access, H5 support/escalation process. Defer attachments/presence/WebSockets.

## 9. Payment — P0, live use blocked on H2

- **Objective/why:** reconcile sender collection and traveler remuneration without coupling them to delivery UI.
- **Dependencies:** provider/business/payee-country confirmation first, approved financial model, phase 7 and operational holds from phase 11.
- **Modules/changes:** `src/server/payments`, checkout adapter/webhook routes, worker, accounting/reconciliation UI; replace payment preview only after verified integration.
- **DB/API:** Payment attempts, Refund, Payout/PayoutAccount, transfer/bank attempt references, LedgerEntry/ProviderEvent; checkout/refund/release commands and signed webhook inbox.
- **Tests:** duplicate/out-of-order webhook, signature failure, unknown timeout, partial refund, late capture after expiry, blocked payee, chargeback and reversal after transfer, duplicate release.
- **Risks:** unsupported payout geography, short authorization windows, duplicate money movement, chargeback liability and misleading escrow language.
- **Acceptance:** sandbox flow reconciles provider/ledger totals; no browser-set PAID; interrupted operations recover without duplicate effect; live activation has documented approvals.
- **Founder:** H2 entire money model/provider/fees/currency/refunds, H4 protection wording. A technically successful sandbox is not commercial approval.

## 10. KYC / Risk — P0 minimum

- **Objective/why:** enforce reviewed eligibility gates before real commitments, not after first payments.
- **Dependencies:** H1/H3 provider/policy decisions; modules introduced alongside phases 3–7, even though numbered here.
- **Modules/changes:** `src/server/trust`, provider-hosted onboarding link/status, risk reason display; change unconditional `trip-card.tsx` verification badge to authorized derived status.
- **DB/API:** IdentityVerification attempts, versioned RiskFlag/evaluation, provider events; own onboarding/status and scoped operator review commands.
- **Tests:** expired/revoked KYC, missing policy, spoofed client result, changed request after review and restrictions during custody.
- **Risks:** overcollection, mistaking KYC for customs permission, blocking an ongoing parcel without operational handling.
- **Acceptance:** no bypass by client, unknown result queues review, sensitive documents restricted, existing obligations remain traceable.
- **Founder:** H1 classification/eligibility; H3 provider, verification gates and privacy; H4 operational remedies.

## 11. Admin / Disputes — P0 minimum; P1 workflow improvements

- **Objective/why:** provide a staffed, auditable remedy for inevitable exceptions before live trading.
- **Dependencies:** identity/MFA, order/payment/trust command boundaries, H4 resolution authority.
- **Modules/changes:** proposed `/admin`, `src/server/operations`, case list/detail/action panels; additional Figma guidance required.
- **DB/API:** Dispute, AdminGrant, evidence and audit; scoped case investigation/resolve/refund-request/release-hold commands, never unrestricted status PATCH.
- **Tests:** support cannot release funds; finance cannot falsify KYC; participant isolation, auditable override, post-payout complaint and case reopening.
- **Risks:** privileged abuse, unsupported manual decisions, no operator available across time zones.
- **Acceptance:** operator can investigate custody/refund failures using evidence and reasons; all sensitive actions attributable and permissions tested; response staffing agreed.
- **Founder:** H4 dispute windows/resolution powers/liability/insurance; H3 evidence access/retention; H5 staffing/SLA.

## 12. Security / QA — P0 throughout

- **Objective/why:** verify real transaction invariants; UI-only success is insufficient.
- **Dependencies:** each phase supplies its tests; independent review before pilot.
- **Modules/changes:** retain `scripts/check-browser.mjs`; proposed `tests/domain`, `tests/integration`, `tests/e2e`, CI config and security headers/config as subsequently authorized.
- **DB/API:** isolated test DB and provider sandbox only; ensure production credentials/data cannot be used by suites.
- **Tests:** existing lint/typecheck/build/browser, accessibility and multilingual flows; auth matrix, CSRF, upload abuse, capacity concurrency, recovery/reconciliation, load and backup restore. Broaden browser coverage beyond historical Chromium as launch support requires.
- **Risks:** keeping old global no-mutation assertion against new transactional routes; reporting old test results as fresh; leaking PII in fixtures/logs.
- **Acceptance:** production path E2E and failure cases pass; no unresolved release-blocking security findings; reviewer records findings and limits.
- **Founder:** H5 supported browsers/availability and launch risk acceptance; unresolved P0 financial/security failures block launch.

## 13. Deployment — P0

- **Objective/why:** run a limited pilot with recovery and human ownership.
- **Dependencies:** all P0 slices and H1–H5 gates, reviewed runbook, staging validation and reviewed code version control. Git metadata was unavailable during initial research but is available at final synthesis verification; deployment branch/release ownership still needs confirmation.
- **Modules/changes:** future deployment/worker configuration, environment schema, health checks, monitoring and runbooks; no infrastructure mutation in this task.
- **DB/API:** human-controlled migrations, least-privilege runtime roles, backups/restore; health endpoints expose no internals; webhook ingress and job scheduling validated.
- **Tests:** deploy/rollback rehearsal, worker restart, DB outage recovery, missed webhook replay, regional auth/upload/page checks and operational alert delivery.
- **Risks:** unsupported worker lifetime, migration drift, poor China reachability, untested recovery.
- **Acceptance:** staging sign-off, measurable launch/recovery targets, named on-call/operator, reconciled pilot transaction and rollback plan; Founder explicitly authorizes live launch.
- **Founder:** H3 hosting/data jurisdiction; H5 budget/targets/pilot cohort and launch; human approval of production migrations and infrastructure actions.

## Recommended First Implementation Task

**Extract shared geography and search types from the homepage sample-data module, preserving observable behavior.** This is the smallest meaningful foundation: future Trip/Request modules must not depend on fictional people and match scores to obtain city identifiers.

Reference [architecture frontend boundary](architecture.md#architecture-choices-and-boundaries) and [domain geography/units](domain-model.md#entity-definitions). Figma reference: Make file `UlMimbPJrGzAYss4ohiJyd`, node `0:1`, **Home route-search and matching summary**. This is structural work; retain existing design/copy and both country directions. A subsequent UI change must read its relevant Figma source.

Likely files: existing `src/content/sample-trips.ts`; new `src/content/geography.ts` (City/Country IDs, labels, countryCities, language type if appropriate), new `src/content/search-types.ts` if needed; imports in `home-experience.tsx`, `route-search.tsx`, `matching-preview.tsx`, `trip-card.tsx`, `preview-dialog.tsx`, `language-provider.tsx` and any other compiler-identified consumers. Keep illustrative Trip type/records/scores and initial demo values clearly in sample-trips. Do not turn the demo Trip interface into a production entity.

Acceptance: shared geography/search types import no sample people/trips; stable city IDs and dependent selects remain unchanged in en/zh/de; initial summary/date/route, cards, sample labels, dialogs and navigation behave identically; no API, persistence or dependencies added; existing lint/typecheck/build/browser checks pass with recorded fresh evidence. Tests need no new framework or mirrored unit tests for simple extraction.

Implementation Engineer reads role guidance, obtains normal task authorization, records scope and tests in its permitted progress record, and submits for review. No H1–H4 policy decision is needed for this behavior-preserving extraction. Do not bundle copy promises, eligibility limits, provider selection or sender form implementation into it. The earlier implementation report's sender-form recommendation is deferred until its required item/design policy is available; this proposal does not edit that historical report.
