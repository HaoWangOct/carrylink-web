import type { SearchValues } from "@/content/search-types";
import { searchQuery } from "@/mock/marketplace";
import { TrustSignals, HowItWorks } from "./story-sections";
import {
  HomeInteractions, HomeNavigation, HomeSearch, HomeMarketplace,
  HomeTrips, HomeMatches, HomeSafety, HomeClosing, HomeFooter,
} from "./home-interactions";

export function HomeExperience({ initial }: { initial: SearchValues }) {
  return <HomeInteractions key={searchQuery(initial)} initial={initial}>
    <HomeNavigation />
    <main id="main" tabIndex={-1}>
      <HomeSearch />
      <TrustSignals />
      <HowItWorks />
      <HomeMarketplace />
      <HomeTrips />
      <HomeMatches />
      <HomeSafety />
      <HomeClosing />
    </main>
    <HomeFooter />
  </HomeInteractions>;
}
