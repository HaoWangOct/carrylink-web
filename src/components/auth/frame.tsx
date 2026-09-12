'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import { authCopy } from '@/content/auth-copy';
import { useLanguage } from '../language-provider';
import { BrandLogo } from '../brand-logo';
import { useAuth } from './provider';
export function AuthFrame({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLanguage();
  const c = authCopy(lang), path = usePathname();
  const { ready, disabled, feedback } = useAuth();
  const error = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (feedback.error) error.current?.focus(); }, [feedback]);
  const step = path.includes('verify') ? 1 : path.includes('complete-profile') ? 2 : 0;
  return <>
    <header className="border-b border-line">
      <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
        <Link href="/" aria-label="CarryLink"><BrandLogo /></Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-link">{c.home}</Link>
          <label className="sr-only" htmlFor="auth-language">Language / 语言 / Sprache</label>
          <select id="auth-language" className="field w-auto" value={lang} onChange={e => setLang(e.target.value as typeof lang)}>
            <option value="en">English</option><option value="zh">中文</option><option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </header>
    <main id="main" className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-xl">
        <p className="mb-6 rounded-xl bg-peach p-4 text-sm" role="note">{c.demo}</p>
        {!path.includes('login') && <ol className="mb-6 grid grid-cols-3 gap-2 text-sm">{[c.accountStep, c.verifyStep, c.profileStep].map((label, i) => <li key={label} className={`rounded-xl px-3 py-3 ${i === step ? 'bg-ink text-white' : 'bg-surface'}`} aria-current={i === step ? 'step' : undefined}>{i + 1}. {label}</li>)}</ol>}
        {feedback.error && <p ref={error} tabIndex={-1} id="auth-error" role="alert" className="mb-5 rounded-xl border border-red-300 p-4 text-sm text-red-800">{c[feedback.error]}</p>}
        {!ready ? <p role="status">{c.loading}</p> : disabled ? <div className="card p-6"><h1 className="mb-5 text-xl font-bold">{c.unavailable}</h1><Link className="text-link" href="/">{c.home}</Link></div> : <div className="card min-w-0 p-5 [overflow-wrap:anywhere] sm:p-8">{children}</div>}
      </div>
    </main>
  </>;
}
