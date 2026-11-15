'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { trips as initialTrips, requests as initialRequests, type MockTrip, type MockOrder } from './marketplace';
export interface Draft {
  from: MockTrip['from'];
  to: MockTrip['to'];
  date: string;
  arrival: string;
  weight: string;
  volume: string;
  item: string;
  area: string;
  length: string;
  width: string;
  height: string;
}
export const emptyDraft: Draft = { from: 'munich', to: 'shanghai', date: '2026-09-20', arrival: '2026-09-25', weight: '', volume: '', item: '', area: '', length: '', width: '', height: '' };
function useStore() {
  const [trips, setTrips] = useState(initialTrips), [requests, setRequests] = useState(initialRequests), [orders, setOrders] = useState<MockOrder[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  return { trips, setTrips, requests, setRequests, orders, setOrders, drafts, setDrafts };
}
const Context = createContext<ReturnType<typeof useStore> | null>(null);
export function MockProvider({ children }: {
  children: ReactNode;
}) { const store = useStore(); return <Context.Provider value={store}>{children}</Context.Provider>; }
export function useMock() {
  const store = useContext(Context); if (!store)
    throw new Error('Missing mock provider'); return store;
}
