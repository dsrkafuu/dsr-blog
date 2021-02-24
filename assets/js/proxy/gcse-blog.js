// 无 trail 的 URL
const API_BASE = 'https://www.googleapis.com/customsearch/v1';
// 代理子路径
const PROXY_PATH = /^\/(\/?.*)/;
// 允许的请求来源
const ALLOWED_ORIGIN = [/^https?:\/\/.*dsrkafuu\.su$/, /^https?:\/\/localhost/];
// 是否拒绝所有无 Origin 请求
const ALLOW_NO_ORIGIN = false;
// secrets
const API_KEY = 'A**********************************k';
const API_CX = '3***************e';

const blockedRes = (text) => new Response(`[dsr-blog] forbidden: ${text}`, { status: 403 });
const timeoutRes = (text) => new Response(`[dsr-blog] tequest timeout: ${text}`, { status: 408 });

/**
 * 验证 Origin
 * @param {Request} req
 * @return {boolean}
 */
function validateOrigin(req) {
  const origin = req.headers.get('Origin');
  if (origin) {
    for (let i = 0; i < ALLOWED_ORIGIN.length; i++) {
      if (ALLOWED_ORIGIN[i].exec(origin)) {
        return true;
      }
    }
  }
  return ALLOW_NO_ORIGIN; // 是否拒绝所有无 Origin 请求
}

/**
 * 解析 API 请求路径
 * @param {Request} req
 * @return {string}
 */
function validatePath(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const valid = PROXY_PATH.exec(pathname);
  if (valid) {
    return true; // 放行
  }
  return false; // 拒绝
}

/**
 * 请求搜索结果
 * @param {string} searchQuerys
 * @returns {Promise<Response>}
 */
async function fetchGoogleAPI(searchQuerys) {
  const url = new URL(API_BASE); // 构建一个新的 URL 对象 `googleapis.com`
  url.searchParams.set('cx', API_CX); // 设置 cx
  url.searchParams.set('key', API_KEY); // 设置 key
  url.searchParams.set('q', searchQuerys); // 设置 q
  const res = await fetch(url);
  return res;
}

/**
 * 响应请求
 * @param {Request} req
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
      res.headers.append('Vary', 'Origin'); // 设置 Vary 头使浏览器正确进行缓存
      return res;
    } catch {
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
