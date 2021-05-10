import { logError } from '../plugins/loggers';

async function testFlexbox() {
  return (
    CSS.supports('display', 'flex') &&
    CSS.supports('flex', '1 1 auto') &&
    CSS.supports('flex', '0 1 25%') &&
    CSS.supports('flex-direction', 'column') &&
    CSS.supports('justify-content', 'flex-start') &&
    CSS.supports('align-items', 'flex-start') &&
    CSS.supports('flex-wrap', 'wrap')
  );
}

async function testGrid() {
  return (
    CSS.supports('display', 'grid') &&
    CSS.supports('grid-template-columns', 'repeat(4, 1fr)') &&
    CSS.supports('gap', '1rem')
  );
}

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
  return CSS.supports('backdrop-filter', 'saturate(180%) blur(0.2rem)');
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
 * @returns {Promise<void>}
 */
export default async () => {
  try {
    const arr = await Promise.all([
      testFlexbox(),
      testGrid(),
      testWebP(),
      testNativeLazyload(),
      testScrollBehavior(),
      testBackdropFilter(),
    ]);
    let doms = document.querySelector('#content-compat');
    doms && (doms = doms.children);
    arr.forEach((res, idx) => {
      if (res) {
        triggerCheck(doms[idx]);
      } else {
        triggerTimes(doms[idx]);
      }
    });
  } catch (e) {
    logError('failed to check compatibility');
  }
};
