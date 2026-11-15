# CarryLink showcase deployment

Scope: a publicly accessible product prototype that preserves the existing Next.js architecture. It does not connect real accounts, funds or a database.

## Current deployment

- [Public demo](https://carrylink-web.vercel.app/)
- [Vercel project](https://vercel.com/carrylink/carrylink-web)
- Initial production deployment ID: `dpl_6X5CfyPfG2xXExiiUio7WKBGga72`
- Initial source: GitHub `main`, showcase merge commit `5d4d1e8b9ca7a343229a7c93055bc78fd3574cfe`.
- Verified on November 15, 2026: Vercel reported **Deployed to Production**; an unauthenticated homepage request returned 200, the account demo API returned 503, and all seven existing browser regression groups passed against the live site.

## Import into Vercel

1. Sign in to Vercel and import `HaoWangOct/carrylink-web` from New Project.
2. Deploy the verified `main` branch. Confirm it contains the intended showcase changes.
3. Use the Next.js framework preset and repository root. Use `npm ci` for installation, `npm run build` for the build command, and the framework's default output directory. Select a Node.js version satisfying `package.json`.
4. Add no environment variables or database connection. Leave account mode disabled by default. Do not upload `.env` files or run migrations, seed commands or resets.
5. After deployment, check the homepage, language switching, mobile layout, search, and traveler and sender demo flows without signing in. Confirm `/api/auth/demo` returns 503; real login and verification codes remain unavailable.
6. Add the actual public deployment URL to the README and GitHub About Website field. Do not use the deployment dashboard URL as the demo link.

References: [Vercel Git deployments](https://vercel.com/docs/git) and [GitHub integration](https://vercel.com/docs/git/vercel-for-github). Local framework reference: `node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`.

## Publication scope and rollback

The showcase excludes the workspace's uncommitted PostgreSQL and Prisma experiments. Deploy a specific Git commit rather than uploading the entire local working directory.

To roll back, select a previous successful showcase deployment in the hosting platform. No database recovery is required. Public source also exposes the existing commit history. Check for credentials and files that should remain private before publication; automated scanning only detects some common patterns.
