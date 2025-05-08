import { sendGAEvent } from '@next/third-parties/google';

export const sendLinkClick = async (
  name: string,
  e: React.MouseEvent<HTMLAnchorElement>
) => {
  const target = e.target;
  if (target instanceof HTMLElement) {
    const href = target.getAttribute('href');
    sendGAEvent('event', name, { href });
  }
};
