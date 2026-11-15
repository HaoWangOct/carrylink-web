'use client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMock } from '@/mock/provider';
import { compatible, readSearch, searchTrips, searchQuery } from '@/mock/marketplace';
import { flowCopy } from '@/content/flow-copy';
import { useLanguage } from '../language-provider';
import { FlowShell, Missing } from './shell';
import { Summary } from './summary';
import { ExistingRequestOrder } from './order';
export function Matches() {
  const store = useMock(), p = useSearchParams(), router = useRouter();
  const c = flowCopy(useLanguage().lang);
  const request = store.requests.find(r => r.id === p.get('request')), trip = store.trips.find(t => t.id === p.get('trip'));
  if ((p.has('request') && !request) || (p.has('trip') && !trip))
    return <Missing />;
  const existingOrder = request && store.orders.find(o => o.request.id === request.id);
  if (existingOrder) return <ExistingRequestOrder order={existingOrder} />;
  const search = readSearch(p);
  const ordered = (id: string) => store.orders.some(o => o.request.id === id);
  const candidates = trip ? store.requests.filter(r => compatible(trip, r) && !ordered(r.id)).map(r => ({ trip, request: r })) : (request ? store.trips.filter(t => compatible(t, request) && !ordered(request.id)) : searchTrips(store.trips, search)).map(t => ({ trip: t, request }));
  candidates.sort((a, b) => (p.get('sort') === 'capacity' ? b.trip.capacity - a.trip.capacity : a.trip.date.localeCompare(b.trip.date)) || a.trip.id.localeCompare(b.trip.id) || (a.request?.id || '').localeCompare(b.request?.id || ''));
  return <FlowShell title={c.matches}>{p.has('submitted') && <p role="status" className="mb-5 rounded-xl bg-peach p-4">{c.submitted}</p>}{(request || trip) && <Summary request={request} trip={trip} />}<div className="my-6 flex flex-wrap items-center gap-4">
    <Link href={request || trip ? '/dashboard' : `/?${searchQuery(search)}#route-search`} className="text-link">{request || trip ? c.back : c.search}</Link>
    {request?.userId === 'you' && <Link className="text-link" href={`/requests/new?edit=${request.id}`}>{c.editRequest}</Link>}
    <label htmlFor="sort">{c.sort}</label>
    <select id="sort" className="field w-auto max-w-full" value={p.get('sort') === 'capacity' ? 'capacity' : 'date'} onChange={e => { const next = new URLSearchParams(p); next.set('sort', e.target.value); router.replace(`/matches?${next}`, { scroll: false }); }}>
      <option value="date">{c.earliest}</option>
      <option value="capacity">{c.capacity}</option>
    </select>
  </div>
    <p className="mb-5 text-sm text-body">{c.fit}</p>{!candidates.length && <p role="status" className="card p-8">{c.empty}</p>}<div className="space-y-5">{candidates.map((v, i) => <article key={`${v.trip.id}:${v.request?.id}`} className="card p-5">
      <p className="eyebrow">{i === 0 ? c.best : c.good}</p>
      <Summary trip={v.trip} request={trip ? v.request : undefined} />
      <details className="my-4">
        <summary className="text-link">{c.why}</summary>
        <p className="mt-3 text-sm">{c.reason}</p>
        <p className="text-sm">{c.fit}</p>
      </details>
      <Link className="inline-block rounded-xl bg-orange px-5 py-3 text-sm font-bold text-white" href={v.request ? `/orders/review?trip=${v.trip.id}&request=${v.request.id}` : `/requests/new?${searchQuery(search)}&trip=${v.trip.id}`}>{v.request ? c.select : c.newRequest}</Link>
    </article>)}</div>
  </FlowShell>;
}
