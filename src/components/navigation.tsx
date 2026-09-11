"use client";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "./brand-logo";
import { useLanguage } from "./language-provider";
import { Button } from "./ui/button";

export function Navigation({
  onAccount,
  onTraveler,
}: {
  onAccount: () => void;
  onTraveler: () => void;
}) {
  const { lang, setLang, t, ui } = useLanguage();
  const [open, setOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const options = [
    { code: "en", flag: "🇬🇧", native: "English", name: "English" },
    { code: "zh", flag: "🇨🇳", native: "中文", name: "Chinese" },
    { code: "de", flag: "🇩🇪", native: "Deutsch", name: "German" },
  ] as const;
  const selected = options.find((option) => option.code === lang)!;
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!languageRef.current?.contains(event.target as Node))
        setLanguagesOpen(false);
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !menuButton.current?.contains(event.target as Node)
      )
        setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (languagesOpen) {
        setLanguagesOpen(false);
        languageButton.current?.focus();
      } else if (open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [languagesOpen, open]);

  function links(mobile = false) {
    const cls =
      "rounded-full px-4 py-2 text-sm font-medium text-body transition-colors hover:bg-surface hover:text-ink";
    return (
      <>
        <Link href="/matches" className={cls} onClick={() => setOpen(false)}>
          {t.nav.findTraveler}
        </Link>
        <button
          className={cls}
          onClick={() => {
            setOpen(false);
            onTraveler();
          }}
        >
          {t.nav.carryItem}
        </button>
        <Link href="/#how-it-works" className={cls} onClick={() => setOpen(false)}>
          {t.nav.howItWorks}
        </Link>
        <Link href="/#safety" className={cls} onClick={() => setOpen(false)}>
          {t.nav.safety}
        </Link>
        {mobile && (
          <button
            className={cls}
            onClick={() => {
              setOpen(false);
              onAccount();
            }}
          >
            {t.nav.login}
          </button>
        )}
      </>
    );
  }
  return (
    <>
      <Link
        href="#main"
        className="fixed top-2 left-2 z-[100] -translate-y-24 rounded-xl bg-ink px-5 py-3 text-white focus:translate-y-0"
      >
        {ui.skip}
      </Link>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-soft-line bg-white/95 backdrop-blur-sm">
        <div className="container-page flex h-full items-center justify-between gap-3">
          <Link href="/" aria-label="CarryLink" className="shrink-0">
            <BrandLogo />
          </Link>
          <nav
            aria-label="Main"
            className="hidden flex-1 items-center justify-center xl:flex"
          >
            {links()}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <div ref={languageRef} className="relative">
              <button
                ref={languageButton}
                aria-label={ui.language}
                aria-expanded={languagesOpen}
                aria-controls="language-options"
                onClick={() => {
                  setLanguagesOpen((value) => !value);
                  setOpen(false);
                }}
                className="flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-sm font-medium text-body hover:bg-surface sm:px-3"
              >
                <span aria-hidden="true">{selected.flag}</span>
                <span className="hidden sm:inline">{selected.native}</span>
                <span
                  aria-hidden="true"
                  className={`text-xs transition-transform ${languagesOpen ? "rotate-180" : ""}`}
                >
                  ⌄
                </span>
              </button>
              {languagesOpen && (
                <div
                  id="language-options"
                  className="absolute top-full right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-white p-1 shadow-lg"
                  role="group"
                  aria-label={ui.language}
                >
                  {options.map((option) => (
                    <button
                      key={option.code}
                      lang={option.code}
                      aria-pressed={lang === option.code}
                      onClick={() => {
                        setLang(option.code);
                        setLanguagesOpen(false);
                        languageButton.current?.focus();
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-surface ${lang === option.code ? "bg-peach" : ""}`}
                    >
                      <span aria-hidden="true">{option.flag}</span>
                      <span className="flex-1">
                        <span className="block font-medium">
                          {option.native}
                        </span>
                        <span className="block text-xs text-muted">
                          {option.name}
                        </span>
                      </span>
                      {lang === option.code && (
                        <span className="text-orange" aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onAccount}
              className="hidden px-3 py-2 text-sm font-medium text-body hover:text-ink xl:block"
            >
              {t.nav.login}
            </button>
            <div className="hidden sm:block">
              <Button onClick={onAccount} className="px-5 py-2.5 font-semibold">
                {t.nav.getStarted}
              </Button>
            </div>
            <button
              ref={menuButton}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={ui.menu}
              onClick={() => {
                setOpen((value) => !value);
                setLanguagesOpen(false);
              }}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line text-xl xl:hidden"
            >
              <span aria-hidden="true">{open ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
        {open && (
          <div
            ref={menuRef}
            id="mobile-navigation"
            className="border-b border-line bg-white p-4 shadow-sm xl:hidden"
          >
            <nav aria-label={ui.menu} className="flex flex-col items-start">
              {links(true)}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
