# Account onboarding foundation

## Task goal
Implementation Engineer; demo implementation on `feature/account-onboarding`, based on committed frontend sprint `612d2ed`. User authorizes signup UX, provisional provider evaluation, private profile model, adapter boundary, environment example and tests. No production authentication, sending, migrations or unrelated marketplace features.

## Implementation summary
Before coding, inspected AGENTS/role instructions, architecture/domain/roadmap, ADR-001, debt and latest 2026-09-10 progress. Presented architecture/routes/profile separation and human gates in the conversation. Implement only local demo UX and fail-closed provider boundary; Supabase production choice remains proposed.

Continued on 2026-09-12 after the usage-limit interruption during build/testing. Preserved the existing implementation and branch; inspected tracked diff, untracked auth files, scripts and this record before continuing. No restart, destructive Git commands, commit, merge or branch switch during continuation.

Already present: shared signup/login screens; email/password and phone/password signup; fictional Google onboarding; six-digit demo verification, resend countdown and feedback; private profile completion/editing; password visibility; EN/ZH/DE copy; navigation links; server validation and provider boundary; expiring process-memory demo sessions and separate profiles. Local identity and saved profiles recover after refresh while that server session exists. Unsubmitted drafts survive internal account navigation only; refresh clears those drafts and all passwords/codes.

### Focused continuation fixes

- Split the grouped command union into discriminated actions to resolve the actual TypeScript narrowing failure in the demo adapter.
- Clear credential fields after successful Google simulation as well as email/phone transitions.
- Hide a previously saved profile from API views while a returning phone login awaits renewed OTP verification; test read/write guards and restoration after proof.
- Fix localhost origin comparison: NextURL normalizes loopback addresses, so compare Origin against a strictly allowlisted actual Host. Reject public hosts, mismatched origins and ports; do not trust forwarded host headers. The initial browser test reproduced a 403 on valid local signup before this fix.
- Add visible invalid-input borders: visual inspection found that the error copy referenced marked fields without showing a visible field marker. Existing accessible error association/focus is retained.
- Added focused server/browser tests using existing TypeScript and Playwright dependencies. Corrected the test loader's ESLint-reserved variable name and browser route waits/error selectors; no testing dependencies installed.

## Files changed
- `.env.example`: local demo setting and unused blank future Supabase references; no credentials.
- `src/auth/contracts.ts`, `validation.ts`: identity/profile/command contracts and shared runtime validation.
- `src/server/auth/adapter.ts`, `demo-adapter.ts`: server-only adapter selection and isolated ephemeral demo state.
- `src/app/api/auth/demo/route.ts`: localhost-only GET/POST, request validation, origin/body limits and scoped HttpOnly cookie.
- `src/app/(account)/layout.tsx` and pages for `/signup`, `/signup/email`, `/signup/phone`, `/signup/verify`, `/signup/complete-profile`, `/login`.
- `src/components/auth/`: provider, frame, fields, credentials, verification and profile components.
- `src/content/auth-copy.ts`, `src/components/navigation.tsx`: translated account UX and entry links.
- `scripts/check-auth-server.mjs`, `scripts/check-auth.mjs`: targeted checks.
- [Account architecture](../architecture/account-onboarding.md), [ADR-003](../decisions/ADR-003-account-onboarding.md), and this existing task record. No duplicate ADR or progress entry.

## Tests
Executed afresh during continuation, including reruns after necessary fixes:

| Check | Result / evidence |
| --- | --- |
| `npm run typecheck` | PASS after discriminated-union fix. |
| `npm run lint` | PASS after renaming the test-loader variable. |
| `npm run build` | PASS after the final application fix; all account routes and demo API build successfully. |
| `node scripts/check-auth-server.mjs` | PASS. Executes actual validation/adapter modules with a controlled clock: provider fail-closed selection, invalid inputs, profile access/ownership, five attempts, resend cooldown, challenge/session expiry, cookie rotation, isolation, returning phone re-verification and absence of retained passwords/submitted codes. No test-only runtime endpoint. |
| `node scripts/check-auth.mjs` | PASS against `CARRYLINK_AUTH_MODE=demo npm run start -- --port 3300`. Signup navigation, mismatch/focus/visibility, email and phone flows, invalid/correct OTP, five failures, actual 60-second resend, profile validation/save/edit/reload, Google first/returning simulation, all three login methods, back/recovery/reset, EN/ZH/DE, responsive layouts and HTTP guards. |
| `BASE_URL=http://127.0.0.1:3300 npm run test:browser` | PASS, all seven existing marketplace regression groups, including traveler/sender/order flows and mobile navigation; no marketplace API/POST calls or console/runtime errors. |
| Supabase unavailable mode | PASS against local production server with `CARRYLINK_AUTH_MODE=supabase`: unavailable UI, GET/POST 503, no external requests. No provider credentials used. |
| `git diff --check` | PASS. Generated artifacts, `.next`, `node_modules` and `.env.local` are ignored; `.env.example` is the only environment file in the change set. |

Expanded final browser rerun: PASS, six result groups, including translated verification/profile/login, visible invalid-field styling, public-Host rejection and unavailable-provider checks. Reproduce with demo server on port 3300, unavailable-provider server on 3301, then `UNAVAILABLE_BASE_URL=http://127.0.0.1:3301 node scripts/check-auth.mjs`. The script also runs without the unavailable server when that variable is omitted. No page exceptions or external requests in the demo suite.

Ignored local evidence: `artifacts/auth-browser-results.json`, `artifacts/auth-unavailable-results.json`, `artifacts/browser-results.json` and `artifacts/auth-*.png`. Viewports: 1440×1000, 768×1024, 390×844 and 320×800. Inspected screenshots for signup/error, verification, profile and German narrow-screen layouts; original card, type, orange button, field and logo styles remain coherent. No auth Figma screen is available for exact comparison. Chrome viewport testing does not establish native mobile keyboard or Safari behavior.

### Security and architecture self-review

No password/OTP logging or durable storage; input strings exist only transiently for validation/transport. Tests use fictional contacts and credentials. Only a random HttpOnly/SameSite demo session reference is retained in the browser, scoped to the demo API; no localStorage/sessionStorage. The visible fixed demo code is intentionally public and cannot authorize marketplace operations. Identity and private profile remain separate; server derives ownership and verified-contact projection. Private fields do not render in public marketplace cards. Uniform simulation/errors perform no account-existence lookup.

Server-only provider modules, environment references and fail-closed configuration remain intact; no client credentials, custom hashing, database/schema changes, payments, KYC or infrastructure additions. Changed-file credential-pattern scan found no matches; manual review found only safe environment placeholders and fictional test values. No unfinished TODO/FIXME markers in the auth scope. Supabase integration remains a proposal, not an implemented live adapter.

## Decisions
See ADR-003 and the account architecture proposal. Existing marketplace model unchanged. Figma reference remains Make `UlMimbPJrGzAYss4ohiJyd`, node `0:1`; repository docs explicitly lack auth screens. Reuse inspected card/field/button/logo/palette as a minimal extension, not a pixel-parity claim. No new assets or design system.

## Known limitations
Production provider/email/SMS, privacy, retention/deletion, region, age and consent approvals remain pending. Local demo never proves identity and cannot authorize marketplace operations. Use fictional data only. Server memory is single-process and disappears on restart; sessions expire after 30 minutes, with periodic expired-data cleanup. Refresh recovers saved data only in that current cookie/session; it is not a durable account or cross-device login. Google uses a fictional identity; password login validates shape and simulates success without password comparison. Country and dial options are examples, not an approved region allowlist.

Real Google OAuth/callbacks, email/SMS delivery, provider account linking/recovery, live sessions/refresh, database/RLS and real verification remain unverified because no provider setup is enabled. Production use requires a supported provider integration and separate review; the demo safeguards are not production authentication.

### Production decisions requiring human approval

Final auth provider/hosting region; Google application, scopes and callbacks; email sender/provider/templates; SMS provider and supported phone regions; real verification and recovery policy; whether phone accounts require password login; age requirements; collection necessity and handling of exact address/DOB; privacy and retention; account deletion including linked marketplace records/backups; consent/terms requirements; MFA, linking and recycled-phone risks. No legal assumptions, age threshold, consent approval or GDPR-compliance claim is made. See the responsible-owner table in the architecture proposal.

## Next steps
Hand off the demo diff and evidence for Reviewer/Historian review. Resolve production decisions before a separately authorized provider/SDK integration and human-controlled database/RLS work. Obtain auth-specific Figma guidance before any pixel-parity claim. Do not commit or merge without user authorization.

## Review
Implementation self-review complete; independent Reviewer/Historian review remains pending. No second Reviewer approval is implied for earlier R1–R5, and those historical records remain unchanged.
