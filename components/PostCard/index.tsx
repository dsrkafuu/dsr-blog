import './index.scss';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ICalendarDay, IClock, IFileAlt, ITimer } from '@/icons';

interface PostCardProps {
  mode: 'post' | 'list';
  title: string;
  cover?: string;
  date: Date;
  pubdate?: Date;
  words: number;
  link?: string;
  children?: ReactNode;
}

const PostCard = ({
  mode,
  title,
  cover,
  date,
  pubdate,
  words,
  link,
  children,
}: PostCardProps) => {
  return (
    <div className='card post'>
      {cover && link && (
        <Link className='post__image fiximg' href={link}>
          <div className='fiximg__container' style={{ paddingBottom: '22.5%' }}>
            <img loading='lazy' src={cover} alt={title} />
          </div>
        </Link>
      )}
      {cover && !link && (
        <div className='post__image fiximg'>
          <div className='fiximg__container' style={{ paddingBottom: '22.5%' }}>
            <img loading='lazy' src={cover} alt={title} />
          </div>
        </div>
      )}
      <div className='post__title'>
        {link ? (
          <Link href={link}>
            <h2>{title}</h2>
          </Link>
        ) : (
          <h2>{title}</h2>
        )}
      </div>
      {mode === 'list' && (
        <div className={clsx({ post__summary: true, post__empty: !children })}>
          {children}
        </div>
      )}
      <div className={clsx({ post__meta: true, post__metas: mode === 'list' })}>
        <span className='post__metaDate'>
          {pubdate ? <IClock /> : <ICalendarDay />}
          <time dateTime={date.toISOString()}>
            {dayjs(date).format('YYYY-MM-DD')}
          </time>
        </span>
        {pubdate && (
          <span className='post__metaUpdate'>
            <ICalendarDay />
            <time dateTime={pubdate.toISOString()}>
              {dayjs(pubdate).format('YYYY-MM-DD')}
            </time>
          </span>
        )}
        <span className='post__metaWords'>
          <IFileAlt />
          {`${words} 字`}
        </span>
        <span className='post__metaWords'>
          <ITimer />
          {`${Math.ceil(words / 500)} 分钟`}
        </span>
      </div>
      {mode === 'post' && (
        <div className={clsx({ post__content: true, post__empty: !children })}>
          {children}
        </div>
      )}
    </div>
  );
};

export default PostCard;
