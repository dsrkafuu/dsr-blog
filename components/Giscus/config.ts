import type { GiscusProps } from '@giscus/react';

export type GiscusConfig = Pick<GiscusProps, 'repo' | 'repoId'> &
  Required<Pick<GiscusProps, 'category' | 'categoryId'>>;

export type GiscusConfigInput = {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
};

const getValue = (override?: string, fallback?: string) =>
  override?.trim() || fallback?.trim() || null;

const isRepo = (value: string): value is GiscusProps['repo'] => {
  const [owner, repo, ...extra] = value.split('/');
  return Boolean(owner && repo && extra.length === 0);
};

export const resolveGiscusConfig = (
  overrides: GiscusConfigInput,
  environment: GiscusConfigInput,
): GiscusConfig | null => {
  const repo = getValue(overrides.repo, environment.repo);
  const repoId = getValue(overrides.repoId, environment.repoId);
  const category = getValue(overrides.category, environment.category);
  const categoryId = getValue(overrides.categoryId, environment.categoryId);

  if (!repo || !isRepo(repo) || !repoId || !category || !categoryId) {
    return null;
  }

  return { repo, repoId, category, categoryId };
};
