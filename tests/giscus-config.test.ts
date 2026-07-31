import { describe, expect, test } from 'bun:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Giscus from '@/components/Giscus';
import { resolveGiscusConfig } from '@/components/Giscus/config';

const requiredEnvironmentNames = [
  'NEXT_PUBLIC_GISCUS_REPO',
  'NEXT_PUBLIC_GISCUS_REPO_ID',
  'NEXT_PUBLIC_GISCUS_CATE',
  'NEXT_PUBLIC_GISCUS_CATE_ID',
] as const;

const completeEnvironment = {
  repo: 'dsrkafuu/dsr-blog',
  repoId: 'R_example',
  category: 'Comments',
  categoryId: 'DIC_example',
} as const;

describe('Giscus configuration', () => {
  test('returns a typed configuration when every required value is present', () => {
    expect(resolveGiscusConfig({}, completeEnvironment)).toEqual(completeEnvironment);
    expect(Giscus(completeEnvironment)).not.toBeNull();
  });

  test('trims values and lets explicit props override the environment', () => {
    expect(
      resolveGiscusConfig(
        {
          repo: ' owner/repo ',
          category: ' Posts ',
        },
        completeEnvironment,
      ),
    ).toEqual({
      ...completeEnvironment,
      repo: 'owner/repo',
      category: 'Posts',
    });
  });

  test('rejects missing or invalid required values', () => {
    expect(resolveGiscusConfig({}, {})).toBeNull();
    expect(resolveGiscusConfig({}, { ...completeEnvironment, categoryId: ' ' })).toBeNull();
    expect(resolveGiscusConfig({}, { ...completeEnvironment, repo: 'invalid-repo' })).toBeNull();
  });

  test('renders nothing when required environment values are missing', () => {
    const originalEnvironment = requiredEnvironmentNames.map(
      (name) => [name, process.env[name]] as const,
    );

    try {
      for (const name of requiredEnvironmentNames) {
        delete process.env[name];
      }

      expect(renderToStaticMarkup(createElement(Giscus))).toBe('');
    } finally {
      for (const [name, value] of originalEnvironment) {
        if (value === undefined) {
          delete process.env[name];
        } else {
          process.env[name] = value;
        }
      }
    }
  });
});
