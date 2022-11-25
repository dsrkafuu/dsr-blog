import { logInfo } from './plugins/loggers';
import { SECTIONS, getSection } from './plugins/utils';
import search from './components/search';
import toc from './components/toc';
import twemoji from './components/twemoji';
import zoom from './components/zoom';

const SECTION = getSection();

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
