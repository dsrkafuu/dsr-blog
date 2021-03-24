import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { SENTRY_DSN } from './plugins/constants';
import { envIsProd } from './plugins/env';

/* sentry */
envIsProd() &&
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });

/* iconfont */
import iconfont from '../svg/iconfont';
iconfont(window);

/* theme system */
import ThemeManager from './components/theme';
const themeManager = new ThemeManager();
document.getElementById('ctrl-adjust').addEventListener('click', () => {
  themeManager.switchTheme();
});
