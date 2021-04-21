import { logInfo, logError } from '../plugins/loggers';
import loadScript from '../plugins/loadScript';
import {
  SCRIPT_GITALK,
  GITALK_ID,
  GITALK_SECRET,
  GITALK_REPO,
  GITALK_OWNER,
  GITALK_ADMIN,
} from '../plugins/constants';

/**
 * 加载评论区
 * @param {Element} el
 */
async function loadComment(el) {
  try {
    await loadScript(SCRIPT_GITALK);
  } catch {
    window.Gitalk = null;
  }
  if (!window.Gitalk) {
    logError('error loading gitalk script');
    return;
  }
  // 初始化
  const gitalk = new window.Gitalk({
    clientID: GITALK_ID,
    clientSecret: GITALK_SECRET,
    repo: GITALK_REPO,
    owner: GITALK_OWNER,
    admin: GITALK_ADMIN,
    id: el.getAttribute('data-identifier'),
    createIssueManually: true,
    flipMoveOptions: {
      staggerDelayBy: 150,
      appearAnimation: 'fade',
      enterAnimation: 'fade',
      leaveAnimation: 'fade',
    },
  });
  // 移除等待加载指示器
  const loadingIndicator = document.getElementById('comment-waiting');
  loadingIndicator && loadingIndicator.setAttribute('style', 'display: none;');
  // 加载评论区
  gitalk.render('gitalk-container');
  logInfo('successfully loaded gitalk');
}

/**
 * IntersectionObserver 懒加载评论区
 */
export default function () {
  const el = document.getElementById('gitalk-container');
  if (el) {
    const commentPromise = new Promise((resolve, reject) => {
      try {
        // 评论区 observer
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 若评论区已出现在页面上
              observer.disconnect(); // 停止当前 observer
              loadComment(el); // 加载评论区
              resolve();
            }
          });
        });
        // 开始监测评论区 DOM
        const commentArea = document.querySelector('.card.comment-wrapper');
        commentArea && observer.observe(commentArea);
      } catch (e) {
        reject(e); // 出现异常
      }
    });
    // 若出现异常 (例如不支持 IntersectionObserver)
    commentPromise.catch(() => {
      logError('error initializing gitalk observer');
      loadComment(el); // 直接加载评论区
    });
  }
}
