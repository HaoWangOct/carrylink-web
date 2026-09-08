<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CarryLink AI-agent workflow

## Product context and current stack

CarryLink is a China-Germany peer-to-peer cross-border carrying marketplace connecting people who need items carried with travelers. The project is transitioning from a Figma Make prototype toward a production-ready marketplace. Prototype examples do not establish approved operating policy.

The project brief describes a React/TypeScript/Vite/Tailwind frontend. Inspection of this repository on 2026-09-08 instead shows Next.js 16 App Router, React 19, strict TypeScript, and Tailwind CSS 4 (`package.json`, `src/app/`, `tsconfig.json`, and `postcss.config.mjs`). Existing checks use ESLint, TypeScript, a Next.js build, and a Playwright-based browser script. Treat the files as evidence of the current implementation; this discrepancy does not authorize a framework migration. No backend or production database is established by this workflow.

## Design and business authority

- Figma is the visual source of truth. Record the relevant file/node or reference when implementing UI; identify missing design guidance and document intentional deviations.
- Existing Figma Make code is a prototype/reference, not code to blindly copy. Evaluate it for correctness, accessibility, security, maintainability, and fit with the actual stack.
- Business-critical rules must not be invented. Examples include eligibility, prohibited items, liability, fees, exchange rates, refunds, matching commitments, identity requirements, and order transitions. Record unknowns and obtain the responsible human's decision before implementing dependent behavior.
- Legal, customs, KYC, and financial decisions require explicit human approval. Record the approver, date, decision, and evidence in the task record and relevant ADR. Research, prototype copy, and technical review are not approval.
- Never silently change business rules. Describe the existing and proposed behavior, rationale, impact, and required approval before changing it; preserve the resulting decision in documentation.
- Financial calculations must be deterministic code using explicit inputs and approved precision, rounding, currency, fee, and exchange-rate policies. Do not use LLM output to calculate or decide monetary amounts. Validate approved calculations with appropriate boundary cases.

## Roles and write ownership

Read this file and the assigned role instructions before work:

| Role | Instructions | Allowed writes during coordinated tasks |
| --- | --- | --- |
| Research Architect (Research Agent) | `agents/research-architect.md` | Research, architecture, proposed ADRs, and task documentation; never `src/` |
| Implementation Engineer | `agents/implementation-engineer.md` | Authorized production application changes and supporting documentation |
| Reviewer/Historian | `agents/reviewer-historian.md` | Review records, progress history, and decision documentation; read-mostly |

Only the Implementation Engineer may modify production application code during coordinated tasks. This boundary also covers behavior-affecting assets, configuration, dependencies, and runtime scripts outside `src/`. Research must not modify `src/`. The Reviewer/Historian must not change application behavior while reviewing; return fixes to the Implementation Engineer. Assign ownership before edits and avoid concurrent writes to the same file. Role definitions do not themselves authorize spawning agents or beginning product work.

## Task workflow and durable records

1. Define the task goal, scope, acceptance criteria, responsible role, and relevant approved requirements. Read existing documentation and applicable instructions.
2. Research uncertain facts and document architecture as needed. Identify blocked business decisions while continuing independent authorized work.
3. Create an ADR for every significant architecture choice in `docs/decisions/`, using its template. Keep proposals distinct from accepted decisions and preserve superseded history.
4. Have the Implementation Engineer implement only the authorized scope once required decisions are resolved.
5. Run appropriate existing checks and have the Reviewer/Historian review changes, evidence, rule consistency, and remaining limitations.
6. Maintain a task record in `docs/progress/`. Every significant implementation task must include **task goal, implementation summary, files changed, tests, decisions, known limitations, and next steps**. Record skipped checks and reasons, link ADRs and approval evidence, and include review findings and resolution status.

Use `docs/research/` for evidence and open questions, `docs/architecture/` for system designs, `docs/decisions/` for ADRs, and `docs/progress/` for task handoffs and history. Historical recommendations are not authorization to start another task.

## Repository and operational safeguards

- Never commit directly to `main` unless explicitly authorized. Inspect repository and branch state first; use a task branch for authorized implementation. Do not initialize Git, push, or merge merely to satisfy this workflow.
- No secrets in source code, documentation, fixtures, logs, or commits. Use environment references and safe placeholders; never copy credentials into task records.
- Agents must not modify production databases, including data writes, migrations, schema changes, or destructive maintenance. Document a proposal for human execution when necessary.
- Preserve unrelated user work and existing framework guidance. Do not install dependencies, introduce frameworks, or start feature development without task authorization.
- For documentation-only workflow tasks, modify documentation only. Do not change application code or run commands that install dependencies or alter application behavior.
