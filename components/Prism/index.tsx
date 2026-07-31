'use client';

import './index.scss';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { Fragment, useEffect } from 'react';

const highlightCode = () => {
  if (window.Prism?.highlightAll) {
    window.Prism.highlightAll();
  }
};

const Prism = () => {
  const pathname = usePathname();

  useEffect(() => {
    highlightCode();
  }, [pathname]);

  return (
    <Fragment>
      <Script id='prism-manual-mode'>
        {`window.Prism = window.Prism || {}; window.Prism.manual = true;`}
      </Script>
      <Script
        id='prism-core'
        src='https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js'
        onReady={highlightCode}
      />
      <Script
        id='prism-autoloader'
        src='https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js'
        onReady={highlightCode}
      />
    </Fragment>
  );
};

export default Prism;
