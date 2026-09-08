import {
  cities,
  formatDate,
  sampleMatches,
  type SearchValues,
  type Trip,
} from "@/content/sample-trips";
import { useLanguage } from "../language-provider";
import { SectionHeading } from "../ui/section-heading";
import { Button } from "../ui/button";
import { TravelerIdentity } from "./trip-card";

export function MatchingPreview({
  search,
  submitted,
  onRequest,
}: {
  search: SearchValues;
  submitted: boolean;
  onRequest: (trip: Trip) => void;
}) {
  const { lang, t, ui } = useLanguage();
  const h = t.home;
  const values = [
    cities[search.fromCity][lang],
    cities[search.toCity][lang],
    `${search.weight} kg`,
    `${search.volume} L`,
    formatDate(search.date, lang),
  ];
  return (
    <section
      id="matching"
      aria-labelledby="matching-heading"
      className="section-space bg-surface"
    >
      <div className="container-page">
        <SectionHeading
          id="matching-heading"
          eyebrow={h.matchingBadge}
          title={h.matchingTitle}
          className="mb-10"
        />
        <div className="card mb-5 flex flex-wrap items-center gap-3 p-5">
          {h.sidebarFields.map((field, i) => (
            <div
              key={field.label}
              className="rounded-xl bg-surface px-4 py-2.5 text-sm font-medium"
            >
              {field.label}: <strong>{values[i]}</strong>
            </div>
          ))}
          <a
            href="#route-search"
            className="ml-auto rounded-xl bg-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-hover"
          >
            {submitted ? h.editSearch : ui.search}
          </a>
        </div>
        <p aria-live="polite" className="mb-4 text-xs text-body">
          {submitted ? ui.updated : ui.sample}
        </p>
        <p className="mb-4 text-xs font-semibold tracking-[1.5px] text-muted uppercase">
          {h.bestMatches}
        </p>
        <div className="space-y-3">
          {sampleMatches.map((trip) => (
            <article
              key={trip.id}
              className="card flex flex-col gap-4 p-5 transition-colors hover:border-orange lg:flex-row lg:items-center"
            >
              <div className="lg:w-44">
                <TravelerIdentity trip={trip} />
              </div>
              <dl className="flex flex-1 flex-wrap gap-5">
                {[
                  {
                    label: h.matchFields.route,
                    value: `${cities[trip.from][lang]} → ${cities[trip.to][lang]}`,
                  },
                  {
                    label: h.matchFields.date,
                    value: formatDate(trip.date, lang),
                  },
                  {
                    label: h.matchFields.capacity,
                    value: `${trip.capacity} kg`,
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <dt className="text-xs text-muted">{field.label}</dt>
                    <dd className="text-sm font-semibold">{field.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between gap-4 lg:justify-start">
                <div className="text-right">
                  <p className="text-xs text-muted">
                    {h.matchFields.matchScore}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      aria-hidden="true"
                      className="h-1.5 w-20 overflow-hidden rounded-full bg-soft-line"
                    >
                      <div
                        className="h-full rounded-full bg-orange"
                        style={{ width: `${trip.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-black">{trip.score}%</span>
                  </div>
                </div>
                <Button
                  className="px-4 py-2.5 text-xs"
                  onClick={() => onRequest(trip)}
                  aria-label={`${h.request}: ${trip.name}`}
                >
                  {h.request}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
