// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.kobu.kagawa.jp',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
