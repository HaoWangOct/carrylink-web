# ADR-002: Frontend mock interactions

- Status: Accepted for this frontend sprint only
- Date: 2026-09-10
- Author: Implementation Engineer
- Decision authority: User's frontend interaction sprint request
- Approval evidence: Request explicitly prefers React context, URL search parameters, local mock data and no backend/dependencies.
- Related task: [Sprint record](../progress/2026-09-10.md)
- Supersedes / superseded by: None; ADR-001 remains proposed

## Context and constraints
Existing single-page homepage provides Figma-derived tokens and accessible primitives. Main journeys are missing. Production policy is unapproved.

## Options considered
Page-local state loses records on navigation. An external state package is unnecessary. Root React context preserves records and drafts across App Router navigation.

## Decision
Use a root in-memory mock context, centralized fixtures/types and pure candidate filtering. Use real route pages and URL search values/record IDs. Refresh deliberately resets the demo; unknown record URLs show recovery links. All new copy supports EN/ZH/DE.
Mock candidates require exact directed cities, positive sufficient weight/volume, and trip arrival on/before request deadline; search uses departure on/after its date. Stable date then ID ordering is a demo display choice, not accepted live ranking. Dimensions are collected but no fit claim is made. Demo orders snapshot records, deduplicate requests and stop at confirmation. No production state machine, capacity reservation, price calculation, fees or eligibility decisions.

## Consequences
Small dependency-free frontend with clear replacement boundary. Data is temporary and cannot be shared between browsers; URL search filters can be shared. No claim of contract, verification or protection.

## Human approval requirements
No new regulated policy is implemented. H1–H5 remain unresolved for live launch, including pricing and physical-fit policy.

## Validation and follow-up
Run existing checks plus browser journeys, invalid input, missing IDs, back navigation, language, responsive layout and modal keyboard checks. Replace the mock boundary only in a separately authorized backend task.
