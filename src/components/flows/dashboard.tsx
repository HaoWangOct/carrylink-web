'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMock } from '@/mock/provider';
import { flowCopy } from '@/content/flow-copy';
import { useLanguage } from '../language-provider';
import { FlowShell } from './shell';
import { Summary } from './summary';
import { Button } from '../ui/button';
export function Dashboard() {
  const store = useMock();
  const c = flowCopy(useLanguage().lang);
  const params = useSearchParams();
  const trips = store.trips.filter(t => t.userId === 'you'), requests = store.requests.filter(r => r.userId === 'you');
  return <FlowShell title={c.traveler}>{params.has('published') && <p role="status" className="mb-6 rounded-xl bg-peach p-4">{c.published}</p>}<div className="space-y-10">
    <section>
      <h2 className="mb-4 text-2xl font-bold">{c.trips}</h2>{!trips.length && <p>{c.noRecords} <Link className="text-link" href="/trips/new">{c.newTrip}</Link>
      </p>}<div className="grid gap-4 lg:grid-cols-2">{trips.map(t => {
        const locked = store.orders.some(o => o.trip.id === t.id); return <article key={t.id}>
          <Summary trip={t} />
          <div className="flex flex-wrap items-center gap-4 p-4">
            <span>{t.status === 'published' ? c.publishedStatus : c.paused}</span>
            <Button variant="ink" disabled={locked} onClick={() => store.setTrips(prev => prev.map(v => v.id === t.id ? { ...v, status: v.status === 'published' ? 'paused' : 'published' } : v))}>{t.status === 'published' ? c.pause : c.resume}</Button>{!locked && <Link className="text-link" href={`/trips/new?edit=${t.id}`}>{c.edit}</Link>}{t.status === 'published' && !locked && <Link className="text-link" href={`/matches?trip=${t.id}`}>{c.find}</Link>}{locked && <p className="text-sm">{c.locked}</p>}</div>
        </article>;
      })}</div>
    </section>
    <section>
      <h2 className="mb-4 text-2xl font-bold">{c.requests}</h2>{!requests.length && <p>{c.noRecords}</p>}<div className="grid gap-4 lg:grid-cols-2">{requests.map(r => {
        const order = store.orders.find(o => o.request.id === r.id);
        return <article key={r.id}>
        <Summary request={r} />
        {order ? <div className="p-4">
          <p className="mb-2">{c.orderExists}</p>
          <Link className="text-link" href={`/orders/${order.id}`}>{c.viewOrder}</Link>
        </div> : <div className="flex flex-wrap gap-4 p-4">
          <Link className="text-link" href={`/matches?request=${r.id}`}>{c.find}</Link>
          <Link className="text-link" href={`/requests/new?edit=${r.id}`}>{c.editRequest}</Link>
        </div>}
      </article>; })}</div>
    </section>
    <section>
      <h2 className="mb-4 text-2xl font-bold">{c.orders}</h2>{!store.orders.length && <p>{c.noRecords}</p>}{store.orders.map(o => <Link className="card mb-3 block p-5 break-words" key={o.id} href={`/orders/${o.id}`}>{c.created} · {o.request.item}</Link>)}</section>
  </div>
  </FlowShell>;
}
