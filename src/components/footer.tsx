import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { useLanguage } from "./language-provider";

export function Footer({
  onInformation,
  onTraveler,
  onSafety,
}: {
  onInformation: (title: string) => void;
  onTraveler: () => void;
  onSafety: () => void;
}) {
  const { t } = useLanguage();
  const f = t.footer;
  const columns = [
    { title: f.platform, links: f.platformLinks },
    { title: f.company, links: f.companyLinks },
    { title: f.support, links: f.supportLinks },
    { title: f.legal, links: f.legalLinks },
  ];
  const linkClass =
    "text-left text-sm leading-relaxed text-[#a0a0a0] transition-colors hover:text-white";
  return (
    <footer className="mt-12 bg-ink text-white md:mt-24">
      <div className="container-page py-16 md:py-20">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="CarryLink" className="mb-5 inline-flex">
              <BrandLogo light />
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-[#a0a0a0]">
              {f.tagline}
            </p>
            <span className="inline-flex rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-white/70">
              🇨🇳 ↔ 🇩🇪
            </span>
          </div>
          {columns.map((column, columnIndex) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-4 text-xs font-semibold tracking-[1.5px] text-orange uppercase">
                {column.title}
              </h2>
              <ul className="space-y-3">
                {column.links.map((link, index) => (
                  <li key={link}>
                    {columnIndex === 0 && [0, 2, 3].includes(index) ? (
                      <Link
                        href={
                          index === 0
                            ? "/matches"
                            : index === 2
                              ? "/#how-it-works"
                              : "/#safety"
                        }
                        className={linkClass}
                      >
                        {link}
                      </Link>
                    ) : (
                      <button
                        className={linkClass}
                        onClick={() => {
                          if (columnIndex === 0 && index === 1) onTraveler();
                          else if (columnIndex === 2 && index === 3) onSafety();
                          else onInformation(link);
                        }}
                      >
                        {link}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm text-[#a0a0a0] md:flex-row md:text-left">
          <p>{f.rights}</p>
          <p>{f.route}</p>
        </div>
      </div>
    </footer>
  );
}
