import type { City, Language } from "./geography";
import type { SearchValues } from "./search-types";

// Illustrative card data, not a production Trip entity.
export interface Trip {
  id: string;
  name: string;
  initials: string;
  rating: number;
  trips: number;
  from: City;
  to: City;
  date: string;
  capacity: number;
  price: number;
  color: string;
  score: number;
}

// Illustrative marketplace records; no live inventory or matching service.
export const sampleTrips: Trip[] = [
  {
    id: "alex",
    name: "Alex M.",
    initials: "AM",
    rating: 4.9,
    trips: 32,
    from: "munich",
    to: "shanghai",
    date: "2026-09-20",
    capacity: 8,
    price: 25,
    color: "#fc5000",
    score: 94,
  },
  {
    id: "emma",
    name: "Emma W.",
    initials: "EW",
    rating: 4.8,
    trips: 18,
    from: "frankfurt",
    to: "beijing",
    date: "2026-09-21",
    capacity: 5,
    price: 22,
    color: "#070607",
    score: 89,
  },
  {
    id: "daniel",
    name: "Daniel K.",
    initials: "DK",
    rating: 5,
    trips: 47,
    from: "munich",
    to: "shanghai",
    date: "2026-09-22",
    capacity: 10,
    price: 28,
    color: "#a0a0a0",
    score: 86,
  },
  {
    id: "li",
    name: "Li Wei",
    initials: "LW",
    rating: 4.7,
    trips: 12,
    from: "berlin",
    to: "chengdu",
    date: "2026-09-23",
    capacity: 6,
    price: 20,
    color: "#5a5a5a",
    score: 78,
  },
];
export const sampleMatches = sampleTrips
  .slice(0, 3)
  .map((trip) => ({ ...trip, to: "shanghai" as const }));

export const initialSearch: SearchValues = {
  fromCountry: "DE",
  fromCity: "munich",
  toCountry: "CN",
  toCity: "shanghai",
  date: "2026-09-20",
  weight: "2",
  volume: "5",
};

export function formatDate(value: string, lang: Language) {
  return new Intl.DateTimeFormat(
    lang === "en" ? "en-GB" : lang === "zh" ? "zh-CN" : "de-DE",
    { month: "short", day: "numeric", timeZone: "UTC" },
  ).format(new Date(`${value}T12:00:00Z`));
}
