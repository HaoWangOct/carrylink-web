import { cities } from '@/content/geography';
import type { SearchValues } from '@/content/search-types';
import type { Trip } from '@/content/sample-trips';
import { useMock } from '@/mock/provider';
import { searchTrips } from '@/mock/marketplace';
import { flowCopy } from '@/content/flow-copy';
import { useLanguage } from '../language-provider';
import { SectionHeading } from '../ui/section-heading';
import { Button } from '../ui/button';
import { TravelerIdentity } from './trip-card';
export function MatchingPreview({ search, onRequest }: {
  search: SearchValues;
  submitted: boolean;
  onRequest: (trip: Trip) => void;
}) {
  const { lang, t } = useLanguage();
  const c = flowCopy(lang);
  const store = useMock();
  const matches = searchTrips(store.trips, search);
  return <section id="matching" aria-labelledby="matching-heading" className="section-space bg-surface">
    <div className="container-page">
      <SectionHeading id="matching-heading" eyebrow={t.home.matchingBadge} title={t.home.matchingTitle} className="mb-10" />
      <p className="mb-5 text-sm">{c.demo}</p>{!matches.length && <p role="status">{c.empty}</p>}<div className="space-y-3">{matches.slice(0, 3).map((trip, i) => <article key={trip.id} className="card flex flex-wrap items-center gap-5 p-5">
        <TravelerIdentity trip={trip} />
        <div className="flex-1">
          <p className="font-semibold">{cities[trip.from][lang]} → {cities[trip.to][lang]}</p>
          <p className="text-sm">{trip.date} · {trip.capacity} kg · {trip.volume} L</p>
          <details className="mt-2 text-sm">
            <summary className="text-link">{c.why}</summary>
            <p>{c.reason}</p>
            <p>{c.fit}</p>
          </details>
        </div>
        <span className="text-sm font-bold text-orange">{i === 0 ? c.best : c.good}</span>
        <Button onClick={() => onRequest(trip)}>{c.newRequest}</Button>
      </article>)}</div>
    </div>
  </section>;
}
