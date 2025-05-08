'use client';

import './index.scss';
import Script from 'next/script';
import { Fragment, useEffect } from 'react';

const Prism = () => {
  const handlePrismCode = () => {
    if (window.Prism && window.Prism.highlightAll) {
      window.Prism.highlightAll();
    }
  };

  useEffect(() => {
    handlePrismCode();
  }, []);

  return (
    <Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.Prism = window.Prism || {}; window.Prism.manual = true;`,
        }}
      />
      <Script
        src='https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js'
        onLoad={handlePrismCode}
      />
      <Script
        src='https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js'
        onLoad={handlePrismCode}
      />
    </Fragment>
  );
};

export default Prism;
