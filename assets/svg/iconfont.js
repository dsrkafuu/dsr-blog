export default function (t) {
  var e,
    n,
    o,
    a,
    i,
    c,
    d,
    s =
      '<svg><symbol id="icon-rss" viewBox="0 0 1024 1024"><path d="M671.47223 926.42c-16.7-309.2-264.36-557.18-573.9-573.9A32 32 0 0 0 63.99223 384.5v96.14a32 32 0 0 0 29.78 32c223.66 14.56 402.94 193.4 417.54 417.54a32 32 0 0 0 32 29.78h96.14a32 32 0 0 0 32-33.58zM96.99223 64A32 32 0 0 0 63.99223 96v96.16a32 32 0 0 0 30.9 32c382.36 15.68 689.26 322.64 704.94 704.94a32 32 0 0 0 32 30.9H927.99223a32 32 0 0 0 32-33C943.19223 459.36 566.91223 80.9 96.99223 64z" opacity=".4" ></path><path d="M63.99223 832a128 128 0 1 1 128 128 128 128 0 0 1-128-128z"  ></path></symbol><symbol id="icon-search" viewBox="0 0 1024 1024"><path d="M415.995413 159.984236a255.974777 255.974777 0 1 1-181.002165 74.972612A254.274945 254.274945 0 0 1 415.995413 159.984236m0-159.984236C186.258051 0 0.0364 186.221651 0.0364 415.959013s186.221651 415.959013 415.959013 415.959014 415.959013-186.221651 415.959014-415.959014S645.732776 0 415.995413 0z" opacity=".4" ></path><path d="M1009.736909 953.306066L953.142486 1009.900489a47.79529 47.79529 0 0 1-67.79332 0L685.968812 810.520135a47.995271 47.995271 0 0 1-13.998621-33.99665V743.926697l71.992906-71.992906h32.596788a47.995271 47.995271 0 0 1 33.99665 13.998621l199.380354 199.380354a48.215249 48.215249 0 0 1-0.19998 67.9933z"  ></path></symbol><symbol id="icon-adjust" viewBox="0 0 1024 1024"><path d="M1008 512c0 274-222 496-496 496V16c274 0 496 222 496 496z" opacity=".4" ></path><path d="M512 16v992C238 1008 16 786 16 512S238 16 512 16z"  ></path></symbol></svg>',
    l = (e = document.getElementsByTagName('script'))[e.length - 1].getAttribute('data-injectcss');
  if (l && !t.__iconfont__svg__cssinject__) {
    t.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
      );
    } catch (t) {
      console && console.log(t);
    }
  }
  function r() {
    c || ((c = !0), a());
  }
  (n = function () {
    var t,
      e,
      n,
      o,
      a,
      i = document.createElement('div');
    (i.innerHTML = s),
      (s = null),
      (t = i.getElementsByTagName('svg')[0]) &&
        (t.setAttribute('aria-hidden', 'true'),
        (t.style.position = 'absolute'),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = 'hidden'),
        (e = t),
        (n = document.body).firstChild
          ? ((o = e), (a = n.firstChild).parentNode.insertBefore(o, a))
          : n.appendChild(e));
  }),
    document.addEventListener
      ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
        ? setTimeout(n, 0)
        : ((o = function () {
            document.removeEventListener('DOMContentLoaded', o, !1), n();
          }),
          document.addEventListener('DOMContentLoaded', o, !1))
      : document.attachEvent &&
        ((a = n),
        (i = t.document),
        (c = !1),
        (d = function () {
          try {
            i.documentElement.doScroll('left');
          } catch (t) {
            return void setTimeout(d, 50);
          }
          r();
        })(),
        (i.onreadystatechange = function () {
          'complete' == i.readyState && ((i.onreadystatechange = null), r());
        }));
}
