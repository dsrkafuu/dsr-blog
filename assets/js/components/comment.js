/* disqus */
import { DISQUS_SHORTNAME } from '../plugins/constants';

const needComment = document.getElementById('disqus_thread');
if (needComment) {
  var d = document,
    s = d.createElement('script');
  s.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
}
