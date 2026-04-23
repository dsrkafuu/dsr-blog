import '@/styles/globals.scss';
import './layout.scss';
import 'sakana-widget/lib/index.css';
// import { SpeedInsights } from '@vercel/speed-insights/next';
// import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import SakanaWidget from '@/components/SakanaWidget';
import Search from '@/components/Search';
import SideInfo from '@/components/SideInfo';
import config from '@/config.json';

export const metadata: Metadata = {
  title: config.siteName,
  metadataBase: new URL(`https://${config.domain}`),
  authors: [{ url: '/', name: config.name }],
  description: config.desc,
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    siteName: config.siteName,
    title: config.name,
    description: config.desc,
    url: '/',
    images: '/og.png',
  },
};

interface RootLayoutProps {
  children?: ReactNode;
  toc?: ReactNode;
}

const RootLayout = ({ children, toc }: RootLayoutProps) => {
  return (
    <html lang='zh'>
      <head>
        {/* prettier-ignore */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        {/* prettier-ignore */}
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        {/* prettier-ignore */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap' />
        {/* prettier-ignore */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap' />
        {/* prettier-ignore */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap' />
        {/* prettier-ignore */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap' />
      </head>
      <body>
        <NavBar />
        <main className='main'>
          <div className='container__eol container'>
            <div className='card eol__warning'>
              <Link href='/post/2025/blog-eol/'>
                <h2>博客低频率更新并进入维护模式</h2>
              </Link>
            </div>
          </div>
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
        {/* <SpeedInsights /> */}
        {/* <Analytics /> */}
        {typeof process.env.NEXT_PUBLIC_GA_ID === 'string' && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
