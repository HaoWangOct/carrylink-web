'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { anonymousView, type AuthCommand, type AuthResult, type AuthView, type ProfileInput } from '@/auth/contracts';
import { validateCommand } from '@/auth/validation';
const blankProfile: ProfileInput = { firstName: '', lastName: '', dateOfBirth: '', country: 'DE', city: '', address: '', email: '', phone: '' };
function useOnboarding() {
  const [state, setState] = useState<AuthView>(anonymousView);
  const [ready, setReady] = useState(false), [disabled, setDisabled] = useState(false), [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<AuthResult>({});
  const [credentials, setCredentials] = useState({ email: '', dial: '+49', number: '', password: '', confirm: '' });
  const [profile, setProfile] = useState<ProfileInput>(blankProfile);
  const active = useRef(false);
  const subject = useRef<string | null>(null);
  const apply = useCallback((next: AuthView) => {
    setState(next);
    if (next.profile) setProfile(next.profile);
    else if (next.identity) {
      const changed = subject.current !== next.identity.subject;
      setProfile(p => ({ ...(changed ? blankProfile : p), email: next.identity!.email || (changed ? '' : p.email), phone: next.identity!.phone || (changed ? '' : p.phone) }));
    }
    subject.current = next.identity?.subject || null;
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/demo', { cache: 'no-store', signal: controller.signal }).then(r => r.json()).then((r: AuthResult) => {
      if (r.state) apply(r.state);
      setDisabled(r.error === 'unavailable');
      setFeedback(r.error ? r : {});
      setReady(true);
    }).catch(() => { if (!controller.signal.aborted) { setFeedback({ error: 'failed' }); setReady(true); } });
    return () => controller.abort();
  }, [apply]);
  async function send(command: AuthCommand): Promise<AuthResult> {
    if (active.current) return {};
    const checked = validateCommand(command);
    if ('error' in checked) { setFeedback(checked); return checked; }
    active.current = true;
    setBusy(true); setFeedback({});
    try {
      const response = await fetch('/api/auth/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(checked.command) });
      const result: AuthResult = await response.json();
      if (result.state) {
        apply(result.state);
        if (command.action === 'signup' || command.action === 'login' || command.action === 'google') setCredentials(p => ({ ...p, password: '', confirm: '' }));
        if (command.action === 'reset') { setCredentials({ email: '', dial: '+49', number: '', password: '', confirm: '' }); setProfile(blankProfile); }
      }
      if (result.retryAt) setState(p => ({ ...p, retryAt: result.retryAt! }));
      if (result.error === 'session') setState(anonymousView);
      setDisabled(result.error === 'unavailable');
      setFeedback(result.error ? result : {});
      return result;
    } catch { const result: AuthResult = { error: 'failed' }; setFeedback(result); return result; }
    finally { active.current = false; setBusy(false); }
  }
  return { state, ready, disabled, busy, feedback, credentials, setCredentials, profile, setProfile, send, clearFeedback: () => setFeedback({}) };
}
const Context = createContext<ReturnType<typeof useOnboarding> | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useOnboarding()}>{children}</Context.Provider>;
}
export function useAuth() { const value = useContext(Context); if (!value) throw new Error('Missing account provider'); return value; }
