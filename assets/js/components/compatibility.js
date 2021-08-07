import { logError } from '../plugins/loggers';

export const ID_COMPATIBILITY = 'compatibility';

function testWebP() {
  return new Promise((resolve) => {
    // most advanced animated webp test image
    const uri =
      'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA';
    const img = new Image();
    img.onerror = () => {
      resolve(false);
    };
    img.onload = (event) => {
      const result = event && event.type === 'load' ? Number(img.width) === 1 : false;
      resolve(result);
    };
    img.src = uri;
  });
}

async function testNativeLazyload() {
  return 'loading' in HTMLImageElement.prototype;
}

async function testScrollBehavior() {
  return CSS.supports('scroll-behavior', 'smooth');
}

async function testBackdropFilter() {
  return (
    CSS.supports('backdrop-filter', 'saturate(180%) blur(3px)') ||
    CSS.supports('-webkit-backdrop-filter', 'saturate(180%) blur(3px)')
  );
}

/**
 * @param {Element} el
 */
function triggerCheck(el) {
  const children = el.children;
  children[0].style.display = 'none';
  children[1].style.display = 'inline-block';
}

/**
 * @param {Element} el
 */
function triggerTimes(el) {
  const children = el.children;
  children[0].style.display = 'none';
  children[2].style.display = 'inline-block';
}

/**
 * compatibility test
 */
export default async () => {
  const compat = document.querySelector(`#${ID_COMPATIBILITY}`);
  if (compat)
    try {
      const arr = await Promise.all([
        testWebP(),
        testNativeLazyload(),
        testScrollBehavior(),
        testBackdropFilter(),
      ]);
      let dom = compat;
      dom && (dom = dom.children);
      arr.forEach((res, idx) => {
        if (res) {
          triggerCheck(dom[idx]);
        } else {
          triggerTimes(dom[idx]);
        }
      });
    } catch (e) {
      logError('failed to check compatibility', e);
    }
};
