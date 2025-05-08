import './page.scss';
import { getPostContent } from '@/utils/assets';

interface PostTOCProps {
  params: Promise<{
    year: string;
    post: string;
  }>;
}

const PostTOC = async ({ params }: PostTOCProps) => {
  const { year, post } = await params;
  const postPath = `/post/${year}/${post}`;
  const content = await getPostContent(postPath);

  if (!content) {
    return null;
  }
  return (
    <div className='sticky'>
      {content.toc && (
        <div
          className='card toc__wrapper'
          dangerouslySetInnerHTML={{ __html: content.toc }}
        />
      )}
      <div className='card back-top'>
        <a href='#top'>返回顶部</a>
      </div>
    </div>
  );
};

export default PostTOC;
