// アプリ一覧のデータ。トップとアプリ一覧ページの両方がここを読みます。
// 画像（icon / screenshots）は public/ 以下に置き、パスを書き込むと表示されます。

export type StatusKind = 'public' | 'soon' | 'members' | 'tester' | 'dev';

export interface AppStatus {
  kind: StatusKind;
  label: string;
}

export interface AppStoreLinks {
  appStore?: string;
  googlePlay?: string;
  web?: string;
}

export interface App {
  slug: string;
  name: string;
  summary: string;
  description: string;
  statuses: AppStatus[];
  platforms: string[];
  stack: string[];
  links: AppStoreLinks;
  detailPage?: string;
  privacyPage?: string;
  icon?: string;
  screenshots?: string[];
  note?: string;
  featured?: boolean;
}

export const apps: App[] = [
  {
    slug: 'oikomi',
    name: 'OIKOMI',
    summary: '課題を「心理的なヤバさ」順に並べる、大学生のための課題管理アプリ',
    description:
      '「あと3日あるし…」その油断が、あなたを徹夜地獄へ。所要時間と「やりたくなさ」から課題の本当のヤバさを計算し、「まだ平和」から「戦争」までの5段階で知らせます。完全無料・アカウント不要。',
    statuses: [
      { kind: 'public', label: '公開中（iOS）' },
      { kind: 'soon', label: 'Android 近日公開' },
    ],
    platforms: ['iOS', 'Android'],
    stack: ['Flutter', 'iOS', 'Android'],
    links: {
      appStore: 'https://apps.apple.com/jp/app/oikomi/id6761453387',
      googlePlay: '',
    },
    detailPage: '/apps/oikomi/',
    privacyPage: '/apps/oikomi/privacy/',
    icon: '/apps/oikomi/icon.webp',
    // TODO: スクリーンショットを public/apps/oikomi/ に置いたらパスを追加
    screenshots: [],
    featured: true,
  },
  {
    slug: 'rakutan',
    name: '楽単ナビ',
    summary: '香川大学のシラバスと学生レビューを統合した履修検索サイト（非公式）',
    description:
      '空きコマをタップすると、そのコマの授業が単位の取りやすさ順に並びます。シラバスは自動で集め、学生の匿名レビューと合わせて検索できます。',
    statuses: [{ kind: 'public', label: '公開中（Web）' }],
    platforms: ['Web'],
    stack: ['Web', 'LINE連携'],
    links: { web: 'https://rakutan.kobu.kagawa.jp' },
    detailPage: '/apps/rakutan/',
    screenshots: ['/apps/rakutan/akikoma.webp', '/apps/rakutan/list.webp'],
    note: '香大生が作った非公式サイトです。香川大学とは関係ありません。',
    featured: true,
  },
  {
    slug: 'gakushoku',
    // TODO: 正式なアプリ名・URL・公開状況を確認する
    name: '学食メニュー提案アプリ',
    summary: '学食のメニュー選びを手助けするLINEアプリ',
    description: 'LINEから開いて、その日の学食メニューを提案します。',
    statuses: [{ kind: 'public', label: '公開中（LINE）' }],
    platforms: ['Web', 'LINE'],
    stack: ['React', 'Cloudflare Pages', 'LINE LIFF'],
    links: { web: '' },
  },
  {
    slug: 'kobulink',
    name: 'KobuLink',
    summary: '香川大学起業部のためのコミュニティSNS',
    description:
      '香川大学起業部専用のコミュニティSNS。タイムライン・通知機能を搭載し、部内のつながりを活性化します。現在、部員が本当に必要とする形へ再設計しています。',
    statuses: [
      { kind: 'members', label: 'メンバー限定（TestFlight配布）' },
      { kind: 'dev', label: '再設計中' },
    ],
    platforms: ['iOS'],
    stack: ['SwiftUI', 'Firebase', 'Cloud Functions'],
    links: {},
  },
  {
    slug: 'udon-card',
    name: 'うどんカード',
    summary: '香川のうどん屋をトレカにして集める訪問記録アプリ',
    description:
      '訪れたうどん屋がトレーディングカードになり、訪問回数に応じてレアリティが5段階で進化します。',
    statuses: [{ kind: 'dev', label: '開発中' }],
    platforms: ['Web'],
    stack: ['Flutter Web', 'Firebase'],
    links: {},
  },
];

export const featuredApps = apps.filter((a) => a.featured);

// トップの数字バッジ用。「公開中」ステータスを持つアプリだけを数えます。
export const publicAppCount = apps.filter((a) =>
  a.statuses.some((s) => s.kind === 'public'),
).length;
