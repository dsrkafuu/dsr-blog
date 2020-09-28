/* disqus */
import { DISQUS_SHORTNAME } from '../plugins/constants';

const needComment = document.getElementById('disqus_thread');
if (needComment) {
  const identifier = needComment.getAttribute('data-id') || 'error';
  const url = window.location.href || 'https://amzrk2.cc/';
}
