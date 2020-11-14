import { COPY_LICENSE, BODY_ATTRIBUTE_SECTION, BODY_ATTRIBUTE_HIDE } from '../plugins/constants';

/**
 * 剪贴板拦截
 */
if (
  !document.body.getAttribute(BODY_ATTRIBUTE_HIDE) &&
  document.body.getAttribute(BODY_ATTRIBUTE_SECTION) === 'single'
) {
  document.addEventListener('copy', (event) => {
    const clipboardData = event.clipboardData; // 获取剪贴板
    if (clipboardData) {
      let copiedText = window.getSelection().toString(); // 获取选择的内容
      if (copiedText) {
        event.preventDefault(); // 防止默认行为复制原文内容
        clipboardData.setData('text/plain', `${copiedText}\n\n${COPY_LICENSE}`);
      }
    }
  });
}
