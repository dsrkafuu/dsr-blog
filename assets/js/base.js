/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { SENTRY_DSN } from './plugins/constants';

const SWITCH_BTN = 'switch-btn';

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
const switcher = document.querySelector(`#${SWITCH_BTN}`);
if (switcher) {
  switcher.addEventListener('click', () => tm.switchTheme());
}

import zoom from './components/zoom';
zoom();
