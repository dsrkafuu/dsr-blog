/**
 * init quicklink
 */
export default () => {
  if (window.quicklink) {
    window.quicklink.listen();
  }
};
