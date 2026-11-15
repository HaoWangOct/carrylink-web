'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { authCopy } from '@/content/auth-copy';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { useAuth } from './provider';
import { AuthField } from './fields';
export function Verification() {
  const auth = useAuth(), router = useRouter();
  const c = authCopy(useLanguage().lang);
  const [code, setCode] = useState(''), [resent, setResent] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const remaining = Math.max(0, Math.ceil((auth.state.retryAt - now) / 1000));
  async function submit(e: FormEvent) {
    e.preventDefault();
    const result = await auth.send({ action: 'verify', code });
    setCode('');
    if (result.state) router.push('/signup/complete-profile');
  }
  if (!auth.state.identity) return <><h1 className="mb-5 text-2xl font-bold">{c.session}</h1><Link className="text-link" href="/signup">{c.signupLink}</Link></>;
  if (auth.state.stage !== 'verify') return <><h1 className="mb-5 text-2xl font-bold">{c.profile}</h1><Link className="text-link" href="/signup/complete-profile">{c.next}</Link></>;
  return <>
    <h1 className="mb-3 text-3xl font-black">{auth.state.identity.method === 'phone' ? c.phoneVerify : c.emailVerify}</h1>
    <p className="mb-3 text-sm">{auth.state.identity.email || auth.state.identity.phone}</p>
    <p id="demo-code-hint" className="mb-6 text-sm text-body">{c.codeHint}</p>
    <form onSubmit={submit} noValidate className="space-y-5">
      <AuthField id="code" label={c.codeLabel} autoComplete="one-time-code" inputMode="numeric" maxLength={6} value={code} disabled={auth.busy} onChange={e => { setCode(e.target.value); auth.clearFeedback(); }} />
      <Button className="w-full" type="submit" disabled={auth.busy}>{auth.busy ? c.loading : c.verify}</Button>
    </form>
    <div className="my-4"><Button variant="ink" disabled={auth.busy || remaining > 0} onClick={async () => { const r = await auth.send({ action: 'resend' }); if (r.state) { setResent(true); setCode(''); } }}>{c.resend}</Button>{remaining > 0 && <p className="mt-3 text-sm" role="timer">{c.resendWait} {remaining}s</p>}{resent && <p role="status" className="mt-3 text-sm">{c.resent}</p>}</div>
    <Link className="text-link" href={`/signup/${auth.state.identity.method === 'phone' ? 'phone' : 'email'}`} onClick={auth.clearFeedback}>{c.back}</Link>
  </>;
}
