"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { SearchValues } from "@/content/search-types";
import { searchQuery } from "@/mock/marketplace";
import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { PreviewDialog, type Preview } from "../preview-dialog";
import { Hero } from "./hero";
import { MarketplacePanels, SafetySection, ClosingCta } from "./story-sections";
import { UpcomingTrips } from "./upcoming-trips";
import { MatchingPreview } from "./matching-preview";

function useHomeState(initial: SearchValues) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [preview, setPreview] = useState<Preview | null>(null);
  return { router, draft, setDraft, preview, setPreview,
    traveler: () => router.push("/dashboard"),
    safety: () => setPreview({ kind: "safety" }),
  };
}
const HomeContext = createContext<ReturnType<typeof useHomeState> | null>(null);
function useHome() {
  const state = useContext(HomeContext);
  if (!state) throw new Error("Missing home interactions provider");
  return state;
}

// Only interactive state lives here; the server composes the page through children.
export function HomeInteractions({ initial, children }: { initial: SearchValues; children: ReactNode }) {
  const state = useHomeState(initial);
  return <HomeContext.Provider value={state}>{children}</HomeContext.Provider>;
}
export function HomeNavigation() {
  const { traveler } = useHome();
  return <Navigation onAccount={traveler} onTraveler={traveler} />;
}
export function HomeSearch() {
  const { draft, setDraft, router, traveler } = useHome();
  return <Hero values={draft} onChange={setDraft} onSearch={() => router.push(`/matches?${searchQuery(draft)}`)} onTraveler={traveler} />;
}
export function HomeMarketplace() {
  return <MarketplacePanels onTraveler={useHome().traveler} />;
}
export function HomeTrips() {
  const { router } = useHome();
  return <UpcomingTrips onView={trip => router.push(`/requests/new?trip=${trip.id}`)} />;
}
export function HomeMatches() {
  const { draft, router } = useHome();
  return <MatchingPreview search={draft} submitted={false}
    onRequest={trip => router.push(`/requests/new?${searchQuery(draft)}&trip=${trip.id}`)} />;
}
export function HomeSafety() {
  return <SafetySection onGuidelines={useHome().safety} />;
}
export function HomeClosing() {
  return <ClosingCta onTraveler={useHome().traveler} />;
}
export function HomeFooter() {
  const { traveler, safety, preview, setPreview } = useHome();
  return <>
    <Footer onInformation={title => setPreview({ kind: "information", title })} onTraveler={traveler} onSafety={safety} />
    <PreviewDialog preview={preview} onClose={() => setPreview(null)} />
  </>;
}
