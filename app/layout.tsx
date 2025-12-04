import '@/styles/globals.scss';
import './layout.scss';
import 'sakana-widget/lib/index.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
// import { SpeedInsights } from '@vercel/speed-insights/next';
// import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import config from '@/config.json';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Search from '@/components/Search';
import SideInfo from '@/components/SideInfo';
import SakanaWidget from '@/components/SakanaWidget';

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
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500' />
        {/* prettier-ignore */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?display=swap&family=Fira+Code:wght@400;500' />
        {/* prettier-ignore */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans+JP:wght@400;500' />
        {/* prettier-ignore */}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans+SC:wght@400;500' />
      </head>
      <body>
        <NavBar />
        <main className='main'>
          <div className='container container__eol'>
            <div className='card eol__warning'>
              <Link href='/post/2025/blog-eol/'>
                <h2>博客停止更新并进入维护模式</h2>
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
