'use client';
import { useState, type InputHTMLAttributes } from 'react';
import { useLanguage } from '../language-provider';
import { authCopy } from '@/content/auth-copy';
import { useAuth } from './provider';
export function AuthField({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string }) {
  const { feedback } = useAuth();
  const invalid = feedback.fields?.includes(props.id);
  return <div>
    <label className="field-label" htmlFor={props.id}>{label}</label>
    <input {...props} className="field aria-invalid:border-red-500" aria-invalid={invalid || undefined} aria-describedby={[hint ? `${props.id}-hint` : '', invalid ? 'auth-error' : ''].filter(Boolean).join(' ') || undefined} />
    {hint && <p id={`${props.id}-hint`} className="mt-2 text-xs leading-relaxed text-body">{hint}</p>}
  </div>;
}
export function PasswordField({ id, label, value, onChange, login = false }: { id: 'password' | 'confirm'; label: string; value: string; onChange: (v: string) => void; login?: boolean }) {
  const [show, setShow] = useState(false);
  const c = authCopy(useLanguage().lang);
  return <div className="space-y-2">
    <AuthField id={id} label={label} type={show ? 'text' : 'password'} autoComplete={login ? 'current-password' : 'new-password'} required value={value} maxLength={128} hint={id === 'password' ? c.passwordHint : undefined} onChange={e => onChange(e.target.value)} />
    <button type="button" className="text-link min-h-11" aria-label={`${show ? c.hide : c.show}: ${label}`} aria-pressed={show} onClick={() => setShow(v => !v)}>{show ? c.hide : c.show}</button>
  </div>;
}
