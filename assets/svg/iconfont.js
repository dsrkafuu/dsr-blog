export default function (a) {
  var t,
    e,
    o,
    l,
    h,
    i,
    n,
    d =
      '<svg><symbol id="icon-bars" viewBox="0 0 1024 1024"><path d="M96 576h832a32 32 0 0 0 32-32v-64a32 32 0 0 0-32-32H96a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32z" opacity=".4" ></path><path d="M928 768H96a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32h832a32 32 0 0 0 32-32v-64a32 32 0 0 0-32-32z m0-640H96A32 32 0 0 0 64 160v64a32 32 0 0 0 32 32h832a32 32 0 0 0 32-32V160a32 32 0 0 0-32-32z"  ></path></symbol><symbol id="icon-chevron-double-left" viewBox="0 0 1024 1024"><path d="M453.12 478l388-388a47.68 47.68 0 0 1 67.46-0.2l0.2 0.2L954 135.4a48.12 48.12 0 0 1 0 67.7L646.72 512l307.16 308.9a47.74 47.74 0 0 1 0.2 67.5l-0.2 0.2-45.3 45.4a47.68 47.68 0 0 1-67.46 0.2l-0.2-0.2-387.8-388a48.34 48.34 0 0 1 0-68z" opacity=".4" ></path><path d="M70 478L458 90a47.68 47.68 0 0 1 67.46-0.2l0.2 0.2 45.22 45.4a47.74 47.74 0 0 1 0.2 67.5l-0.2 0.2L263.52 512l307.36 308.9a48.12 48.12 0 0 1 0 67.7L525.58 934a47.68 47.68 0 0 1-67.46 0.2l-0.2-0.2L70 546a48.34 48.34 0 0 1 0-68z"  ></path></symbol><symbol id="icon-chevron-left" viewBox="0 0 1024 1024"><path d="M763.18 820.8a47.86 47.86 0 0 1 0 67.68l-45.4 45.3a48 48 0 0 1-67.88 0l-308.62-308L454.84 512z" opacity=".4" ></path><path d="M717.7 90.12l45.4 45.3a47.86 47.86 0 0 1 0 67.68L341.16 625.8l-80-80a47.88 47.88 0 0 1 0-67.68l388.66-388a48 48 0 0 1 67.88 0z"  ></path></symbol><symbol id="icon-chevron-double-right" viewBox="0 0 1024 1024"><path d="M571.2 546L181.58 934a48 48 0 0 1-67.76 0.2l-0.2-0.2-45.48-45.4a48 48 0 0 1 0-67.7L376.78 512 68.14 203.1A47.6 47.6 0 0 1 68 135.6l0.22-0.2L113.62 90a48 48 0 0 1 67.76-0.2l0.2 0.2L571.2 478a48.18 48.18 0 0 1 0 68z" opacity=".4" ></path><path d="M956 546L566.38 934a48 48 0 0 1-67.74 0.2l-0.2-0.2-45.5-45.4a47.62 47.62 0 0 1-0.2-67.5l0.2-0.2L761.6 512 452.94 203.1a48 48 0 0 1 0-67.7L498.44 90a48 48 0 0 1 67.74-0.2 1.88 1.88 0 0 1 0.2 0.2L956 478a48.18 48.18 0 0 1 0 68z"  ></path></symbol><symbol id="icon-chevron-right" viewBox="0 0 1024 1024"><path d="M569.48 512l113.56 113.78L374.42 933.8a48 48 0 0 1-67.88 0l-45.4-45.3a47.86 47.86 0 0 1 0-67.68z" opacity=".4" ></path><path d="M374.5 90.12l388.66 388a47.86 47.86 0 0 1 0 67.68l-80 80-422-422.68a47.84 47.84 0 0 1 0-67.68l45.4-45.3a48 48 0 0 1 67.94-0.02z"  ></path></symbol><symbol id="icon-calendar-day" viewBox="0 0 1024 1024"><path d="M64 384v544a96 96 0 0 0 96 96h704a96 96 0 0 0 96-96V384z m384 352a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32z m224-480h64a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32h-64a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32z m-384 0h64a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32h-64a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32z" opacity=".4" ></path><path d="M960 224v160H64v-160a96 96 0 0 1 96-96h96v96a32 32 0 0 0 32 32h64a32 32 0 0 0 32-32V128h256v96a32 32 0 0 0 32 32h64a32 32 0 0 0 32-32V128h96a96 96 0 0 1 96 96z"  ></path></symbol><symbol id="icon-clock" viewBox="0 0 1024 1024"><path d="M512 16C238 16 16 238 16 512s222 496 496 496 496-222 496-496S786 16 512 16z m184.98 626l-40 50a32 32 0 0 1-44.98 5l-134-99.44a80 80 0 0 1-30-62.46V224a32 32 0 0 1 32-32h64a32 32 0 0 1 32 32v288l116 85a32 32 0 0 1 4.98 45z" opacity=".4" ></path><path d="M696.98 642l-40 50a32 32 0 0 1-44.98 5l-134-99.44a80 80 0 0 1-30-62.46V224a32 32 0 0 1 32-32h64a32 32 0 0 1 32 32v288l116 85a32 32 0 0 1 4.98 45z"  ></path></symbol><symbol id="icon-hashtag" viewBox="0 0 1024 1024"><path d="M468.92 64.38a23 23 0 0 0-4.22-0.38h-81.26a24 24 0 0 0-23.62 19.78L329.06 256h130l29.24-163.78a24 24 0 0 0-19.38-27.84zM208.38 931.78a24 24 0 0 0 19.4 27.84A23 23 0 0 0 232 960h81.28a24 24 0 0 0 23.62-19.78L436.22 384h-130z m327.3 0a24 24 0 0 0 19.4 27.84 23 23 0 0 0 4.22 0.38h81.26a24 24 0 0 0 23.64-19.78L694.94 768h-130z m260.54-867.4A23 23 0 0 0 792 64h-81.26a24 24 0 0 0-23.64 19.78L587.78 640h130l97.84-547.78a24 24 0 0 0-19.4-27.84z" opacity=".4" ></path><path d="M152.36 383.62a23 23 0 0 0 4.22 0.38H634l22-128H170.86a24 24 0 0 0-23.62 19.78l-14.28 80a24 24 0 0 0 19.4 27.84zM78.66 659.78l-14.28 80a24 24 0 0 0 19.4 27.84A23 23 0 0 0 88 768h150l22-128H102.3a24 24 0 0 0-23.64 19.78z m861.56-403.4A23 23 0 0 0 936 256h-150l-22 128h157.7a24 24 0 0 0 23.64-19.78l14.28-80a24 24 0 0 0-19.4-27.84z m-68.58 384a23 23 0 0 0-4.22-0.38H390l-22 128h485.14a24 24 0 0 0 23.62-19.78l14.28-80a24 24 0 0 0-19.4-27.84z"  ></path></symbol><symbol id="icon-rss" viewBox="0 0 1024 1024"><path d="M671.47223 926.42c-16.7-309.2-264.36-557.18-573.9-573.9A32 32 0 0 0 63.99223 384.5v96.14a32 32 0 0 0 29.78 32c223.66 14.56 402.94 193.4 417.54 417.54a32 32 0 0 0 32 29.78h96.14a32 32 0 0 0 32-33.58zM96.99223 64A32 32 0 0 0 63.99223 96v96.16a32 32 0 0 0 30.9 32c382.36 15.68 689.26 322.64 704.94 704.94a32 32 0 0 0 32 30.9H927.99223a32 32 0 0 0 32-33C943.19223 459.36 566.91223 80.9 96.99223 64z" opacity=".4" ></path><path d="M63.99223 832a128 128 0 1 1 128 128 128 128 0 0 1-128-128z"  ></path></symbol><symbol id="icon-search" viewBox="0 0 1024 1024"><path d="M415.995413 159.984236a255.974777 255.974777 0 1 1-181.002165 74.972612A254.274945 254.274945 0 0 1 415.995413 159.984236m0-159.984236C186.258051 0 0.0364 186.221651 0.0364 415.959013s186.221651 415.959013 415.959013 415.959014 415.959013-186.221651 415.959014-415.959014S645.732776 0 415.995413 0z" opacity=".4" ></path><path d="M1009.736909 953.306066L953.142486 1009.900489a47.79529 47.79529 0 0 1-67.79332 0L685.968812 810.520135a47.995271 47.995271 0 0 1-13.998621-33.99665V743.926697l71.992906-71.992906h32.596788a47.995271 47.995271 0 0 1 33.99665 13.998621l199.380354 199.380354a48.215249 48.215249 0 0 1-0.19998 67.9933z"  ></path></symbol><symbol id="icon-adjust" viewBox="0 0 1024 1024"><path d="M1008 512c0 274-222 496-496 496V16c274 0 496 222 496 496z" opacity=".4" ></path><path d="M512 16v992C238 1008 16 786 16 512S238 16 512 16z"  ></path></symbol></svg>',
    c = (t = document.getElementsByTagName('script'))[t.length - 1].getAttribute('data-injectcss');
  if (c && !a.__iconfont__svg__cssinject__) {
    a.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
      );
    } catch (a) {
      console && console.log(a);
    }
  }
  function s() {
    i || ((i = !0), l());
  }
  (e = function () {
    var a,
      t,
      e,
      o,
      l,
      h = document.createElement('div');
    (h.innerHTML = d),
      (d = null),
      (a = h.getElementsByTagName('svg')[0]) &&
        (a.setAttribute('aria-hidden', 'true'),
        (a.style.position = 'absolute'),
        (a.style.width = 0),
        (a.style.height = 0),
        (a.style.overflow = 'hidden'),
        (t = a),
        (e = document.body).firstChild
          ? ((o = t), (l = e.firstChild).parentNode.insertBefore(o, l))
          : e.appendChild(t));
  }),
    document.addEventListener
      ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
        ? setTimeout(e, 0)
        : ((o = function () {
            document.removeEventListener('DOMContentLoaded', o, !1), e();
          }),
          document.addEventListener('DOMContentLoaded', o, !1))
      : document.attachEvent &&
        ((l = e),
        (h = a.document),
        (i = !1),
        (n = function () {
          try {
            h.documentElement.doScroll('left');
          } catch (a) {
            return void setTimeout(n, 50);
          }
          s();
        })(),
        (h.onreadystatechange = function () {
          'complete' == h.readyState && ((h.onreadystatechange = null), s());
        }));
}
