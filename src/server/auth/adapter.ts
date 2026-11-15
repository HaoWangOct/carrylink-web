import 'server-only';
import type { AuthCommand, AuthResult, AuthView } from '@/auth/contracts';
import { demoAdapter } from './demo-adapter';
export interface AdapterResponse { result: AuthResult; sessionId?: string; clearCookie?: boolean; status?: number }
export interface AuthAdapter {
  read(sessionId?: string): AuthView;
  execute(command: AuthCommand, sessionId?: string): AdapterResponse;
}
export function authMode() {
  return process.env.CARRYLINK_AUTH_MODE ?? (process.env.NODE_ENV === 'development' ? 'demo' : 'disabled');
}
// No partial live implementation: credentials alone must never turn on sending.
export function getAuthAdapter(): AuthAdapter | null { return authMode() === 'demo' ? demoAdapter : null; }
