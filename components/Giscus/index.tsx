'use client';

import './index.scss';
import type { GiscusProps } from '@giscus/react';
import GiscusReact from '@giscus/react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const Giscus = (props: Partial<GiscusProps>) => {
  const pathname = usePathname();

  const repo = props.repo || process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = props.repoId || process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = props.category || process.env.NEXT_PUBLIC_GISCUS_CATE;
  const categoryId = props.categoryId || process.env.NEXT_PUBLIC_GISCUS_CATE_ID;

  return (
    <Fragment>
      <div id='comment' />
      <div className='card comment-area'>
        <noscript>请启用 JavaScript 以加载评论区</noscript>
        <GiscusReact
          id='giscus'
          key={`giscus-${pathname}`}
          repo={repo as any}
          repoId={repoId as any}
          category={category as any}
          categoryId={categoryId as any}
          mapping={props.mapping || 'title'}
          term={props.term}
          strict='0'
          reactionsEnabled='1'
          emitMetadata='0'
          inputPosition='bottom'
          theme='preferred_color_scheme'
          lang='zh-CN'
          loading='lazy'
        />
      </div>
    </Fragment>
  );
};

export default Giscus;
