import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { logError, logInfo } from './plugins/loggers';
import { SECTIONS, getSection } from './plugins/utils';
import search from './components/search';
import toc from './components/toc';
import twemoji from './components/twemoji';
import zoom from './components/zoom';

const SECTION = getSection();

// sentry
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: process.env.HUGO_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      sampleRate: 1, // report all errors
      tracesSampleRate: 0.05, // report 5% of traces
    });
    logInfo('sentry module inited');
  } catch (e) {
    logError('error init sentry', e);
  }
}

// modules
twemoji();
logInfo('twemoji module inited');
if ([SECTIONS.INDEX, SECTIONS.LIST].includes(SECTION)) {
  search();
  logInfo('search module inited');
}
if (SECTION === SECTIONS.SINGLE) {
  toc();
  logInfo('toc module inited');
  zoom();
  logInfo('zoom module inited');
}
