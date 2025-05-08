import './page.scss';
import Link from 'next/link';
import clsx from 'clsx';
import PostCard from '@/components/PostCard';
import NotFound from '@/components/NotFound';
import {
  IChevronDoubleLeft,
  IChevronDoubleRight,
  IChevronLeft,
  IChevronRight,
} from '@/icons';
import { getPostList } from '@/utils/assets';

interface ListPageProps {
  params: Promise<{
    num: string;
  }>;
}

// 预构建所有博客列表
export const generateStaticParams = async () => {
  const { totalPages = 0 } = await getPostList();
  return new Array(totalPages).fill(1).map((_, i) => ({ num: `${i + 1}` }));
};

const ListPage = async ({ params }: ListPageProps) => {
  const { num = '1' } = await params;
  const data = await getPostList();
  const pageNum = +num;
  const slicedList = data.list.slice((pageNum - 1) * 10, pageNum * 10);

  const offsetLinks = 2;
  const maxLinks = offsetLinks * 2 + 1;
  const lowerLimit = offsetLinks + 1;
  const upperLimit = data.totalPages - offsetLinks;
  const hasPrev = pageNum > 1;
  const hasNext = pageNum < data.totalPages;

  const showedPageNums: number[] = [];
  for (let showPage = 1; showPage <= data.totalPages; showPage++) {
    let pageNumFlag = false;
    if (data.totalPages > maxLinks) {
      if (pageNum <= lowerLimit && showPage <= maxLinks) {
        pageNumFlag = true;
      } else if (
        pageNum >= upperLimit &&
        showPage >= data.totalPages - maxLinks
      ) {
        pageNumFlag = true;
      } else if (
        showPage >= pageNum - offsetLinks &&
        showPage <= pageNum + offsetLinks
      ) {
        pageNumFlag = true;
      }
    } else {
      pageNumFlag = true;
    }
    if (pageNumFlag) {
      showedPageNums.push(showPage);
    }
  }

  const getPageLink = (page: number) => {
    return page === 1 ? '/post/' : `/post/page/${page}/`;
  };

  if (!slicedList.length) {
    return <NotFound />;
  }
  return (
    <div className='post__list'>
      {slicedList.map((post) => {
        return (
          <PostCard
            mode='list'
            key={post.path}
            link={`${post.path}/`}
            {...post}
          >
            {post.preview && (
              <div
                className='markdown'
                dangerouslySetInnerHTML={{ __html: post.preview }}
              />
            )}
          </PostCard>
        );
      })}
      <div className='card'>
        <div className='pagination'>
          {pageNum !== 1 && (
            <Link className='pagination__first' href={getPageLink(1)}>
              <IChevronDoubleLeft />
            </Link>
          )}
          {hasPrev && (
            <Link
              className='pagination__previous'
              href={getPageLink(pageNum - 1)}
            >
              <IChevronLeft />
            </Link>
          )}
          {showedPageNums.map((page) => {
            return (
              <Link
                className={clsx({
                  pagination__item: true,
                  'pagination__item--active': pageNum === page,
                })}
                key={`pagination-${page}`}
                href={getPageLink(page)}
              >
                {page}
              </Link>
            );
          })}
          {hasNext && (
            <Link className='pagination__next' href={getPageLink(pageNum + 1)}>
              <IChevronRight />
            </Link>
          )}
          {pageNum !== data.totalPages && (
            <Link
              className='pagination__last'
              href={getPageLink(data.totalPages)}
            >
              <IChevronDoubleRight />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
