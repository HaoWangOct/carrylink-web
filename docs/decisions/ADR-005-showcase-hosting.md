# 005: GitHub source showcase and Next.js demo hosting

- Status: Proposed (Vercel hosting); accepted scope: GitHub showcase and public demo
- Date: 2026-11-15
- Author: Implementation Engineer (primary agent)
- Decision authority: Project owner
- Approval evidence: User requested GitHub project display, selected GitHub + online demo, and explicitly selected making the repository public in this conversation.
- Related task: [Showcase task](../progress/2026-11-15-github-showcase.md)
- Supersedes / superseded by: None

## Context and constraints

Existing application uses Next.js App Router with dynamic order routes and a local-only demo authentication endpoint. Uncommitted PostgreSQL work must remain separate. This release showcases a prototype; it does not authorize real transactions.

## Options considered

- GitHub repository only: displays source and screenshots but does not satisfy the requested live demo.
- GitHub Pages: requires static export adaptation; existing server routes prevent direct hosting of the current application.
- Native Next.js hosting through Vercel: retains framework and routes, supports Git imports, and requires the owner's account login.
- Sites hosting: available deployment format is static assets or a Cloudflare Worker; adapting this repository is outside this bounded showcase task.

## Proposed decision

Publish a documented source branch, retaining existing framework and behavior. Use Vercel for the live demo after owner login; do not introduce database or auth secrets. Keep repository visibility changes tied to explicit user authorization. No new hosting account or paid plan is accepted on the owner's behalf.

## Consequences

Screenshots and accurate feature boundaries make the project reviewable. Public authentication stays unavailable by design. Fixture dates remain fixed, and browser memory resets on reload. Online hosting remains unverified until a successful deployment and smoke check.

## Human approval requirements

Public repository requested explicitly on 2026-11-15. Account registration/terms, if needed, remain with the owner. No legal, customs, KYC or financial operating decisions are implemented or approved by this technical task.

## Validation and follow-up

Validate lint, types, build and existing browser flows. Confirm public repository state and remote commit. Verify a deployed URL before advertising it. See [deployment instructions](../deployment.md) and the task record for actual results.
