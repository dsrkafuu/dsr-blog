/* disqusjs */
import DisqusJS from 'disqusjs';
import { decData } from '../plugins/encrypt';
const DISQUS_API_KEYS = [
  'PT13YjJsVFppZDFVSWgxWVpKVGJzOTBhUlYzWUZkR1R5VTNSa05GYjJCM01LeG1aRFpqTW9SRU1GVm1OcEowU3hBemFqTmtVa2hsVnc5bWJ0VkhialYxWg==',
  'PT13TmhWMmRESjFkelFtVExCbFZMaEVUT2RtTnFOa1MwQVZZSnBVVjM1a1RJQm5TSlZsTld0bVZqVlVNWnhXYlROR2JETkRUNFZtUlhGa2FwVlhRUmRuUg==',
];
const apikey = [];
DISQUS_API_KEYS.forEach((val) => {
  apikey.push(decData(val));
});
const disqusjs = new DisqusJS({
  shortname: 'amzrk2-ng',
  siteName: 'DSRKafuU',
  identifier: document.location.pathname,
  url: document.location.origin + document.location.pathname + document.location.search,
  api: 'https://disqus.skk.moe/disqus/',
  apikey,
  nocomment: '暂无评论',
  admin: 'amzrk2',
  adminLabel: '管理员',
});

export default disqusjs;
