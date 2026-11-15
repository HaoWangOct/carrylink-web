'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMock } from '@/mock/provider';
import { compatible, type MockOrder } from '@/mock/marketplace';
import { flowCopy } from '@/content/flow-copy';
import { useLanguage } from '../language-provider';
import { FlowShell, Missing } from './shell';
import { Summary } from './summary';
import { Button } from '../ui/button';
export function OrderReview() {
  const store = useMock(), p = useSearchParams(), router = useRouter();
  const c = flowCopy(useLanguage().lang);
  const [accepted, setAccepted] = useState(false);
  const submitted = useRef(false);
  const trip = store.trips.find(t => t.id === p.get('trip')), request = store.requests.find(r => r.id === p.get('request'));
  const existing = store.orders.find(o => o.request.id === request?.id);
  if (!trip || !request)
    return <Missing />;
  if (existing)
    return <OrderDetail id={existing.id} />;
  if (!compatible(trip, request))
    return <FlowShell title={c.empty}>
      <Link className="text-link" href={`/matches?request=${request.id}`}>{c.find}</Link>
    </FlowShell>;
  return <FlowShell title={c.orderReview}>
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <Summary trip={trip} request={request} />
      <form className="card min-w-0 space-y-6 p-6 [overflow-wrap:anywhere]" onSubmit={e => {
        e.preventDefault(); if (!accepted || submitted.current)
          return; submitted.current = true; const id = crypto.randomUUID(); store.setOrders(prev => prev.some(o => o.request.id === request.id) ? prev : [...prev, { id, trip: { ...trip }, request: { ...request }, match: { id: `${trip.id}:${request.id}`, tripId: trip.id, requestId: request.id } }]); router.replace(`/orders/${id}`);
      }}>
        <h2 className="text-xl font-bold">{c.price}</h2>
        <p>{c.undecided}</p>
        <p className="text-sm text-body">{c.fit}</p>
        <label className="flex items-start gap-3">
          <input className="mt-1 size-5 shrink-0" type="checkbox" required checked={accepted} onChange={e => setAccepted(e.target.checked)} />
          <span>{c.acknowledge}</span>
        </label>
        <Button type="submit" disabled={!accepted}>{c.confirm}</Button>
        <Link className="text-link block" href={`/matches?${trip.userId === 'you' ? `trip=${trip.id}` : `request=${request.id}`}`}>{c.previous}</Link>
      </form>
    </div>
  </FlowShell>;
}
export function OrderDetail({ id }: {
  id: string;
}) {
  const store = useMock(); const c = flowCopy(useLanguage().lang); const order = store.orders.find(o => o.id === id); if (!order)
    return <Missing />; return <FlowShell title={c.created}>
      <p role="status" className="mb-6 rounded-xl bg-peach p-5">{c.guidance}</p>
      <Summary trip={order.trip} request={order.request} />
      <div className="card my-6 p-6">
        <h2 className="mb-3 text-xl font-bold">{c.price}</h2>
        <p>{c.undecided}</p>
      </div>
      <Link className="text-link" href="/dashboard">{c.back}</Link>
    </FlowShell>;
}

export function ExistingRequestOrder({ order }: { order: MockOrder }) {
  const c = flowCopy(useLanguage().lang);
  return <FlowShell title={c.orderExists}>
    <p role="status" className="mb-6 rounded-xl bg-peach p-5">{c.created}</p>
    <Summary trip={order.trip} request={order.request} />
    <div className="my-6 flex flex-wrap gap-5">
      <Link className="text-link" href={`/orders/${order.id}`}>{c.viewOrder}</Link>
      <Link className="text-link" href="/dashboard">{c.back}</Link>
    </div>
  </FlowShell>;
}
