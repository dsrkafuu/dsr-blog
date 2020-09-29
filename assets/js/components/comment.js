/* gitalk */
import { logInfo, logError } from '../plugins/logger';
import Gitalk from 'gitalk';
import {
  GITALK_CLIENT_ID,
  GITALK_CLIENT_SECRET,
  GITALK_REPO,
  GITALK_OWNER,
  GITALK_ADMIN,
} from '../plugins/constants';

/**
 * 加载评论区
 */
const loadComment = () => {
  const gitalk = new Gitalk({
    clientID: GITALK_CLIENT_ID,
    clientSecret: GITALK_CLIENT_SECRET,
    repo: GITALK_REPO,
    owner: GITALK_OWNER,
    admin: GITALK_ADMIN,
    id: needComment.getAttribute('data-identifier') || location.pathname,
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
  logInfo('Comment area loaded');
};

const needComment = document.getElementById('gitalk-container');
if (needComment) {
  const commentPromise = new Promise((resolve, reject) => {
    try {
      // 评论区 observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 若评论区已出现在页面上
            loadComment(); // 加载评论区
            observer.disconnect(); // 停止当前 observer
            resolve();
          }
        });
      });
      // 开始监测评论区 DOM
      const commentAreaNode = document.querySelector('.card.comment-wrapper');
      commentAreaNode && observer.observe(commentAreaNode);
    } catch (e) {
      reject(e); // 出现异常
    }
  });
  // 若出现异常 (例如不支持 IntersectionObserver)
  commentPromise.catch((reason) => {
    logError(reason);
    loadComment(); // 直接加载评论区
  });
}
