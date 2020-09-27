/* disqusjs */
import DisqusJS from 'disqusjs';
import { decData } from '../plugins/encrypt';
import {
  DISQUS_API_KEYS,
  DISQUS_API_PROXY,
  DISQUS_SHORTNAME,
  DISQUS_SITENAME,
  DISQUS_ADMIN,
} from '../plugins/constants';

const apikey = [];
DISQUS_API_KEYS.forEach((val) => {
  apikey.push(decData(val));
});
new DisqusJS({
  shortname: DISQUS_SHORTNAME,
  siteName: DISQUS_SITENAME,
  identifier: document.location.pathname,
  url: document.location.origin + document.location.pathname + document.location.search,
  api: DISQUS_API_PROXY,
  apikey,
  nocomment: '暂无评论',
  admin: DISQUS_ADMIN,
  adminLabel: '管理员',
});
