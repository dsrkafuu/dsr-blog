import { logInfo, logError } from '../plugins/logger';
import { decData } from '../plugins/encrypt';
import { SEARCH_API_CX, SEARCH_API_URL, SEARCH_API_KEY } from '../plugins/constants';

const API_KEY = SEARCH_API_KEY;
const API_CX = SEARCH_API_CX;
const API_URL = SEARCH_API_URL;

/* vue components */
const VSearchInfo = {
  props: {
    status: Boolean,
    data: Object,
    query: Array,
  },
  computed: {
    info() {
      if (this.status) {
        if (this.data && this.data.formattedTotalResults && this.data.formattedSearchTime) {
          return `找到约 ${this.data.formattedTotalResults} 条结果 (用时 ${this.data.formattedSearchTime} 秒)`;
        } else {
          return `无法连接到 Google 服务器`;
        }
      } else {
        return false;
      }
    },
    loading() {
      if (!this.status && Array.isArray(this.query) && this.query.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  template: `
    <div v-if="loading" class="search-data">
      <svg class="icon spin" aria-hidden="true">
        <use xlink:href="#icon-spinner-third"></use>
      </svg>
    </div>
    <div v-else-if="status && info" class="search-data">{{ info }}</div>
  `,
};
const VSearchList = {
  props: {
    status: Boolean,
    items: Array,
  },
  template: `
  <div v-if="status && items" class="search-result">
    <div class="card" v-for="item of items">
      <div class="list-box">
        <div class="list-post">
          <a :href="item.link" target="_blank">
            <h2 class="list-title" v-text="item.title"></h2>
          </a>
          <div class="list-summary markdown content" v-html="item.htmlSnippet"></div>
        </div>
      </div>
    </div>
  </div>
  `,
};

/* vue search engine */
new Vue({
  el: '#app',
  components: {
    VSearchInfo,
    VSearchList,
  },
  data: {
    status: false,
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
      const urlParam = new URLSearchParams(window.location.search);
      if (urlParam.has('q')) {
        let paramsArray = urlParam.get('q');
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
      params.append('key', decData(API_KEY));
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
