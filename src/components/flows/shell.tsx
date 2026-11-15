'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Navigation } from '../navigation';
import { useLanguage } from '../language-provider';
import { flowCopy } from '@/content/flow-copy';
export function FlowShell({ title, children }: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const c = flowCopy(useLanguage().lang);
  return <>
    <Navigation onAccount={() => router.push('/dashboard')} onTraveler={() => router.push('/dashboard')} />
    <main id="main" tabIndex={-1} className="container-page min-h-screen pt-24 pb-16">
      <p className="mb-6 rounded-xl bg-peach p-4 text-sm" role="note">{c.demo}</p>
      <nav className="mb-8 flex flex-wrap gap-5" aria-label={c.dashboard}>
        <Link className="text-link" href="/dashboard">{c.dashboard}</Link>
        <Link className="text-link" href="/trips/new">{c.newTrip}</Link>
        <Link className="text-link" href="/requests/new">{c.newRequest}</Link>
      </nav>
      <h1 className="heading mb-8">{title}</h1>{children}</main>
  </>;
}
export function Missing() {
  const c = flowCopy(useLanguage().lang); return <FlowShell title={c.missing}>
    <Link className="text-link" href="/dashboard">{c.back}</Link>
  </FlowShell>;
}
