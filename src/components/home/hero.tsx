import type { ComponentProps } from "react";
import { useLanguage } from "../language-provider";
import { RouteSearch } from "./route-search";

export function Hero(props: ComponentProps<typeof RouteSearch>) {
  const { t } = useLanguage();
  const h = t.home;
  return (
    <section
      aria-labelledby="hero-heading"
      className="pt-28 pb-20 md:pt-32 md:pb-24"
    >
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-orange"
            />
            <span className="text-xs font-medium text-body sm:text-sm">
              {h.badge}
            </span>
          </div>
          <h1
            id="hero-heading"
            className="mb-6 text-[clamp(44px,7vw,84px)] leading-[0.97] font-black tracking-[-2px] whitespace-pre-line sm:tracking-[-3px]"
          >
            {h.headline}
          </h1>
          <p className="mb-12 max-w-xl text-lg leading-relaxed text-body">
            {h.subheadline}
          </p>
        </div>
        <RouteSearch {...props} />
        <div
          className="mt-10 flex max-w-sm items-center gap-3 sm:gap-4"
          aria-label={`${h.germanyLabel} ↔ ${h.chinaLabel}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🇩🇪
            </span>
            <div>
              <p className="text-xs font-medium text-muted">{h.germanyLabel}</p>
              <p className="text-sm font-semibold">{h.germanyCity}</p>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="flex w-12 shrink-0 items-center gap-1"
          >
            <span className="flex-1 border-t-2 border-dashed border-orange/40" />
            <span>✈️</span>
            <span className="flex-1 border-t-2 border-dashed border-orange/40" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🇨🇳
            </span>
            <div>
              <p className="text-xs font-medium text-muted">{h.chinaLabel}</p>
              <p className="text-sm font-semibold">{h.chinaCity}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
