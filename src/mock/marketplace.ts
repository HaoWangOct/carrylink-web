import { sampleTrips, initialSearch, type Trip } from '@/content/sample-trips';
import { countryCities, type City } from '@/content/geography';
import type { SearchValues } from '@/content/search-types';
export interface MockTrip extends Trip {
  userId: string;
  arrival: string;
  volume: number;
  status: 'published' | 'paused';
}
export interface MockRequest {
  id: string;
  userId: string;
  from: City;
  to: City;
  deadline: string;
  weight: number;
  volume: number;
  item: string;
  area: string;
  length: number;
  width: number;
  height: number;
}
export interface MockMatch {
  id: string;
  tripId: string;
  requestId: string;
}
export interface MockOrder {
  id: string;
  match: MockMatch;
  trip: MockTrip;
  request: MockRequest;
}
export const users = [{ id: 'you', name: 'Demo' }, ...sampleTrips.map(t => ({ id: t.id, name: t.name })), { id: 'sender', name: 'Demo sender' }];
export const travelerProfiles = users.map(u => ({ userId: u.id, displayName: u.name }));
export const trips: MockTrip[] = sampleTrips.map(t => ({ ...t, userId: t.id, arrival: t.date, volume: 25, status: 'published' }));
export const requests: MockRequest[] = [{ id: 'sample-request', userId: 'sender', from: 'munich', to: 'shanghai', deadline: '2026-09-25', weight: 2, volume: 5, item: 'Demo parcel / 演示包裹 / Demo-Paket', area: 'Shanghai / 上海', length: 20, width: 20, height: 10 }];
export function validDate(s: string) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s; }
export function positive(n: number | string) { return Number.isFinite(Number(n)) && Number(n) > 0; }
export function country(city: City) { return countryCities.DE.includes(city) ? 'DE' : 'CN'; }
export function readSearch(p: {
  get: (key: string) => string | null;
}): SearchValues {
  const from = p.get('fromCity') as City, to = p.get('toCity') as City;
  const all = [...countryCities.DE, ...countryCities.CN];
  return {
    fromCity: all.includes(from) ? from : initialSearch.fromCity, toCity: all.includes(to) ? to : initialSearch.toCity,
    fromCountry: all.includes(from) ? country(from) : initialSearch.fromCountry, toCountry: all.includes(to) ? country(to) : initialSearch.toCountry,
    date: validDate(p.get('date') || '') ? p.get('date')! : initialSearch.date,
    weight: positive(p.get('weight') || '') ? p.get('weight')! : initialSearch.weight, volume: positive(p.get('volume') || '') ? p.get('volume')! : initialSearch.volume
  };
}
export function searchQuery(s: SearchValues) { return new URLSearchParams({ ...s }).toString(); }
export function searchTrips(ts: MockTrip[], s: SearchValues) { return ts.filter(t => t.status === 'published' && t.from === s.fromCity && t.to === s.toCity && t.date >= s.date && t.capacity >= +s.weight && t.volume >= +s.volume).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)); }
export function compatible(t: MockTrip, r: MockRequest) { return t.status === 'published' && t.userId !== r.userId && t.from === r.from && t.to === r.to && t.arrival <= r.deadline && t.capacity >= r.weight && t.volume >= r.volume; }
