import type { AuthCommand, ErrorCode, ProfileInput } from './contracts';
export const demoPasswordMin = 8;
const emailValid = (v: string) => v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneValid = (v: string) => /^\+[1-9]\d{6,14}$/.test(v);
function record(v: unknown): v is Record<string, unknown> { return !!v && typeof v === 'object' && !Array.isArray(v); }
const str = (v: unknown) => typeof v === 'string' ? v : '';
export function validateCommand(input: unknown): { command: AuthCommand } | { error: ErrorCode; fields: string[] } {
  if (!record(input)) return { error: 'invalid', fields: [] };
  const action = input.action;
  if (action === 'resend' || action === 'google' || action === 'reset') return { command: { action } };
  if (action === 'verify') {
    const code = str(input.code).trim();
    return /^\d{6}$/.test(code) ? { command: { action, code } } : { error: 'code', fields: ['code'] };
  }
  if (action === 'signup' || action === 'login') {
    const method = input.method;
    if (method !== 'email' && method !== 'phone') return { error: 'invalid', fields: ['method'] };
    const email = str(input.email).trim(), phone = str(input.phone).replace(/[\s()-]/g, '');
    const password = str(input.password), confirm = str(input.confirm);
    const otpLogin = action === 'login' && method === 'phone' && input.otpLogin === true;
    const fields: string[] = [];
    if (method === 'email' ? !emailValid(email) : !phoneValid(phone)) fields.push(method);
    if (!otpLogin && (password.length < demoPasswordMin || password.length > 128)) fields.push('password');
    if (fields.length) return { error: 'invalid', fields };
    if (action === 'signup' && password !== confirm) return { error: 'mismatch', fields: ['confirm'] };
    return { command: { action, method, email: method === 'email' ? email : '', phone: method === 'phone' ? phone : '', password, confirm, otpLogin } };
  }
  if (action === 'profile' && record(input.profile)) {
    const p = input.profile;
    const profile = Object.fromEntries(['firstName','lastName','dateOfBirth','country','city','address','email','phone'].map(k => [k, str(p[k]).trim()])) as unknown as ProfileInput;
    const fields = ['firstName','lastName','city','address'].filter(k => !str(p[k]).trim() || str(p[k]).length > (k === 'address' ? 300 : 100));
    const date = profile.dateOfBirth;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date || date >= new Date().toISOString().slice(0,10)) fields.push('dateOfBirth');
    if (!['DE','CN'].includes(profile.country)) fields.push('country');
    if (!emailValid(profile.email)) fields.push('email');
    if (profile.phone && !phoneValid(profile.phone)) fields.push('phone');
    return fields.length ? { error: 'invalid', fields } : { command: { action, profile } };
  }
  return { error: 'invalid', fields: [] };
}
