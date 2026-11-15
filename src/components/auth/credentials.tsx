'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { authCopy } from '@/content/auth-copy';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { useAuth } from './provider';
import { AuthField, PasswordField } from './fields';
export function Credentials({ method = 'email', login = false }: { method?: 'email' | 'phone'; login?: boolean }) {
  const auth = useAuth(), router = useRouter();
  const c = authCopy(useLanguage().lang);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [otpLogin, setOtpLogin] = useState(false);
  const selected = login ? loginMethod : method;
  const values = auth.credentials;
  const update = (change: Partial<typeof values>) => { auth.setCredentials(p => ({ ...p, ...change })); auth.clearFeedback(); };
  async function google() {
    const result = await auth.send({ action: 'google' });
    if (result.state) router.push('/signup/complete-profile');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await auth.send({ action: login ? 'login' : 'signup', method: selected, email: values.email, phone: values.dial + values.number, password: values.password, confirm: values.confirm, otpLogin });
    if (result.state) router.push(result.state.stage === 'verify' ? '/signup/verify' : '/signup/complete-profile');
  }
  return <>
    <h1 className="mb-6 text-3xl font-black tracking-tight">{login ? c.login : c.signup}</h1>
    <Button className="w-full" variant="ink" disabled={auth.busy} onClick={google}>{auth.busy ? c.loading : c.google}</Button>
    <p className="my-3 text-xs text-body">{c.googleDemo}</p>
    <div className="my-6 grid grid-cols-2 gap-2" role="group" aria-label={c.accountStep}>
      {(['email', 'phone'] as const).map(v => login ? <button key={v} type="button" className={`min-h-11 rounded-xl border border-line ${selected === v ? 'bg-peach font-bold' : ''}`} aria-pressed={selected === v} disabled={auth.busy} onClick={() => { setLoginMethod(v); auth.clearFeedback(); }}>{c[v]}</button> : <Link key={v} href={`/signup/${v}`} onClick={auth.clearFeedback} aria-current={selected === v ? 'page' : undefined} className={`rounded-xl border border-line px-4 py-3 text-center ${selected === v ? 'bg-peach font-bold' : ''}`}>{c[v]}</Link>)}
    </div>
    <form onSubmit={submit} noValidate>
      <fieldset disabled={auth.busy} className="space-y-4">
        {selected === 'email' ? <AuthField id="email" type="email" label={c.email} autoComplete="email" required value={values.email} onChange={e => update({ email: e.target.value })} /> : <>
          <div><label className="field-label" htmlFor="dial">{c.dialCode}</label><select id="dial" className="field" autoComplete="tel-country-code" value={values.dial} onChange={e => update({ dial: e.target.value })}><option value="+49">{c.germany} +49</option><option value="+86">{c.china} +86</option><option value="+44">United Kingdom +44</option><option value="+1">US / Canada +1</option></select></div>
          <AuthField id="phone" type="tel" label={c.number} hint={c.numberHint} autoComplete="tel-national" inputMode="tel" required value={values.number} onChange={e => update({ number: e.target.value })} />
          {login && <div className="flex flex-wrap gap-4">{[false, true].map(otp => <label key={String(otp)} className="flex min-h-11 items-center gap-2"><input type="radio" name="login-mode" checked={otpLogin === otp} onChange={() => { setOtpLogin(otp); auth.clearFeedback(); }} />{otp ? c.phoneOtp : c.phonePassword}</label>)}</div>}
        </>}
        {!(login && selected === 'phone' && otpLogin) && <PasswordField id="password" label={c.password} value={values.password} onChange={password => update({ password })} login={login} />}
        {!login && <PasswordField id="confirm" label={c.confirm} value={values.confirm} onChange={confirm => update({ confirm })} />}
        <Button type="submit" className="w-full" disabled={auth.busy}>{auth.busy ? c.loading : login ? c.login : c.next}</Button>
      </fieldset>
    </form>
    {auth.state.stage !== 'anonymous' && <Link className="text-link mt-5 block" href={auth.state.stage === 'verify' ? '/signup/verify' : '/signup/complete-profile'}>{c.next}</Link>}
    <Link className="text-link mt-6 block" href={login ? '/signup' : '/login'} onClick={auth.clearFeedback}>{login ? c.signupLink : c.loginLink}</Link>
  </>;
}
