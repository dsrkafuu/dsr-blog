/* mail */
import loadEmail from './components/mail';

loadEmail('amzrk2@outlook.com');

/* search engine */
import { logInfo, logError } from './plugins/logger';
const API_KEY = 'QlJFTXVWbU0yWUdjcjVHWjVWamNSUjNhcUZHWnZWM05ROTFYSkp6ZDNFelE1TlZZNmxVUQ==';
const API_CX = '981257f142e5b0b8e';
const API_URL = 'https://www.googleapis.com/customsearch/v1';

new Vue({
  el: '#app',
  data: {
    status: false,
    urlParam: '',
    searchInput: '',
    searchQuerys: [],
    resultData: {},
  },
  mounted() {
    const hasQuery = this.parseSearchQuerys();
    if (hasQuery) {
      logInfo('Searching with keys: ', this.searchQuerys);
      this.performSearch();
    } else {
      logInfo('No search keys found');
    }
  },
  methods: {
    /**
     * 获取搜索关键词
     * 返回是否有搜索关键词的布尔值
     */
    parseSearchQuerys() {
      this.urlParam = new URLSearchParams(window.location.search);
      if (this.urlParam.has('q')) {
        let paramsArray = this.urlParam.get('q');
        if (paramsArray.length > 0) {
          paramsArray = paramsArray.split(' ');
          this.searchQuerys = paramsArray;
          this.searchInput = paramsArray.join(' ');
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    /**
     * 执行搜索
     */
    async performSearch() {
      const url = new URL(API_URL);
      const params = new URLSearchParams();
      params.append('q', this.searchQuerys.join('+'));
      params.append('cx', API_CX);
      params.append('key', window.atob(window.atob(API_KEY).split('').reverse().join('')));
      url.search = params.toString();
      const req = new Request(url);
      try {
        const res = await fetch(req);
        this.resultData = await res.json();
        this.status = true;
      } catch (e) {
        logError(e);
        this.status = true;
      }
    },
  },
});
