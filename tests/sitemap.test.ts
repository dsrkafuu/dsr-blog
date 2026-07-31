import { describe, expect, test } from 'bun:test';

import sitemap from '@/app/sitemap';
import config from '@/config.json';
import { getPostList } from '@/utils/assets';

describe('sitemap pagination URLs', () => {
  test('uses the canonical post list routes', async () => {
    const entries = await sitemap();
    const { totalPages } = await getPostList();
    const base = `https://${config.domain}`;
    const urls = entries.map(({ url }) => url);

    expect(urls).toContain(`${base}/post/`);
    expect(urls).not.toContain(`${base}/post/page/1/`);

    for (let page = 1; page <= totalPages; page++) {
      expect(urls).not.toContain(`${base}/post/${page}/`);
    }

    for (let page = 2; page <= totalPages; page++) {
      expect(urls).toContain(`${base}/post/page/${page}/`);
    }
  });
});
