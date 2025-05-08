import './index.scss';
import { INotFound } from '@/icons';

const NotFound = () => {
  return (
    <div className='card error'>
      <div className='error__content'>
        <INotFound className='error__icon' />
        <div className='error__title'>404 Not Found</div>
      </div>
    </div>
  );
};

export default NotFound;
