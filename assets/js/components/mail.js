import { logInfo, logError } from '../plugins/logger';
import { EMAIL_ADDRESS } from '../plugins/constants';

/**
 * 设置邮箱地址 (机器人验证待添加)
 */
(async function loadEmail() {
  const emailLoader = new Promise((resolve, reject) => {
    const linksNode = document.querySelectorAll('.links-item.links-email');
    if (linksNode && linksNode.length > 0) {
      const emailNode = linksNode[linksNode.length - 1];
      emailNode.setAttribute('href', `mailto:${EMAIL_ADDRESS}`);
      resolve(`Email loaded with ${EMAIL_ADDRESS}`);
    } else {
      reject(new Error('Email node not found'));
    }
  });
  emailLoader
    .then((val) => {
      logInfo(val);
    })
    .catch((res) => {
      logError(res);
    });
})();
