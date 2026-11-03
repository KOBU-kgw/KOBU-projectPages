// サイト全体で使う運営者情報。表記を変えるときはここだけ直せば全ページに反映されます。

export const site = {
  name: 'KOBU-Project',
  shortName: 'KOBU',
  url: 'https://www.kobu.kagawa.jp',
  tagline: 'アイデアを、動くプロダクトに。',
  subcopy: '香川から、アプリと業務自動化で「困りごと」を形にします。',
  description:
    '香川を拠点に、iOS・Android・Webアプリの開発と、AIを使った業務自動化を行うKOBU-Projectの公式サイトです。',
  representative: 'あっきー',
  foundedAt: '2026-07-01',
  foundedLabel: '2026年7月1日',
  region: '香川県',
  email: 'kobu.project.kgw@gmail.com',
  // 公開してよいURLだけ入れてください。空のものは表示されません。
  social: {
    github: '',
    x: '',
    line: '',
  },
};

// お問い合わせの種類。フォームの選択肢と、各ページからのリンク（?type=）で共通に使います。
export const inquiryTypes = [
  { value: 'app-dev', label: 'アプリ開発のご相談' },
  { value: 'automation', label: '業務自動化のご相談' },
  { value: 'app-support', label: 'アプリについて（不具合・ご要望）' },
  { value: 'other', label: 'その他' },
] as const;

export type InquiryType = (typeof inquiryTypes)[number]['value'];
