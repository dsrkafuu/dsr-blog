import type { MetadataRoute } from 'next';
import config from '@/config.json';
import { getPostList } from '@/utils/assets';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const now = new Date();
  const base = `https://${config.domain}`;
  const { list = [], totalPages = 0 } = await getPostList();

  const postMapList: MetadataRoute.Sitemap = [];
  for (let i = 0; i < list.length; i++) {
    const { params, date } = list[i];
    postMapList.push({
      url: `${base}/post/${params.year}/${params.post}/`,
      lastModified: date,
    });
  }
  const latestPost = postMapList[0];

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
      lastModified: latestPost?.lastModified || now,
    },
    ...new Array(totalPages).fill(1).map((_, i) => {
      return {
        url: `${base}/post/${i + 1}/`,
        lastModified: latestPost?.lastModified || now,
      };
    }),
    // 文章
    ...(postMapList || []),
  ];
};

export default sitemap;
