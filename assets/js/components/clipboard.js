import { COPY_LICENSE, BODY_ATTRIBUTE_SECTION } from '../plugins/constants';

/**
 * 获取父节点
 * @param {Element} node 当前节点
 * @param {number} count 递归层数
 */
function getAllParentNodes(node, count = 4) {
  const allParentNodes = [];
  let recCount = 2; // 递归层数
  /**
   * @param {Element} node
   */
  const getParentNodes = (node) => {
    if (recCount++ >= count || !node.parentNode) {
      return;
    }
    allParentNodes.push(node.parentNode.nodeName);
    return getParentNodes(node.parentNode);
  };
  getParentNodes(node);
  return allParentNodes;
}

// 剪贴板拦截
if (document.body.getAttribute(BODY_ATTRIBUTE_SECTION) === 'single') {
  document.addEventListener('copy', (event) => {
    if (event.clipboardData) {
      const selection = window.getSelection(); // 获取选择的内容
      // 检查是否代码块
      const nodes = [
        getAllParentNodes(selection.anchorNode).join(),
        getAllParentNodes(selection.focusNode).join(),
      ].join(' ');
      // 如果不是代码块
      if (!/(CODE|PRE).* .*(CODE|PRE)/gi.exec(nodes)) {
        // 添加 LICENSE
        let copiedText = selection.toString();
        if (copiedText && copiedText.length > 80) {
          event.preventDefault(); // 防止默认行为复制原文内容
          event.clipboardData.setData('text/plain', `${copiedText}\n${COPY_LICENSE}`);
        }
      }
    }
  });
}
