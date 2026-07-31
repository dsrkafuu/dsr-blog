import { describe, expect, test } from 'bun:test';

import { renderToStaticMarkup } from 'react-dom/server';

import Search from '@/components/Search';
import { SakanaShowButton } from '@/components/SideInfo/SakanaBtn';

describe('interactive control semantics', () => {
  test('renders search as a named form with native controls', () => {
    const html = renderToStaticMarkup(<Search />);

    expect(html).toContain('<form class="card search" role="search"');
    expect(html).toContain('type="search"');
    expect(html).toContain('name="q"');
    expect(html).toContain('aria-label="搜索文章"');
    expect(html).toContain('<button type="submit"');
    expect(html).not.toContain('<label');
  });

  test('renders the Sakana action as a native button', () => {
    const html = renderToStaticMarkup(<SakanaShowButton onClick={() => {}} />);

    expect(html).toContain('<button type="button" class="sakanawbtn">显示小组件</button>');
  });
});
