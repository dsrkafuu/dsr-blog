import { HM_SRC } from './constants';
import { envIsProd } from './env';

envIsProd() &&
  (() => {
    const hm = document.createElement('script');
    hm.setAttribute('async', '');
    hm.src = HM_SRC;
    document.head.appendChild(hm);
  })();
