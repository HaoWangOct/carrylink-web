import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth/provider';
import { AuthFrame } from '@/components/auth/frame';
export const metadata: Metadata = { title: 'CarryLink — Account', robots: { index: false, follow: false } };
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AuthFrame>{children}</AuthFrame></AuthProvider>;
}
