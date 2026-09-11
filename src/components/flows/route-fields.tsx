'use client';
import { cities, countryCities, type City, type Country } from '@/content/geography';
import { country } from '@/mock/marketplace';
import { useLanguage } from '../language-provider';
export function RouteFields({ from, to, onChange }: {
  from: City;
  to: City;
  onChange: (change: Partial<{
    from: City;
    to: City;
  }>) => void;
}) {
  const { lang, t } = useLanguage();
  return <div className="grid gap-4 sm:grid-cols-2">{(['from', 'to'] as const).map(side => {
    const city = side === 'from' ? from : to; return <div key={side} className="space-y-3">
      <label className="field-label" htmlFor={`${side}-country`}>{side === 'from' ? t.home.searchFromCountry : t.home.searchToCountry}</label>
      <select id={`${side}-country`} className="field" value={country(city)} onChange={e => onChange({ [side]: countryCities[e.target.value as Country][0] })}>
        <option value="DE">{t.home.countryGermany}</option>
        <option value="CN">{t.home.countryChina}</option>
      </select>
      <label className="field-label" htmlFor={`${side}-city`}>{side === 'from' ? t.home.searchFromCity : t.home.searchToCity}</label>
      <select id={`${side}-city`} className="field" value={city} onChange={e => onChange({ [side]: e.target.value as City })}>{countryCities[country(city)].map(v => <option key={v} value={v}>{cities[v][lang]}</option>)}</select>
    </div>;
  })}</div>;
}
