// UI contracts only. Provider credentials and session tokens never belong here.
export type AuthMethod = 'email' | 'phone' | 'google';
export interface AuthIdentity {
  subject: string;
  provider: 'demo';
  method: AuthMethod;
  email: string;
  phone: string;
  demoVerified: boolean;
}
export interface PrivateProfile {
  authUserId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
export type ProfileInput = Omit<PrivateProfile, 'authUserId' | 'createdAt' | 'updatedAt'>;
export interface AuthView {
  stage: 'anonymous' | 'verify' | 'profile' | 'complete';
  identity: AuthIdentity | null;
  profile: PrivateProfile | null;
  retryAt: number;
  expiresAt: number;
}
export const anonymousView: AuthView = { stage: 'anonymous', identity: null, profile: null, retryAt: 0, expiresAt: 0 };
export type ErrorCode = 'invalid' | 'mismatch' | 'code' | 'expired' | 'wait' | 'unavailable' | 'session' | 'failed';
export interface AuthResult { state?: AuthView; error?: ErrorCode; fields?: string[]; retryAt?: number }
export type AuthCommand =
  | { action: 'signup' | 'login'; method: 'email' | 'phone'; email: string; phone: string; password: string; confirm: string; otpLogin: boolean }
  | { action: 'verify'; code: string }
  | { action: 'profile'; profile: ProfileInput }
  | { action: 'resend' }
  | { action: 'google' }
  | { action: 'reset' };
