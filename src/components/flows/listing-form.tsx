'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMock, emptyDraft, type Draft } from '@/mock/provider';
import { country, positive, validDate, readSearch, type MockRequest, type MockTrip } from '@/mock/marketplace';
import { flowCopy } from '@/content/flow-copy';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { FlowShell, Missing } from './shell';
import { RouteFields } from './route-fields';
import { Summary } from './summary';
import { ExistingRequestOrder } from './order';
export function ListingForm({ kind }: { kind: 'trip' | 'request' }) {
  const params = useSearchParams();
  return <ListingEditor key={`${kind}:${params.toString()}`} kind={kind} />;
}
function ListingEditor({ kind }: { kind: 'trip' | 'request' }) {
  const store = useMock(), router = useRouter(), params = useSearchParams();
  const c = flowCopy(useLanguage().lang);
  const editId = params.get('edit');
  const originalTrip = kind === 'trip' ? store.trips.find(t => t.id === editId && t.userId === 'you') : undefined;
  const originalRequest = kind === 'request' ? store.requests.find(r => r.id === editId && r.userId === 'you') : undefined;
  const original = originalTrip || originalRequest;
  const existingOrder = originalRequest && store.orders.find(o => o.request.id === originalRequest.id);
  const selected = store.trips.find(t => t.id === params.get('trip'));
  const key = `${kind}:${editId || params.toString()}`;
  const search = readSearch(params);
  const initial: Draft = originalTrip ? {
    ...emptyDraft, from: originalTrip.from, to: originalTrip.to, date: originalTrip.date,
    arrival: originalTrip.arrival, weight: String(originalTrip.capacity), volume: String(originalTrip.volume),
  } : originalRequest ? {
    ...emptyDraft, from: originalRequest.from, to: originalRequest.to, arrival: originalRequest.deadline,
    weight: String(originalRequest.weight), volume: String(originalRequest.volume),
    item: originalRequest.item, area: originalRequest.area, length: String(originalRequest.length),
    width: String(originalRequest.width), height: String(originalRequest.height),
  } : { ...emptyDraft, ...(kind === 'request' ? {
    from: selected?.from || search.fromCity, to: selected?.to || search.toCity,
    arrival: selected?.arrival || search.date, weight: search.weight, volume: search.volume,
  } : {}) };
  const draft = store.drafts[key] || initial;
  const [step, setStep] = useState(0), [error, setError] = useState(false), [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false);
  if (existingOrder) return <ExistingRequestOrder order={existingOrder} />;
  if (!editId && params.has('trip') && (!selected || selected.status !== 'published')) return <Missing />;
  if (editId && (!original || (kind === 'trip' && store.orders.some(o => o.trip.id === editId))))
    return <Missing />;
  function update(change: Partial<Draft>) { store.setDrafts(prev => ({ ...prev, [key]: { ...draft, ...change } })); setError(false); }
  function move(n: number) { setStep(n); setError(false); requestAnimationFrame(() => heading.current?.focus()); }
  const routeValid = country(draft.from) !== country(draft.to) && validDate(draft.arrival) && (kind === 'request' || (validDate(draft.date) && draft.arrival >= draft.date));
  const detailValid = positive(draft.weight) && positive(draft.volume) && (kind === 'trip' || (draft.item.trim().length > 0 && draft.area.trim().length > 0 && [draft.length, draft.width, draft.height].every(positive)));
  const trip: MockTrip = { id: original?.id || '', userId: 'you', name: 'Demo', initials: 'D', rating: 0, trips: 0, from: draft.from, to: draft.to, date: draft.date, arrival: draft.arrival, capacity: +draft.weight, volume: +draft.volume, price: 0, color: '#fc5000', status: originalTrip?.status || 'published' };
  const request: MockRequest = { id: '', userId: 'you', from: draft.from, to: draft.to, deadline: draft.arrival, weight: +draft.weight, volume: +draft.volume, item: draft.item.trim(), area: draft.area.trim(), length: +draft.length, width: +draft.width, height: +draft.height };
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!(step === 0 ? routeValid : step === 1 ? detailValid : routeValid && detailValid)) {
      setError(true);
      return;
    }
    if (step < 2) {
      move(step + 1);
      return;
    }
    if (submitted.current)
      return;
    submitted.current = true;
    setBusy(true);
    const id = original?.id || crypto.randomUUID();
    if (kind === 'trip') {
      store.setTrips(prev => original ? prev.map(t => t.id === id ? { ...trip, id } : t) : [...prev, { ...trip, id }]);
      router.push('/dashboard?published=1');
    }
    else {
      store.setRequests(prev => originalRequest ? prev.map(r => r.id === id ? { ...request, id } : r) : [...prev, { ...request, id }]);
      router.push(`/matches?request=${id}&submitted=1`);
    }
    store.setDrafts(prev => { const next = { ...prev }; delete next[key]; return next; });
  }
  function field(name: keyof Draft, label: string, type = 'number') {
    return <div key={name}>
      <label htmlFor={name} className="field-label">{label}</label>
      <input className="field" id={name} type={type} required value={draft[name]} maxLength={type === 'text' ? 300 : undefined} min={type === 'number' ? '0.1' : undefined} step={type === 'number' ? '0.1' : undefined} aria-invalid={error || undefined} aria-describedby={error ? 'form-error' : undefined} onChange={e => update({ [name]: e.target.value })} />
    </div>;
  }
  return <FlowShell title={original ? kind === 'trip' ? c.edit : c.editRequest : kind === 'trip' ? c.newTrip : c.newRequest}>
    <div className="mx-auto max-w-3xl">
      <ol className="mb-6 grid grid-cols-3 gap-2">{[c.route, c.details, c.review].map((s, i) => <li key={s} aria-current={step === i ? 'step' : undefined} className={`rounded-xl p-3 text-sm ${step === i ? 'bg-ink text-white' : 'bg-surface'}`}>{i + 1}. {s}</li>)}</ol>
      <form onSubmit={submit} className="card space-y-6 p-5 sm:p-8" onInvalid={() => setError(true)}>
        <h2 ref={heading} tabIndex={-1} className="text-xl font-bold">{[c.route, c.details, c.review][step]}</h2>{step === 0 && <>
          <RouteFields from={draft.from} to={draft.to} onChange={update} />
          <div className="grid gap-4 sm:grid-cols-2">{kind === 'trip' && field('date', c.departure, 'date')}{field('arrival', kind === 'trip' ? c.arrival : c.deadline, 'date')}</div>
        </>}{step === 1 && <div className="grid gap-4 sm:grid-cols-2">{kind === 'request' && <>{field('item', c.item, 'text')}{field('area', c.area, 'text')}</>}{field('weight', c.weight)}{field('volume', c.volume)}{kind === 'request' && <>{field('length', c.length)}{field('width', c.width)}{field('height', c.height)}</>}</div>}{step === 2 && <>
          <Summary trip={kind === 'trip' ? trip : undefined} request={kind === 'request' ? request : undefined} />
          <p className="text-sm text-body">{c.fit}</p>
          <p>{c.undecided}</p>
        </>}{error && <p id="form-error" role="alert" className="text-sm text-red-700">{c.invalid}</p>}<div className="flex flex-wrap gap-3">{step > 0 && <Button type="button" variant="ink" onClick={() => move(step - 1)}>{c.previous}</Button>}<Button type="submit" disabled={busy}>{busy ? c.loading : step < 2 ? c.next : original ? c.save : kind === 'trip' ? c.publish : c.submit}</Button>
          <Link className="text-link self-center" href="/dashboard">{c.back}</Link>
        </div>
      </form>
    </div>
  </FlowShell>;
}
