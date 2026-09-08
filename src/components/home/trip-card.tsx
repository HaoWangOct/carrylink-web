import { cities, formatDate, type Trip } from "@/content/sample-trips";
import { useLanguage } from "../language-provider";
import { Button } from "../ui/button";

export function TravelerIdentity({ trip }: { trip: Trip }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
        style={{ backgroundColor: trip.color }}
      >
        {trip.initials}
      </span>
      <div>
        <h3 className="text-sm font-bold">{trip.name}</h3>
        <p className="text-xs font-semibold text-orange">
          ✓ {t.home.tripFields.verified}
        </p>
      </div>
    </div>
  );
}

export function TripCard({
  trip,
  onView,
}: {
  trip: Trip;
  onView: (trip: Trip) => void;
}) {
  const { lang, t } = useLanguage();
  const h = t.home;
  return (
    <article className="card p-5 transition-all hover:border-orange hover:shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <TravelerIdentity trip={trip} />
        <span className="ml-auto shrink-0 rounded-lg bg-surface px-2 py-1 text-xs font-bold">
          <span aria-hidden="true">⭐ </span>
          {trip.rating}
        </span>
      </div>
      <div className="mb-4">
        <p className="mb-1 text-sm font-bold">
          {cities[trip.from][lang]} → {cities[trip.to][lang]}
        </p>
        <p className="text-xs text-muted">
          <span aria-hidden="true">📅 </span>
          <time dateTime={trip.date}>{formatDate(trip.date, lang)}</time> ·{" "}
          <span aria-hidden="true">⚖️ </span>
          {trip.capacity} kg
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-soft-line pt-4">
        <div>
          <p className="text-xs text-muted">{h.tripFields.from}</p>
          <p className="text-sm font-black">€{trip.price}/kg</p>
        </div>
        <Button
          className="px-4 py-2 text-xs"
          aria-label={`${h.viewTrip}: ${trip.name}`}
          onClick={() => onView(trip)}
        >
          {h.viewTrip}
        </Button>
      </div>
    </article>
  );
}
