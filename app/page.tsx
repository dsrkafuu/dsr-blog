import './page.scss';
import NotFound from '@/components/NotFound';
import { getPostContent } from '@/utils/assets';

const HomePage = async () => {
  const content = await getPostContent('/index');

  if (!content) {
    return <NotFound />;
  }
  return (
    <div className='card index'>
      {content.cover && (
        <div className='index__image fiximg'>
          <div className='fiximg__container' style={{ paddingBottom: '22.5%' }}>
            <img loading='lazy' src={content.cover} alt={content.title} />
          </div>
        </div>
      )}
      <article
        className='index__content markdown'
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </div>
  );
};

export default HomePage;
