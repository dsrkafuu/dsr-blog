import type { Metadata, ResolvingMetadata } from 'next';
import { Fragment } from 'react';
import config from '@/config.json';
import MediumZoom from '@/components/MediumZoom';
import Giscus from '@/components/Giscus';
import Prism from '@/components/Prism';
import NotFound from '@/components/NotFound';
import PostCard from '@/components/PostCard';
import { getPostContent, getPostList } from '@/utils/assets';

interface PostPageProps {
  params: Promise<{
    year: string;
    post: string;
  }>;
}

export const generateMetadata = async (
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { year, post } = await params;
  const postPath = `/post/${year}/${post}`;
  const content = await getPostContent(postPath);
  const origin = await parent;

  if (!content) {
    return {};
  }
  return {
    title: `${content.title} | ${config.siteName}`,
    description: content.description || config.desc,
    keywords: content.keywords || [],
    openGraph: {
      ...origin.openGraph,
      title: `${content.title} | ${config.siteName}`,
      description: content.description || config.desc,
      url: `${postPath}/`,
    },
  };
};

// 写文章用，即时刷新
// export const revalidate = 0;

// 预构建所有博客文章
export const generateStaticParams = async () => {
  const { list = [] } = await getPostList();
  return list.map((post) => {
    return { ...post.params };
  });
};

const PostPage = async ({ params }: PostPageProps) => {
  const { year, post } = await params;
  const postPath = `/post/${year}/${post}`;
  const content = await getPostContent(postPath);

  if (!content) {
    return <NotFound />;
  }
  return (
    <Fragment>
      <PostCard mode='post' {...content}>
        <article
          className='markdown'
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      </PostCard>
      <Giscus />
      <MediumZoom />
      <Prism />
    </Fragment>
  );
};

export default PostPage;
