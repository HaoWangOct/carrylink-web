'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { authCopy } from '@/content/auth-copy';
import type { ProfileInput } from '@/auth/contracts';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { useAuth } from './provider';
import { AuthField } from './fields';
export function ProfileForm() {
  const auth = useAuth(), c = authCopy(useLanguage().lang);
  const [editing, setEditing] = useState(false);
  if (!auth.state.identity?.demoVerified) return <><h1 className="mb-5 text-2xl font-bold">{c.verifyFirst}</h1><Link className="text-link" href={auth.state.stage === 'verify' ? '/signup/verify' : '/signup'}>{c.next}</Link></>;
  async function submit(e: FormEvent) {
    e.preventDefault();
    const result = await auth.send({ action: 'profile', profile: auth.profile });
    if (result.state) { setEditing(false); requestAnimationFrame(() => document.getElementById('profile-title')?.focus()); }
  }
  if (auth.state.stage === 'complete' && !editing) return <>
    <h1 id="profile-title" tabIndex={-1} className="mb-5 text-3xl font-black">{c.complete}</h1>
    <p role="status" className="mb-6">{c.completeBody}</p>
    <div className="flex flex-wrap gap-5"><Link className="text-link" href="/dashboard">{c.dashboard}</Link><button className="text-link" onClick={() => setEditing(true)}>{c.edit}</button></div>
    <Button className="mt-6" variant="ink" disabled={auth.busy} onClick={async () => { await auth.send({ action: 'reset' }); }}>{c.reset}</Button>
    <p className="mt-3 text-xs text-body">{c.resetBody}</p>
    <Link className="text-link mt-5 block" href="/login">{c.login}</Link>
  </>;
  function field(id: keyof ProfileInput, type = 'text', autoComplete?: string) {
    const locked = (id === 'email' && !!auth.state.identity?.email) || (id === 'phone' && !!auth.state.identity?.phone);
    return <AuthField key={id} id={id} label={id === 'phone' && !locked ? c.optionalPhone : c[id]} type={type} autoComplete={autoComplete} required={id !== 'phone' || locked} maxLength={id === 'address' ? 300 : id === 'email' ? 254 : 100} readOnly={locked} value={auth.profile[id]} onChange={e => { auth.setProfile(p => ({ ...p, [id]: e.target.value })); auth.clearFeedback(); }} />;
  }
  return <>
    <h1 id="profile-title" tabIndex={-1} className="mb-3 text-3xl font-black">{c.profile}</h1><p className="mb-6 text-sm text-body">{c.private}</p>
    <form noValidate onSubmit={submit}>
      <fieldset disabled={auth.busy} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">{field('firstName', 'text', 'given-name')}{field('lastName', 'text', 'family-name')}</div>
        {field('dateOfBirth', 'date', 'bday')}
        <div><label className="field-label" htmlFor="country">{c.country}</label><select id="country" className="field" autoComplete="country" value={auth.profile.country} onChange={e => { auth.setProfile(p => ({ ...p, country: e.target.value })); auth.clearFeedback(); }}><option value="DE">{c.germany}</option><option value="CN">{c.china}</option></select></div>
        {field('city', 'text', 'address-level2')}{field('address', 'text', 'street-address')}{field('email', 'email', 'email')}{field('phone', 'tel', 'tel')}
        <p className="text-xs text-body">{c.contactHint}</p>
        <Button className="w-full" type="submit" disabled={auth.busy}>{auth.busy ? c.loading : c.save}</Button>
      </fieldset>
    </form>
    <Link href="/signup" className="text-link mt-5 inline-block" onClick={auth.clearFeedback}>{c.back}</Link>
  </>;
}
