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
- No database, payment or production mutations/checks performed.

## Decisions

User authorized public source and live demo; see [ADR-005](../decisions/ADR-005-showcase-hosting.md). Preserve original Figma Make reference `UlMimbPJrGzAYss4ohiJyd`, node `0:1`; no UI design changes. Existing runtime safeguards disable publicly hosted account demo requests.

## Known limitations

Vercel not logged in when inspected; owner asked to complete login/registration. Live URL not yet available. Default GitHub branch is old `main`; do not imply branch preparation updates the default branch. Existing independent reviews remain outstanding as documented in prior task records. Dates are fixed fixtures; no real account, payment, messaging or shipment service exists.

## Review

Sequential self-review: README capabilities checked against routes, mock provider, auth adapter and browser script. Publication stages only explicitly named showcase files; existing uncommitted database work remains untouched. Independent review not performed. `git diff --check`: PASS. Desktop screenshot visually inspected. GitHub visibility independently re-read via CLI: PUBLIC. Live deployment still pending owner login.

## Next steps

Complete clean source checks, commit and push the showcase branch, create a reviewable PR, apply authorized public visibility, then finish Vercel import after owner login. Record actual URLs and deployment verification; do not invent an online address.
