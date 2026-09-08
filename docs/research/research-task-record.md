# CarryLink research and architecture task record

2026-09-08 · Owner: Research Architect · Status: documentation synthesis complete; architecture/policy approval pending.

## Task goal and scope

Continue interrupted research using existing evidence, producing actionable architecture/domain/roadmap/ADR documents. Only `docs/research/`, `docs/architecture/` and `docs/decisions/` may change. This record resides here as explicitly requested, overriding the normal progress-directory convention. No application implementation, dependencies, migrations, new broad research, external publication or Figma mutation.

The latest brief specifies China ↔ Germany; the earlier benchmark records China → Germany as its historical scope. The scope update does not approve direction-specific eligibility or financial policy. Research proposals remain separate from approved requirements.

## Repositories and sources already used

- CarryLink: `D:/model/carrylink-web`, one App Router homepage, current source/config/manifest, implementation report and existing browser artifacts. Git metadata was unavailable during initial research but is available at final synthesis verification. The Research Architect did not initialize Git.
- Mercur: `main` commit `da34c523f27cb0c33bf3d5c08640a4894859897c`.
- Ever Demand: `develop` commit `c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3`.
- Full primary source links, access date (2026-09-08), examined paths and evidence limitations: [benchmark source register](open-source-benchmark.md#source-register). These sources were reused, not refetched during synthesis.
- Figma Make file `UlMimbPJrGzAYss4ohiJyd`, node `0:1`; prior App/CreateTrip/OrderPage reads and implementation report's homepage analysis. No new design read was needed for documentation synthesis.
- Earlier session also consulted official Next.js backend-for-frontend guidance and installed corresponding guide, Prisma transaction documentation, Supabase email-auth documentation and Stripe cross-border-payout documentation. These preliminary reads do not select a vendor/version or prove regional commercial feasibility; no new provider claim is made from them here.

## Findings already captured

The [benchmark](open-source-benchmark.md) captures Mercur modules, account/commission/payout boundaries and scheduled-job caveats; Ever Demand's carrier/warehouse milestones, mixed persistence/reactive architecture and unsafe-to-import payment/transition assumptions; root and mixed licensing concerns; actual homepage/sample-state limits and reusable components. No upstream code was copied.

The current app has local sample search/trips/match scores, unconditional verification presentation and prototype protection copy. Current controls support both country directions; initial fixtures depart Germany. Existing source/docs establish a reusable frontend, not a functioning transactional marketplace.

## Implementation summary and files changed

New documents in continuation:

- [architecture.md](../architecture/architecture.md): modular monolith, provider boundaries, authorization, jobs, security, operations and decision gates.
- [domain-model.md](../architecture/domain-model.md): entities/ownership/fields/invariants, custody and financial lifecycle, exceptions, deterministic matching.
- [roadmap.md](../architecture/roadmap.md): all 13 phases with tests/gates, P0–P3 and bounded first implementation handoff.
- [ADR-001](../decisions/ADR-001-production-architecture.md): proposed architecture, alternatives and consequences.
- This task record: provenance, unresolved evidence, verification and handoff.

Benchmark update: add continuation-scope/status note while retaining earlier findings and sources. Its previously missing relative document links now have targets.

## Evidence gaps and unresolved questions

- Neither upstream project was executed or audited comprehensively; missing-feature observations remain bounded to inspected paths. No claim of production readiness or complete permission/test coverage.
- No rendered Figma screenshot comparison; sender/auth/admin/dispute screens need additional design guidance before UI implementation.
- No provider selected or confirmed for actual entity, payer/payee residence, bank countries, commercial carrying activity or funds flow. No assumption that a common PSP's marketplace product supports all China/Germany participants.
- ORM/package versions, runtime compatibility, hosting worker limits and China auth/upload reachability need bounded implementation-stage verification.
- Handover/recipient proof, dispute windows, fees/rounding/currency, payment authorization duration and capacity fit policy remain unresolved. The domain supplies proposals and gates, not invented accepted rules.
- Privacy purpose, data location, retention/deletion, verification gate, staffing, liability/insurance and lawful item categories require human decisions. No legal/customs classifications were produced.

## Licensing and human review

Mercur root MIT and licensed Enterprise boundary; Ever Demand root AGPL with GPL/MIT subparts/commercial alternatives are documented in the benchmark. Exact package/file reuse, notice/source-disclosure/network obligations, dependency compatibility, trademarks and commercial agreement terms require counsel. This task is architecture inspiration without code reuse and makes no legal conclusion.

Use [H1–H6](../architecture/architecture.md#human-decision-gates) for Founder/adviser decisions. Approval evidence is **pending** for all; record approver, date, decision and supporting evidence before dependent implementation. Research completeness is not business approval.

## Tests and review

Documentation-only validation: ten Markdown documents in the allowed directories checked; zero broken relative file links. Required entity/phase/state coverage self-reviewed. All 46 pre-research baseline files were directly rehashed and unchanged, including application code, assets, manifest, lockfile and configuration. Git status shows only five new synthesis documents and the benchmark update. Git required a command-scoped safe-directory override for the read; no global Git configuration was changed. No application build/browser/backend tests rerun because no application behavior changed. Historical browser/build results remain explicitly attributed to the existing implementation report. No dependencies installed or migrations executed.

Self-review by Research Architect covers consistency, evidence attribution and write scope. Independent Reviewer/Historian review remains pending; no independent approval is claimed. Final verification results are reported in the completion response.

## Decisions and next steps

ADR-001 remains Proposed. The [first implementation task](../architecture/roadmap.md#recommended-first-implementation-task) is behavior-preserving geography/search-type extraction from sample data. It is ready to authorize independently of legal/payment decisions; meaningful marketplace features remain gated by the listed policies. Implementation Engineer should preserve existing UI and record fresh validation; Founder/advisers resolve operating and provider feasibility in parallel with authorized foundation work.
