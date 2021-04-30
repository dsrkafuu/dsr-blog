/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

// mobile toc
import toc from './components/toc';
toc();

// clipboard injector
import clipboard from './components/clipboard';
if (process.env.NODE_ENV === 'production') {
  clipboard();
}

// gitalk comment
import comment from './components/comment';
comment();
