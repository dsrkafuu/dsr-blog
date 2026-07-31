import { describe, expect, test } from 'bun:test';

import { renderToStaticMarkup } from 'react-dom/server';

import Footer from '@/components/Footer';
import config from '@/config.json';
import packageInfo from '@/package.json';

describe('footer metadata', () => {
  test('uses the canonical author and package metadata', () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain(`href="${config.authorLink}"`);
    expect(html).toContain(`>${config.siteName}</a>`);
    expect(html).toContain(` v${packageInfo.version} | ${packageInfo.license}`);
    expect(html).not.toContain('{{ .Site.Data.meta.author_link }}');
    expect(html).not.toContain('v9.0.0');
  });
});
