import Link from "next/link";
import { useMock } from "@/mock/provider";
import { type Trip } from "@/content/sample-trips";
import { useLanguage } from "../language-provider";
import { SectionHeading } from "../ui/section-heading";
import { TripCard } from "./trip-card";

export function UpcomingTrips({ onView }: { onView: (trip: Trip) => void }) {
  const { t, ui } = useLanguage();
  const { trips } = useMock();
  return (
    <section
      id="trips"
      aria-labelledby="trips-heading"
      className="section-space"
    >
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <SectionHeading
            id="trips-heading"
            eyebrow={t.home.marketplaceBadge}
            title={t.home.marketplaceTitle}
          />
          <Link href="/matches" className="text-link">
            {t.home.viewAll}
          </Link>
        </div>
        <p className="mb-4 text-xs text-muted">{ui.sample}</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {trips.filter(trip => trip.status === "published").map((trip) => (
            <TripCard key={trip.id} trip={trip} onView={onView} />
          ))}
        </div>
      </div>
    </section>
  );
}
