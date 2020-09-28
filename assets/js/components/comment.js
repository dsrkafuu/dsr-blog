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

const needComment = document.getElementById('disqus_thread');
if (needComment) {
  const apikey = [];
  DISQUS_API_KEYS.forEach((val) => {
    apikey.push(decData(val));
  });
  const identifier = needComment.getAttribute('data-id') || 'error';
  const url = window.location.href || 'https://amzrk2.cc/';
  new DisqusJS({
    shortname: DISQUS_SHORTNAME,
    siteName: DISQUS_SITENAME,
    identifier,
    url,
    api: DISQUS_API_PROXY,
    apikey,
    nocomment: '暂无评论',
    admin: DISQUS_ADMIN,
    adminLabel: '管理员',
  });
}
