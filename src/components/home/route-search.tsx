"use client";

import { useState, type FormEvent } from "react";
import {
  cities,
  countryCities,
  type City,
  type Country,
  type SearchValues,
} from "@/content/sample-trips";
import { useLanguage } from "../language-provider";
import { Button } from "../ui/button";

interface Props {
  values: SearchValues;
  onChange: (values: SearchValues) => void;
  onSearch: () => void;
  onTraveler: () => void;
}

export function RouteSearch({ values, onChange, onSearch, onTraveler }: Props) {
  const { lang, t, ui } = useLanguage();
  const h = t.home;
  const [invalidRoute, setInvalidRoute] = useState(false);
  function update(change: Partial<SearchValues>) {
    onChange({ ...values, ...change });
    setInvalidRoute(false);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (values.fromCountry === values.toCountry) {
      setInvalidRoute(true);
      return;
    }
    onSearch();
  }
  return (
    <form
      id="route-search"
      aria-label={h.findTraveler}
      onSubmit={submit}
      className="card max-w-3xl p-5 shadow-sm sm:p-6"
    >
      <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {(["from", "to"] as const).map((side) => {
          const countryKey = side === "from" ? "fromCountry" : "toCountry";
          const cityKey = side === "from" ? "fromCity" : "toCity";
          return (
            <div key={side} className="contents">
              <div className="min-w-0">
                <label className="field-label" htmlFor={`${side}-country`}>
                  {side === "from" ? h.searchFromCountry : h.searchToCountry}
                </label>
                <select
                  id={`${side}-country`}
                  className="field"
                  value={values[countryKey]}
                  aria-invalid={invalidRoute}
                  aria-describedby={invalidRoute ? "route-error" : undefined}
                  onChange={(event) => {
                    const country = event.target.value as Country;
                    update({
                      [countryKey]: country,
                      [cityKey]: countryCities[country][0],
                    });
                  }}
                >
                  <option value="DE">{h.countryGermany}</option>
                  <option value="CN">{h.countryChina}</option>
                </select>
              </div>
              <div className="min-w-0">
                <label className="field-label" htmlFor={`${side}-city`}>
                  {side === "from" ? h.searchFromCity : h.searchToCity}
                </label>
                <select
                  id={`${side}-city`}
                  className="field"
                  value={values[cityKey]}
                  onChange={(event) =>
                    update({ [cityKey]: event.target.value as City })
                  }
                >
                  {countryCities[values[countryKey]].map((city) => (
                    <option key={city} value={city}>
                      {cities[city][lang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <label className="field-label" htmlFor="trip-date">
            {h.searchDate}
          </label>
          <input
            className="field"
            id="trip-date"
            type="date"
            required
            value={values.date}
            onChange={(event) => update({ date: event.target.value })}
          />
        </div>
        {(["weight", "volume"] as const).map((key) => (
          <div key={key}>
            <label className="field-label" htmlFor={`trip-${key}`}>
              {key === "weight" ? h.searchWeight : h.searchVolume}
            </label>
            <div className="relative">
              <input
                id={`trip-${key}`}
                type="number"
                required
                min="0.1"
                step="0.1"
                max={key === "weight" ? 32 : 200}
                value={values[key]}
                onChange={(event) => update({ [key]: event.target.value })}
                className="field pr-12"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted">
                {key === "weight" ? "kg" : "L"}
              </span>
            </div>
          </div>
        ))}
      </div>
      {invalidRoute && (
        <p id="route-error" role="alert" className="mb-4 text-sm text-red-700">
          {ui.error}
        </p>
      )}
      <div className="grid gap-3 min-[380px]:grid-cols-2">
        <Button type="submit">{h.findTraveler}</Button>
        <Button variant="ink" onClick={onTraveler}>
          {h.imTraveling}
        </Button>
      </div>
    </form>
  );
}
