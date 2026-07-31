import { describe, expect, test } from 'bun:test';

import { marked } from 'marked';

import { renderMarkdown } from '@/utils/assets';

describe('Markdown renderer isolation', () => {
  test('does not mutate the package-level Marked renderer', async () => {
    const source = '[external](https://example.com)';
    const defaultHtml = await marked.parse(source);

    const { html } = await renderMarkdown(source, '/post/2026/example');

    expect(html).toContain('target="_blank" rel="noreferrer"');
    expect(await marked.parse(source)).toBe(defaultHtml);
  });

  test('keeps headings local to concurrent renders', async () => {
    const [first, second] = await Promise.all([
      renderMarkdown('# Alpha', '/post/2026/alpha'),
      renderMarkdown('## Beta', '/post/2026/beta'),
    ]);

    expect(first.toc).toContain('href="#alpha"');
    expect(first.toc).not.toContain('href="#beta"');
    expect(second.toc).toContain('href="#beta"');
    expect(second.toc).not.toContain('href="#alpha"');
  });
});
