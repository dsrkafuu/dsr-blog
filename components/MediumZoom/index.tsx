'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const MediumZoom = () => {
  const handleInitZoom = () => {
    if (document.querySelector('[data-zoomable]') && window.mediumZoom) {
      window.mediumZoom('[data-zoomable]', {
        background: 'var(--color-backdrop)',
      });
    }
  };

  useEffect(() => {
    handleInitZoom();
  }, []);

  return (
    <Script
      src='https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.min.js'
      onLoad={handleInitZoom}
    />
  );
};

export default MediumZoom;
