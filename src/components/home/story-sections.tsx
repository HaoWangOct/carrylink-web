"use client";

import Link from "next/link";
import { useLanguage } from "../language-provider";
import { SectionHeading } from "../ui/section-heading";
import { Button } from "../ui/button";

export function TrustSignals() {
  const { t } = useLanguage();
  return (
    <section
      aria-label={t.home.trustTitle}
      className="border-t border-soft-line py-14"
    >
      <div className="container-page grid grid-cols-1 gap-8 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {t.home.trust.map((item, i) => (
          <div key={item.label} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-peach text-sm font-bold text-orange"
            >
              {["✓", "⟳", "🔒", "📦"][i]}
            </span>
            <div>
              <h2 className="mb-1 text-sm font-semibold">{item.label}</h2>
              <p className="text-xs leading-snug text-body">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="section-space"
    >
      <div className="container-page">
        <SectionHeading
          id="how-heading"
          eyebrow={t.home.howBadge}
          title={t.home.howTitle}
          className="mb-14"
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {t.home.steps.map((step, i) => (
            <li
              key={step.title}
              className={`flex min-h-[260px] flex-col justify-between gap-8 rounded-2xl border p-8 ${i === 1 ? "border-transparent bg-ink text-white" : "border-line bg-white"}`}
            >
              <span
                aria-hidden="true"
                className={`text-5xl leading-none font-black tracking-[-2px] text-orange ${i === 1 ? "" : "opacity-20"}`}
              >
                0{i + 1}
              </span>
              <div>
                <h3 className="mb-2 text-lg font-bold tracking-[-0.3px]">
                  {step.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${i === 1 ? "text-[#a0a0a0]" : "text-body"}`}
                >
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function MarketplacePanels({ onTraveler }: { onTraveler: () => void }) {
  const { t } = useLanguage();
  const h = t.home;
  return (
    <section
      id="travelers-and-senders"
      aria-label={`${h.forTravelersBadge} / ${h.forSendersBadge}`}
      className="section-space bg-surface"
    >
      <div className="container-page grid gap-5 md:grid-cols-2">
        <article className="flex min-h-[380px] flex-col justify-between rounded-2xl bg-ink p-7 text-white sm:p-10">
          <div>
            <p className="eyebrow mb-5">{h.forTravelersBadge}</p>
            <h2 className="mb-4 text-[28px] leading-[1.15] font-black tracking-[-0.5px]">
              {h.forTravelersTitle}
            </h2>
            <p className="text-sm leading-relaxed text-[#a0a0a0]">
              {h.forTravelersDesc}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/8 p-4">
              <span className="text-2xl" aria-hidden="true">
                🧳
              </span>
              <div>
                <p className="text-sm font-semibold">{h.forTravelersAvg}</p>
                <p className="text-xs text-[#a0a0a0]">
                  {h.forTravelersCapacity}
                </p>
              </div>
            </div>
            <Button onClick={onTraveler}>{h.publishTrip}</Button>
          </div>
        </article>
        <article className="flex min-h-[380px] flex-col justify-between rounded-2xl bg-orange p-7 text-white sm:p-10">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[1.5px] text-white/70 uppercase">
              {h.forSendersBadge}
            </p>
            <h2 className="mb-4 text-[28px] leading-[1.15] font-black tracking-[-0.5px]">
              {h.forSendersTitle}
            </h2>
            <p className="text-sm leading-relaxed text-white/75">
              {h.forSendersDesc}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-black/15 p-4">
              <span className="text-2xl" aria-hidden="true">
                📦
              </span>
              <div>
                <p className="text-sm font-semibold">{h.forSendersAvg}</p>
                <p className="text-xs text-white/70">{h.forSendersPrice}</p>
              </div>
            </div>
            <Link
              href="/requests/new"
              className="rounded-xl bg-ink px-5 py-3.5 text-center text-sm font-bold transition-colors hover:bg-ink-hover"
            >
              {h.createRequest}
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export function SafetySection({ onGuidelines }: { onGuidelines: () => void }) {
  const { t } = useLanguage();
  const h = t.home;
  return (
    <section
      id="safety"
      aria-labelledby="safety-heading"
      className="section-space"
    >
      <div className="container-page grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="safety-heading"
            eyebrow={h.safetyBadge}
            title={h.safetyTitle}
            className="mb-5"
          />
          <p className="mb-6 leading-relaxed text-body">{h.safetyDesc}</p>
          <button className="text-link" onClick={onGuidelines}>
            {h.safetyLink}
          </button>
        </div>
        <div className="grid gap-3 min-[400px]:grid-cols-2">
          {h.safetyFeatures.map((feature) => (
            <article
              key={feature.title}
              className="card p-5 transition-colors hover:border-orange"
            >
              <div
                aria-hidden="true"
                className="mb-3 flex size-8 items-center justify-center rounded-lg bg-peach"
              >
                <span className="size-2 rounded-full bg-orange" />
              </div>
              <h3 className="mb-1 text-sm font-bold">{feature.title}</h3>
              <p className="text-xs leading-snug text-body">{feature.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClosingCta({ onTraveler }: { onTraveler: () => void }) {
  const { t } = useLanguage();
  return (
    <section aria-labelledby="closing-heading" className="pb-24">
      <div className="container-page">
        <div className="rounded-3xl bg-ink px-6 py-12 text-center sm:p-16">
          <h2
            id="closing-heading"
            className="mb-4 text-[clamp(32px,4vw,52px)] leading-[1.05] font-black tracking-[-2px] text-white"
          >
            {t.home.ctaTitle}
          </h2>
          <p className="mx-auto mb-10 max-w-md text-lg text-[#a0a0a0]">
            {t.home.ctaDesc}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={onTraveler} className="px-8 py-4">
              {t.home.ctaPublish}
            </Button>
            <Link
              href="/requests/new"
              className="rounded-xl border border-white/15 bg-white/10 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              {t.home.ctaFind}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
