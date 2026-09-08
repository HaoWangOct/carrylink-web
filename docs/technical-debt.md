# CarryLink technical debt

Established 2026-09-08 by Reviewer/Historian during review of `2fbce23`. These entries consolidate existing observations from the [benchmark](research/open-source-benchmark.md) and [implementation/review history](progress/2026-09-08.md); they are not new regressions or authorization to change behavior. The [roadmap](architecture/roadmap.md) and [human decision gates](architecture/architecture.md#human-decision-gates) govern resolution.

## TD-001 — Match Score percentages versus deterministic ranking

- Status: Open; existing prototype debt. Severity: Medium for presentation, must be resolved before live matching presentation.
- Evidence: `src/content/sample-trips.ts` contains fixed scores 94, 89, 86 and 78; its `sampleMatches` takes the first three trips and assigns Shanghai as destination. `src/components/home/matching-preview.tsx:104` uses scores as percentage bar widths and text. Search changes the summary, not the candidates or scores.
- Why it matters: illustrative percentages can imply measured compatibility or likelihood. The [proposed MVP matching model](architecture/domain-model.md#mvp-matching) instead requires eligibility hard filters followed by deterministic ordering and versioned reasons. A repeatable percentage calculation alone would not prove probability calibration.
- Owner/gates: Founder approves H5 presentation and ranking semantics; Implementation Engineer implements only a separately authorized scope. Live matching additionally requires the roadmap's eligibility, data and quote-policy dependencies. ADR-001 and the proposed ordering remain unapproved.
- Recommended action: include score meaning in the truthful-preview copy review. Preserve existing UI during this extraction review. Later implement approved reason-based candidate presentation and ranking; do not invent replacement percentages or treat fixtures as algorithm evidence.
- Closure evidence: named wording/ranking approval, relevant Figma reference, approved eligibility filters and stable tie-break tests for live matching, accurate reasons, clear sample/live distinction, en/zh/de and responsive regression results. Any interim copy-only mitigation must leave the unimplemented live-matching portion open.

## TD-002 — Unconditional verification and protection claims

- Status: Open; existing prototype debt. Severity: Medium in this preview review; blocks truthful live presentation until resolved.
- Evidence: `src/components/home/trip-card.tsx` renders a verification label unconditionally; `src/content/translations.json` contains identity-verification and escrow/protection claims. The [benchmark's CarryLink inspection](research/open-source-benchmark.md#3-carrylink-specific-inspection) already documents the gap between these claims and the absent backend/providers.
- Why it matters: a sample badge or prototype sentence is not evidence of verification, held funds or protection. Retaining behavior for a structural refactor does not accept those claims as production truth.
- Owner/gates: Founder and responsible advisers approve H4/H5 wording; H2/H3 decisions are required for dependent payment/identity capabilities. Implementation Engineer owns later authorized copy/UI work.
- Recommended action: next phase-1 task inventories claims and prepares truthful preview wording in en/zh/de for approval. Keep this review documentation-only.
- Closure evidence: named approver/date/evidence, accurate translated copy and sample/live distinctions, applicable Figma guidance, and homepage regressions. Any future verification/payment claim must be supported by implemented authoritative state and required approvals.

## Other retained limitations

Shared `SearchValues` is an unvalidated presentation contract: country/city relationships, date/time semantics and physical-unit normalization remain future domain-boundary work. Browser evidence currently covers Chrome; supplemental extraction checks and screenshot baselines are ignored local artifacts. These limitations are documented in the [review history](progress/2026-09-08.md) and roadmap; they do not justify expanding this extraction into production modeling or a new test framework.
