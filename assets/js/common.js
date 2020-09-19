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
import initMobileToc from './components/toc';
initMobileToc();

/* feature detection */
import detectFeature from './components/feature';
detectFeature();
