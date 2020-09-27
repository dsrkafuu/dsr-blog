(function initMobileToc() {
  const tocNode = document.getElementById('table-of-contents');
  if (tocNode) {
    document.getElementById('ctrl-toc').addEventListener('click', () => {
      const classes = Array.from(tocNode.classList);
      if (classes.includes('hidden')) {
        tocNode.classList.remove('hidden');
      } else {
        tocNode.classList.add('hidden');
      }
    });
  }
})();
