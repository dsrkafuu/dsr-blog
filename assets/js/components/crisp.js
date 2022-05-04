/**
 * open crisp button
 */
export default () => {
  const btn = document.querySelector('#crisp-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.$crisp && window.$crisp.push) {
        window.$crisp.push(['do', 'chat:open']);
      }
    });
  }
};
