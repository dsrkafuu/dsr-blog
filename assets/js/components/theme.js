export default class ThemeManager {
  theme = document.body.getAttribute('data-theme');

  constructor() {}

  /**
   * @private
   * 获取当前浏览器主题
   */
  getCSSScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * @private
   * 获取当前实际主题
   */
  getSpecificTheme() {
    if (this.theme === 'auto') {
      // 若当前为自动模式
      // 则获取实际显示的主题
      return this.getCSSScheme();
    } else {
      return this.theme === 'dark' ? 'dark' : 'light';
    }
  }

  /**
   * @private
   * 设置主题
   * @param {string} scheme 将要设置的主题
   */
  setTheme(scheme) {
    if (['auto', 'dark', 'light'].includes(scheme)) {
      document.body.setAttribute('data-theme', scheme);
      this.theme = scheme;
      console.info(`[LOGGER] Theme set to ${scheme} mode`);
    }
  }

  /**
   * @public
   * 切换主题
   */
  switchTheme() {
    const nowTheme = this.getSpecificTheme();
    const targetTheme = nowTheme === 'light' ? 'dark' : 'light';
    if (targetTheme === this.getCSSScheme()) {
      // 若目标主题为浏览器主题
      // 则恢复自动模式
      this.setTheme('auto');
    } else {
      this.setTheme(targetTheme);
    }
  }
}
