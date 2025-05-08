import { INextJS } from '@/icons';
import './index.scss';
import config from '@/config.json';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container'>
        <span className='footer__text'>
          {`Copyright © 2018-${new Date().getFullYear()} | `}
          <a
            className='link'
            href='{{ .Site.Data.meta.author_link }}'
            target='_blank'
            rel='noopener'
          >
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
          {' v9.0.0 | AGPL-3.0'}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
