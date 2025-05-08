import './index.scss';
import Link from 'next/link';
import config from '@/config.json';
import NavTabs from './NavTabs';

const NavBar = async () => {
  return (
    <header className='header'>
      <nav className='navbar container'>
        <div className='navbar__brand'>
          <Link className='navbar__item' href='/'>
            <h1>{config.siteName}</h1>
          </Link>
        </div>
        <div className='navbar__menu'>
          <NavTabs
            tabs={[
              { title: '文章', link: '/post/' },
              { title: '友链', link: '/friends/' },
            ]}
          />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
