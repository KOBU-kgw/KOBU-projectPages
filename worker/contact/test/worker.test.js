import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { validate, buildMail } from '../src/index.js';

const ORIGIN = 'https://www.kobu.kagawa.jp';
const env = {
  ALLOWED_ORIGINS: ORIGIN,
  MAIL_TO: 'to@example.com',
  MAIL_FROM: 'from@example.com',
  TURNSTILE_SECRET: 'secret',
  RESEND_API_KEY: 'key',
};

function makeForm(over = {}) {
  const f = new FormData();
  const base = {
    type: 'automation', name: '山田', email: 'a@example.com',
    message: '相談です', agree: 'on', 'cf-turnstile-response': 'tok', ...over,
  };
  for (const [k, v] of Object.entries(base)) f.append(k, v);
  return f;
}

function req(form, origin = ORIGIN) {
  return new Request('https://worker.example/', { method: 'POST', body: form, headers: { Origin: origin } });
}

function mockFetch({ human = true, mailOk = true } = {}) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('turnstile')) return Response.json({ success: human });
    return new Response('{}', { status: mailOk ? 200 : 500 });
  };
  return calls;
}

test('正常に送信できる', async () => {
  const calls = mockFetch();
  const res = await worker.fetch(req(makeForm()), env);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  const mail = JSON.parse(calls[1].init.body);
  assert.equal(mail.to[0], 'to@example.com');
  assert.equal(mail.reply_to, 'a@example.com');
  assert.match(mail.subject, /業務自動化/);
});

test('許可していない送信元は拒否', async () => {
  mockFetch();
  const res = await worker.fetch(req(makeForm(), 'https://evil.example'), env);
  assert.equal(res.status, 403);
});

test('Turnstile に失敗したら拒否', async () => {
  const calls = mockFetch({ human: false });
  const res = await worker.fetch(req(makeForm()), env);
  assert.equal(res.status, 400);
  assert.equal(calls.length, 1);
});

test('隠し欄に入力があればメールを送らず成功扱い', async () => {
  const calls = mockFetch();
  const res = await worker.fetch(req(makeForm({ website: 'spam' })), env);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('メール送信失敗は 502', async () => {
  mockFetch({ mailOk: false });
  const res = await worker.fetch(req(makeForm()), env);
  assert.equal(res.status, 502);
});

test('入力チェック', () => {
  assert.ok(validate(makeForm()).data);
  assert.ok(validate(makeForm({ type: 'x' })).error);
  assert.ok(validate(makeForm({ email: 'bad' })).error);
  assert.ok(validate(makeForm({ agree: '' })).error);
  assert.ok(validate(makeForm({ name: 'a\nBcc: x' })).error);
  assert.ok(validate(makeForm({ message: 'あ'.repeat(5001) })).error);
});

test('メール本文に未入力欄が表示される', () => {
  const { text } = buildMail(validate(makeForm()).data);
  assert.match(text, /会社名：（未入力）/);
});
