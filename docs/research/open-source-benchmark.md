# CarryLink open-source benchmark

Date/access date: 2026-09-08. Author: Research Architect. Status: research complete; recommendations **proposed**, not approved operating rules.

## Goal, scope, and evidence

Study Mercur and Ever Demand for a small, web-only China → Germany carrying marketplace; inspect the actual CarryLink frontend; propose architecture without copying code. No application edits, installations, migrations, or feature implementation are authorized. The requested filenames override the research README's date-prefix convention. The [research task record](research-task-record.md) is in this directory because the user limited writes to research, architecture, and decisions.

Public GitHub API metadata and untruncated recursive trees were read, followed by selected source files and repository documentation. Snapshots:

| Project | Branch and inspected commit | Commit timestamp (UTC) | Scope limits |
| --- | --- | --- | --- |
| [Mercur](https://github.com/mercurjs/mercur) | `main`, `da34c523f27cb0c33bf3d5c08640a4894859897c` | 2026-09-08 15:34:18 | Core, selected models, payout/commission/refund docs, manifest, test tree; not installed or executed |
| [Ever Demand](https://github.com/ever-co/ever-demand) | `develop`, `c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3` | 2026-08-05 12:35:22 | Shared entities/statuses, selected services, manifests, licensing, test tree; not installed or executed |
| CarryLink | `D:/model/carrylink-web`; Git metadata unavailable | Local inspection 2026-09-08 | Source/configuration/docs/browser script and existing report; no new runtime test |

Commit dates establish snapshot provenance, not release quality. A feature mentioned in documentation is not proof it is configured, tested, or supplied in the core package. “Not established” below means absent from the inspected evidence, not conclusively absent everywhere.

## 1. Learned from Mercur

### Marketplace and logistics

| Area | Observed evidence | Lesson and limit for CarryLink |
| --- | --- | --- |
| Users/customers/vendors | Seller has commercial details, currency, approval state and member associations; Member can belong to multiple sellers; order group references a customer [M2–M4]. | Separate authenticated person from marketplace capability. A traveler is an individual with time-bound capacity, not a store with staff. Do not import organization membership for MVP. |
| Marketplace lifecycle | Seller model starts pending approval, stores approval/rejection reasons and dates, and supports closure periods [M2]. | Explicit eligibility is useful. Do not assume store approval equals identity verification or customs eligibility. |
| Order lifecycle | OrderGroup connects cart/customer and aggregates seller orders; core workflows/tests include order-group status aggregation and payment-status routes [M4, M10]. | Preserve contract snapshots and distinguish financial/fulfillment status; avoid carts and multi-seller splitting for a one-request/one-traveler transaction. |
| Commission | Rules select rates across seller/product dimensions with deterministic precedence; lines allocate order commission [M5]. | Snapshot an approved fee formula/version on the order. Product-category commission engines are unnecessary initially. |
| Payment/payout | Documented pipeline distinguishes authorization, capture, account eligibility and transfer; payout has an idempotency key; provider integration is behind a contract [M6]. | Separate payment collection from traveler remuneration. Do not reuse capture windows, schedules, or release conditions as CarryLink policy. |
| Account eligibility | Payout accounts have pending, active, restricted, rejected states; provider webhooks drive changes [M7]. | Store provider account eligibility separately and recheck before release. A CarryLink badge must not override provider restrictions. |
| Refund | Vendor guide describes partial/full refunds after capture and before fully refunded [M8]. | Model refunds independently of order cancellation; a refund is a financial result, not proof of item return. |
| Disputes | No dedicated end-to-end custody dispute process established in selected evidence. | Build a case with evidence, decisions and money holds; a refund drawer is not adjudication. |
| Administration/permissions | Admin/vendor interfaces; seller-member associations; vendor permission and payout route test files [M2, M10]. | Enforce ownership and permissions on server commands. UI visibility alone is insufficient; this research did not audit all permission middleware. |
| Fulfillment/tracking/routes | Medusa commerce core supplies fulfillment/shipping primitives; payout docs inspect fulfillment readiness [M1, M6]. | Shipment is only a partial analogy. Passenger itinerary, baggage reservation, two-party custody evidence, missed flights and recipient no-show need CarryLink design. No passenger route/capacity model established. |
| Cancellations/exceptions/realtime | Docs discuss expired authorizations and account restrictions; workflow/subscriber patterns are present [M6–M7]. | Use durable failure/reconciliation paths. Do not assume customer GPS tracking or chat is included. |

### Engineering

Core is a TypeScript Medusa plugin; repository includes React/Vite admin and vendor packages, storefront application, typed API client, SDK and payout provider. PostgreSQL/Redis are documented infrastructure. The manifest uses Bun workspaces/Turbo and pins Medusa packages; its Node engine lower bound differs from README prerequisites, so an adoption project would need version-specific validation. [M1, M9]

Models and services form modules, with workflow steps and event subscribers coordinating them. The payout documentation explicitly distinguishes bundled workflows/webhook subscriber from **project-wired scheduled capture/payout jobs**. The described automatic pipeline must not be reported as turnkey core functionality. [M6]

Integration trees include commission calculations, store/admin/vendor payment status, vendor payouts and RBAC checks; unit and HTTP integration scripts are declared. These are useful test categories, not evidence that this snapshot passes or is secure. APIs and provider contracts are a better extension boundary than forking its dashboards. [M9–M10]

## 2. Learned from Ever Demand

### Marketplace and logistics

| Area | Observed evidence | Lesson and limit for CarryLink |
| --- | --- | --- |
| User/customer | User is distinct from Carrier, Admin and Warehouse. Order embeds a customer snapshot [E2, E5]. | Preserve historical contact/contract facts, but use one CarryLink account that can both send and travel. Copy only necessary snapshot fields, not whole profiles. |
| Seller/carrier | Warehouse represents store/merchant stock and payment settings; Carrier has availability, location, delivery counts and shared-carrier flag [E3, E5]. | Traveler resembles the custody actor, not the merchant. Traveler availability must be an itinerary offer rather than online driver status. |
| Marketplace/order lifecycle | Order belongs to one warehouse, contains product snapshots, confirmation/cancellation/payment flags and separate warehouse/carrier states [E2]. | One service commitment is a useful bound. Avoid a product catalog and combinations of independent booleans that allow inconsistent order states. |
| Route/delivery | Carrier service discovers nearby orders using geolocation streams and assigns carriers [E4]. | Route compatibility matters, but airport/city/date matching replaces proximity dispatch. No passenger flight or luggage capacity model established. |
| Fulfillment/tracking | Status enums distinguish selection, pickup, start, arrival and completion; location updates produce observable order results [E3–E4]. | Distinguish receipt into traveler custody from receipt by destination recipient. Milestone tracking is sufficient initially. |
| Cancellation/exceptions | Carrier cancellation clears assignment; exceptions include delivery issue and recipient refusal; warehouse preparation can fail [E3–E4]. | Track custody during exceptions. Do not clear assignment after pickup as though the goods disappeared. |
| Transition correctness | SelectedForDelivery/updateStatus contain TODOs for transition validation. DeliveryCompleted sets `isPaid` in that service [E4]. | Do not copy these semantics: CarryLink needs explicit allowed transitions, actor authorization, capacity concurrency checks and provider-confirmed payment. This is a source-path finding, not a complete security audit. |
| Payment | Order stores Stripe charge reference; OrdersService contains Stripe logic and a TODO to separate payments. Warehouse config supports online/cash modes [E2, E5–E6]. | Isolate provider effects; do not import cash-on-delivery assumptions into cross-border carrying. |
| Commission/payout/refund | No independently verified marketplace commission/payout ledger or complete asynchronous refund workflow established by inspected services/tree. | Do not credit undocumented capabilities. CarryLink needs these boundaries even if initial processing is operator-supervised. |
| Dispute | Delivery issue enum and order issue UI test path exist; formal evidence-based adjudication not established. | Delivery incident reporting is not a dispute resolution system. |
| Admin/permissions | Separate admin application/entity; authentication service dispatches carrier/warehouse identities by app name [E5, E7]. | Separate operational access from participant actions, but do not replicate separate person identities. Full object-level authorization coverage is unverified. |

### Engineering

The monorepo contains Angular web/admin and Ionic customer/carrier/merchant apps, plus other frontend variants. Shared TypeScript/common-angular routers connect clients to reactive services. Root manifest declares Angular 13/TypeScript 4.5-era tooling; backend manifest declares NestJS 8, GraphQL, socket tooling, Redis, MongoDB/Mongoose and TypeORM dependencies. This is evidence of a broad existing stack, not a recommendation to install those versions. [E1, E8]

Inspected delivery services use Inversify, Pyro router decorators and RxJS. Nest's services module bridges the service container. Shared User/Warehouse models contain both Pyro schema and TypeORM decorators, while delivery queries use Mongo-style filters and model population: describe the inspected path as document-oriented, **not** as a clean PostgreSQL-only Nest application. [E4–E5, E9]

REST/GraphQL/WS interfaces are documented; observable listeners and database existence events are concrete reactive examples. Notifications/location observation could merit asynchronous work, but a reliable durable-job/retry/dead-letter design was not established. Core Jest and UI test files exist, including geo integration and socket/router specs; no suite was run. Environment configuration, dependency injection and common router interfaces support extension, at the cost of a large maintenance surface. [E1, E4, E8–E10]

## 3. CarryLink-specific inspection

| Existing path | Observed behavior | Production assessment and action |
| --- | --- | --- |
| `src/app/page.tsx`, `layout.tsx` | Only `/`; server page composes HomeExperience; metadata and local font | Keep App Router and page shell. No dashboard/order/create-trip route currently exists. |
| `src/components/home/home-experience.tsx` | Client draft/search/submitted/dialog state; search updates summary and focus | Good UI ownership; no persisted requests, filtering or API. Add service-backed data only in approved phases. |
| `route-search.tsx` | Dependent country/city selects, native required/date/number constraints, rejects equal countries | Keep accessible controls. No past-date guard or server validation; 32 kg/200 L limits are prototype numbers, not approved airline rules. |
| `src/content/sample-trips.ts` | Four fixed people/trips, Sep 2026 dates, prices/ratings/capacity/scores; matches take first three and overwrite destination to Shanghai | Fixture only. Default is Munich → Shanghai; all shown trips depart Germany. Launch direction is China → Germany. Do not seed these as real people/inventory. |
| `matching-preview.tsx` | Renders fixed matches regardless of search; displays scores as percentages | Keep row/card geometry; replace fixture adapter later. Percentages are not measured likelihoods. |
| `trip-card.tsx`, `translations.json` | Verification label is unconditional; copy claims ID verification and escrow protection | Block claims from live presentation until truthful and approved; sample labels do not approve the general marketing claims. |
| `preview-dialog.tsx` | Native modal with Escape, outside dismissal and restored focus; all future actions remain previews | Keep dialog accessibility pattern. Replace individual CTA destinations incrementally, not the whole homepage. |
| `language-provider.tsx`, `ui-copy.ts`, `translations.json` | en/zh/de context; memory-only language, DOM lang updates, stable city IDs | Keep copy and IDs. Extract geography/types from fixture file; later choose server-consistent locale persistence without a global state framework. |
| `navigation.tsx`, `footer.tsx`, `story-sections.tsx`, UI primitives | In-page navigation, reusable branded sections/buttons and typography | Reusable frontend foundation, not certification of whole-product readiness. Avoid duplicating component system. |
| `globals.css`, logo/font assets | Tailwind theme, orange/ink branding, local Inter and original logo vector | Keep tokens/assets and font license. Inspect missing screen designs before extending UI. |
| `package.json`, lockfile, TypeScript/config | Next 16.3.4, React 19.2.8, TS 6.0.3, Tailwind 4.3.3, strict typing, pinned dependencies | Keep stack; no auth/ORM/service SDK today. Reported ESLint compatibility pin needs a future compatibility check, not an automatic upgrade. |
| `scripts/check-browser.mjs` | Playwright Core custom Node assertions, installed browser, four widths, languages, form/dialog behavior and no API/mutations assertion | Keep homepage regression coverage. No `tests/` directory observed. Introduce separate authorized product suites as APIs arrive; don't retain “no mutations anywhere” as a production contract. |
| `artifacts/browser-results.json`, `docs/implementation-report.md` | Existing report records ten passing groups and earlier lint/typecheck/build | Historical evidence only; not rerun here. No backend security, capacity race, webhook or payment evidence. |

Production-worthy **building blocks**: strict typed components, semantic labels, modal focus behavior, responsive layout, localized copy organization, local fonts, reproducible manifests and browser checks. Prototype-only: all business records, scores, badges, dates, prices, future-screen actions and general protection claims. A real backend is needed for every shared/authoritative fact: identity, eligibility, listings, reservation, agreement, messages, custody, money, reviews, disputes and audit history.

### Figma evidence

[Make file](https://www.figma.com/make/UlMimbPJrGzAYss4ohiJyd/Carrylink网站设计), node `0:1`, read through Figma MCP on the access date. Directly read `src/App.tsx`, `src/pages/CreateTrip.tsx`, `src/pages/OrderPage.tsx`. App uses a local seven-view page switcher, unlike CarryLink's single App Router route. CreateTrip has route/flight/capacity/category steps and fixture defaults; OrderPage has sample people, timeline/payment/messages panels and static online indicator. These provide layout intent, not implemented services or accepted policies. No rendered Make screenshot was returned; no pixel-equivalence claim is made. Sender request, authentication, admin and dispute flows need additional design guidance. Do not restore Vite or the page switcher.

## 4. Licensing: issues for professional review

Mercur's inspected root [MIT license](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/LICENSE) contains notice/permission retention terms. If code is reused, review applicable package/file notices, dependencies, assets, attribution and commercial module boundaries; README distinguishes licensed Enterprise capabilities. Root MIT does not establish rights to Enterprise modules or third-party assets. [M1]

Ever Demand root [LICENSE](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/LICENSE) identifies AGPL-3.0. [LICENSES.md](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/LICENSES.md) describes Community AGPL, GPL for mobile/shared portions, MIT Pyro portions and commercial alternatives. Counsel must inspect exact files, copying/linking/deployment pattern, source-disclosure and network-use implications, license compatibility and trademarks before reuse. A commercial arrangement's scope must be obtained in writing rather than inferred from marketing text.

This task used architectural study and original proposals; no project source was copied into CarryLink. Inspiration and code reuse are distinct review tracks, but this is **not a legal conclusion** that a future implementation is exempt from obligations.

## 5. Avoid and approval register

Avoid wholesale adoption of either platform, stock/cart/order splitting, mobile fleet apps, live GPS, GraphQL plus REST plus WS, automatic customs verdicts, invented match probabilities, premature ML, and financially meaningful fixture values. Their cost is disproportionate to one corridor and uncertain transaction demand.

Founder with responsible professional advisers must decide: operating entity/jurisdictions and carrier eligibility; approved item categories and documentary duties; liability/insurance wording; price/currency/rounding/fee/refund policy; PSP and payee-country feasibility; custody evidence and cancellation/dispute windows; identity/retention and cross-border data arrangements. Record approver/date/evidence before dependent implementation. See [architecture approval gates](../architecture/architecture.md#human-decision-gates), [domain model](../architecture/domain-model.md), [roadmap](../architecture/roadmap.md) and [ADR-001](../decisions/ADR-001-production-architecture.md).

## Source register

All accessed 2026-09-08. M/E references are pinned primary repository sources. Applicability: general software patterns; neither repository establishes China/Germany legal or commercial feasibility.

- M1: [Mercur README](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/README.md).
- M2: [Seller model](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/packages/core/src/modules/seller/models/seller.ts).
- M3: [Member model](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/packages/core/src/modules/seller/models/member.ts).
- M4: [Order group](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/packages/core/src/modules/seller/models/order-group.ts).
- M5: [Commission matching](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/apps/docs/platform/commission/concepts/rule-matching.mdx).
- M6: [Payout pipeline](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/apps/docs/platform/payout/concepts/payout-pipeline.mdx).
- M7: [Payout account lifecycle](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/apps/docs/platform/payout/concepts/account-lifecycle.mdx).
- M8: [Refund guide](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/apps/docs/user-guide/vendor/orders/how-tos/refund-an-order.mdx).
- M9: [Mercur manifest](https://github.com/mercurjs/mercur/blob/da34c523f27cb0c33bf3d5c08640a4894859897c/package.json).
- M10: [Integration test tree](https://github.com/mercurjs/mercur/tree/da34c523f27cb0c33bf3d5c08640a4894859897c/integration-tests/http).
- E1: [Ever Demand README](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/README.md).
- E2: [Order interface](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/common/src/interfaces/IOrder.ts).
- E3: [Carrier status](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/common/src/enums/OrderCarrierStatus.ts), [warehouse status](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/common/src/enums/OrderWarehouseStatus.ts), [carrier interface](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/common/src/interfaces/ICarrier.ts).
- E4: [Carrier order service](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/core/src/services/carriers/CarriersOrdersService.ts).
- E5: [Shared entity directory](https://github.com/ever-co/ever-demand/tree/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/common/src/entities): User, Admin, Warehouse inspected.
- E6: [Orders service](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/core/src/services/orders/OrdersService.ts).
- E7: [Authentication service](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/core/src/services/auth/AuthenticationService.ts).
- E8: [Root manifest](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/package.json), [backend manifest](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/core/package.json).
- E9: [Nest service bridge](https://github.com/ever-co/ever-demand/blob/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/core/src/services/services.module.ts).
- E10: [Core integration tests](https://github.com/ever-co/ever-demand/tree/c21fd5c93d4f2f3898cf60b1a62e3112bf4a5fa3/packages/core/src/test/integration).
