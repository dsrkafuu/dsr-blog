import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { SENTRY_DSN, ID_THEME_CTRL } from './plugins/constants';

// sentry
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  } catch (e) {
    logError(e);
  }
}

// theme system
import ThemeManager from './components/theme';
import { logError } from './plugins/loggers';
const tm = new ThemeManager();
const switcher = document.querySelector(`#${ID_THEME_CTRL}`);
if (switcher) {
  switcher.addEventListener('click', () => tm.switchTheme());
}
