# English GitHub showcase

## Task goal

On November 15, 2026, the owner requested English-only GitHub showcase content. Scope: README and its public deployment guide, plus verification of repository metadata. Acceptance: all prose and labels in these showcase documents are English, with working local references and unchanged demo boundaries.

Responsible role: primary agent as Implementation Engineer, followed by sequential Reviewer/Historian self-review. No subagents. Branch: `docs/english-showcase`, based on `origin/main` at `a3ec4d6`. Existing uncommitted database work is excluded.

## Implementation summary

Translated the README and deployment guide into English, preserving live links, screenshots, feature coverage, setup commands and limitations. Repository description was already English and needs no change. Historical engineering records retain their original languages; the website continues to offer English, Chinese and German.

## Files changed

- `README.md`
- `docs/deployment.md`
- This task record.

## Tests

Documentation checks: scan showcase files for CJK characters, verify relative file links and image references, and run `git diff --check`. No application checks rerun: this task changes documentation only and preserves runtime behavior. PASS: no CJK characters in the three changed documents; all relative Markdown links and image references resolve; `git diff --check` passed.

## Decisions

No architectural or business changes; no ADR required. Existing Figma reference and screenshots retained. Owner's English showcase request authorizes publishing the documentation update through a task branch and PR, following the established showcase workflow.

## Known limitations

This is a translation of public-facing showcase material, not every historical research note, PR discussion or commit message. Existing mock dates and demo limitations remain documented. No independent reviewer used.

## Review

Sequential self-review checks English wording against the existing functionality, runtime boundaries and original setup instructions. Unrelated changes remain untouched.

## Next steps

Publish the English showcase documentation to GitHub through a PR and verify the default-branch README.
