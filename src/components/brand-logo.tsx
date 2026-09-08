import Image from "next/image";

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image src="/carrylink-mark.svg" width={36} height={24} alt="" priority />
      <span
        className={`text-[17px] leading-none font-bold tracking-[-0.2px] ${light ? "text-white" : "text-ink"}`}
      >
        Carrylink
      </span>
    </span>
  );
}
