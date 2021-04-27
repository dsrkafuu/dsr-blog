import { setLS, getLS } from '../plugins/storage';
import { logInfo } from '../plugins/loggers';
import { ATTR_THEME, STORAGE_THEME } from '../plugins/constants';

export default class ThemeManager {
  constructor() {
    this.theme = getLS(STORAGE_THEME) || document.body.getAttribute(ATTR_THEME);
    // if inline scripts failed to execute
    if (this.theme !== document.body.getAttribute(ATTR_THEME)) {
      document.body.setAttribute(ATTR_THEME, this.theme);
    }
  }

  /**
   * @private
   * get current system theme
   * @returns {'dark'|'light'}
   */
  _getCSSScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * @private
   * get actual displayed theme
   * @returns {'dark'|'light'}
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
   * @param {'auto'|'dark'|'light'} scheme
   */
  _setTheme(scheme) {
    document.body.setAttribute(ATTR_THEME, scheme);
    this.theme = scheme;
    logInfo(`theme set to ${scheme}`);
  }

  /**
   * @public
   */
  switchTheme() {
    const nowTheme = this._getSpecificTheme();
    const targetTheme = nowTheme === 'light' ? 'dark' : 'light';
    if (targetTheme === this._getCSSScheme()) {
      // return to auto mode if target theme equals system theme
      this._setTheme('auto');
      setLS(STORAGE_THEME, 'auto');
    } else {
      this._setTheme(targetTheme);
      setLS(STORAGE_THEME, targetTheme);
    }
  }
}
