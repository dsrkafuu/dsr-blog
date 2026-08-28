import '@/styles/globals.scss';
import './layout.scss';
import { GoogleAnalytics } from '@next/third-parties/google';
import clsx from 'clsx';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import SakanaWidget from '@/components/SakanaWidget';
import Search from '@/components/Search';
import SideInfo from '@/components/SideInfo';
import config from '@/config.json';

import { inter, cascadiaMono, notoSansSC, notoSansJP } from './fonts';

export const metadata: Metadata = {
  title: config.siteName,
  metadataBase: new URL(`https://${config.domain}`),
  authors: [{ url: '/', name: config.name }],
  description: config.desc,
  openGraph: {
    siteName: config.siteName,
    title: config.name,
    description: config.desc,
    url: '/',
    images: '/og.jpg',
  },
};

interface RootLayoutProps {
  children?: ReactNode;
  toc?: ReactNode;
}

const RootLayout = ({ children, toc }: RootLayoutProps) => {
  return (
    <html
      lang='zh'
      suppressHydrationWarning
      data-scroll-behavior='smooth'
      className={clsx(
        inter.variable,
        cascadiaMono.variable,
        notoSansSC.variable,
        notoSansJP.variable,
      )}
    >
      <body>
        <NavBar />
        <main className='main'>
          <div className='container'>
            <div className='content'>
              <div className='content__inner'>{children}</div>
            </div>
            <aside className='sidebar'>
              <div className='sidebar__inner'>
                <Search />
                <SideInfo />
                {toc}
              </div>
            </aside>
          </div>
        </main>
        <Footer />
        <SakanaWidget />
        {typeof process.env.NEXT_PUBLIC_GA_ID === 'string' && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
