/**
 * get a license query
 * @returns {string}
 */
function getLicense() {
  return `[CC BY-NC-SA 4.0] (${window.location.origin + window.location.pathname})`;
}

/**
 * check parent nodes
 * @param {Element} node
 * @returns {Element[]}
 */
function getParentNodes(node) {
  const nodes = [];
  node.nodeName && nodes.push(node.nodeName);
  /**
   * @param {Element} node
   */
  function getParentNode(node) {
    if (!node.parentNode) {
      return;
    }
    nodes.push(node.parentNode.nodeName);
    return getParentNode(node.parentNode);
  }
  getParentNode(node);
  return nodes;
}

/**
 * clipboard injector
 */
export default async () => {
  document.addEventListener('copy', (e) => {
    if (e.clipboardData) {
      const selection = window.getSelection();
      // check if code blocks
      const nodes = [
        ...getParentNodes(selection.anchorNode),
        ...getParentNodes(selection.focusNode),
      ]
        .join(' ')
        .toUpperCase();
      // if not code block and in article
      if (nodes.includes('ARTICLE') && !nodes.includes('PRE')) {
        let text = selection.toString();
        if (text && text.length > 80) {
          e.preventDefault(); // stop default copy
          e.clipboardData.setData('text/plain', `${text}\n${getLicense()}`);
        }
      }
    }
  });
};
