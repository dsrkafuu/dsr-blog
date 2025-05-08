import './page.scss';
import config from '@/config.json';
import Giscus from '@/components/Giscus';

const FriendsPage = async () => {
  return (
    <div className='friends__list'>
      {config.friends.map((friend) => {
        const url = new URL(friend.link);
        url.searchParams.set('from', 'dsrblog');
        return (
          <div className='card friends__item' key={friend.link}>
            <div className='friends__image fiximg'>
              <a
                className='fiximg__container'
                style={{ paddingBottom: '100%' }}
                href={url.toString()}
                target='_blank'
                rel='noreferrer'
              >
                <img loading='lazy' src={friend.icon} alt={friend.title} />
              </a>
            </div>
            <div className='friends__box'>
              <a
                className='friends__title'
                href={url.toString()}
                target='_blank'
                rel='noreferrer'
              >
                <h2>{friend.title}</h2>
              </a>
              <span className='friends__desc'>{friend.desc}</span>
            </div>
          </div>
        );
      })}
      <Giscus
        mapping='number'
        term={process.env.NEXT_PUBLIC_GISCUS_FRIENDS_TERM}
      />
    </div>
  );
};

export default FriendsPage;
