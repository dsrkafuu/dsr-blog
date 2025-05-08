import type { MetadataRoute } from 'next';
import config from '@/config.json';
import { getPostList } from '@/utils/assets';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date();
  const base = `https://${config.domain}`;
  const { list = [], totalPages = 0 } = await getPostList();

  return [
    // 首页
    {
      url: `${base}/`,
      lastModified: now,
    },
    // 列表页
    {
      url: `${base}/friends/`,
      lastModified: now,
    },
    {
      url: `${base}/post/`,
      lastModified: now,
    },
    ...new Array(totalPages).fill(1).map((_, i) => {
      return {
        url: `${base}/post/${i + 1}/`,
        lastModified: now,
      };
    }),
    // 文章
    ...list.map((post) => {
      return {
        url: `${base}/post/${post.params.year}/${post.params.post}/`,
        lastModified: now,
      };
    }),
  ];
};

export default sitemap;
