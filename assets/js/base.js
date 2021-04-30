/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { SENTRY_DSN, ID_THEME_CTRL } from './plugins/constants';

// sentry
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

// iconfont
import iconfont from '../svg/iconfont';
iconfont(window);

// theme system
import ThemeManager from './components/theme';
const tm = new ThemeManager();
const switcher = document.querySelector(`#${ID_THEME_CTRL}`);
if (switcher) {
  switcher.addEventListener('click', () => tm.switchTheme());
}
