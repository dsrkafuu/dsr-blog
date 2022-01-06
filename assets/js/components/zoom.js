/**
 * init medium-zoom
 */
export default () => {
  if (document.querySelector('[data-zoomable]')) {
    if (window.mediumZoom) {
      window.mediumZoom('[data-zoomable]', {
        background: 'var(--color-bg)',
      });
    }
  }
};
