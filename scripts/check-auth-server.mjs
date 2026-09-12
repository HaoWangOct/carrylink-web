import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
// Execute the actual server modules in isolation with a controlled clock.
// No test-only endpoint or clock override is added to application code.
let now = Date.parse('2026-09-12T12:00:00Z');
class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
const context = vm.createContext({ Date: Clock, Map, process: { env: { NODE_ENV: 'production' } }, setInterval: () => ({ unref() {} }) });
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} }; cache.set(file, loaded);
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const imported = name => {
    if (name === 'server-only') return {}; // Next enforces this marker in the app build.
    if (name === 'node:crypto') return require(name);
    if (name.startsWith('@/')) return load(`src/${name.slice(2)}.ts`);
    if (name.startsWith('./')) return load(`${file.slice(0,file.lastIndexOf('/'))}/${name.slice(2)}.ts`);
    throw new Error('Unexpected server dependency');
  };
  vm.runInContext(`(function(require,module,exports){${code}\n})`, context)(imported, loaded, loaded.exports);
  return loaded.exports;
}
const { validateCommand } = load('src/auth/validation.ts');
const { getAuthAdapter } = load('src/server/auth/adapter.ts');
assert.equal(getAuthAdapter(), null);
context.process.env.CARRYLINK_AUTH_MODE = 'supabase'; assert.equal(getAuthAdapter(), null);
context.process.env.CARRYLINK_AUTH_MODE = 'invalid'; assert.equal(getAuthAdapter(), null);
context.process.env.CARRYLINK_AUTH_MODE = 'demo'; const adapter = getAuthAdapter();
const signup = { action: 'signup', method: 'email', email: 'person@example.test', phone: '', password: 'FictionalPassword!', confirm: 'FictionalPassword!', otpLogin: false };
const command = v => { const r = validateCommand(v); assert.ok(r.command, 'valid command'); return r.command; };
assert.equal(validateCommand({ ...signup, confirm: 'different' }).error, 'mismatch');
assert.equal(validateCommand({ ...signup, password: 'x', confirm: 'x' }).error, 'invalid');
assert.equal(validateCommand({ ...signup, method: 'phone', phone: '+abc' }).error, 'invalid');
assert.equal(validateCommand({ action: 'verify', code: 'x' }).error, 'code');
const profile = { firstName: 'Fictional', lastName: 'Person', dateOfBirth: '1990-02-20', country: 'DE', city: 'Berlin', address: 'Example street', email: 'other@example.test', phone: '' };
assert.equal(validateCommand({ action: 'profile', profile: { ...profile, dateOfBirth: '2026-02-30' } }).error, 'invalid');
assert.equal(validateCommand({ action: 'profile', profile: { ...profile, dateOfBirth: '2099-01-01' } }).error, 'invalid');
assert.equal(validateCommand({ action: 'profile', profile: { ...profile, address: 'x'.repeat(301) } }).error, 'invalid');
let start = adapter.execute(command(signup)); let id = start.sessionId;
const subject = start.result.state.identity.subject;
assert.equal(start.result.state.stage, 'verify');
assert.equal(adapter.execute(command({ action: 'profile', profile }), id).status, 401);
assert.equal(adapter.execute({ action: 'resend' }, id).status, 429);
for (let i=0;i<5;i++) assert.equal(adapter.execute({ action: 'verify', code: '000000' }, id).result.error, 'code');
assert.equal(adapter.execute({ action: 'verify', code: '123456' }, id).result.error, 'expired');
now += 60_001;
assert.equal(adapter.execute({ action: 'resend' }, id).result.state.stage, 'verify');
now += 600_001;
assert.equal(adapter.execute({ action: 'verify', code: '123456' }, id).result.error, 'expired');
assert.ok(adapter.execute({ action: 'resend' }, id).result.state);
const verified = adapter.execute({ action: 'verify', code: '123456' }, id);
assert.notEqual(verified.sessionId, id); assert.equal(adapter.read(id).stage, 'anonymous'); id=verified.sessionId;
assert.equal(verified.result.state.stage, 'profile');
const saved = adapter.execute(command({ action: 'profile', profile: { ...profile, authUserId: 'attacker', demoVerified: true } }), id).result.state;
assert.equal(saved.profile.authUserId, subject); assert.equal(saved.profile.email, signup.email);
const second = adapter.execute({ action: 'google' });
assert.equal(second.result.state.profile, null);
assert.equal(adapter.read(second.sessionId).identity.method, 'google');
assert.equal(adapter.read('made-up').profile, null);
const phoneLogin = command({ ...signup, action: 'login', method: 'phone', phone: '+4915100000000' });
const phoneSession = adapter.execute(phoneLogin);
adapter.execute(command({ action: 'profile', profile }), phoneSession.sessionId);
now += 60_001;
const challenge = adapter.execute({ ...phoneLogin, otpLogin: true }, phoneSession.sessionId);
assert.equal(challenge.result.state.stage, 'verify');
assert.equal(challenge.result.state.profile, null);
assert.equal(adapter.read(phoneSession.sessionId).profile, null);
assert.equal(adapter.execute(command({ action: 'profile', profile }), phoneSession.sessionId).status, 401);
assert.equal(adapter.execute({ action: 'verify', code: '123456' }, phoneSession.sessionId).result.state.stage, 'complete');
const memory = JSON.stringify({ sessions: [...context.carrylinkAuthDemo.sessions.values()], profiles: [...context.carrylinkAuthDemo.profiles.values()] });
assert.equal(/password|confirm|"123456"|"000000"|FictionalPassword/.test(memory), false);
now += 1_800_001;
assert.equal(adapter.read(id).stage, 'anonymous'); assert.equal(context.carrylinkAuthDemo.profiles.size, 0);
assert.equal(adapter.execute({ action: 'verify', code: '123456' }, id).status, 401);
console.log('PASS: provider fail-closed selection, input validation, verification/profile guards, attempt limit, cooldown, code/session expiry, cookie rotation, isolated profiles and no retained passwords/codes.');
