"use client";

import { useState } from "react";
import { initialSearch } from "@/content/sample-trips";
import type { SearchValues } from "@/content/search-types";
import { LanguageProvider } from "../language-provider";
import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { PreviewDialog, type Preview } from "../preview-dialog";
import { Hero } from "./hero";
import {
  TrustSignals,
  HowItWorks,
  MarketplacePanels,
  SafetySection,
  ClosingCta,
} from "./story-sections";
import { UpcomingTrips } from "./upcoming-trips";
import { MatchingPreview } from "./matching-preview";

function Homepage() {
  const [draft, setDraft] = useState<SearchValues>(initialSearch);
  const [search, setSearch] = useState<SearchValues>(initialSearch);
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const traveler = () => setPreview({ kind: "traveler" });
  const safety = () => setPreview({ kind: "safety" });
  function submitSearch() {
    setSearch({ ...draft });
    setSubmitted(true);
    document.getElementById("matching")?.scrollIntoView();
    const heading = document.getElementById("matching-heading");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }
  return (
    <>
      <Navigation
        onAccount={() => setPreview({ kind: "account" })}
        onTraveler={traveler}
      />
      <main id="main" tabIndex={-1}>
        <Hero
          values={draft}
          onChange={setDraft}
          onSearch={submitSearch}
          onTraveler={traveler}
        />
        <TrustSignals />
        <HowItWorks />
        <MarketplacePanels onTraveler={traveler} />
        <UpcomingTrips onView={(trip) => setPreview({ kind: "trip", trip })} />
        <MatchingPreview
          search={search}
          submitted={submitted}
          onRequest={(trip) => setPreview({ kind: "trip", trip })}
        />
        <SafetySection onGuidelines={safety} />
        <ClosingCta onTraveler={traveler} />
      </main>
      <Footer
        onInformation={(title) => setPreview({ kind: "information", title })}
        onTraveler={traveler}
        onSafety={safety}
      />
      <PreviewDialog preview={preview} onClose={() => setPreview(null)} />
    </>
  );
}

export function HomeExperience() {
  return (
    <LanguageProvider>
      <Homepage />
    </LanguageProvider>
  );
}
