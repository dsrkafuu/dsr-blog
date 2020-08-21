/* iconfont */
import iconfont from '../svg/iconfont';

iconfont(window);

/* theme system */
import ThemeManager from './components/theme';

const themeManager = new ThemeManager();
document.getElementById('ctrl-adjust').addEventListener('click', () => {
  themeManager.switchTheme();
});
