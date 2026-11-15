'use client';
import { cities } from '@/content/geography';
import { flowCopy } from '@/content/flow-copy';
import type { MockTrip, MockRequest } from '@/mock/marketplace';
import { useLanguage } from '../language-provider';
export function Summary({ trip, request }: {
  trip?: MockTrip;
  request?: MockRequest;
}) {
  const { lang, t } = useLanguage();
  const c = flowCopy(lang);
  const route = trip || request;
  return <div className="card min-w-0 space-y-4 p-6 [overflow-wrap:anywhere]">{route && <h2 className="text-xl font-bold">{cities[route.from][lang]} → {cities[route.to][lang]}</h2>}{trip && <>
    <p>{trip.name} · {c.sample}</p>
    <p>{c.departure}: {trip.date} · {c.arrival}: {trip.arrival}</p>
    <p>{t.home.matchFields.capacity}: {trip.capacity} kg / {trip.volume} L</p>
  </>}{request && <>
    <p>{c.item}: {request.item}</p>
    <p>{request.weight} kg · {request.volume} L · {request.length} × {request.width} × {request.height} cm</p>
    <p>{c.deadline}: {request.deadline}</p>
    <p>{c.area}: {request.area}</p>
  </>}</div>;
}
