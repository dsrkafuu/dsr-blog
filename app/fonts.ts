import { Inter, Cascadia_Mono, Noto_Sans_SC, Noto_Sans_JP } from 'next/font/google';

export const inter = Inter({
  display: 'swap',
  weight: 'variable',
  variable: '--font-inter',
});

export const cascadiaMono = Cascadia_Mono({
  display: 'swap',
  weight: 'variable',
  variable: '--font-cascadia-mono',
});

export const notoSansSC = Noto_Sans_SC({
  display: 'swap',
  weight: 'variable',
  variable: '--font-noto-sans-sc',
});

export const notoSansJP = Noto_Sans_JP({
  display: 'swap',
  weight: 'variable',
  variable: '--font-noto-sans-jp',
});
