'use client';

import './index.scss';
import type { GiscusProps } from '@giscus/react';
import GiscusReact from '@giscus/react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { type GiscusConfig, resolveGiscusConfig } from './config';

type GiscusOverrides = Partial<
  Pick<GiscusProps, 'repo' | 'repoId' | 'category' | 'categoryId' | 'mapping' | 'term'>
>;

type ConfiguredGiscusProps = Pick<GiscusProps, 'mapping' | 'term'> & {
  config: GiscusConfig;
};

const ConfiguredGiscus = ({ config, mapping, term }: ConfiguredGiscusProps) => {
  const pathname = usePathname();

  return (
    <Fragment>
      <div id='comment' />
      <div className='card comment-area'>
        <noscript>请启用 JavaScript 以加载评论区</noscript>
        <GiscusReact
          id='giscus'
          key={`giscus-${pathname}`}
          {...config}
          mapping={mapping}
          term={term}
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

const Giscus = (props: GiscusOverrides) => {
  const config = resolveGiscusConfig(props, {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
    category: process.env.NEXT_PUBLIC_GISCUS_CATE,
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATE_ID,
  });

  if (!config) {
    return null;
  }

  return <ConfiguredGiscus config={config} mapping={props.mapping || 'title'} term={props.term} />;
};

export default Giscus;
