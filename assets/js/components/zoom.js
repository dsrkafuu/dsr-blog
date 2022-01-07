/**
 * init medium-zoom
 */
export default () => {
  if (document.querySelector('[data-zoomable]')) {
    console.log(window.mediumZoom);
    if (window.mediumZoom) {
      window.mediumZoom('[data-zoomable]', {
        background: 'var(--color-backdrop)',
      });
    }
  }
};
