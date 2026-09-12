import { NextRequest, NextResponse } from 'next/server';
import { validateCommand } from '@/auth/validation';
import { getAuthAdapter } from '@/server/auth/adapter';
import type { AuthResult } from '@/auth/contracts';
export const runtime = 'nodejs';
const COOKIE = 'carrylink_demo_onboarding';
const headers = { 'Cache-Control': 'no-store, max-age=0', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' };
function response(body: AuthResult, status = 200) { return NextResponse.json(body, { status, headers }); }
function localOrigin(request: NextRequest) {
  // NextURL normalizes loopback addresses; compare the browser's actual Host.
  // Reject public hosts and do not trust forwarded host headers for this demo.
  const host = request.headers.get('host') || '';
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/.test(host)) return null;
  try { return new URL(`${new URL(request.url).protocol}//${host}`).origin; }
  catch { return null; }
}
function adapterFor(request: NextRequest) {
  // The mock endpoint must not operate on a publicly hosted hostname.
  const host = new URL(request.url).hostname;
  return localOrigin(request) && ['localhost','127.0.0.1','[::1]'].includes(host) ? getAuthAdapter() : null;
}
export async function GET(request: NextRequest) {
  const adapter = adapterFor(request);
  if (!adapter) return response({ error: 'unavailable' }, 503);
  return response({ state: adapter.read(request.cookies.get(COOKIE)?.value) });
}
export async function POST(request: NextRequest) {
  const adapter = adapterFor(request);
  if (!adapter) return response({ error: 'unavailable' }, 503);
  if (request.headers.get('origin') !== localOrigin(request) || !request.headers.get('content-type')?.startsWith('application/json')) return response({ error: 'failed' }, 403);
  try {
    const reader = request.body?.getReader();
    if (!reader) return response({ error: 'invalid' }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 8192) { await reader.cancel(); return response({ error: 'invalid' }, 413); }
      chunks.push(value);
    }
    const validated = validateCommand(JSON.parse(Buffer.concat(chunks).toString('utf8')));
    if ('error' in validated) return response(validated, 400);
    const output = adapter.execute(validated.command, request.cookies.get(COOKIE)?.value);
    const result = response(output.result, output.status);
    if (output.sessionId || output.clearCookie) result.cookies.set(COOKIE, output.sessionId || '', {
      httpOnly: true, sameSite: 'strict', secure: new URL(request.url).protocol === 'https:',
      path: '/api/auth/demo', maxAge: output.clearCookie ? 0 : 1800,
    });
    return result;
  } catch {
    // Never return parser/provider details or log credentials/verification inputs.
    return response({ error: 'failed' }, 400);
  }
}
