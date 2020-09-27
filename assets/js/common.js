/*! amzrk2-ng | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */

/* iconfont */
import iconfont from '../svg/iconfont';
iconfont(window);

/* theme system */
import ThemeManager from './components/theme';
const themeManager = new ThemeManager();
document.getElementById('ctrl-adjust').addEventListener('click', () => {
  themeManager.switchTheme();
});

/* toc control */
import './components/toc';

/* feature detection */
import './components/feature';
