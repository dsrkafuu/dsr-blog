import { logInfo, logError } from '../plugins/logger';

export default async function loadEmail(address) {
  const emailLoader = new Promise((resolve, reject) => {
    const linksNode = document.getElementsByClassName('links-item btn');
    if (linksNode && linksNode.length > 0) {
      const emailNode = linksNode[linksNode.length - 1];
      emailNode.setAttribute('href', `mailto:${address}`);
      resolve(`Email loaded with ${address}`);
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
}
