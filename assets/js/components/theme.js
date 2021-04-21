import { setLS, getLS } from '../plugins/storage';
import { logInfo } from '../plugins/loggers';
import { ATTR_THEME, STORAGE_THEME } from '../plugins/constants';

export default class ThemeManager {
  constructor() {
    this.theme = getLS(STORAGE_THEME) || document.body.getAttribute(ATTR_THEME);
    // 若 body 后的内联脚本执行失败了
    if (this.theme !== document.body.getAttribute(ATTR_THEME)) {
      document.body.setAttribute(ATTR_THEME, this.theme);
    }
  }

  /**
   * @private
   * 获取当前浏览器主题
   */
  _getCSSScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * @private
   * 获取当前实际主题
   */
  _getSpecificTheme() {
    if (this.theme === 'auto') {
      // 若当前为自动模式则获取实际显示的主题
      return this._getCSSScheme();
    } else {
      return this.theme === 'dark' ? 'dark' : 'light';
    }
  }

  /**
   * @private
   * 设置主题
   * @param {string} scheme 将要设置的主题
   */
  _setTheme(scheme) {
    if (['auto', 'dark', 'light'].includes(scheme)) {
      document.body.setAttribute(ATTR_THEME, scheme);
      this.theme = scheme;
      logInfo(`theme set to ${scheme}`);
    }
  }

  /**
   * @public
   * 切换主题
   */
  switchTheme() {
    const nowTheme = this._getSpecificTheme();
    const targetTheme = nowTheme === 'light' ? 'dark' : 'light';
    if (targetTheme === this._getCSSScheme()) {
      // 若目标主题为浏览器主题
      // 则恢复自动模式
      this._setTheme('auto');
      setLS(STORAGE_THEME, 'auto');
    } else {
      this._setTheme(targetTheme);
      setLS(STORAGE_THEME, targetTheme);
    }
  }
}
