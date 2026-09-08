# Initialize the CarryLink AI-agent workflow

## Task goal

Initialize repository-wide instructions, three role definitions, and durable research, architecture, decision, and progress folders. Scope is documentation only; no feature work, framework changes, dependency installation, or application edits. Owner: coordinating assistant. Status: completed.

## Implementation summary

Extended `AGENTS.md` while preserving its existing generated Next.js guidance. Defined role ownership, human decision requirements, deterministic financial calculations, repository safeguards, and implementation handoffs. Added folder guidance and an ADR template.

## Files changed

Modified:

- `AGENTS.md`

Created:

- `agents/research-architect.md`
- `agents/implementation-engineer.md`
- `agents/reviewer-historian.md`
- `docs/research/README.md`
- `docs/architecture/README.md`
- `docs/decisions/README.md`
- `docs/decisions/template.md`
- `docs/progress/README.md`
- `docs/progress/2026-09-08-agent-workflow.md`

## Tests

Documentation validation: checked required files, workflow rules, role boundaries, and local documentation references. SHA-256 comparison verified that existing files under `src/`, `public/`, and `scripts/`, plus root files other than `AGENTS.md`, remained unchanged. Application tests were not run because this task changes documentation only. No dependencies were installed.

## Decisions

Recorded the inspected Next.js/React/TypeScript/Tailwind stack and the discrepancy with the brief's Vite description. No framework migration or other product architecture choice was made, so no product ADR was introduced. Future significant architecture choices require ADRs. No legal, customs, KYC, or financial policy was decided.

## Known limitations

`git status --short` reported that the directory is not a Git repository; no branch or diff verification was available. Git was not initialized and no commits were made. Role ownership is an instruction-based workflow, not a technical access-control mechanism. Figma was not re-inspected for this documentation task.

## Next steps

Use these instructions for the next explicitly authorized task. Resolve business-critical unknowns with the responsible human and record significant architecture choices before dependent implementation. Confirm the intended framework before any future framework-specific migration work.

## Review

Self-reviewed for the requested documentation-only scope and all sixteen required rules. No independent reviewer agent was invoked.
