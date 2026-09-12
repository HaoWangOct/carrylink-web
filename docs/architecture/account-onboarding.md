# Account onboarding proposal and local UX

2026-09-11 · Implementation Engineer · Production proposal, not launch approval.

## Provider evaluation
Supabase is a provisional fit for the installed Next.js App Router and PostgreSQL direction. Its documented SDK supports email/password and phone/password with confirmation; phone OTP login is separate from phone/password signup. Phone-number recycling needs an explicit account-recovery/MFA decision. [Password authentication](https://supabase.com/docs/guides/auth/passwords), [phone login](https://supabase.com/docs/guides/auth/phone-login).

The supported Next.js SSR approach uses `@supabase/supabase-js` and `@supabase/ssr`, per-request clients, cookies and Proxy token refresh. Protect server data using validated claims/user identity, not a client-supplied session object. Auth responses must not be shared-cached. Installed Next 16 docs confirm async cookies and Route Handlers. Architectural compatibility is supported by documentation; exact SDK integration is not exercised here. [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

Google requires an OAuth application, consent-screen setup and allowed callback URLs; future server callback exchanges the authorization code through PKCE and checks the private profile by provider subject. Missing profile fields trigger onboarding; a provider's creation timestamp is not the source of profile completeness. Never merge accounts solely from unverified contact strings. [Google integration](https://supabase.com/docs/guides/auth/social-login/auth-google).

Email confirmation needs a configured sender; Supabase's default SMTP is for limited testing, not production delivery. SMS needs provider credentials and approved country coverage. Mainland China access and delivery must be tested from representative networks; no availability assumption. Email OTP presentation requires compatible provider email templates. [SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

## Boundary and routes
`/signup` and `/signup/email` → email/password/confirmation; `/signup/phone` → phone/password/confirmation; `/signup/verify` → email or SMS code; `/signup/complete-profile` → private fields/success; `/login` → email/password, phone/password or phone OTP, Google. Shared `(account)` layout retains non-submitted drafts across internal navigation. Header entry links add access without protecting or changing the mock marketplace.

UI → `/api/auth/demo` → strict runtime validation → `AuthAdapter`. No external calls exist. The demo adapter validates credential shape then discards passwords; it does not validate a real password or possess credentials. Fixed displayed code `123456` simulates verification. Google uses a fictional identity and detects the profile's presence within this same demo session. Login only simulates a flow, with uniform outcomes regardless of account existence. Returning profiles are recoverable within the current same-browser demo session, not a durable account directory.

`CARRYLINK_AUTH_MODE=demo` enables the loopback-only adapter; unset configuration enables demo in development and disables it in production. `supabase`, `disabled` or invalid settings fail closed. Supplying credentials never activates live sending. Production localhost tests can explicitly select demo. No demo cookie is a production credential or marketplace authorization token.

Demo safeguards: same-origin JSON POST, bounded body, server validation, server-bound verification, five attempts per challenge, 60-second resend delay, ten-minute challenge, 30-minute session, capped process-memory records, HttpOnly/SameSite cookie and no-store responses. Timing/password limits are clearly demo engineering parameters, not adopted production policy. Request bodies are never logged. Password and code fields clear after successful submission; drafts are memory-only and cleared on reset. No emails, SMS, real OAuth or production data writes.

## Minimum private profile model

| Record | Fields and boundary |
| --- | --- |
| Provider identity (future `auth.users`) | Provider-owned subject UUID, linked identities, login email/phone and verification/session state. Password hashing, OTP secrets and tokens belong to provider. No traveler/sender business fields. |
| Private application profile (proposed `private.account_profiles`) | `auth_user_id` primary/foreign key; first/last name; date-only birth date; country code; city; address; contact email; optional phone; timestamps. Contact data entered here is not automatically verified. No password/OTP/token columns. |
| Public profile projection | Not created in this task. A later explicitly approved projection may expose a display name/avatar. Never publish DOB, legal name, street address, private email or phone by default. |

Live implementation must key profiles to validated provider subjects, enforce owner-only access/RLS, deny anonymous reads and prevent clients changing ownership/verification flags. Keep private schema outside exposed Data API or configure and test owner policies explicitly; do not copy a tutorial's publicly readable profile policy. [Supabase user data](https://supabase.com/docs/guides/auth/managing-user-data).

Only TypeScript models and isolated in-memory demo records are implemented here. No SQL migrations, table creation, automatic cascades, or marketplace domain edits. Deletion semantics deliberately remain proposed: application records, provider identity, sessions, backups and legal retention must be handled together under approved policy.

## Required human decisions before enabling production

| Decision | Responsible approval / evidence needed |
| --- | --- |
| Provider and hosting | Founder: Supabase acceptance, project ownership, region, cost, availability, SDK/session spike and China/Germany network evidence. |
| Google OAuth configuration | Product/operations: application ownership, consent screen, authorized redirect origins/callbacks, scopes and production verification evidence. |
| Email service | Founder/operations: sender domain, provider, templates, verification mode, delivery tests, bounce/abuse handling and recovery. |
| SMS service / phone regions | Founder/operations/advisers: provider, country allowlist, number normalization, sender registration, cost/fraud limits and regional delivery evidence. Demo dial codes are examples, not a coverage promise. |
| Privacy and collection | Founder/privacy advisers: purposes and necessity of exact DOB, full name and address at signup; access, notices, processors/transfers and security review. No automatic GDPR conclusion. |
| Retention / deletion | Founder/privacy/legal advisers: abandoned signup/challenge retention, profile and provider deletion, marketplace obligations, backup expiry and audit retention. |
| Age | Founder/legal advisers: eligible ages, regional differences and verification/parental rules. Demo only validates a real past calendar date. |
| Consent | Founder/legal/privacy advisers: applicable terms/privacy versions, lawful basis and any consent requirements; separate optional marketing. No invented acceptance checkbox or legal text. |
| Credential / account policy | Security/product owner: whether phone accounts require password login, password requirements, real email/phone verification policy, breached-password protection, MFA, rate limits/CAPTCHA, session/recovery rules, phone recycling, linking and contact changes. |

No decision in this table has been approved by the implementation. These gates block production activation, not local fictional-data UX testing.
