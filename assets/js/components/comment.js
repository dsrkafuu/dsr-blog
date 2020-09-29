/* gitalk */
import Gitalk from 'gitalk';
import {
  GITALK_CLIENT_ID,
  GITALK_CLIENT_SECRET,
  GITALK_REPO,
  GITALK_OWNER,
  GITALK_ADMIN,
} from '../plugins/constants';

const needComment = document.getElementById('gitalk-container');
if (needComment) {
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
  gitalk.render('gitalk-container');
}
