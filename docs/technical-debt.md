# CarryLink technical debt

Established 2026-09-08 by Reviewer/Historian during review of `2fbce23`. These entries consolidate existing observations from the [benchmark](research/open-source-benchmark.md) and [implementation/review history](progress/2026-09-08.md); they are not new regressions or authorization to change behavior. The [roadmap](architecture/roadmap.md) and [human decision gates](architecture/architecture.md#human-decision-gates) govern resolution.

## TD-001 — Match Score percentages versus deterministic ranking

- Status: Demo percentage presentation mitigated in the 2026-09-10 working tree; live matching policy/evidence remains open. See the independent audit below.
- Historical evidence (2026-09-08 baseline, no longer current): `src/content/sample-trips.ts` contains fixed scores 94, 89, 86 and 78; its `sampleMatches` takes the first three trips and assigns Shanghai as destination. `src/components/home/matching-preview.tsx:104` uses scores as percentage bar widths and text. Search changes the summary, not the candidates or scores.
- Why it matters: illustrative percentages can imply measured compatibility or likelihood. The [proposed MVP matching model](architecture/domain-model.md#mvp-matching) instead requires eligibility hard filters followed by deterministic ordering and versioned reasons. A repeatable percentage calculation alone would not prove probability calibration.
- Owner/gates: Founder approves H5 presentation and ranking semantics; Implementation Engineer implements only a separately authorized scope. Live matching additionally requires the roadmap's eligibility, data and quote-policy dependencies. ADR-001 and the proposed ordering remain unapproved.
- Recommended action: include score meaning in the truthful-preview copy review. Preserve existing UI during this extraction review. Later implement approved reason-based candidate presentation and ranking; do not invent replacement percentages or treat fixtures as algorithm evidence.
- Closure evidence: named wording/ranking approval, relevant Figma reference, approved eligibility filters and stable tie-break tests for live matching, accurate reasons, clear sample/live distinction, en/zh/de and responsive regression results. Any interim copy-only mitigation must leave the unimplemented live-matching portion open.

## TD-002 — Unconditional verification and protection claims

- Status: Reachable demo claims mitigated in the 2026-09-10 working tree; live provider/policy/evidence requirements remain open. See the independent audit below.
- Historical evidence (2026-09-08 baseline, no longer current): `src/components/home/trip-card.tsx` renders a verification label unconditionally; `src/content/translations.json` contains identity-verification and escrow/protection claims. The [benchmark's CarryLink inspection](research/open-source-benchmark.md#3-carrylink-specific-inspection) already documents the gap between these claims and the absent backend/providers.
- Why it matters: a sample badge or prototype sentence is not evidence of verification, held funds or protection. Retaining behavior for a structural refactor does not accept those claims as production truth.
- Owner/gates: Founder and responsible advisers approve H4/H5 wording; H2/H3 decisions are required for dependent payment/identity capabilities. Implementation Engineer owns later authorized copy/UI work.
- Recommended action: next phase-1 task inventories claims and prepares truthful preview wording in en/zh/de for approval. Keep this review documentation-only.
- Closure evidence: named approver/date/evidence, accurate translated copy and sample/live distinctions, applicable Figma guidance, and homepage regressions. Any future verification/payment claim must be supported by implemented authoritative state and required approvals.

## Other retained limitations

Shared `SearchValues` is an unvalidated presentation contract: country/city relationships, date/time semantics and physical-unit normalization remain future domain-boundary work. Browser evidence currently covers Chrome; supplemental extraction checks and screenshot baselines are ignored local artifacts. These limitations are documented in the [review history](progress/2026-09-08.md) and roadmap; they do not justify expanding this extraction into production modeling or a new test framework.


## 2026-09-10 independent audit update

Reviewed `feature/frontend-interactions`, HEAD `51b1989` plus existing implementation working-tree changes. Result: **CHANGES REQUIRED**. Full reproductions, test evidence, policy gates and review limits are in [the independent review](progress/2026-09-10.md#independent-reviewer--historian-audit--2026-09-10). These entries authorize no code or business-rule changes.

**TD-001 current evidence:** fixed score data/bars are removed. Reachable matching uses deterministic exact route, date and capacity comparisons without probability percentages. Reasons are generic; “Best match” tracks the chosen sort, and traveler-side sort options compare one identical trip across requests. Remaining work: explicit predicate/value explanations and sort-relative labeling; approved live eligibility/ranking with stable tests remains gated on H1/H5. Earlier preserve-UI recommendations above are historical extraction guidance.

**TD-002 current evidence:** reachable EN/ZH/DE copy now says fictional/demo profiles, no verification/payment/protection and unquoted pricing. Legacy prices remain in fixture fields, the unused trip-dialog branch (`src/components/preview-dialog.tsx:121`) and dormant translation content. No current caller opens that branch. Remove or quarantine obsolete copy before reuse; actual provider-backed claims remain gated on H2–H5. This technical review does not supply named business approval.

## TD-003 — Search handoff loses user measurements

- Status: Implemented and regression-verified; awaiting second Reviewer/Historian re-review (not closed); Medium; required frontend correction (R1). See [correction evidence](progress/2026-09-10.md#focused-r1r5-correction-pass--implementation-and-resumed-verification).
- Evidence: `src/components/home/home-experience.tsx:53` forwards trip ID without search inputs. Enter 7 kg/12 L and use a homepage match's Create Request: details become 2 kg/5 L.
- Owner: Implementation Engineer. Preserve inputs across both homepage and results-page request entry paths; do not conflate departure and deadline dates.
- Closure: browser regression demonstrates retained non-default measurements and coherent review summary.

## TD-004 — Order grid overflows with accepted long text

- Status: Implemented and regression-verified; awaiting second Reviewer/Historian re-review (not closed); High; required frontend correction (R2). See [correction evidence](progress/2026-09-10.md#focused-r1r5-correction-pass--implementation-and-resumed-verification).
- Evidence: `src/components/flows/order.tsx:28`, `summary.tsx:13`. A permitted 300-character unbroken item/area expands the order-review document to 3348 px at a 390 px viewport; also fails tablet, desktop and 320 px.
- Owner: Implementation Engineer. Correct grid intrinsic sizing and content wrapping.
- Closure: allowed long content remains readable with reachable confirmation controls and no horizontal overflow at 320/390/768/1440 px; ordinary layouts remain intact.

## TD-005 — Whole homepage depends on client rendering

- Status: Implemented and regression-verified; awaiting second Reviewer/Historian re-review (not closed); Medium; required frontend correction (R3). See [correction evidence](progress/2026-09-10.md#focused-r1r5-correction-pass--implementation-and-resumed-verification).
- Evidence: `src/app/page.tsx:6` wraps the entire homepage in Suspense; `home-experience.tsx:69` reads search parameters. A JavaScript-disabled production browser receives only Loading… and zero H1s.
- Owner: Implementation Engineer. Restore server-rendered public content while retaining URL-aware interactions. See installed Next useSearchParams static-rendering documentation.
- Closure: production initial HTML contains meaningful public navigation/content and headings; hydrated URL searches and language switching still work. No framework migration needed.

## TD-006 — Request recovery and existing-order presentation

- Status: Implemented and regression-verified; awaiting second Reviewer/Historian re-review (not closed); Medium; required frontend corrections (R4/R5). See [correction evidence](progress/2026-09-10.md#focused-r1r5-correction-pass--implementation-and-resumed-verification).
- Evidence: `listing-form.tsx` only edits trips and deletes submitted request drafts; `matches.tsx:21` offers no request revision link; `dashboard.tsx:30` always links requests to matching. Empty results ask users to change inputs without a revision path. Requests with saved demo orders receive the same misleading empty state.
- Owner: Implementation Engineer. Provide retained-value request correction and explicit saved-order linkage. Keep live withdrawal/cancellation/commitment policy under human control.
- Closure: no-match users can recover without retyping everything; ordered requests visibly link to their existing summary rather than recommending new search inputs; snapshots remain unchanged.

## TD-007 — Mock boundary and prototype clarity

- Status: Open; Low/Medium; non-blocking for the bounded interaction demo.
- Evidence: `src/mock/provider.tsx` exposes raw state setters; listing and order mutations live in UI handlers. Draft identity includes raw query strings. Mock types extend card fixtures with dormant price/rating fields; unused users/profile exports remain. Orders snapshot records but do not reduce capacity; frontend trip locks do not establish inventory reservations.
- Owner: Implementation Engineer for later authorized boundary cleanup; Founder for scope/wording. Prefer explicit mock commands/view models when adding a real service, with server authorization/validation later; do not treat mock types as production contracts. Explain that capacity ignores existing demo orders until a simulation is authorized.
- Closure: agreed service boundary and demo behavior, removed obsolete presentation paths, meaningful contract tests when backend integration is authorized. No persistence or reservation feature demanded by this audit.

## TD-008 — Recovery, accessibility and visual regression coverage

- Status: Open; Low/Medium; non-blocking refinements beyond required R1–R5 corrections.
- Evidence: current browser suite passes ordinary flows but missed R1–R5. Form errors use one global flag and generic guidance; route selects lack field-level error associations. Dashboard title is traveler-specific for senders; View Trip and View all trips labels do not describe their destinations. Nested match cards, wrapped-label alignment and compact links need polish.
- Owner: Implementation Engineer; product owner for terminology/design and supported-browser targets.
- Closure: targeted regressions for actual bugs, precise accessible errors, coherent localized terminology, approved Figma flow guidance, and agreed browser/screen-reader coverage. Production-browser review used Chrome only; direct Figma Make screenshot inspection was unsupported. Do not imply pixel parity or physical-device validation.
