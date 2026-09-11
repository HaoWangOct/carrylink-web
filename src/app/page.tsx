import { HomeExperience } from "@/components/home/home-experience";
import { readSearch } from "@/mock/marketplace";

export default async function HomePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initial = readSearch({ get: key => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? null;
  } });
  return <HomeExperience initial={initial} />;
}
