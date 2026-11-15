import 'server-only';
import { randomUUID } from 'node:crypto';
import { anonymousView, type AuthIdentity, type AuthView, type PrivateProfile } from '@/auth/contracts';
import type { AuthAdapter, AdapterResponse } from './adapter';
const SESSION_MS = 30 * 60_000;
const CODE_MS = 10 * 60_000;
const RESEND_MS = 60_000;
interface DemoSession { identity: AuthIdentity; expiresAt: number; retryAt: number; codeExpiresAt: number; attempts: number }
// Single-process demo records, not a password store or production session system.
const globalDemo = globalThis as typeof globalThis & { carrylinkAuthDemo?: { sessions: Map<string, DemoSession>; profiles: Map<string, PrivateProfile> } };
const store = globalDemo.carrylinkAuthDemo ??= { sessions: new Map(), profiles: new Map() };
function remove(id: string) {
  const session = store.sessions.get(id);
  if (session) store.profiles.delete(session.identity.subject);
  store.sessions.delete(id);
}
function cleanup() {
  for (const [id, session] of store.sessions) if (session.expiresAt <= Date.now()) remove(id);
}
// Delete expired private demo data even when no further requests arrive.
const timer = setInterval(cleanup, 60_000);
timer.unref();
function view(session?: DemoSession): AuthView {
  if (!session) return { ...anonymousView };
  const profile = session.identity.demoVerified ? store.profiles.get(session.identity.subject) ?? null : null;
  return { stage: !session.identity.demoVerified ? 'verify' : profile ? 'complete' : 'profile', identity: { ...session.identity }, profile: profile && { ...profile }, retryAt: session.retryAt, expiresAt: session.expiresAt };
}
const failure = (error: 'session' | 'code' | 'expired' | 'failed', status = 400): AdapterResponse => ({ result: { error }, status });
export const demoAdapter: AuthAdapter = {
  read(id) { cleanup(); return view(id ? store.sessions.get(id) : undefined); },
  execute(command, id) {
    cleanup();
    const session = id ? store.sessions.get(id) : undefined;
    if (command.action === 'reset') {
      if (id) remove(id);
      return { result: { state: { ...anonymousView } }, clearCookie: true };
    }
    if (command.action === 'signup' || command.action === 'login' || command.action === 'google') {
      const method = command.action === 'google' ? 'google' : command.method;
      const email = command.action === 'google' ? 'google@example.test' : command.email;
      const phone = command.action === 'google' ? '' : command.phone;
      // Same-session returning simulation. No account lookup or password comparison.
      if (command.action !== 'signup' && session?.identity.demoVerified && session.identity.method === method && session.identity.email === email && session.identity.phone === phone) {
        if (command.action === 'login' && command.otpLogin) {
          if (session.retryAt > Date.now()) return { result: { error: 'wait', retryAt: session.retryAt }, status: 429 };
          session.identity.demoVerified = false;
          session.retryAt = Date.now() + RESEND_MS;
          session.codeExpiresAt = Date.now() + CODE_MS;
          session.attempts = 0;
        }
        return { result: { state: view(session) } };
      }
      if (session && !session.identity.demoVerified && session.retryAt > Date.now()) {
        return { result: { error: 'wait', retryAt: session.retryAt }, status: 429 };
      }
      if (!session && store.sessions.size >= 500) return failure('failed', 503);
      if (id) remove(id);
      const sessionId = randomUUID();
      const now = Date.now();
      const next: DemoSession = {
        identity: { subject: `demo-${randomUUID()}`, provider: 'demo', method, email, phone, demoVerified: method === 'google' || (command.action === 'login' && !command.otpLogin) },
        expiresAt: now + SESSION_MS, retryAt: now + RESEND_MS, codeExpiresAt: now + CODE_MS, attempts: 0,
      };
      store.sessions.set(sessionId, next);
      return { result: { state: view(next) }, sessionId };
    }
    if (!session) return failure('session', 401);
    if (command.action === 'verify') {
      if (session.identity.demoVerified) return { result: { state: view(session) } };
      if (session.codeExpiresAt <= Date.now() || session.attempts >= 5) return failure('expired');
      session.attempts += 1;
      if (command.code !== '123456') return failure('code');
      session.identity.demoVerified = true;
      // Rotate the demo cookie on the verification boundary.
      const sessionId = randomUUID();
      store.sessions.delete(id!);
      store.sessions.set(sessionId, session);
      return { result: { state: view(session) }, sessionId };
    }
    if (command.action === 'resend') {
      if (session.identity.demoVerified) return { result: { state: view(session) } };
      if (session.retryAt > Date.now()) return { result: { error: 'wait', retryAt: session.retryAt }, status: 429 };
      session.retryAt = Date.now() + RESEND_MS;
      session.codeExpiresAt = Date.now() + CODE_MS;
      session.attempts = 0;
      return { result: { state: view(session) } };
    }
    if (command.action === 'profile') {
      if (!session.identity.demoVerified) return failure('session', 401);
      // Profile input cannot change the identity or its verified-contact projection.
      const old = store.profiles.get(session.identity.subject);
      const now = new Date().toISOString();
      store.profiles.set(session.identity.subject, {
        ...command.profile, authUserId: session.identity.subject,
        email: session.identity.email || command.profile.email,
        phone: session.identity.phone || command.profile.phone,
        createdAt: old?.createdAt || now, updatedAt: now,
      });
      return { result: { state: view(session) } };
    }
    return failure('failed');
  },
};
