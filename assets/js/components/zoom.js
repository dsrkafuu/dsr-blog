/**
 * init medium-zoom
 */
export default () => {
  if (document.querySelector('[data-zoomable]') && window.mediumZoom) {
    window.mediumZoom('[data-zoomable]', {
      background: 'var(--color-backdrop)',
    });
  }
};
