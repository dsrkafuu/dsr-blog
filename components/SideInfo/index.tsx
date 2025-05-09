import './index.scss';
import { Fragment } from 'react';
import Image from 'next/image';
import irasutoya from '@/assets/irasutoya.jpg';
import kofi from '@/assets/kofi.png';
import config from '@/config.json';
import { getPostList } from '@/utils/assets';
import { IBitcoin, IGitHub } from '@/icons';

const IconMap: Record<string, any> = {
  github: IGitHub,
  bitcoin: IBitcoin,
};

const SideInfo = async () => {
  const { list, wordsCount = 0 } = await getPostList();
  const postCount = list.length || 0;

  return (
    <Fragment>
      <div className='card info'>
        <div className='info__avatar'>
          <Image src={irasutoya} width={75} height={75} alt='头像' />
        </div>
        <div className='info__meta'>
          <span className='info__metaName'>{config.name}</span>
        </div>
        <div className='info__counter'>
          <div className='info__counterItem'>
            <span className='info__counterData'>
              {Math.round(wordsCount / 1000)}
            </span>
            <span className='info__counterName'>千字</span>
          </div>
          <div className='info__counterItem'>
            <span className='info__counterData'>{postCount}</span>
            <span className='info__counterName'>文章</span>
          </div>
        </div>
      </div>
      <div className='card links'>
        {config.links.map((link) => {
          const Icon = IconMap[link.icon];
          return (
            <a
              key={link.key}
              className='links__item'
              href={link.href}
              target='_blank'
              title={link.name}
              rel='noreferrer'
            >
              <Icon />
            </a>
          );
        })}
      </div>
      <a
        className='card kofi'
        href='https://dsrkafuu.net/crypto'
        target='_blank'
        rel='noreferrer'
      >
        <Image
          src={kofi}
          style={{ width: '100%', height: 'auto' }}
          alt='赞助图片'
        />
      </a>
    </Fragment>
  );
};

export default SideInfo;
