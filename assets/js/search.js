/* mail */
import loadEmail from './components/mail';

loadEmail('amzrk2@outlook.com');

/* search engine */
import { logInfo } from './plugins/logger';

new Vue({
  el: '#search-result',
  data: {
    urlParam: '',
    searchQuerys: [],
  },
  mounted() {
    const hasQuery = this.parseSearchQuerys();
    if (hasQuery) {
      logInfo('Searching with keys: ', this.searchQuerys);
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
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
});
