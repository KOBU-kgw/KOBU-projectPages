// お問い合わせフォームの受付 Worker
// 1. 送信元（Origin）を確認
// 2. Turnstile で人間の送信か確認
// 3. 入力を検証して、Resend 経由で Gmail に転送

const TYPES = {
  'app-dev': 'アプリ開発のご相談',
  automation: '業務自動化のご相談',
  'app-support': 'アプリについて（不具合・ご要望）',
  other: 'その他',
};

const LIMITS = { company: 100, name: 100, email: 254, phone: 30, message: 5000 };

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const cors = allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
      : {};

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Max-Age': '86400' },
      });
    }
    if (request.method !== 'POST') return json({ ok: false, error: '許可されていない操作です。' }, 405, cors);
    if (!allowed.includes(origin)) return json({ ok: false, error: '許可されていない送信元です。' }, 403, cors);

    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ ok: false, error: '送信内容を読み取れませんでした。' }, 400, cors);
    }

    // 人には見えない入力欄に値がある＝ロボット。成功したふりをして捨てる。
    if (str(form.get('website'))) return json({ ok: true }, 200, cors);

    const human = await verifyTurnstile(
      str(form.get('cf-turnstile-response')),
      request.headers.get('CF-Connecting-IP'),
      env.TURNSTILE_SECRET,
    );
    if (!human) return json({ ok: false, error: 'ロボットではないことの確認に失敗しました。' }, 400, cors);

    const result = validate(form);
    if (result.error) return json({ ok: false, error: result.error }, 400, cors);

    const sent = await sendMail(result.data, env);
    if (!sent) return json({ ok: false, error: 'メールの送信に失敗しました。' }, 502, cors);

    return json({ ok: true }, 200, cors);
  },
};

export function validate(form) {
  const data = {
    type: str(form.get('type')),
    company: str(form.get('company')),
    name: str(form.get('name')),
    email: str(form.get('email')),
    phone: str(form.get('phone')),
    message: str(form.get('message')),
    agree: str(form.get('agree')),
  };
  if (!TYPES[data.type]) return { error: 'ご相談の種類を選んでください。' };
  if (!data.name) return { error: 'お名前を入力してください。' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: 'メールアドレスの形式が正しくありません。' };
  if (!data.message) return { error: 'ご相談内容を入力してください。' };
  if (!data.agree) return { error: 'プライバシーポリシーへの同意が必要です。' };
  for (const [key, max] of Object.entries(LIMITS)) {
    if (data[key].length > max) return { error: `入力が長すぎます（${max}文字まで）。` };
  }
  // メールのヘッダーに改行が入り込まないようにする
  if (/[\r\n]/.test(data.name + data.email + data.company + data.phone)) {
    return { error: '入力に使えない文字が含まれています。' };
  }
  return { data };
}

async function verifyTurnstile(token, ip, secret) {
  if (!token || !secret) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out = await res.json();
    return out.success === true;
  } catch {
    return false;
  }
}

export function buildMail(d) {
  const typeLabel = TYPES[d.type];
  const text = [
    `種類：${typeLabel}`,
    `会社名：${d.company || '（未入力）'}`,
    `お名前：${d.name}`,
    `メール：${d.email}`,
    `電話：${d.phone || '（未入力）'}`,
    '',
    '--- ご相談内容 ---',
    d.message,
  ].join('\n');
  return {
    subject: `[KOBUサイト] ${typeLabel}｜${d.name} 様`,
    text,
  };
}

async function sendMail(d, env) {
  const mail = buildMail(d);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [env.MAIL_TO],
        reply_to: d.email,
        subject: mail.subject,
        text: mail.text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}
