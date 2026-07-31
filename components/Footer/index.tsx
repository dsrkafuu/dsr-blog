import config from '@/config.json';
import { INextJS } from '@/icons';

import './index.scss';
import packageInfo from '@/package.json';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container'>
        <span className='footer__text'>
          {`Copyright © 2018-${new Date().getFullYear()} | `}
          <a className='link' href={config.authorLink} target='_blank' rel='noopener'>
            {config.name}
          </a>
        </span>
        <a
          href='https://nextjs.org/'
          target='_blank'
          rel='noreferrer'
          title='NEXT.JS'
          style={{ color: 'var(--color-text)' }}
        >
          <INextJS />
        </a>
        <span className='footer__text'>
          <a
            className='link'
            href='https://github.com/dsrkafuu/dsr-blog'
            target='_blank'
            rel='noreferrer'
          >
            {config.siteName}
          </a>
          {` v${packageInfo.version} | ${packageInfo.license}`}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
