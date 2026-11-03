// お知らせ・ロードマップ。新しいお知らせは news の先頭に足してください。

export interface NewsItem {
  date: string; // YYYY-MM-DD
  category: 'お知らせ' | 'アプリ' | 'イベント';
  title: string;
  body?: string;
  link?: { href: string; label: string };
}

export const news: NewsItem[] = [
  {
    date: '2026-11-03',
    category: 'お知らせ',
    title: '公式サイトをリニューアルしました',
    body: 'アプリごとの紹介ページ、OIKOMIのサポート・プライバシーポリシー・利用規約、お問い合わせページなどを追加しました。',
  },
  {
    date: '2026-11-03',
    category: 'アプリ',
    title: '楽単ナビの紹介ページを公開しました',
    link: { href: '/apps/rakutan/', label: '楽単ナビを見る' },
  },
  {
    date: '2026-11-03',
    category: 'アプリ',
    title: 'OIKOMIのサポート情報を公式サイトに移転しました',
    body: '旧ページ（kobu-kgw.github.io/OIKOMIapp/）からは自動で新しいページに移動します。',
    link: { href: '/apps/oikomi/support/', label: 'OIKOMI サポート' },
  },
  {
    date: '2026-07-02',
    category: 'イベント',
    title: 'IVS2026（京都）に参加しました',
  },
  {
    date: '2026-07-01',
    category: 'お知らせ',
    title: 'KOBU-Projectを開業しました',
  },
];

export interface RoadmapItem {
  when: string;
  title: string;
  status: 'done' | 'next' | 'later';
}

// 日付は確定するまで「近日」「準備中」のようにぼかして書く
export const roadmap: RoadmapItem[] = [
  { when: '公開中', title: 'OIKOMI iOS版', status: 'done' },
  { when: '公開中', title: '楽単ナビ（Web）', status: 'done' },
  { when: '近日', title: 'OIKOMI Android版の公開', status: 'next' },
  { when: '準備中', title: 'KobuLinkの再設計', status: 'later' },
  { when: '準備中', title: 'うどんカードの開発', status: 'later' },
];
