# ADR-001: CarryLink modular production architecture

- Status: **Proposed**
- Date: 2026-09-08
- Author: Research Architect
- Decision authority: Founder; responsible legal/privacy/financial advisers for regulated policy
- Approval evidence: Pending
- Related task, research, and architecture: [task record](../research/research-task-record.md), [benchmark](../research/open-source-benchmark.md), [architecture](../architecture/architecture.md), [domain](../architecture/domain-model.md), [roadmap](../architecture/roadmap.md)
- Supersedes / superseded by: None

## Context and constraints

CarryLink has a working Next.js homepage with reusable TypeScript/Tailwind/Figma-derived UI and historical browser validation, but no backend or transaction system. The continuation brief specifies China ↔ Germany, web only and small scale. Users offer spare luggage capacity rather than merchant stock. Research may write only documentation; no production code, dependencies or migrations are authorized here.

## Options considered

| Option | Assessment |
| --- | --- |
| Next.js API/application modules + PostgreSQL + worker | Recommended: reuse frontend/release model, keep consistency local and separate durable effects from HTTP lifetime. Requires disciplined service boundaries. |
| Separate NestJS backend | Strong explicit backend organization but adds deployment, authentication and contract integration burden before demonstrated need. Suitable later if independent scaling/teams/clients emerge. |
| Adopt Mercur/Medusa | Useful marketplace infrastructure, but catalog/cart/vendor model does not fit individual itinerary capacity and two-party custody. Conversion and maintenance outweigh early benefit. |
| Adopt Ever Demand | Delivery actors and reactive interfaces are relevant, but fleet/warehouse assumptions, broad stack and license review cost are unsuitable for this MVP. |
| Direct browser-to-BaaS CRUD | Fast simple forms, but distributes authorization and makes atomic booking/provider effects harder to reason about. Managed auth/storage are candidates behind service boundaries. |

## Proposed decision

Keep Next.js; add a modular TypeScript application layer behind explicit HTTP commands, PostgreSQL repositories, provisionally Prisma, managed authentication, private object storage and a durable outbox/worker. Use HTTP polling for order messages and deterministic hard-filter matching. Store physical progress independently from payment/refund/payout and case status. Use transactional capacity reservations and immutable agreement snapshots. Provider callbacks and reconciled server commands are authoritative for money and identity.

Prisma is a recommendation, not an installed dependency or selected version; evaluate exact compatibility and required conditional writes first. Payment/KYC/auth/storage vendors remain unselected pending regional and privacy feasibility. No assumption of legal escrow or cross-border payout coverage.

## Lessons and CarryLink-specific choices

**Mercur:** learn module/provider boundaries, seller/account eligibility, commission snapshots and idempotent payout effects; its documented capture/daily payout jobs need project wiring. Do not inherit fee precedence, timing or vendor organizations as CarryLink policy.

**Ever Demand:** learn separate custody milestones, carrier/customer concerns and durable communication needs. Do not copy the inspected path where delivery completion sets payment state or transition guards remain TODOs; do not import warehouse stock or driver proximity matching.

**CarryLink:** a User may send and travel; Trip differs from Flight and Capacity; Request differs from accepted Match/Order; origin Handover differs from destination Delivery. Reserve capacity atomically, preserve item whereabouts during complaints and use human-reviewed directional eligibility. Keep the existing homepage and design assets, introduce real routes incrementally.

## Consequences

Benefits: smaller operational surface, typed ownership, relational consistency, preserved frontend investment and explainable behavior. Costs: build a focused order/custody domain and operator tools; worker/reconciliation are real operational responsibilities even at low volume. Prisma and managed providers introduce coupling mitigated by repository/adapter boundaries. One deployment can become a bottleneck later; extract measured hotspots rather than prematurely distribute transactions.

No reuse of upstream source is proposed. Architecture inspiration does not resolve future commercial/AGPL/GPL/MIT reuse questions; exact-file legal review remains necessary if scope changes.

## Human approval requirements

All [H1–H6](../architecture/architecture.md#human-decision-gates) remain pending. Founder accepts architecture/budget; advisers review operating/customs policy, restricted goods, liability/insurance, money custody and payouts, KYC/provider selection, retention/privacy and any commercial reuse. Order transition evidence, timings and matching preferences are proposals requiring approval before dependent implementation. This ADR is not authorization to deploy or start features.

## Validation and follow-up

Implement only an authorized increment from the roadmap. Verify ORM/runtime compatibility in an isolated environment; prove double-booking prevention, failed payment reconciliation, role isolation and two-party custody transitions. Validate auth/payment/storage reachability and provider commercial support for both markets before launch. Review this ADR after pilot evidence or a material scope change; record acceptance with named authority/date/evidence. One ADR captures the coherent MVP architecture; detailed funds/legal structure warrants a future ADR after feasibility decisions rather than speculative vendor ADRs now.
