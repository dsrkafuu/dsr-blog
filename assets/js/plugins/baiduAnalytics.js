import { HM_SRC } from './constants';
const hm = document.createElement('script');
hm.setAttribute('async', '');
hm.src = HM_SRC;
document.head.appendChild(hm);
