/* sentry */
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

if (/dsrkafuu\.su$/.exec(window.location.hostname)) {
  Sentry.init({
    dsn: 'https://d48ce0382d374d95aed3f137ba47fc7b@o526740.ingest.sentry.io/5645193',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

/* iconfont */
import iconfont from '../svg/iconfont';
iconfont(window);

/* theme system */
import ThemeManager from './components/theme';
const themeManager = new ThemeManager();
document.getElementById('ctrl-adjust').addEventListener('click', () => {
  themeManager.switchTheme();
});
