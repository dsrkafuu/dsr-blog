'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavTabsProps {
  tabs: Array<{
    title: string;
    link: string;
  }>;
}

const NavTabs = ({ tabs }: NavTabsProps) => {
  const pathname = usePathname();

  // https://github.com/vercel/next.js/issues/72541
  // 为避免上述问题 Parallel Routes 必须有 default.tsx
  // 否则从 404 页面进行 SPA 跳转时 React 会出错
  return (
    <div className='navbar__start'>
      {tabs.map((tab) => (
        <Link
          key={tab.link}
          className={clsx({
            navbar__item: true,
            'navbar__item--active': pathname && pathname.indexOf(tab.link) > -1,
          })}
          href={tab.link}
        >
          {tab.title}
        </Link>
      ))}
    </div>
  );
};

export default NavTabs;
