# KOBU-Project 公式サイト

https://www.kobu.kagawa.jp のソースです。[Astro](https://astro.build) で作り、GitHub Pages で公開しています。

## よく触る場所

| やりたいこと | 編集するファイル |
|---|---|
| 屋号・代表名・メール・SNSのURL | `src/data/site.ts` |
| アプリの追加・説明・ステータス・ストアURL | `src/data/apps.ts` |
| アプリのアイコン・スクショ | `public/` に置き、`apps.ts` の `icon` / `screenshots` にパスを書く |
| ページの文章 | `src/pages/` 以下の各ページ |

## 手元で確認する

```bash
npm install
npm run dev
```

http://localhost:4321 で確認できます。

## 公開のしくみ

`main` に取り込まれると、GitHub Actions（`.github/workflows/deploy.yml`）が自動でビルドして公開します。

### 初回だけ必要な設定

1. GitHub のリポジトリで **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に変更する
2. 同じ画面の **Custom domain** が `www.kobu.kagawa.jp` になっていることを確認する

> Source を切り替える前に `main` に取り込むと、公開中のサイトが表示されなくなります。必ず先に切り替えてください。

## お問い合わせフォーム

フォームの送信先は Cloudflare Worker（`worker/contact/`）です。届いた内容は Resend 経由で Gmail に転送されます。
Worker の準備ができるまでは、フォームの代わりにメールアドレスが表示されます。

### 設定手順

1. **Turnstile**：Cloudflare ダッシュボード → Turnstile でサイトを追加（ドメイン `www.kobu.kagawa.jp`）し、サイトキーとシークレットキーを控える
2. **Resend**：https://resend.com に登録し、`kobu.kagawa.jp` を送信ドメインとして追加（表示される DNS レコードをドメインに設定）。API キーを発行する
3. **Worker をデプロイ**

   ```bash
   cd worker/contact
   npm install
   npx wrangler login
   npx wrangler secret put TURNSTILE_SECRET
   npx wrangler secret put RESEND_API_KEY
   npx wrangler deploy
   ```

   送信元アドレスや受け取り先は `worker/contact/wrangler.toml` の `[vars]` で変えられます。

4. **サイトに設定**：GitHub の **Settings → Secrets and variables → Actions → Variables** に次の2つを登録し、Actions を再実行する
   - `PUBLIC_CONTACT_ENDPOINT`：デプロイした Worker の URL
   - `PUBLIC_TURNSTILE_SITE_KEY`：Turnstile のサイトキー

Worker のテストは `cd worker/contact && npm test` で実行できます。
