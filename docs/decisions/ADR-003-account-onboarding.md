# ADR-003: Separate authentication identity from private account profiles

- Status: Proposed for production; local demo boundary authorized for this task
- Date: 2026-09-11
- Author: Implementation Engineer
- Decision authority: User for this frontend task; Founder and responsible advisers for production
- Approval evidence: Current request authorizes signup UX, provisional Supabase evaluation and safe mock fallback; production decisions pending
- Related task: [Progress](../progress/2026-09-11-account-onboarding.md), [account architecture](../architecture/account-onboarding.md)
- Supersedes / superseded by: None; ADR-001 remains proposed

## Context and constraints
CarryLink has Next.js 16 App Router, React 19 and local marketplace state. No real accounts/database. Requested email/password, phone/password with OTP, Google and private profile completion must not imply live service readiness.

## Options considered
Supabase fits PostgreSQL plus the requested auth methods; Auth0/Clerk would add a separate identity service and still need profile storage and regional evaluation. A custom password/session service creates unnecessary security obligations. No vendor selected for production.

## Proposed decision
Use separate auth identity and private CarryLink profile concepts, same-origin validated commands and a provider adapter. Implement a bounded local demo adapter now; Supabase mode is explicitly unavailable, never a silent demo fallback. No SDK installation or partial live callback/refresh implementation while production setup is unapproved.

Auth pages share one route-group layout and transient form context. A random HttpOnly cookie references isolated demo state held in server memory. No password/OTP is persisted; known demo code is only a simulation. Demo state expires, is bounded, and cannot authorize marketplace data. No browser storage. Production defaults disabled; demo requests restricted to localhost and explicit mode configuration.

## Consequences
UX can be tested with real server-side input validation, verification guards and resend throttling without provider effects. Server memory is single-process, ephemeral and unsuitable for real accounts. A Supabase adapter must later replace the demo boundary using supported SDK/session handling, not expand the demo into custom auth.

## Human approval requirements
Provider/hosting, email, SMS, regions, collection purposes, retention, deletion, privacy, age, consent, password/recovery/linking and recycled-number risk remain pending. No GDPR, legal eligibility or minimum-age claim. Birth date/address are private mock fields only until collection purpose is approved.

## Validation and follow-up
Typecheck/lint/build, local signup/login/browser flows, direct server validation and isolated-session tests, disabled-provider tests. Live OAuth, email, SMS, RLS and provider session refresh remain unverified. Human-controlled schema and RLS review precede any production database work.
