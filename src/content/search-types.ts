import type { City, Country } from "./geography";

// Homepage form values: date, weight (kg) and volume (L) remain raw input strings.
// This is a presentation contract, not a validated production request.
export interface SearchValues {
  fromCountry: Country;
  fromCity: City;
  toCountry: Country;
  toCity: City;
  date: string;
  weight: string;
  volume: string;
}
