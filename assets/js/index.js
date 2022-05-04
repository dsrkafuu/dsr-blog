import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { logError, logInfo } from './plugins/loggers';
import { SECTIONS, getSection } from './plugins/utils';
import crisp from './components/crisp';
import search from './components/search';
import toc from './components/toc';
import zoom from './components/zoom';

const SECTION = getSection();

// sentry
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: process.env.HUGO_SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  } catch (e) {
    logError('error init sentry', e);
  }
}

// modules
if ([SECTIONS.INDEX, SECTIONS.LIST].includes(SECTION)) {
  search();
  logInfo('search module inited');
}
if (SECTION === SECTIONS.SINGLE) {
  crisp();
  logInfo('crisp module inited');
  toc();
  logInfo('toc module inited');
  zoom();
  logInfo('zoom module inited');
}
