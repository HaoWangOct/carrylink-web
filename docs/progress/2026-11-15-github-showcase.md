# GitHub showcase and online demo

## Task goal

2026-11-15. User requested a GitHub project showcase and selected a publicly accessible online demo, then explicitly authorized making the private GitHub repository public. Acceptance: accurate README with previews, verified source available on GitHub, and a verified live demo when hosting access is available.

Responsible role: primary agent as Implementation Engineer; sequential Reviewer/Historian self-review. No subagents. Branch: `chore/github-showcase`, based on `6f3b586`. Preserve all pre-existing uncommitted database files and configuration changes; exclude them from publication.

## Implementation summary

Replaced outdated homepage-only README with bilingual project introduction, current demo capabilities, desktop/mobile screenshots, route map, setup/check commands and explicit simulation boundaries. Added deployment instructions and hosting decision record. No application code, dependencies, business rules or databases changed.

## Files changed

- `README.md`
- `docs/images/home-desktop.png`, `docs/images/home-mobile.png`
- `docs/deployment.md`
- `docs/decisions/ADR-005-showcase-hosting.md`
- This task record.

## Tests

- Current workspace: `npm run lint`, `npm run typecheck`, `npm run build`: PASS.
- Current workspace: `npm run test:browser`: PASS, all seven groups, including mobile/desktop, languages, matching, sender/traveler flows and demo orders; no runtime/console errors or API/POST requests.
- Committed source snapshot extracted to `/private/tmp/carrylink-showcase-20261115`, excluding uncommitted database work: lint/type/build PASS. Initial build failed because Turbopack rejects a node_modules symlink outside its root; copied installed dependencies into the temporary snapshot and build then passed. Not a clean dependency install.
- All locally available Git history scanned for common private-key, GitHub-token, AWS-access-key and live Stripe-secret patterns: no matches. No `.env` / `.env.local` tracked history found. This is a bounded scan, not a comprehensive security audit.
- Clean-source production server: `BASE_URL=http://127.0.0.1:3001 npm run test:browser`: PASS, seven groups. `GET /api/auth/demo`: 503 as expected. Local server/network checks required sandbox escalation.
- Live deployment: `BASE_URL=https://carrylink-web.vercel.app npm run test:browser`: PASS, seven groups, no runtime/console errors or API/POST requests. Unauthenticated GET `/`: 200; GET `/api/auth/demo`: 503.
- No database or payment mutations/checks performed.

## Decisions

User authorized public source and live demo; see [ADR-005](../decisions/ADR-005-showcase-hosting.md). Preserve original Figma Make reference `UlMimbPJrGzAYss4ohiJyd`, node `0:1`; no UI design changes. Existing runtime safeguards disable publicly hosted account demo requests.

## Known limitations

Owner completed Vercel login and reported completing the GitHub connection. Explicit single-repository GitHub App permission approval received in chat; Vercel showed `HaoWangOct/carrylink-web` as importable. Imported `main` into Carrylink Hobby scope with Next.js defaults, project name `carrylink-web`, no added environment variables. Owner completed additional email identity verification. Vercel confirmed Deployed to Production in 32 seconds, deployment `dpl_6X5CfyPfG2xXExiiUio7WKBGga72`. Public URL: https://carrylink-web.vercel.app/ ; immutable deployment URL: https://carrylink-qlxcjjz2r-carrylink.vercel.app/ . GitHub About Website updated to public URL. PR #1 merged to `main` after explicit owner authorization; merge commit `5d4d1e8b9ca7a343229a7c93055bc78fd3574cfe`. Existing independent reviews remain outstanding as documented in prior task records. Dates are fixed fixtures; no real account, payment, messaging or shipment service exists.

## Review

Sequential self-review: README capabilities checked against routes, mock provider, auth adapter and browser script. Publication stages only explicitly named showcase files; existing uncommitted database work remains untouched. Independent review not performed. `git diff --check`: PASS. Desktop screenshot visually inspected. GitHub visibility independently re-read via CLI: PUBLIC. Live deployment confirmed by Vercel success page, unauthenticated HTTP 200, and seven passing online browser regression groups. Auth demo endpoint remains 503.

## Next steps

Source commit `98524c2` pushed; [PR #1](https://github.com/HaoWangOct/carrylink-web/pull/1) merged with explicit owner approval. Public visibility and main commit verified via GitHub CLI. Public prototype deployment complete. README and deployment docs link the verified site; follow-up documentation publication uses a PR rather than direct main commits. Future feature development and real trading remain separate tasks.
