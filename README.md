# CarryLink Web

Independent Next.js homepage based on the [CarryLink Figma Make project](https://www.figma.com/make/UlMimbPJrGzAYss4ohiJyd/Carrylink网站设计). The remote prototype remains unchanged. No other application pages, APIs, authentication, databases, payments, KYC, live matching, messaging, or deployment are implemented.

## Run locally

Use Node.js 22.13+ and npm:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. This Windows workspace has a checksum-verified portable Node 24.20.0 under the ignored `.tools` directory. If Node is not on PATH:

```powershell
$env:PATH = "$PWD/.tools/node-v24.20.0-win-x64;" + $env:PATH
$env:npm_config_cache = "$PWD/.tools/npm-cache"
npm.cmd run dev
```

## Validation

With the dev server running:

```sh
npm run typecheck
npm run lint
npm run build
npm run test:browser
```

Browser checks use `playwright-core` with an existing Chrome/Edge/Chromium installation; no browser is downloaded. Set `CHROME_PATH` if auto-discovery does not find your browser. Set `BASE_URL` to test a different local server. Screenshots and the check report are written to ignored `artifacts/`.

The suite checks four viewport widths (1440, 768, 390, 320), visible content, overflow, English/Chinese/German switching, mobile navigation, dependent cities, route validation, search summary updates, dialog keyboard behavior, focus restoration, console errors, and absence of API/mutation requests.

## Structure

- `src/app/`: App Router homepage, metadata, local Inter font, and Tailwind theme.
- `src/components/home/`: HomeExperience, Hero, RouteSearch, TrustSignals, HowItWorks, MarketplacePanels, TravelerIdentity, TripCard, UpcomingTrips, MatchingPreview, SafetySection, ClosingCta.
- `src/components/`: Navigation, Footer, BrandLogo, LanguageProvider, PreviewDialog.
- `src/components/ui/`: Button and SectionHeading.
- `src/content/`: homepage translations, preview copy, typed sample trips and stable city identifiers.
- `public/carrylink-mark.svg`: exact vector paths retrieved from the Make logo component.
- `scripts/check-browser.mjs`: browser validation and screenshots.
- `docs/implementation-report.md`: source comparison, commands, results, and remaining work.

The server page and layout prerender the homepage; a client boundary owns language and UI interactions. There is one application route, `/`, plus Next.js's standard not-found response.

## Interaction boundaries

Navigation links scroll to homepage sections. Search validates basic input and updates the request summary; it does not filter or rank travelers. Cards and scores are explicitly labeled sample data. The initial summary uses the search form's route, correcting the prototype's inconsistent direction.

Trip, traveler, account, safety, and unavailable footer actions open local dialogs. No action creates a trip, request, account, payment, or message. Language changes remain in memory and reset on reload; city IDs remain stable across languages. Native dialogs provide modal focus behavior and Escape dismissal.

## Design source

The MCP supplied Home, Nav, Footer, CarrylinkLogo, translations, and CSS. These define section order, copy, geometry, and colors. The implementation keeps Inter, orange `#fc5000`, near-black `#070607`, rounded cards, a 1200px content area, and alternating surfaces.

Mobile adjustments include a menu, stacked fields, responsive headings, larger button targets, and less crowded cards. Muted text is slightly darker for readability; sample labels and preview dialogs are additions. Native dates, select arrows, flags/emoji, and Chinese fallback fonts vary by browser/OS. Comparison used structured Make source and local Chrome screenshots; the MCP did not return a rendered Make screenshot for pixel comparison.

Inter is self-hosted through `next/font/local`; its SIL Open Font License is in `src/app/fonts/OFL.txt`. No font CDN is contacted at runtime.

## Dependencies

Runtime: Next.js 16.3.4, React/React DOM 19.2.8. Development: TypeScript 6.0.3, Tailwind/PostCSS plugin 4.3.3, Next.js ESLint configuration, ESLint, React/Node types, and Playwright Core. Exact versions and the lockfile keep installs reproducible. No UI, icon, state, auth, or service SDKs were added.

ESLint is pinned to 9.39.5 because the React lint plugin bundled with Next.js 16.3.4 crashes on ESLint 10.10.0 (`contextOrFilename.getFilename is not a function`). npm marks ESLint 9 deprecated; revisit this development-tool pin when the upstream plugin supports ESLint 10. Lint passes with zero warnings on the pinned version.

Recommended next task: specify and implement the sender request form as a separate UI task, including item eligibility, dimensions, validation, and review, before choosing backend services.
