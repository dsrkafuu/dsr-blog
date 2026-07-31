import { describe, expect, test } from 'bun:test';

import PostPage from '@/app/post/[year]/[post]/page';
import { getPostContent } from '@/utils/assets';

const missingPostPath = '/post/2099/missing';
const missingPostParams = Promise.resolve({
  year: '2099',
  post: 'missing',
});

describe('missing posts', () => {
  test('return null from the content layer', async () => {
    expect(getPostContent(missingPostPath)).resolves.toBeNull();
  });

  test('trigger the Next.js not-found response', async () => {
    expect(PostPage({ params: missingPostParams })).rejects.toMatchObject({
      digest: 'NEXT_HTTP_ERROR_FALLBACK;404',
    });
  });
});
