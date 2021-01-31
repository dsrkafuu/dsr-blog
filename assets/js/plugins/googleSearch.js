/*! Google Custom Search in CloudFlare Workers | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

const ALLOWED_ORIGIN = [
  /^https?:\/\/amzrk2\.cc/,
  /^https?:\/\/blog\.amzrk2\.cc/,
  /^https?:\/\/search-dsrca\.amzrk2\.workers\.dev/,
];
const ALLOWED_PATH = /^\/search(.*)/;

const API_URL = 'https://www.googleapis.com/customsearch/v1';
const API_KEY = 'AI**********DA';
const API_CX = '98**********b8e';

const blockedRes = (text) => new Response(`[dsr search] forbidden: ${text}`, { status: 403 });
const timeoutRes = (text) => new Response(`[dsr search] tequest timeout: ${text}`, { status: 408 });

/**
 * 验证 Origin 头是否允许
 * @param {Request} req
 * @returns {Boolean}
 */
function validateOrigin(req) {
  const origin = req.headers.get('Origin');
  /* DEV - START */
  if (origin && origin.includes('localhost')) {
    return true;
  }
  /* DEV - END */
  if (origin && origin.includes('https')) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true; // 通过
      }
    }
  }
  return false; // 拒绝所有非 CORS 请求和非 SSL 请求
}

/**
 * 验证 pathname 是否允许
 * @param {Request} req
 * @returns {Boolean}
 */
function validatePath(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const valid = ALLOWED_PATH.exec(pathname);
  if (valid && valid.length > 1) {
    return true; // 放行
  }
  return false; // 拒绝
}

/**
 * 请求搜索结果
 * @param {String} searchQuerys - 关键词
 * @returns {Promise<Response>}
 */
async function fetchGoogleAPI(searchQuerys) {
  const url = new URL(API_URL); // 构建一个新的 URL 对象 `googleapis.com`
  url.searchParams.set('cx', API_CX); // 设置 cx
  url.searchParams.set('key', API_KEY); // 设置 key
  url.searchParams.set('q', searchQuerys); // 设置 q
  return fetch(url);
}

/**
 * 响应请求
 * @param {Request} req - 源请求
 * @returns {Response}
 */
async function handleReq(req) {
  const url = new URL(req.url);
  const searchQuerys = url.searchParams.get('q');
  if (searchQuerys) {
    try {
      let res = await fetchGoogleAPI(searchQuerys);
      // CORS
      res = new Response(res.body, res); // 覆盖响应 response
      res.headers.set('Access-Control-Allow-Origin', req.headers.get('Origin') || '*'); // 设置 CORS 头
      if (!res.headers.get('Vary').includes('Origin')) {
        res.headers.append('Vary', 'Origin'); // 设置 Vary 头使浏览器正确进行缓存
      }
      return res;
    } catch (e) {
      console.error(e);
      return timeoutRes('internal Google API error occurred');
    }
  }
  return blockedRes('no search querys found'); // 拒绝
}

addEventListener('fetch', (event) => {
  const req = event.request; // 获取请求的信息
  // 验证身份
  const validOrigin = validateOrigin(req);
  const validPath = validatePath(req);
  // 验证通过
  if (validOrigin && validPath) {
    event.respondWith(handleReq(req)); // 响应
  } else {
    event.respondWith(blockedRes('origin or pathname not allowed')); // 拒绝
  }
});
