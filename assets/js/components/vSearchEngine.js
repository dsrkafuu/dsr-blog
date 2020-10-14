import { logInfo, logError } from '../plugins/logger';
import { SEARCH_API_URL } from '../plugins/constants';

const API_URL = SEARCH_API_URL;

/* vue components */
const VSearchInfo = {
  props: {
    status: Boolean,
    data: Object,
  },
  computed: {
    info() {
      if (this.status) {
        if (this.data && this.data.formattedTotalResults && this.data.formattedSearchTime) {
          return `找到约 ${this.data.formattedTotalResults} 条结果 (用时 ${this.data.formattedSearchTime} 秒)`;
        } else {
          return `无法连接到 CloudFlare Workers 服务器`;
        }
      } else {
        return '请输入搜索关键词 (空格分隔)';
      }
    },
    loading() {
      const urlParam = new URLSearchParams(window.location.search);
      return !this.status && urlParam.has('q');
    },
  },
  template: `
    <div v-if="loading" class="search-data">
      <svg class="icon spin" aria-hidden="true">
        <use xlink:href="#icon-spinner-third"></use>
      </svg>
    </div>
    <div v-else-if="info" class="search-data">{{ info }}</div>
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
    resultData: {},
  },
  mounted() {
    const hasInput = this.parseSearchInput();
    if (hasInput) {
      logInfo('Searching with keys:', this.searchInput);
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
    parseSearchInput() {
      const urlParam = new URLSearchParams(window.location.search);
      if (urlParam.has('q')) {
        const searchParam = urlParam.get('q');
        if (searchParam.length > 0) {
          // 有 q 且有关键词
          this.searchInput = searchParam;
          return true;
        } else {
          // 有 q 且没关键词则返回
          window.location.href = window.location.origin + window.location.pathname;
        }
      }
      return false;
    },
    /**
     * 执行搜索
     */
    async performSearch() {
      const url = new URL(API_URL);
      url.searchParams.set('q', this.searchInput);
      try {
        const res = await fetch(url);
        this.resultData = await res.json();
        this.status = true;
      } catch (e) {
        logError(e);
        this.status = true;
      }
    },
    /**
     * 响应表单
     */
    handleSubmit() {
      if (this.searchInput) {
        // 过滤输入
        const str = '测试1  　测试2　测试3';
        str.replaceAll();
        this.searchInput = this.searchInput
          .replaceAll(/　/gi, ' ') // 替换所有中文空格
          .split(' ')
          .filter((val) => val) // 移除多余项
          .join(' ');
        // 执行搜索
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('q', this.searchInput);
        window.location.href = url;
      }
    },
  },
});
