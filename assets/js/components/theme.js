import { setLS, getLS } from '../plugins/storage';
import { logInfo } from '../plugins/loggers';

import { ID_COMMENT_CONTENT } from './comment';
export const STORAGE_THEME = 'dsr-blog_theme';
export const DATA_THEME = 'data-theme';

export default class ThemeManager {
  constructor() {
    this.theme = getLS(STORAGE_THEME) || document.body.getAttribute(DATA_THEME);
    // if inline scripts failed to execute
    if (this.theme !== document.body.getAttribute(DATA_THEME)) {
      document.body.setAttribute(DATA_THEME, this.theme);
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
      // get actual theme when in auto mode
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
    document.body.setAttribute(DATA_THEME, scheme);
    this.theme = scheme;
    logInfo(`theme set to ${scheme}`);
  }

  /**
   * @public
   */
  switchTheme() {
    const nowTheme = this._getSpecificTheme();
    const targetTheme = nowTheme === 'light' ? 'dark' : 'light';
    // set utterances theme
    const frame = document.querySelector(`#${ID_COMMENT_CONTENT} .utterances-frame`);
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage(
        { type: 'set-theme', theme: `github-${targetTheme}` },
        'https://utteranc.es'
      );
    }
    // set blog theme
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
