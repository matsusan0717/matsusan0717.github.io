/**
 * ==========================================================================
 * M-StruX - External JavaScript Bundle (external.js)
 * 
 * Blogger Template "M-StruX" External Script
 * Template.xml 内に記述されていた外部化可能なJavaScriptコードを統合したファイルです。
 * 
 * 合計 32 モジュール
 * ==========================================================================
 */

/* ==========================================================================
   1. ナビゲーションバー追従制御 (Peek.js 初期化)
   上部グローバルナビゲーションのスクロール連動表示・非表示クラス制御
   (元 Template.xml 行番号: L85 - L102)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof Peek === 'function') {
    Peek('.global-nav', {
      offset: 250,
      tolerance: 5,
      classes: {
        pinned: 'nav-pinned',
        unpinned: 'nav-unpinned',
        top: 'nav-at-top',
        notTop: 'nav-not-top'
      }
    });
  }
});

/* ==========================================================================
   2. View Transitions & 記事アイキャッチ画像アニメーション制御
   ページ遷移時のView Transition名設定・解除およびスクロール復元手動化
   (元 Template.xml 行番号: L188 - L411)
   ========================================================================== */
(function () {
  var PREFIX = "post-image-";
  if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }

  function isMobileDevice() {
    return /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
  }
  window.__isMobileDevice = isMobileDevice;

  function slugOf(url) {
    try {
      var p = new URL(url, location.href).pathname;
      p = p.replace(/\.html$/, "").replace(/\/+$/, "");
      var seg = p.split("/");
      return PREFIX + (seg[seg.length - 1] || p);
    } catch (e) {
      return "";
    }
  }
  function isArticleUrl(u) {
    try {
      return /\/\d{4}\/\d{2}\/[^/]+\.html$/.test(
        new URL(u, location.href).pathname,
      );
    } catch (e) {
      return false;
    }
  }
  function setName(el, name) {
    if (el && name) el.style.viewTransitionName = name;
  }
  function clearName(el) {
    if (el) el.style.viewTransitionName = "none";
  }
  function findThumb(url) {
    var s = slugOf(url),
      best = null;
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      if (slugOf(links[i].href) === s) {
        if (links[i].querySelector("img")) return links[i];
        if (!best) best = links[i];
      }
    }
    return best;
  }
  window.__vtUtil = {
    slugOf: slugOf,
    isArticleUrl: isArticleUrl,
    setName: setName,
    clearName: clearName,
    findThumb: findThumb,
  };

  document.addEventListener(
    "click",
    function (e) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      if (
        typeof window.__vtSupports !== "function" ||
        !window.__vtSupports(href)
      )
        return;
      if (typeof window.__vtRender !== "function") return;

      e.preventDefault();
      var oldUrl = location.href;
      if (!isMobileDevice()) {
        if (isArticleUrl(oldUrl)) {
          var ai = document.querySelector(".post-body img");
          if (ai) setName(ai, slugOf(oldUrl));
        } else if (isArticleUrl(href)) {
          var link = findThumb(href);
          if (link) {
            var li = link.querySelector("img");
            if (li) setName(li, slugOf(href));
          }
        }
      }

      var vt = window.__vtRender(href, function () {
        var newUrl = location.href;
        function waitDecode(img) {
          if (!img) return Promise.resolve();
          var p = (img.decode ? img.decode() : Promise.resolve()).catch(
            function () {
              return Promise.resolve();
            },
          );
          var to = new Promise(function (res) {
            setTimeout(res, 1000);
          });
          return Promise.race([p, to]);
        }
        if (isArticleUrl(newUrl) && !isArticleUrl(oldUrl)) {
          var a2 = document.querySelector(".post-body img");
          return waitDecode(a2).then(function () {
            if (a2) {
              setName(a2, slugOf(newUrl));
              if (vt && vt.ready)
                vt.ready.then(function () {
                  clearName(a2);
                });
            }
          });
        } else if (!isArticleUrl(newUrl) && isArticleUrl(oldUrl)) {
          var link2 = findThumb(oldUrl);
          var li2 = link2 ? link2.querySelector("img") : null;
          return waitDecode(li2).then(function () {
            if (li2) {
              setName(li2, slugOf(oldUrl));
              if (vt && vt.ready)
                vt.ready.then(function () {
                  clearName(li2);
                });
            }
          });
        }
        return Promise.resolve();
      });
    },
    true,
  );
  window.addEventListener("pageswap", function (e) {
    if (!e.viewTransition || isMobileDevice()) return;
    var act = e.activation;
    if (!act || !act.entry) return;
    var targetUrl = act.entry.url;
    if (isArticleUrl(targetUrl)) {
      var link = findThumb(targetUrl);
      if (link) {
        var img = link.querySelector("img");
        if (img) setName(img, slugOf(targetUrl));
      }
    } else {
      var a = document.querySelector(".post-body img");
      if (a) setName(a, slugOf(location.href));
    }
  });
  function whenElement(selector, cb, onFail, deadline) {
    var el = document.querySelector(selector);
    if (el) {
      cb(el);
      return;
    }
    var start = Date.now(),
      done = false,
      to = deadline || 1500;
    var obs = new MutationObserver(function () {
      var e2 = document.querySelector(selector);
      if (e2) {
        done = true;
        obs.disconnect();
        cb(e2);
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    var iv = setInterval(function () {
      if (done) {
        clearInterval(iv);
        return;
      }
      if (Date.now() - start > to) {
        clearInterval(iv);
        obs.disconnect();
        if (onFail) onFail();
      }
    }, 50);
    requestAnimationFrame(function () {
      var e3 = document.querySelector(selector);
      if (e3 && !done) {
        done = true;
        clearInterval(iv);
        obs.disconnect();
        cb(e3);
      }
    });
  }
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition || isMobileDevice()) return;
    var nav = window.navigation;
    if (!nav || !nav.activation || !nav.activation.from) return;
    var fromUrl = nav.activation.from.url,
      curUrl = nav.activation.entry.url;
    var vt = e.viewTransition;
    if (isArticleUrl(curUrl) && !isArticleUrl(fromUrl)) {
      whenElement(".post-body img", function (a) {
        setName(a, slugOf(curUrl));
        vt.ready.then(function () {
          clearName(a);
        });
      });
    } else if (!isArticleUrl(curUrl) && isArticleUrl(fromUrl)) {
      whenElement("a[href]", function () {
        var link = findThumb(fromUrl);
        if (link) {
          var img = link.querySelector("img");
          if (img) {
            setName(img, slugOf(fromUrl));
            vt.ready.then(function () {
              clearName(img);
            });
          }
        }
      });
    }
  });
})();

/* ==========================================================================
   3. Google AdSense アンカー広告 非表示制御
   画面下部等のアンカー広告 (ins.adsbygoogle) をMutationObserverで監視して非表示化
   (元 Template.xml 行番号: L412 - L482)
   ========================================================================== */
(function() {
        var hideAnchorAds = function() {
          document.querySelectorAll('ins.adsbygoogle[data-anchor-status="displayed"]').forEach(function(ad) {
            ad.style.setProperty('display', 'none', 'important');
            ad.style.setProperty('visibility', 'hidden', 'important');
            ad.style.setProperty('opacity', '0', 'important');
            ad.style.setProperty('height', '0', 'important');
            ad.style.setProperty('min-height', '0', 'important');
            ad.style.setProperty('max-height', '0', 'important');
            ad.style.setProperty('overflow', 'hidden', 'important');
            ad.style.setProperty('transform', 'none', 'important');
            ad.style.setProperty('transition', 'none', 'important');
            ad.style.setProperty('animation', 'none', 'important');
            ad.style.setProperty('pointer-events', 'none', 'important');
          });
        };
        hideAnchorAds();
        var observer = new MutationObserver(function(mutations) {
          var shouldHide = false;
          for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            if (m.type === 'childList') {
              for (var j = 0; j < m.addedNodes.length; j++) {
                var node = m.addedNodes[j];
                if (node.nodeType === 1) {
                  if (node.matches && node.matches('ins.adsbygoogle[data-anchor-status="displayed"]')) {
                    shouldHide = true;
                    break;
                  }
                  if (node.querySelector && node.querySelector('ins.adsbygoogle[data-anchor-status="displayed"]')) {
                    shouldHide = true;
                    break;
                  }
                }
              }
            } else if (m.type === 'attributes' && m.attributeName === 'data-anchor-status') {
              if (m.target.getAttribute('data-anchor-status') === 'displayed') {
                shouldHide = true;
              }
            }
            if (shouldHide) break;
          }
          if (shouldHide) hideAnchorAds();
        });
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['data-anchor-status']
        });
        // SPA対応: History APIのフック
        var origPushState = history.pushState;
        if (origPushState) {
          history.pushState = function() {
            origPushState.apply(this, arguments);
            setTimeout(hideAnchorAds, 0);
            setTimeout(hideAnchorAds, 100);
            setTimeout(hideAnchorAds, 300);
          };
        }
        window.addEventListener('popstate', function() {
          setTimeout(hideAnchorAds, 0);
          setTimeout(hideAnchorAds, 100);
          setTimeout(hideAnchorAds, 300);
        });
        window.addEventListener('hashchange', hideAnchorAds);
      })();

/* ==========================================================================
   4. A/Bテスト アイテム ランダム表示
   .strux-ab-item 要素の中からランダムで1つを選択して表示
   (元 Template.xml 行番号: L2613 - L2623)
   ========================================================================== */
(function() {
    		const struxAbElements = document.querySelectorAll('.strux-ab-item');
    		if (struxAbElements.length > 0) {
        		const struxSelectedIdx = Math.floor(Math.random() * struxAbElements.length);
        		struxAbElements[struxSelectedIdx].style.display = 'block';
    		}
		})();

/* ==========================================================================
   5. サイドバー ランダム記事ウィジェット
   ブログフィードから記事をランダム取得してサイドバーにカード描画
   (元 Template.xml 行番号: L2754 - L2870)
   ========================================================================== */
(function () {
  function detectSingleItem() {
    return (
      /\/[0-9]{4}\/[0-9]{2}\/[^\/]+\.html/.test(window.location.href) ||
      document.body.classList.contains("item-view")
    );
  }
  function buildSidebarRandom() {
    var single = detectSingleItem();
    var postCount = single ? 5 : 3;
    var blogURL =
      window.location.protocol + "//" + window.location.hostname + "/";
    fetch(blogURL + "feeds/posts/default?alt=json&max-results=50")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var entries = (data.feed && data.feed.entry) || [];
        if (!entries.length) return;
        var picked = [],
          len = entries.length;
        while (picked.length < Math.min(len, postCount)) {
          var r = Math.floor(Math.random() * len);
          if (picked.indexOf(r) === -1) picked.push(r);
        }
        var noImg =
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPDYu4ibLWCVdJdTwQa2zoBViIfND-ZB0Y9g8IU1Csk_7AoRwVi1efzTdGFKjaiXh9LPWyCllES9iKlhik8b2G2liUUd8oeAA4NOVflZO3VqPtxhzuUteSAIGCRkyw2Ps8R5FjyFd1FzhmgPYCeAUGBM2qx3Z-lXUGUft6xgiKGUORq3Uz2ULqbSZFEsQ/s1600/NoImage.png";
        var html = "";
        if (single) {
          picked.forEach(function (idx) {
            var e = entries[idx];
            var title = e.title.$t;
            var link = "";
            for (var k = 0; k < e.link.length; k++) {
              if (e.link[k].rel === "alternate") {
                link = e.link[k].href;
                break;
              }
            }
            var img = noImg;
            if (e.media$thumbnail)
              img = e.media$thumbnail.url
                .replace(/\/(s|w|h)\d+[^/]*\//, "/s80-c/")
                .replace(/=[swh]\d+[^&]*/, "=s80-c");
            html +=
              '<a href="' +
              link +
              '" class="rnd-list-item" style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);text-decoration:none;">' +
              '<span style="width:52px;min-width:52px;height:52px;border-radius:6px;overflow:hidden;flex-shrink:0;display:block;background:#eee;">' +
              '<img src="' +
              img +
              '" alt="" style="width:52px;height:52px;object-fit:cover;display:block;transition:transform 0.3s ease;" loading="lazy"/>' +
              "</span>" +
              '<span style="flex:1;font-size:13px;font-weight:bold;color:var(--text-main);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' +
              title +
              "</span>" +
              "</a>";
          });
        } else {
          picked.forEach(function (idx) {
            var e = entries[idx];
            var title = e.title.$t;
            var link = "";
            for (var k = 0; k < e.link.length; k++) {
              if (e.link[k].rel === "alternate") {
                link = e.link[k].href;
                break;
              }
            }
            var img = noImg;
            if (e.media$thumbnail)
              img = e.media$thumbnail.url
                .replace(/\/(s|w|h)\d+[^/]*\//, "/w400-rw/")
                .replace(/=[swh]\d+[^&]*/, "=w400-rw");
            html +=
              '<a href="' +
              link +
              '" class="rnd-card-item" style="display:block;position:relative;width:100%;aspect-ratio:16/10;margin-bottom:14px;border-radius:8px;overflow:hidden;text-decoration:none;">' +
              '<img src="' +
              img +
              '" alt="" style="width:100%;height:100%;object-fit:cover;background:#eee;transition:transform 0.3s ease;" loading="lazy">' +
              '<div style="position:absolute;bottom:0;left:0;right:0;padding:24px 12px 10px;background:linear-gradient(transparent,rgba(0,0,0,0.78));">' +
              '<span style="display:block;font-size:13px;font-weight:bold;color:#fff;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:1px 1px 3px rgba(0,0,0,.5);">' +
              title +
              "</span>" +
              "</div></a>";
          });
        }
        document.querySelectorAll('#sidebar-random-posts-list').forEach(function(el) {
          el.innerHTML = html || '<span style="color:var(--text-muted);">記事が見つかりませんでした</span>';
        });
      })
      .catch(function (err) {
        console.error("Sidebar Random Posts Error:", err);
      });
  }
  var _lastHref = "";
  function initSidebarRandom() {
    _lastHref = window.location.href;
    buildSidebarRandom();
    setInterval(function () {
      if (window.location.href !== _lastHref) {
        _lastHref = window.location.href;
        setTimeout(buildSidebarRandom, 300);
      }
    }, 500);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarRandom);
  } else {
    initSidebarRandom();
  }
})();

/* ==========================================================================
   6. URL監視 & bodyクラス制御 (is-homepage, is-post)
   SPA遷移やハッシュ変更時にURLを検知してbodyに状態クラスを自動付与
   (元 Template.xml 行番号: L2871 - L2915)
   ========================================================================== */
(function() {
  function updateBodyClass() {
    var path = window.location.pathname;
    var search = window.location.search;
    var params = new URLSearchParams(search);
    var isPage1 = params.get('page') === '1';
    var isHomepage =
      ((path === '/' || path === '/index.html' || path === '') &&
      (!search.includes('page=') || isPage1));

    if (isHomepage) {
      document.body.classList.add('is-homepage');
    } else {
      document.body.classList.remove('is-homepage');
    }
    var isPost = /\/\d{4}\/\d{2}\/[^/]+\.html$/.test(path);
    if (isPost) {
      document.body.classList.add('is-post');
    } else {
      document.body.classList.remove('is-post');
    }
  }
  updateBodyClass();
  var observer = new MutationObserver(function() {
    updateBodyClass();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  var lastUrl = location.href;
  new MutationObserver(function() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      updateBodyClass();
    }
  }).observe(document, {
    subtree: true,
    childList: true
  });
})();

/* ==========================================================================
   7. A8.net ランダムバナーB
   サイドバー下部のA8バナーをランダム選定して挿入
   (元 Template.xml 行番号: L3043 - L3066)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const adTags = [
        '<a href="https://px.a8.net/svt/ejp?a8mat=3ZB8U2+5R71GY+348+6KMIP" rel="nofollow"><img border="0" width="300" height="250" alt="" src="https://www29.a8.net/svt/bgt?aid=240709754348&wid=009&eno=01&mid=s00000000404001104000&mc=1"></a><img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=3ZB8U2+5R71GY+348+6KMIP" alt="">',
        '<a href="https://px.a8.net/svt/ejp?a8mat=3ZB8U2+5R71GY+348+6EMGX" rel="nofollow"><img border="0" width="336" height="280" alt="" src="https://www23.a8.net/svt/bgt?aid=240709754348&wid=009&eno=01&mid=s00000000404001076000&mc=1" style="width:100%;"></a><img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=3ZB8U2+5R71GY+348+6EMGX" alt="">',
        '<a href="https://px.a8.net/svt/ejp?a8mat=3Z55Z3+B2WIEI+3IB8+601S1" rel="nofollow"><img border="0" width="300" height="250" alt="" src="https://www21.a8.net/svt/bgt?aid=240426111670&wid=004&eno=01&mid=s00000016370001008000&mc=1"></a><img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=3Z55Z3+B2WIEI+3IB8+601S1" alt="">'
    ];
    const targetElement = document.getElementById('a8-random-banner-b');
    if (targetElement) {
        const randomIndex = Math.floor(Math.random() * adTags.length);
        targetElement.innerHTML = adTags[randomIndex];
    } else {
        window.addEventListener('load', function() {
            const retryElement = document.getElementById('a8-random-banner-b');
            if (retryElement) {
                const randomIndex = Math.floor(Math.random() * adTags.length);
                retryElement.innerHTML = adTags[randomIndex];
            }
        });
    }
});

/* ==========================================================================
   8. M-StruX コアアプリケーション (SPA・記事・目次・検索・パンくず・無限スクロール等)
   M-StruX テンプレートのメインロジック (BLOG_CONFIG等を参照して動作する約112KBのコア機能群)
   (元 Template.xml 行番号: L3391 - L5537)
   ========================================================================== */
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}(function() {
  "use strict";
  const t = window.location.hostname === "draft.blogger.com" || window
    .location.search.includes("isPreview=1");
  const e = () => {
    if (t) {
      const t = document.querySelector('link[rel="canonical"]');
      if (t && t.href) {
        return new URL(t.href).origin
      }
    }
    return ""
  };
  const s = () => {
    const t = window.location.hostname === "draft.blogger.com";
    if (t) {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.setProperty("color-scheme", "light");
      return
    }
    const e = localStorage.getItem("mbare-theme");
    if (e) {
      document.documentElement.setAttribute("data-theme", e)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark")
    }
  };
  s();
  const n = () => {
    if (window.location.hostname.includes("blogger.com")) return;
    const t = document.documentElement;
    let e = t.getAttribute("data-theme");
    if (!e) {
      e = window.matchMedia("(prefers-color-scheme: dark)").matches ?
        "dark" : "light"
    }
    const s = e === "dark" ? "light" : "dark";
    t.setAttribute("data-theme", s);
    localStorage.setItem("mbare-theme", s)
  };
  const a =
    `<svg style="width:12px;height:12px;margin-right:4px;vertical-align:-0.125em;" viewBox="0 0 448 512" fill="currentColor"><path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`;
  const o =
    `<svg style="width:12px;height:12px;margin-right:4px;vertical-align:-0.125em;" viewBox="0 0 448 512" fill="currentColor"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h352V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"/></svg>`;
  const i =
    `<svg style="width:12px;height:12px;margin-right:4px;vertical-align:-0.125em;" viewBox="0 0 512 512" fill="currentColor"><path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L427 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8h19.5z"/></svg>`;
  const l =
    `<svg style="width:16px;height:16px;" viewBox="0 0 512 512" fill="currentColor"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`;
  const r =
    `<svg style="width:12px;height:12px;margin-right:4px;vertical-align:-0.125em;" viewBox="0 0 512 512" fill="currentColor"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0c0.3-0.3 8.7-8.7 20.3-25.2c1.7-2.4 3.4-4.9 5.2-7.5c12.5-17.8 24-34.1 27.6-46.7C20.3 344.2 0 294.1 0 240C0 125.1 114.6 32 256 32S512 125.1 512 240z"/></svg>`;
  const c = t => {
    const e = document.createElement("div");
    e.innerHTML = t;
    e.querySelectorAll("pre, code, #toc, .matsu-toc, script, style")
      .forEach(t => t.remove());
    return e.textContent || e.innerText || ""
  };
  window.copyToClipboard = (t, e) => {
    const s = t => {
      const e = document.createElement("textarea");
      e.value = t;
      document.body.appendChild(e);
      e.select();
      try {
        document.execCommand("copy");
        n()
      } catch (t) {
        console.error("Fallback copy failed", t)
      }
      document.body.removeChild(e)
    };
    const n = () => {
      const t = e.textContent;
      e.textContent = "コピー完了！";
      e.classList.add("success");
      setTimeout(() => {
        e.textContent = t;
        e.classList.remove("success")
      }, 2e3)
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(n).catch(() => s(t))
    } else {
      s(t)
    }
  };
  const d = t => {
    const e = new Date(t);
    if (isNaN(e.getTime())) return "";
    return `${e.getFullYear()}/${String(e.getMonth()+1).padStart(2,"0")}/${String(e.getDate()).padStart(2,"0")}`
  };
  const resizeGoogleImage = (url, size = "s120-rw") => {
    if (!url) return url;
    if (url.includes("googleusercontent.com") || url.includes("blogspot.com")) {
      return url.replace(/\/(s|w|h)\d+[^\/]*\//, `/${size}/`).replace(/=[swh]\d+[^&]*/, `=${size}`);
    }
    return url;
  };
  const optimizeAllImagesOnPage = () => {
    const profileImgs = document.querySelectorAll('#sidebar-author-img, .author-avatar, .author-profile img, #mobile-profile-avatar');
    profileImgs.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.includes('googleusercontent.com') && !src.includes('/s120-rw/') && !src.includes('/s120/')) {
        img.setAttribute('src', resizeGoogleImage(src, 's120-rw'));
      }
    });
    const starImgs = document.querySelectorAll('.htns');
    starImgs.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.includes('googleusercontent.com') && !src.includes('/s30-rw/') && !src.includes('/s30/')) {
        img.setAttribute('src', resizeGoogleImage(src, 's30-rw'));
      }
    });
    const evaImg = document.getElementById('eva_poster_image_front');
    if (evaImg) {
      const src = evaImg.getAttribute('src');
      if (src && src.includes('googleusercontent.com') && !src.includes('/w300-rw/') && !src.includes('/w300/')) {
        evaImg.setAttribute('src', resizeGoogleImage(src, 'w300-rw'));
      }
    }
  };
  setInterval(optimizeAllImagesOnPage, 500);
  const m = (t, e = "w400-rw") => {
    if (t.media$thumbnail && t.media$thumbnail.url) {
      return t.media$thumbnail.url.replace(/\/(s|w|h)\d+[^\/]*\//,
        `/${e}/`)
    }
    if (t.content && t.content.$t) {
      const s = t.content.$t.match(/<img[^>]+src="([^">]+)"/);
      if (s) {
        const t = s[1];
        if (t.includes("googleusercontent.com")) {
          return t.replace(/\/(s|w|h)\d+[^/]*\//, `/${e}/`).replace(
            /=[swh]\d+[^&]*/, `=${e}`)
        }
        return t
      }
    }
    return null
  };
  const p = t => {
    if (!t.category) return "";
    const e = t.category.filter(t => !t.term.startsWith("#")).map(t =>
      `<span class='post-label-item'>${a}${t.term}</span>`).join("");
    return e ? `<div class='post-labels'>${e}</div>` : ""
  };
  const h = (t = 6) => {
    const e = BLOG_CONFIG.viewMode !== "list";
    let s = "";
    if (e) {
      for (let e = 0; e < t; e++) {
        s +=
          ` <div class='skeleton-card'> <div class='skeleton skeleton-thumb'></div> <div class='skeleton skeleton-text'></div> <div class='skeleton skeleton-text' style='width:60%'></div> <div class='skeleton skeleton-meta'></div> </div> `
      }
      return `<div class='post-grid'>${s}</div>`
    } else {
      for (let e = 0; e < t; e++) {
        s +=
          ` <div class='skeleton-card' style='display:flex;gap:1rem;margin-bottom:1rem;'> <div class='skeleton' style='width:240px;min-width:240px;height:135px;border-radius:var(--radius);'></div> <div style='flex:1;'> <div class='skeleton skeleton-text' style='height:1.4rem;margin-bottom:0.6rem;'></div> <div class='skeleton skeleton-text'></div> <div class='skeleton skeleton-text' style='width:70%'></div> <div class='skeleton skeleton-meta' style='margin-top:1rem;'></div> </div> </div> `
      }
      return `<div class='post-list-wrap'>${s}</div>`
    }
  };
  const u = t => {
    const e = t.title && t.title.$t ? t.title.$t : "No Title";
    const s = t.link ? t.link.find(t => t.rel === "alternate")?.href ||
      "#" : "#";
    const n = t.summary ? t.summary.$t : t.content ? t.content.$t : "";
    let a = c(n).substring(0, 100);
    if (n.length > 100) a += "...";
    const i = t.published ? d(t.published.$t) : "";
    const l = m(t);
    const r = l ?
      `<div class='post-thumbnail-wrapper'><img src='${l}' alt='${e}' class='post-thumbnail' loading='lazy'/></div>` :
      `<div class='post-thumbnail-wrapper' style='display:flex;align-items:center;justify-content:center;color:var(--text-muted);'>No Image</div>`;
    const h = p(t);
    return ` <article class='post-card'> <a href='${s}' class='post-link'> ${r} <div class='post-content'> ${h} <h2 class='post-title'>${e}</h2> <p class='post-summary'>${a}</p> <div class='post-footer'> <span class='post-date'>${o}${i}</span> <span class='post-readmore'>続きを読む &raquo;</span> </div> </div> </a> </article> `
  };
  const g = t => {
    t.querySelectorAll("script").forEach(t => {
      if (t.dataset.executed) return;
      const e = document.createElement("script");
      Array.from(t.attributes).forEach(t => e.setAttribute(t.name, t
        .value));
      if (!t.src) e.textContent = t.textContent;
      t.dataset.executed = "true";
      t.replaceWith(e)
    });
    t.querySelectorAll("style").forEach(t => {
      if (t.dataset.moved) return;
      const e = document.createElement("style");
      e.textContent = t.textContent;
      e.dataset.entryStyle = "true";
      t.dataset.moved = "true";
      t.remove();
      document.head.appendChild(e)
    });
    const e = /&lt;script([\s\S]*?)&gt;([\s\S]*?)&lt;\/script&gt;/gi;
    const s = t => {
      if (t.nodeType === Node.TEXT_NODE) {
        const s = t.textContent;
        if (!s.includes("&lt;script")) return;
        e.lastIndex = 0;
        let n;
        while ((n = e.exec(s)) !== null) {
          const t = n[1];
          const e = n[2];
          const s = document.createElement("script");
          const a = t.match(/src=["']([^"']+)["']/);
          if (a) s.src = a[1].replace(/^\/\//, "https://");
          if (/async/.test(t)) s.async = !0;
          const o = t.match(/charset=["']([^"']+)["']/);
          if (o) s.charset = o[1];
          if (!a && e.trim()) s.textContent = e.trim();
          document.body.appendChild(s)
        }
      } else if (t.nodeType === Node.ELEMENT_NODE) {
        if (["TABLE", "THEAD", "TBODY", "TR", "TD", "TH"].includes(t
            .tagName)) return;
        Array.from(t.childNodes).forEach(s)
      }
    };
    s(t)
  };
  const f = () => {
    const t = document.querySelector(".post-body");
    if (t) g(t);
    const e = document.querySelectorAll(
      ".post-body blockquote.twitter-tweet");
    if (e.length > 0) {
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load()
      } else {
        const t = document.createElement("script");
        t.src = "https://platform.twitter.com/widgets.js";
        t.async = !0;
        t.onload = () => window.twttr.widgets.load();
        document.head.appendChild(t)
      }
    }
    const s = document.querySelectorAll(
      ".post-body blockquote.instagram-media");
    if (s.length > 0) {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process()
      } else {
        const t = document.createElement("script");
        t.src = "https://www.instagram.com/embed.js";
        t.async = !0;
        t.onload = () => window.instgrm.Embeds.process();
        document.head.appendChild(t)
      }
    }
    const n = document.querySelectorAll(".post-body .twitter-lazy");
    if (n.length > 0) {
      const t = new IntersectionObserver(e => {
        e.forEach(e => {
          if (!e.isIntersecting) return;
          const s = e.target;
          const n = s.getAttribute("data-tweet-id");
          const w = s.parentElement ? s.parentElement.offsetWidth : 0;
          if (w > 0) s.style.width = Math.min(w, 550) + "px";
          s.innerHTML =
            `<blockquote class="twitter-tweet" data-width="550"><a href="https://twitter.com/x/status/${n}"></a></blockquote>`;
          const loadTweet = () => {
            if (window.twttr && window.twttr.widgets) {
              window.twttr.widgets.load(s)
            } else {
              const t = document.createElement("script");
              t.src = "https://platform.twitter.com/widgets.js";
              t.async = !0;
              t.onload = () => window.twttr.widgets.load(s);
              document.head.appendChild(t)
            }
          };
          requestAnimationFrame(() => requestAnimationFrame(loadTweet));
          t.unobserve(s)
        })
      }, {
        rootMargin: "0px 0px 300px 0px"
      });
      n.forEach(e => t.observe(e))
    }
    const a = document.querySelectorAll(".post-body .instagram-lazy");
    if (a.length > 0) {
      a.forEach(t => {
        const e = t.getAttribute("data-url");
        t.innerHTML =
          `<blockquote class="instagram-media" data-instgrm-permalink="${e}" data-instgrm-version="14" style="width:100%; margin:0;"></blockquote>`
      });
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process()
      } else {
        const t = document.createElement("script");
        t.src = "https://www.instagram.com/embed.js";
        t.async = !0;
        t.onload = () => window.instgrm.Embeds.process();
        document.head.appendChild(t)
      }
    }
  };
  const v = () => {
    const imgs = document.querySelectorAll('.post-body img');
    imgs.forEach((img, i) => {
      const e = img.getAttribute('data-original-width');
      const s = img.getAttribute('data-original-height');
      if (e && s) {
        img.style.aspectRatio = `${e} / ${s}`;
        img.style.objectFit = 'cover';
      }
      img.removeAttribute('width');
      img.removeAttribute('height');
      const src = img.getAttribute('src');
      if (src && (img.classList.contains('htns') || src.includes('hatenastar') || src.includes('nvK24Yqth'))) {
        const newSrc = resizeGoogleImage(src, "s30-rw");
        img.setAttribute('src', newSrc);
        return;
      }
      if (src && src.includes('googleusercontent.com')) {
        const newSrc = src
          .replace(/\/((?:s|w|h)\d+)([^\/]*)\//, (_, size, flags) => {
            if (flags.includes('rw')) return `/${size}${flags}/`;
            return `/${size}${flags}-rw/`;
          });
        img.setAttribute('src', newSrc);
      }
      if (i > 0 && !img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  };  const y = () => {
    const t = (t, e) => {
      if (!e || t.dataset.adRendered) return;
      t.dataset.adRendered = "true";
      const s = AD_CONFIG.client;
      const f = (AD_CONFIG.formats && AD_CONFIG.formats[t.id]) ? AD_CONFIG.formats[t.id] : "auto";
      t.innerHTML =
        ` <ins class="adsbygoogle" style="display:block" data-ad-client="${s}" data-ad-slot="${e}" data-ad-format="${f}" data-full-width-responsive="true"></ins>`;
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const t = document.createElement("script");
        t.src =
          `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${s}`;
        t.async = !0;
        t.crossOrigin = "anonymous";
        document.head.appendChild(t)
      }(window.adsbygoogle = window.adsbygoogle || []).push({})
    };
    const e = new IntersectionObserver(s => {
      s.forEach(s => {
        if (!s.isIntersecting) return;
        const n = s.target;
        const a = n.id;
        const o = AD_CONFIG.slots[a];
        if (o) t(n, o);
        e.unobserve(n)
      })
    }, {
      rootMargin: "0px 0px 400px 0px"
    });
    document.querySelectorAll(".adsense-slot").forEach(t => {
      if (AD_CONFIG.slots[t.id]) e.observe(t);
      else t.style.display = "none"
    });
    const s = t => {
      const e = t.getAttribute("data-url");
      t.innerHTML =
        `<blockquote class="instagram-media" data-instgrm-permalink="${e}" data-instgrm-version="14" style="width:100%; margin:0;"></blockquote>`;
      const s = () => setTimeout(() => {
        if (window.instgrm && window.instgrm.Embeds) window.instgrm
          .Embeds.process()
      }, 100);
      if (!window.instgrm) {
        const t = document.createElement("script");
        t.src = "https://www.instagram.com/embed.js";
        t.async = !0;
        t.onload = s;
        document.head.appendChild(t)
      } else {
        s()
      }
    };
    const n = new IntersectionObserver(t => {
      t.forEach(t => {
        if (!t.isIntersecting) return;
        const e = t.target;
        const s = AD_CONFIG.client;
        const a = e.getAttribute("data-ad-slot");
        e.innerHTML =
          ` <ins class="adsbygoogle" style="display:block" data-ad-client="${s}" data-ad-slot="${a}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
        if (!document.querySelector(
          'script[src*="adsbygoogle.js"]')) {
          const t = document.createElement("script");
          t.src =
            `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${s}`;
          t.async = !0;
          t.crossOrigin = "anonymous";
          document.head.appendChild(t)
        }(window.adsbygoogle = window.adsbygoogle || []).push({});
        n.unobserve(e)
      })
    }, {
      rootMargin: "0px 0px 500px 0px"
    });
    document.querySelectorAll(".adsense-lazy").forEach(t => n.observe(t));
    const a = new IntersectionObserver(t => {
      t.forEach(t => {
        if (!t.isIntersecting) return;
        s(t.target);
        a.unobserve(t.target)
      })
    }, {
      rootMargin: "0px 0px 500px 0px"
    });
    document.querySelectorAll(".instagram-lazy").forEach(t => a.observe(t));
  };
  const b = t => {
    const e = t.title && t.title.$t ? t.title.$t : "No Title";
    const s = t.link ? t.link.find(t => t.rel === "alternate")?.href ||
      "#" : "#";
    const n = t.summary ? t.summary.$t : t.content ? t.content.$t : "";
    let a = c(n).substring(0, 140);
    if (n.length > 140) a += "...";
    const i = t.published ? d(t.published.$t) : "";
    const l = m(t);
    const r = l ?
      `<div class='list-thumb-inner'><img src='${l}' alt='${e}' class='post-thumbnail' loading='lazy'/></div>` :
      `<div class='list-thumb-inner' style='display:flex;align-items:center;justify-content:center;color:var(--text-muted);'>No Image</div>`;
    const h = p(t);
    return ` <article class='post-item-list'> <a href='${s}' class='list-link'> <div class='list-thumb'>${r}</div> <div class='list-content'> ${h} <h2 class='list-title'>${e}</h2> <p class='list-summary'>${a}</p> <div class='list-footer'> <span class='list-date'>${o}${i}</span> <span class='list-readmore'>続きを読む &raquo;</span> </div> </div> </a> </article> `
  };
  const $ = t => {
    const e = t.title && t.title.$t ? t.title.$t : "No Title";
    const s = t.content && t.content.$t ? t.content.$t : "";
    const n = t.published && t.published.$t ? d(t.published.$t) : "";
    const l = t.updated && t.updated.$t ? d(t.updated.$t) : n;
    const c = t.thr$total && t.thr$total.$t ? t.thr$total.$t : "0";
    const m = c === "0" ? "No Comment" : c;
    const p = t.author && t.author.length > 0 ? t.author[0] : {
      name: {
        $t: "Anonymous"
      }
    };
    const h = p.name && p.name.$t ? p.name.$t : "Anonymous";
    const rawAvatar = p.gd$image && p.gd$image.src ? p.gd$image.src : (SNS_CONFIG.avatar || "https://via.placeholder.com/120?text=A");
    const u = resizeGoogleImage(rawAvatar, "s120-rw");
    const g = t.category || [];
    const f = g.filter(t => !t.term.startsWith("#"));
    const v = g.filter(t => t.term.startsWith("#"));
    let y = "";
    let likeHtml = `<div class='like-wrapper'><button class='heart-btn' data-url='${window.location.href.split("?")[0]}'><i class='far fa-heart'></i></button><span class='like-count' data-count='0'></span></div>`;
    const starRow = `<style>
      .star-source-row{display:flex;align-items:flex-end;gap:8px;width:100%;min-height:32px;flex-wrap:wrap;}
      .star-source-row .hatena-line{display:flex;align-items:flex-end;align-self:flex-end;gap:8px;flex:1;min-width:0;}
      .star-source-row .source-btn{display:inline-flex;align-items:center;align-self:flex-end;gap:6px;padding:6px 12px;border:1px solid #dadce0;border-radius:6px;background:#fff;text-decoration:none;font-family:'Google Sans',Roboto,Arial,sans-serif;font-size:12px;font-weight:500;color:#3c4043;flex-shrink:0;white-space:nowrap;}
	  .hatena-star-iframe-container {top: -6px;position: relative;min-height: 60px;height:60px;}
      @media (max-width: 600px) {
        .star-source-row{flex-direction:column-reverse;align-items:stretch;}
        .star-source-row .source-btn{width:100%;justify-content:center;white-space:normal;text-align:center;}
        .star-source-row .hatena-line{width:100%;}
      }
    </style>
    <div class="star-source-row">
      <div class="hatena-line">
        <img class="htns" alt="はてなスター" border="0" width="25" style="display: block; flex-shrink: 0;" data-original-height="703" data-original-width="653" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcVrFfmBHxvFoOwyG1UKUeXTAqB_adv-qIeZvusoOkVE6ujVgtNQVADWgmWdoNqJaiCwSfQcK5pbh3Ha3yqVPUaI5a4AHuaKfGlJBdrX3l7YBjoRW7UsEYMBelu4jkmjtJh09sh-fOroKAMUYFzm73Ed4869EPZwBPTYmnHygkhBlZM_t12yPYxzvRv_4/s30-rw/nvK24YqthFKts311772476591_1772476610.png"/>
        <div class='hatena-star-iframe-container' style="flex: 1;"></div>
      </div>
      <a class="source-btn" href="https://www.google.com/preferences/source?q=blogger.matsusanjpn.com" target="_blank" rel="noopener">
        <svg width="14" height="14" viewBox="0 0 48 48" style="flex-shrink:0;">
          <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
          <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
          <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
          <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
        </svg>
        Blogger TIPSをGoogleの優先ソースに設定
      </a>
    </div>`;

    if (v.length > 0) {
      y = `<div class='entry-tag-container'>
        ${starRow}
        <div class='reaction-bar'>
          <div class='entry-tag'>${v.map(t=>`<a class='hashtag-pill' href='/search/label/${encodeURIComponent(t.term)}' rel='tag'>${t.term.replace(/^#/, '')}</a>`).join("")}</div>
          ${likeHtml}
        </div>
      </div>`;
    } else {
      y = `<div class='entry-tag-container'>
        ${starRow}
        <div class='reaction-bar'>
          ${likeHtml}
        </div>
      </div>`;
    }
    const _bPageParam = new URLSearchParams(window.location.search).get("page");
    const b = window.location.href.split("?")[0] + (_bPageParam ? "?page=" + encodeURIComponent(_bPageParam) : "");
    const $ = encodeURIComponent(b);
    const w = document.querySelector(".site-title a")?.textContent
    ?.trim() || "";
    const x = `${e} | ${w}`;
    const E = "https://x.com/intent/post?url=" + encodeURIComponent(b) +
      "&text=" + encodeURIComponent(e);
    _({
      name: h,
      img: u
    });
    const _bcItems = [
      { id: "/", name: "ホーム", position: 1 },
      ...(f.length > 0 ? [{ id: "/search/label/" + encodeURIComponent(f[0].term), name: f[0].term, position: 2 }] : [])
    ];
    const _bcJsonLd = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":${JSON.stringify(_bcItems.map(item=>({
      "@type":"ListItem",
      "position": item.position,
      "item":{"@type":"Thing","@id":"https://blogger.matsusanjpn.com"+item.id,"name":item.name}
    })))}}<\/script>`;
    const k =
      _bcJsonLd +
      ` <nav class='post-breadcrumbs'> <span> <a href='/'><i class="fa-solid fa-house-laptop" style="margin-right:5px;"></i> ホーム</a> </span> ${f.length>0?`&nbsp;&rsaquo;&nbsp;<span><a href='/search/label/${encodeURIComponent(f[0].term)}'><i class="fa-solid fa-folder-minus" style="margin:0 5px;"></i> ${f[0].term}</a></span>`:""} </nav> `;
    const L = f.map(t =>
      ` <a href='/search/label/${encodeURIComponent(t.term)}' class='meta-item'><i class='fa-solid fa-folder-minus'></i>${t.term}</a> `
      ).join(" ");
    return ` <article class='post-full'> ${k} <header class='post-full-header'> <h1 class='post-full-title'>${e}</h1> <div class='post-full-meta'> <span class='author-info' title='Author'> <img src='${u}' class='author-avatar' alt='${h}'/> <span>${h}</span> </span>${l!==n?`<span class='meta-item' title='更新日時'>${i}${l}</span>`:""} <span class='meta-item' title='公開日時'>${o}${n}</span>  ${L} <span class='meta-item' title='コメント数'>${r}${m}</span> <button class='meta-bookmark-btn' id='post-bookmark-btn' data-url='${b}' data-title='${e.replace(/'/g,"&#39;")}' aria-label='ブックマーク'><svg fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'><path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/></svg><span class='bm-label'>あとで読む</span></button> </div> </header> \x3c!-- 広告：記事本文 上 --\x3e <div class='adsense-slot' id='ad-post-top'></div> <div class='post-body'>\x3c!-- content --\x3e</div> \x3c!-- 広告：記事本文 下 --\x3e <div class='adsense-slot' id='ad-post-bottom'></div> ${(()=>{const _lns=f.map(t=>t.term);if(_lns.includes('テーマ : 海外')||_lns.includes('テーマ : 国内')){return `<div class='mtu-eyecatch-container mtu-ab-group-c color-amber' style='border-top:1px dashed #555;border-bottom:1px dashed #555;padding:2em 0 1.5em;margin:0 0 4em;top:30px;position:relative;'><div class='mtu-eyecatch-text'><span class='upper'>Blogger Template</span><span class='lower'>M-Stru<span style='color:#0f2b46;'>X</span></span></div><div class='mtu-eyecatch-detail'><span class='status-tag'>Bloggerテーマ</span><br/>自作テンプレート公開中!! <a href='https://blogger.matsusanjpn.com/2026/05/blogger-m-strux.html' style='color:#b45309;font-weight:600;'>紹介ページ <i class='fa-solid fa-arrow-up-right-from-square'></i></a></div></div>`;}return '';})()} ${y} \x3c!-- 著者プロフィール --\x3e <div class='author-profile google-anno-skip'> <img src='${u}' alt='${h}'/> <div class='author-profile-info'> <h3>${h}</h3> <p>${SNS_CONFIG.description}</p> <div class='author-social'> <a href='${SNS_CONFIG.twitter}' target='_blank' title='Twitter'><i class='fa-brands fa-twitter'></i></a> <a href='${SNS_CONFIG.instagram}' target='_blank' title='Github'><i class="fa-brands fa-github"></i></a> <a href='${SNS_CONFIG.tiktok}' target='_blank' title='Blogger'><i class="fa-brands fa-blogger"></i></i></a> <a href='${SNS_CONFIG.youtube}' target='_blank' title='YouTube'><i class='fa-brands fa-youtube'></i></a> </div> </div> </div> <div id='pager-placeholder'></div> <div class='pSh'> <div class='pShc' data-text='Share:'> <label class="share-trigger" for="forShare" role="button" aria-label="共有メニューを開く"> <svg viewBox="0 0 24 24"> <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/> </svg> </label> </div> </div> <input type='checkbox' id='forShare'/> <div class='share-modal'> <div class='share-modal-content'> <label class='share-modal-close' for='forShare'>✕</label> <h3 class='share-modal-title'>記事を共有する</h3> <div class='share-btn-list'> \x3c!-- X / Twitter --\x3e <a aria-label='X / Twitter' class='c tw' href='https://x.com/intent/post?text=${encodeURIComponent(x+"\n"+b)}' rel='noopener' role='button' target='_blank'> <svg viewBox='0 0 512 512'><path d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z'></path></svg> </a> \x3c!-- Facebook --\x3e <a aria-label='Facebook' class='c fb' href='https://www.facebook.com/sharer/sharer.php?u=${$}' rel='noopener' role='button' target='_blank'> <svg viewBox='0 0 512 512'><path d='M504 256C504 119 393 8 256 8S8 119 8 256c0 123.8 90.7 226.4 209.3 245V327.7h-63.1V256h63.1v-54.6c0-62.2 37-96.5 93.7-96.5 27.1 0 55.5 4.8 55.5 4.8v61h-31.2c-30.8 0-40.4 19.1-40.4 38.7V256h68.8l-11 71.7h-57.8V501C413.3 482.4 504 379.8 504 256z'></path></svg> </a> <a aria-label='はてなブックマーク' class='c hb' data-text='はてな' href='https://b.hatena.ne.jp/entry/panel/?url=${$}&btitle=${encodeURIComponent(x)}' rel='noopener' role='button' target='_blank'> <span class='hb-icon'>B!</span> </a> <a aria-label='LINE' class='c ln' data-text='LINE' href='https://social-plugins.line.me/lineit/share?url=${$}&text=${encodeURIComponent(x)}' rel='noopener' role='button' target='_blank'> <svg viewBox='0 0 512 512'> <path d='M459.4 215.6c0-94-89.2-170.5-199.4-170.5S60.6 121.6 60.6 215.6c0 84.2 64.6 154.5 152 167.3l-5.8 34.4c-1.1 6.5 5 11.5 10.6 8.3l85-50c82.1-4.2 157-61.9 157-129.9zM192.1 270.3h-33c-4.7 0-8.5-3.8-8.5-8.5V169.2c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5v84.1h24.5c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5zm55.4-8.5c0 4.7-3.8 8.5-8.5 8.5s-8.5-3.8-8.5-8.5V169.2c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5v92.6zm102.4 0c0 4.7-3.8 8.5-8.5 8.5h-31.1c-4.7 0-8.5-3.8-8.5-8.5V169.2c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5v75.6h22.6c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5zm64.8-84.1V261.8c0 4.7-3.8 8.5-8.5 8.5h-31.1c-4.7 0-8.5-3.8-8.5-8.5V169.2c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5v34.4h22.6c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5v22.6h22.6c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5v.1z'></path> </svg> </a> </div> <div class='copy-link-box'> <span class='copy-link-input'>${b}</span> <button class='copy-link-btn' onclick="copyToClipboard('${b}', this)">コピー</button> </div> </div> </div> <div id='related-posts-placeholder'></div> <div id='comments-list-container'></div> <div id='comments-placeholder'></div> </article> `
  };
  const w = t => {
    const e = t.getAttribute("data-title");
    const s = t.getAttribute("data-url");
    const n = t.getAttribute("data-thumb");
    const i = t.getAttribute("data-snippet") || "No description available.";
    const l = t.getAttribute("data-date");
    const r = l ? d(l) : "";
    const c = t.getAttribute("data-author") || "Admin";
    const m = t.getAttribute("data-label") || "Pick Up";
    if (!e || !s || s === "") return "";
    const p = n ?
      `<div class='post-thumbnail-wrapper'><img src='${n}' alt='${e}' class='post-thumbnail' loading='lazy'/></div>` :
      `<div class='post-thumbnail-wrapper' style='display:flex;align-items:center;justify-content:center;color:var(--text-muted);'>No Image</div>`;
    const h =
      `<div class='post-labels'><span class='post-label-item'>${a}${m}</span></div>`;
    return ` <a href='${s}' class='highlight-post'> <div class='hp-thumb-link'>${p}</div> <div class='hp-content'> ${h} <h2 class='hp-title'>${e}</h2> <p class='hp-summary'>${i}</p> <div class='post-footer'> <span class='post-date'>${o}${r}</span> <span class='author-info' style='margin-left:15px; font-size:0.8rem; opacity:0.8;'>By ${c}</span> <span class='post-readmore'>続きを読む &raquo;</span> </div> </div> </a> `
  };
  const x = () => {
    const t = document.getElementById("featured-root");
    if (!t) return;
    const e = document.querySelectorAll(".feat-data");
    const s = new URLSearchParams(window.location.search);
    const n = window.location.pathname;
    const a = (n === "/" || n === "/index.html") && (!s.has("page") || s
      .get("page") === "1");
    if (!a || e.length === 0) {
      t.innerHTML = "";
      return
    }
    const o = t => {
      if (!t) return "General";
      return t.replace(/^#+/, "")
    };
    const i = Array.from(e).map(t => ({
      title: t.getAttribute("data-title"),
      url: t.getAttribute("data-url") || "#",
      thumb: t.getAttribute("data-thumb"),
      label: o(t.getAttribute("data-label")),
      author: t.getAttribute("data-author"),
      date: t.getAttribute("data-date"),
      snippet: t.getAttribute("data-snippet") || "",
      authorImg: t.getAttribute("data-author-img") || ""
    }));
    const l = i[0];
    const r = i.slice(1, 3);
    const blsmImg = t => `<a class="blsm-img" href="${t.url}" style="background-image:url(${t.thumb})"><span class="tyimg-lay"></span></a>`;
    const blsmFirst = t => {
      const raw = (t.snippet || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const summary = raw.length > 110 ? raw.slice(0, 110) + '…' : raw;
      const avSrc = t.authorImg || (window.SNS_CONFIG && SNS_CONFIG.avatar) || "";
      const avatar = avSrc ? resizeGoogleImage(avSrc, 's48-rw') : '';
      const avatarHtml = avatar ? `<img src='${avatar}' class='blsm-author-img' alt='${t.author}'/>` : `<i class="fa-solid fa-user blsm-author-fallback"></i>`;
      return `<div class="blsm-card blsm-first">
        ${blsmImg(t)}
        <div class="blsm-con-blossom">
          <div class="blossom-label"><a href="/search/label/${encodeURIComponent(t.label)}">${t.label}</a></div>
          <h3 class="blossomt-title"><a href="${t.url}">${t.title}</a></h3>
          ${summary ? `<p class="blsm-summary">${summary}</p>` : ''}
          <div class="blsm-meta">
            ${t.date ? `<span class="blsm-time">${d(t.date)}</span>` : ''}
            <span class="blsm-author">${avatarHtml}<span>${t.author}</span></span>
          </div>
        </div>
      </div>`;
    };
    const blsmRest = t => `<div class="blsm-card blsm-rest">
        ${blsmImg(t)}
        <div class="blsm-label-tl"><a href="/search/label/${encodeURIComponent(t.label)}"><i class="fa-solid fa-tag"></i>${t.label}</a></div>
      </div>`;
    const c =
      ` <div class="blsm-feat"> ${blsmFirst(l)} ${r.length ? `<div class="blsm-rest-wrap">${r.map(t => blsmRest(t)).join('')}</div>` : ''} </div> `;
    t.innerHTML = c
  };
  const E = t => {
    const e = t.title.$t;
    const s = t.link.find(t => t.rel === "alternate").href;
    const n = d(t.published.$t);
    const a = t.author[0].name.$t;
    const i = t.author[0].gd$image ? t.author[0].gd$image.src :
      "https://via.placeholder.com/50?text=A";
    const l = t.category && t.category.length > 0 ? t.category[0].term :
      "Pick Up";
    let r = t.summary ? t.summary.$t : t.content ? t.content.$t : "";
    r = c(r).substring(0, 200);
    let m = "";
    if (t.media$thumbnail) {
      m = resizeGoogleImage(t.media$thumbnail.url, "w800-rw")
    } else if (t.content && t.content.$t.includes("<img")) {
      const e = t.content.$t.match(/<img[^>]+src="([^">]+)"/);
      if (e) m = e[1]
    }
    const p = m ?
          `<div class='post-thumbnail-wrapper'><img src='${m}' alt='${e}' class='post-thumbnail' loading='lazy'/></div>` :
          `<div class='post-thumbnail-wrapper' style='display:flex;align-items:center;justify-content:center;color:var(--text-muted);'>No Image</div>`;
        const safeLabel = (l || "").replace(/#/g, '');
        return ` <a href='${s}' class='highlight-post'> <div class='hp-thumb-link'>${p}</div> <div class='hp-content'> <h2 class='hp-title'>${e}</h2> <p class='hp-summary'>${r}</p> <div class='hp-footer'> <span class='hp-date'>${o}${n}</span> <span class='hp-label'><svg style="width:12px;height:12px;margin-right:4px;vertical-align:-0.125em;" viewBox="0 0 448 512" fill="currentColor"><path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg>${safeLabel}</span> <div class='hp-author-wrap'> <img src='${i}' class='hp-author-img' alt='${a}'/> <span>${a}</span> </div> <span class='hp-readmore'>続きを読む &raquo;</span> </div> </div> </a> `
      };
  const RANDOM_HTML = `
          <div class='tpd-random-wrapper' id='tpd-random-wrapper' style='margin:0 0 20px;'>
            <div id='tpd-random-box' style='display:none;'>
              <div class='random-unit'>
                <div class='hero-v2-flex'>
                  <div class='hero-item first' id='tpd-hero-a1'>
                    <img alt='' src=''/><div class='caption'><h2 id='tpd-title-a1'></h2><p id='tpd-desc-a1'></p><a href='#' id='tpd-link-a1'>READ MORE</a></div>
                  </div>
                  <div class='hero-item last' id='tpd-hero-a2'>
                    <img alt='' src=''/><div class='caption'><h2 id='tpd-title-a2'></h2><p id='tpd-desc-a2'></p><a href='#' id='tpd-link-a2'>READ MORE</a></div>
                  </div>
                </div>
              </div>
              <div class='random-unit'>
                <div class='hero-v2-flex'>
                  <div class='hero-item first' id='tpd-hero-b1'>
                    <img alt='' src=''/><div class='caption'><h2 id='tpd-title-b1'></h2><p id='tpd-desc-b1'></p><a href='#' id='tpd-link-b1'>READ MORE</a></div>
                  </div>
                  <div class='hero-item last' id='tpd-hero-b2'>
                    <img alt='' src=''/><div class='caption'><h2 id='tpd-title-b2'></h2><p id='tpd-desc-b2'></p><a href='#' id='tpd-link-b2'>READ MORE</a></div>
                  </div>
                </div>
              </div>
              <div class='random-unit'>
                <div id='slider-container'>
                  <div id='loading-screen' style='position:absolute;top:0;left:0;width:100%;height:100%;background:#000;z-index:200;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#ecad29;font-family:sans-serif;'>
                    <div style='width:40px;height:40px;border:3px solid #333;border-top:3px solid #ecad29;border-radius:50%;animation:spin 1s linear infinite;'></div>
                    <div style='margin-top:15px;font-size:12px;letter-spacing:2px;'>LOADING...</div>
                  </div>
                  <div id='demo'></div>
                  <div class='details' id='details-even'>
                    <div class='place-box'><div class='text'></div></div>
                    <div class='title-box-1'><div class='title-1'></div></div>
                    <div class='title-box-2'><div class='title-2'></div></div>
                    <div class='desc'></div>
                    <div class='cta'>
                      <button class='bookmark'><svg viewBox='0 0 24 24'><path d='M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21l-7.165-3.583L4.835 21V5.507c0-1.47 1.073-2.756 2.57-2.93z'/></svg></button>
                      <button class='discover'>READ MORE</button>
                    </div>
                  </div>
                  <div class='details' id='details-odd'>
                    <div class='place-box'><div class='text'></div></div>
                    <div class='title-box-1'><div class='title-1'></div></div>
                    <div class='title-box-2'><div class='title-2'></div></div>
                    <div class='desc'></div>
                    <div class='cta'>
                      <button class='bookmark'><svg viewBox='0 0 24 24'><path d='M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21l-7.165-3.583L4.835 21V5.507c0-1.47 1.073-2.756 2.57-2.93z'/></svg></button>
                      <button class='discover'>READ MORE</button>
                    </div>
                  </div>
                  <div class='pagination'>
                    <div class='arrow' id='prev'><svg viewBox='0 0 24 24'><path d='M15.75 19.5L8.25 12l7.5-7.5' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg></div>
                    <div class='arrow' id='next'><svg viewBox='0 0 24 24'><path d='M8.25 4.5l7.5 7.5-7.5 7.5' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/></svg></div>
                    <div class='progress-sub-container'><div class='progress-sub-background'><div class='progress-sub-foreground'></div></div></div>
                  </div>
                  <div class='cover'></div>
                </div>
              </div>
            </div>
          </div>`;
  window.__initRandom = function() {
    var box = document.getElementById('tpd-random-box');
    if (!box) return Promise.resolve();
    return new Promise(function (resolveInitRandom) {
    clearTimeout(window.__randomTimer);
    box.innerHTML = box.innerHTML;
    var units = Array.from(box.children);
    var winnerIdx = 2; 
    box.style.display = 'block';
    units.forEach(function(u, i) { if (i !== winnerIdx) u.style.display = 'none'; });
    var sliderData = [
      { place:'2026.08.01', title:'TIPS', title2:'GoogleサーチコンソールでBloggerがインデックスされない問題を解決したい', description:'', image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi89cTIKN3ghHuyFtfnFQ1aHjOljiNA8eQ8SsUtG8iq0efNIlVrdiCVDTlqXoPyg8D1hQVKmm-V030lWq4id7DW2UDJddZeEufFpN9ehDlUYwp8kBuMITPFgg32EPGOYmANelJFEAml7Mi9yYnL29uUin8k2dFigSbtc1v11SlIn3otsEHqvRblDhM6h9s/s900/603de1da-a695-454d-985f-14978da5447c.jpg', link:'/2026/08/gsc-faq.html' },   
      { place:'2026.02.26', title:'カスタマイズ', title2:'ないなら作ったらいいじゃない&#65311;Bloggerで簡単調整ランダムポスト表示', description:'', image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggR25exqlI2M7wrUahWllUju3IJ43r3GuL6kYOjSEeikCwukEuVdgrqBvanPcXF9i1nVtnzFhfc-fAwCZtCijNRKfMxWL7rF7i65HH8krSM7Yi-ShVuZq2w-YNw3Fnxhi_gXaxlgfSn-jtQfgg0kgV_oLAPf-YE2wrGuD2tfGZ_3GWYfFPKP3SqKTjaXA/s900/random.png', link:'/2026/09/blogger-random-post.html' },
      { place:'2026.05.07', title:'テンプレート', title2:'Bloggerテンプレート&#12302;M-StruX&#12303;', description:'', image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggRVof3Ka9O7AbS59ueVZ2EsVAk7Utz6KWvFCWyht9KBFm8rHAB8Vslj92X5ng-1r49ErEo8EDqKOOYzMGLn_Ax6eVkLl5QtrORCcqu4fW4dNPj3kwCQPVBkucC7uY7yZ1RBOv1SADK7Y-qgN19_UtuEGFJuW14fC3CjYWpXPN568prVeqykUdAN_E0L4/s900-rw/1a637f4c-27c1-4cca-b7ea-285617d1cf98.jp', link:'/2026/05/blogger-m-strux.html' },
      { place:'2026.02.24', title:'カスタマイズ', title2:'Bloggerにスプレッドシート+GAS+JavaScriptで&#12300;いいね&#12301;ボタンを実装する', description:'', image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcfnjZj6OW_A8fqvoBimg0U3gPiUTaDXRUMqYbxJIv98S5Ggs2NkiexOTvgkcfAKIYkJwzDpSb5IgFdKQ0DPwXPAb3fIu54QDEWFEssSec1cJLVlNIeLLpzMX8G6sA9B87l2A8mJXnkc85lVDNtPDkjr0l4ra5nwtDFhf7gzX3oRf0ug6Kyg9eCVHXCnA/s900/THUMBS%20UP.jpg', link:'https://blogger.matsusanjpn.com/2026/02/nice.html' },
      { place:'2026.02.24', title:'TIPS', title2:'BloggerではじめるGoogleアドセンス 準備から申請まで', description:'', image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR4WD35_nK98wPfn5yX5UVmyrfFhV3dHp4mxd9UbghyQdGaU5O9remOvJVXH3BJ-HJnnOY8iaUvFnuqAUnvvdOQnyFzonplGLIazOXstK8mTdv6y9n86tz4RFktrIoul7-Qc49GWc2IKfieS6mkiRreLq1M5sgtWBy7HiLDdQuh0R99rjA7hhJlHIIOu4/s900/Ivd3cjR6RSqa2Pg1787139283_1787139300.jpg', link:'/2026/02/blogger-adsense-guide.html' },
      { place:'2026.02.25', title:'カスタマイズ', title2:'Bloggerでトップページをホームページ風にする方法を解説', description:'', image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUB86ydQ_kP1Fak7Wj483ec4vWqEq4RPctCuoAcMIA9FPWfnh0WjJJsNgg2mqSQSqbQGljY8V6Q0B8kp23wBGYkm2WT2WjjDhHEwJ_tVjqFBTH0oSkYi9bOMIQr_KUQqt0mSEse-V5TDsNsw9reUTX6sBCNDL99Dt-Nw4BZcpKPghZOD5Ru_5EmwJB3DI/s900/53a78033-9ddf-43ce-a401-613d366545f0_upscaled.jpg', link:'/2026/02/blogger-toppage-custom.html' }
    ];
    function initSlider(data) {
      if (typeof gsap === 'undefined') {
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        s.onload = function() { _buildSlider(data); };
        document.head.appendChild(s);
      } else {
        _buildSlider(data);
      }
    }
    function _buildSlider(data) {
      var _id = function(id) { return document.getElementById(id); };
      var container = _id('slider-container');
      var demo = _id('demo');
      if (!container || !demo) return;
      var order = data.map(function(_, i) { return i; });
      var isAnimating = false;
      var detailsEven = true;
      var currentStepCount = 1;
      clearTimeout(window.__randomTimer);
      var cardWidth = 120, cardHeight = 180, gap = 20;
      demo.innerHTML = data.map(function(item, index) {
        return '<div class="card" id="card' + index + '" style="background-image:url(' + item.image + ')"></div>';
      }).join('') + data.map(function(item, index) {
        return '<div class="card-content" id="card-content-' + index + '"><div class="content-start"></div><div class="content-place">' + item.place + '</div><div class="content-title-1">' + item.title + '</div></div>';
      }).join('');
      function updateDetails(id, index) {
        var item = data[index], el = document.querySelector(id);
        if (!el) return;
        el.querySelector('.text').innerHTML = item.place;
        el.querySelector('.title-1').innerHTML = item.title;
        el.querySelector('.title-2').innerHTML = item.title2;
        el.querySelector('.desc').innerHTML = item.description;
        el.querySelector('.discover').onclick = function(e) {
          e.stopPropagation();
          if (item.link && item.link !== '#') window.location.href = item.link;
        };
      }
      function init() {
        var ls = _id('loading-screen');
        if (ls) gsap.to('#loading-screen', { opacity: 0, duration: .5, onComplete: function() { ls.remove(); } });
        var active = order[0], rest = order.slice(1);
        var detailsActive = detailsEven ? '#details-even' : '#details-odd';
        var width = container.offsetWidth, height = container.offsetHeight;
        updateDetails(detailsActive, active);
        gsap.set(detailsActive, { opacity: 1, x: 0, zIndex: 300, visibility: 'visible' });
        document.querySelector(detailsActive).classList.add('active-details');
        gsap.set('#card' + active, { x: 0, y: 0, width: width, height: height, zIndex: 10, borderRadius: 0 });
        gsap.set('#card-content-' + active, { opacity: 0 });
        rest.forEach(function(i, index) {
          var xPos = (width - 450) + index * (cardWidth + gap);
          gsap.set('#card' + i, { x: xPos, y: height - 210, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 8 });
          gsap.set('#card-content-' + i, { x: xPos, y: height - 210 + cardHeight - 80, opacity: 1, zIndex: 40 });
        });
        gsap.set('.progress-sub-foreground', { width: (100 / data.length * currentStepCount) + '%' });
        resolveInitRandom();
        gsap.to('.cover', { x: width + 100, duration: .8, onComplete: function() { startAutoPlay(); } });
        _id('next').addEventListener('click', function() { handleNav(1); });
        _id('prev').addEventListener('click', function() { handleNav(-1); });
      }
      function step(direction) {
        direction = direction || 1;
        if (isAnimating) return;
        isAnimating = true;
        var prevActive = order[0];
        if (direction === 1) order.push(order.shift()); else order.unshift(order.pop());
        var active = order[0], rest = order.slice(1);
        currentStepCount = direction === 1 ? (currentStepCount % data.length) + 1 : (currentStepCount - 2 + data.length) % data.length + 1;
        var detailsActiveId   = !detailsEven ? '#details-even' : '#details-odd';
        var detailsInactiveId =  detailsEven ? '#details-even' : '#details-odd';
        detailsEven = !detailsEven;
        updateDetails(detailsActiveId, active);
        var width = container.offsetWidth, height = container.offsetHeight;
        document.querySelector(detailsInactiveId).classList.remove('active-details');
        document.querySelector(detailsActiveId).classList.add('active-details');
        gsap.set('#card' + prevActive, { zIndex: 5, x: 0, y: 0, width: width, height: height, borderRadius: 0 });
        gsap.set('#card' + active, { zIndex: 20 });
        var tl = gsap.timeline({ onComplete: function() {
          var lastX = (width - 450) + (data.length - 2) * (cardWidth + gap);
          gsap.set('#card' + prevActive, { x: lastX, y: height - 210, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 8 });
          gsap.set('#card-content-' + prevActive, { x: lastX, y: height - 210 + cardHeight - 80, opacity: 1, zIndex: 40 });
          isAnimating = false;
        }});
        tl.to('.progress-sub-foreground', { width: (100 / data.length * currentStepCount) + '%', duration: .75, ease: 'power2.inOut' }, 0);
        tl.to('#card' + active, { x: 0, y: 0, width: width, height: height, borderRadius: 0, duration: .75, ease: 'power2.inOut' }, 0)
          .to(detailsActiveId, { opacity: 1, x: 0, duration: .4, visibility: 'visible' }, .2)
          .to(detailsInactiveId, { opacity: 0, duration: .3 }, 0)
          .to('#card-content-' + active, { opacity: 0, duration: .3 }, 0);
        rest.forEach(function(i, index) {
          if (i === prevActive) return;
          var xNew = (width - 450) + index * (cardWidth + gap);
          tl.to('#card' + i, { x: xNew, y: height - 210, width: cardWidth, height: cardHeight, borderRadius: 8, zIndex: 30, duration: .75, ease: 'power2.inOut' }, 0);
          tl.to('#card-content-' + i, { x: xNew, y: height - 210 + cardHeight - 80, opacity: 1, zIndex: 40, duration: .75, ease: 'power2.inOut' }, 0);
        });
      }
      function handleNav(dir) { clearTimeout(window.__randomTimer); step(dir); startAutoPlay(); }
      function startAutoPlay() { window.__randomTimer = setTimeout(function() { step(1); startAutoPlay(); }, 3400); }
      var loaded = 0;
      data.forEach(function(d) {
        var img = new Image();
        img.src = d.image;
        img.onload = img.onerror = function() { if (++loaded === data.length) init(); };
      });
    }
    initSlider(sliderData);
    setTimeout(resolveInitRandom, 1200);
    });
  };
  const k = async () => {
    const t = document.getElementById("view-root");
    const s = window.location.pathname;
    x();
    const n = s === "/" || s === "/index.html" || s.startsWith(
      "/search") || /\/\d{4}\/\d{2}\/?$/.test(s) && !s.includes(
      ".html") || /_archive\.html$/.test(s);
    document.querySelectorAll("style[data-entry-style]").forEach(t => t
      .remove());
    t.innerHTML = n ? h(6) :
      `<div class='skeleton-card' style='padding-top:2rem;'><div class='skeleton skeleton-text' style='height:2rem;width:70%;margin-bottom:1.5rem;'></div><div class='skeleton skeleton-thumb' style='aspect-ratio:21/9;margin-bottom:2rem;'></div><div class='skeleton skeleton-text'></div><div class='skeleton skeleton-text'></div><div class='skeleton skeleton-text' style='width:50%'></div></div>`;
    const a = new URLSearchParams(window.location.search);
    const o = parseInt(a.get("page")) || 1;
    const i = BLOG_CONFIG.perPage || 12;
    const si = (o - 1) * i + 1;
    let r = "";
    let c = "";
    let pageTitle = "";
    const blogName = document.querySelector(".site-title a")?.textContent
      ?.trim() || (document.title.split("|").pop() || "").trim();
    const isSearch = s.startsWith("/search") && a.has("q") && !s
      .startsWith("/search/label/");
    const isLabel = s.startsWith("/search/label/");
    const isArchive = /\/\d{4}\/\d{2}\/?$/.test(s) || /_archive\.html$/
      .test(s);
    if (n) {
if (isSearch) {
      const q = a.get("q");
      r = `${e()}/feeds/posts/default?alt=json&max-results=150&q=${encodeURIComponent(q)}`;
      c = `<div class='view-status'><i class='fa-solid fa-magnifying-glass'></i><span> 検索キーワード <b>「${q}」</b> に一致する投稿を日付順で表示しています。</span></div>`;
      pageTitle = `${q} | ${blogName}`;
    } else if (isLabel) {
      const lt = s.split("/search/label/")[1].split("?")[0];
      const ln = decodeURIComponent(lt);
      r = `${e()}/feeds/posts/default/-/${lt}?alt=json&max-results=150`;
      const displayLabel = ln.replace(/#/g, '');
      c = `<div class='view-status'><i class='fa-solid fa-tag'></i><span> ${ln.startsWith("#")?"タグ":"カテゴリ"} <b>「${displayLabel}」</b> の記事を日付順で表示しています。</span></div>`;
      pageTitle = `${ln.startsWith("#")?"タグ":"ラベル"}: ${displayLabel} | ${blogName}`;
    } else if (isArchive) {
        let yr, mo;
        if (/_archive\.html$/.test(s)) {
          const m = s.match(/(\d{4})_(\d{2})_\d{2}_archive\.html/);
          if (m) {
            yr = m[1];
            mo = m[2]
          }
        } else {
          const m = s.match(/\/(\d{4})\/(\d{2})\//);
          if (m) {
            yr = m[1];
            mo = m[2]
          }
        }
        if (yr && mo) {
          const nx = parseInt(mo) === 12 ? 1 : parseInt(mo) + 1;
          const nxy = nx === 1 ? parseInt(yr) + 1 : parseInt(yr);
          const pmin = `${yr}-${mo}-01T00:00:00Z`;
          const pmax = `${nxy}-${String(nx).padStart(2,"0")}-01T00:00:00Z`;
          r = `${e()}/feeds/posts/default?alt=json&max-results=150&published-min=${pmin}&published-max=${pmax}`;
          c = `<div class='view-status'><i class='fa-solid fa-calendar-days'></i><span> アーカイブ <b>「${yr}年 ${parseInt(mo)}月」</b> の記事を日付順で表示しています。</span></div>`;
          pageTitle = `${yr}年${parseInt(mo)}月 | ${blogName}`;
        }
      } else {
        r =
          `${e()}/feeds/posts/default?alt=json&max-results=${i}&start-index=${si}`;
        pageTitle = o > 1 ? `${blogName} - ページ ${o}` : blogName;
      }
    } else {
      const pt = s.startsWith("/p/") ? "pages" : "posts";
      r = `${e()}/feeds/${pt}/default?alt=json&path=${s}&max-results=1`;
    }
    try {
      const fa = await fetch(r);
      if (!fa.ok) throw new Error("Fetch failed");
      const fl = await fa.json();
      let fd = fl.feed ? fl.feed.entry : null;
      let total = fl.feed && fl.feed.openSearch$totalResults ? parseInt(fl.feed.openSearch$totalResults.$t) : fd ? fd.length : 0;
      if ((isSearch || isLabel || isArchive) && fd) {
        total = fd.length;
        fd = fd.slice((o - 1) * i, o * i);
      }
      if (fd && fd.length > 0 && !n) {
        const t = fd[0];
        const ec = t.content && t.content.$t && t.content.$t.length > 500;
        if (!ec) {
          try {
            const sl = t.link && t.link.find(t => t.rel === "self");
            if (sl) {
              const sr = await fetch(`${sl.href}?alt=json`);
              if (sr.ok) {
                const sj = await sr.json();
                if (sj.entry && sj.entry.content && sj.entry.content.$t) {
                  fd[0] = sj.entry
                }
              }
            }
          } catch (t) {}
        }
      }
      if (fd && fd.length > 0) {
        const au = fd[0].author ? fd[0].author[0] : null;
        if (au) {
          const t = au.name.$t;
          const ei = au.gd$image ? resizeGoogleImage(au.gd$image.src, "s120-rw") : (SNS_CONFIG.avatar || "https://via.placeholder.com/120?text=A");
          _({
            name: t,
            img: ei
          })
        }
        if (n) {
          const isTop = (s === "/" || s === "/index.html") && o === 1;
          const hpd = document.querySelector(".hp-data");
          let lc = c;
          if (isTop && hpd) {
            const hu = hpd.getAttribute("data-url");
            if (hu) {
              try {
                const hp = new URL(hu).pathname;
                const hf = await fetch(
                  `${e()}/feeds/posts/default?alt=json&path=${hp}`);
                const hj = await hf.json();
                if (hj.feed && hj.feed.entry && hj.feed.entry.length >
                  0) {
                  lc += E(hj.feed.entry[0])
                }
              } catch (t) {
                console.error("Highlight fetch failed", t);
                lc += w(hpd)
              }
            }
          }
          const sv = BLOG_CONFIG.viewMode !== "list";
          lc +=
            `<div class='${sv?"post-grid":"post-list-wrap"}'>${fd.map(sv?u:b).join("")}</div>`;
          lc += L(total, i, o);
          if (n) lc = RANDOM_HTML + lc;
          t.innerHTML = lc;
          document.title = pageTitle || blogName;
          document.body.classList.remove("is-full-mode");
          document.body.classList.remove("is-static-page");
          if (typeof T === "function") T();
          document.body.classList.add("sidebar-ready");
          if (typeof window.__applyTabsVisibility === "function") window.__applyTabsVisibility();
          F();
        } else {
          const ep = fd[0];
          t.innerHTML = $(ep);
          q(ep);
          if (typeof window.__applyTabsVisibility === "function") window.__applyTabsVisibility();
          const ne = t.querySelector(".post-body");
          if (ne && ep.content && ep.content.$t) {
            ne.innerHTML = ep.content.$t.replace(/<strike[^>]*>\s*full-width\s*<\/strike>/gi, "");
            (function addExternalLinkIcons(container) {
              const currentHost = location.hostname;
              container.querySelectorAll("p a[href], li a[href]").forEach(function(a) {
                if (a.querySelector(".fa-arrow-up-right-from-square")) return;
                if (a.querySelector("img")) return;
                if (a.getAttribute("data-external-link") !== null) return;
                var href = a.getAttribute("href") || "";
                if (!href || href.startsWith("#") || href.startsWith("javascript")) return;
                try {
                  var linkHost = new URL(href, location.href).hostname;
                  if (linkHost && linkHost !== currentHost) {
                    var icon = document.createElement("i");
                    icon.className = "fa-solid fa-arrow-up-right-from-square";
                    a.appendChild(document.createTextNode("\u00a0"));
                    a.appendChild(icon);
                  }
                } catch (e) {}
              });
            })(ne)
          } else {
            console.warn("[DEBUG] content missing")
          }
          document.title = ep.title.$t + " | " + (document.title.split(
            "|")[1]?.trim() || document.title);
          S(ep);
          G();
          F();
          R();
          v();
          f();
          (function() {
            var postUrl   = window.location.href.split('?')[0];
            var postTitle = ep.title.$t || '';
            var iframeUrl = 'https://matsusan0717.github.io/hatenastar/?url='
              + encodeURIComponent(postUrl)
              + '&title=' + encodeURIComponent(postTitle);
            var containers = document.querySelectorAll('.hatena-star-iframe-container');
            containers.forEach(function(el) {
              el.innerHTML = '<iframe src="' + iframeUrl + '"'
                + ' height="80" width="100%" frameborder="0"'
                + ' scrolling="no" style="overflow:hidden;border:none;"'
                + ' sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms allow-popups-to-escape-sandbox allow-top-navigation"'
                + '></iframe>';
            });
          })();
          const isp = s.startsWith("/p/");
          if (isp) {
            const t = document.getElementById("pager-placeholder");
            if (t) t.style.display = "none";
            const e = document.getElementById("comments-placeholder");
            if (e) e.style.display = "none"
          }
          const ce = document.getElementById("comments-placeholder");
          if (ce && !isp) {
            const blogId = BLOG_CONFIG.blogId;
            const sid = ep.id.$t.split("-").pop();
            ce.innerHTML = `
              <div id='custom-giscus-container' style='margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;'>
                <h3 class="giscus-title aslot" style='margin: 0 0 8px 0;font-size:1.2rem;'>
                  <i class='fa-solid fa-comments' style='margin: 0 10px 0 0;'></i>COMMENT
                </h3>
                <small style='display: block; text-align: right; margin-bottom: 20px;'>
                  <a href='https://www.blogger.com/comment-iframe.g?blogID=${blogId}&postID=${sid}&isPopup=true' onclick='window.open(this.href, "blogger_comment", "width=600,height=600,scrollbars=yes,resizable=yes"); return false;' style='color: #888; text-decoration: underline; cursor: pointer;'>
                    <i class='fa-solid fa-comments'></i>GitHub以外でコメントする
                  </a>
                </small>
              </div>
              <style>
                #comments {
                  display: none !important;
                }
              </style>
            `;
            const script = document.createElement('script');
            script.src = 'https://giscus.app/client.js';
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-category', 'Announcements');
            script.setAttribute('data-category-id', 'DIC_kwDORj0uG84ClC7w');
            script.setAttribute('data-emit-metadata', '0');
            script.setAttribute('data-input-position', 'bottom');
            script.setAttribute('data-lang', 'ja');
            script.setAttribute('data-mapping', 'pathname');
            script.setAttribute('data-reactions-enabled', '1');
            script.setAttribute('data-repo', 'matsusan0717/my-digital-garden-comments');
            script.setAttribute('data-repo-id', 'R_kgDORj0uGw');
            script.setAttribute('data-strict', '0');
            script.setAttribute('data-theme', 'light_tritanopia');
            document.getElementById('custom-giscus-container').appendChild(script);
          }
          if (!isp) I(ep.published ? ep.published.$t : "");
          C(ep.category || [])
        }
      } else {
        t.innerHTML = c +
          '<div style="padding:4rem;text-align:center;color:var(--text-muted);">記事が見つかりませんでした。</div>'
        document.title = n ? (pageTitle || blogName) : `見つかりません | ${blogName}`;
      }
    } catch (ep) {
      console.error("loadMainContent Error:", ep);document.title = `404 | ${blogName}`;t.innerHTML=`<div class="ms-fetch-error-wrap"><style>.sidebar{opacity:0;transition:opacity 0.2s ease;display:none;}.ms-fetch-error-wrap{display:flex;align-items:center;justify-content:center;min-height:60vh;padding:2rem;}.ms-fetch-error{width:100%;max-width:580px;text-align:center;color:var(--text-main);border:2px solid var(--border);border-radius:var(--radius);padding:2.5rem 2rem;background:var(--bg-color);}.ms-fetch-error h1{font-size:clamp(80px,18vw,140px);font-weight:900;line-height:1;margin:0 0 0.1em;color:var(--accent);letter-spacing:-0.04em;}.ms-fetch-error h2{font-size:1.4rem;font-weight:700;margin:0 0 1rem;color:var(--text-main);}.ms-fetch-error p{color:var(--text-muted);margin:0 0 0.6rem;font-size:0.95rem;line-height:1.6;}.ms-fetch-error .btns{margin-top:1.5rem;display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;}.ms-fetch-error button{padding:0.5em 1.2em;color:var(--text-main);border:2px solid var(--border);border-radius:var(--radius);background:none;font-size:0.95rem;font-family:inherit;cursor:pointer;transition:0.25s;}.ms-fetch-error .fill,.ms-fetch-error button:hover{background:var(--accent);color:#fff;border-color:var(--accent);}.ms-fetch-error .fill:hover{opacity:0.85;}@media(max-width:500px){.ms-fetch-error-wrap{padding:1rem;}.ms-fetch-error h1{font-size:90px;}.ms-fetch-error h2{font-size:1.15rem;}.ms-fetch-error p{font-size:0.88rem;}.ms-fetch-error .btns{flex-direction:column;align-items:stretch;}}</style><div class="ms-fetch-error"><h1>404</h1><h2>Oops, Page not found!</h2><p>お探しのページは見つかりませんでした。恐れ入りますが、トップページへ戻るか、<br/>メニューから再度ご希望のページをお探しください。</p><div class="btns"><button class="fill" onclick="location.href=location.protocol+'//'+location.host+'/'">HOME</button><button onclick="location.href='https://blogger.matsusanjpn.com/'">Report</button></div></div></div>`
  
    }
  };
const L = (total, perPage, currentPage) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return "";
  const a = new URL(window.location.href);
  const mu = p => {
    a.searchParams.set("page", p);
    return a.toString()
  };
  const delta = 1;

  let items = "";

  if (currentPage > 1) {
    items += `<li class="btn prev"><a href="${mu(currentPage - 1)}">‹ prev</a></li>`;
  } else {
    items += `<li class="btn prev disabled">‹ prev</li>`;
  }
  for (let p = 1; p <= totalPages; p++) {
    const isFirst = p === 1;
    const isLast = p === totalPages;
    const inRange = p >= currentPage - delta && p <= currentPage + delta;
    if (isFirst || isLast || inRange) {
      const cls = [
        "numb",
        isFirst ? "first" : "",
        isLast ? "last" : "",
        p === currentPage ? "active" : ""
      ].filter(Boolean).join(" ");

      if (p === currentPage) {
        items += `<li class="${cls}">${p}</li>`;
      } else {
        items += `<li class="${cls}"><a href="${mu(p)}">${p}</a></li>`;
      }
    } else if (p === currentPage - delta - 1 || p === currentPage + delta + 1) {
      items += `<li class="dots">…</li>`;
    }
  }
  if (currentPage < totalPages) {
    items += `<li class="btn next"><a href="${mu(currentPage + 1)}">next ›</a></li>`;
  } else {
    items += `<li class="btn next disabled">next ›</li>`;
  }
  return `<div class="pagination"><ul>${items}</ul></div>`;
  };
  const I = async t => {
    const s = document.getElementById("pager-placeholder");
    if (!s) return;
    try {
      const d = new Date(t);
      const tPrev = new Date(d.getTime() - 1000).toISOString().replace(
        /\.\d{3}Z$/, "+00:00");
      const tNext = new Date(d.getTime() + 1000).toISOString().replace(
        /\.\d{3}Z$/, "+00:00");
      const [prevRes, nextRes] = await Promise.all([fetch(
        `${e()}/feeds/posts/default?alt=json&max-results=1&published-max=${encodeURIComponent(tPrev)}&orderby=published`
        ).then(r => r.json()), fetch(
        `${e()}/feeds/posts/default?alt=json&max-results=1&published-min=${encodeURIComponent(tNext)}&orderby=published&start-index=1`
        ).then(r => r.json())]);
      const prev = prevRes.feed?.entry?.[0] || null;
      const nextTotal = nextRes.feed?.openSearch$totalResults ? parseInt(
        nextRes.feed.openSearch$totalResults.$t) : 0;
      let next = null;
      if (nextTotal > 0) {
        const lastRes = await fetch(
          `${e()}/feeds/posts/default?alt=json&max-results=1&published-min=${encodeURIComponent(tNext)}&orderby=published&start-index=${nextTotal}`
          ).then(r => r.json());
        next = lastRes.feed?.entry?.[0] || null;
      }
      let r = "<div class='aChp'>";
      if (prev) {
        const lk = prev.link.find(l => l.rel === "alternate");
        const ti = prev.title.$t || "Previous Post";
        r +=
          `<a href='${lk.href}' class='o'><div class='b'><i class="fa-solid fa-angles-left"></i> Previous</div><div class='t'>${ti}</div></a>`
      } else {
        r += "<div></div>"
      }
      if (next) {
        const lk = next.link.find(l => l.rel === "alternate");
        const ti = next.title.$t || "Next Post";
        r +=
          `<a href='${lk.href}' class='n'><div class='b'>Next <i class="fa-solid fa-angles-right"></i></div><div class='t'>${ti}</div></a>`
      } else {
        r += "<div></div>"
      }
      r += "</div>";
      s.innerHTML = r;
      const c = s.querySelector(".aChp");
      const upd = () => {
        const tn = c.querySelector(".n");
        const tp = c.querySelector(".o");
        if (window.innerWidth <= 600) {
          c.style.flexDirection = "column";
          if (tn) tn.style.order = "-1";
          if (tp) tp.style.order = "0"
        } else {
          c.style.flexDirection = "";
          if (tn) tn.style.order = "";
          if (tp) tp.style.order = ""
        }
      };
      upd();
      window.addEventListener("resize", upd)
    } catch (err) {
      console.error("Pager load error:", err)
    }
  };
  const C = async t => {
    const s = document.getElementById("related-posts-placeholder");
    if (!s || !t || t.length === 0) return;
    const o = window.location.pathname;
    const MAX = 6;
    const shuffle = arr => {
      const e = [...arr];
      for (let k = e.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [e[k], e[j]] = [e[j], e[k]]
      }
      return e
    };
    const regularLabels = t.map(x => x.term).filter(x => !x.startsWith("#"));
    const hashLabels = t.map(x => x.term).filter(x => x.startsWith("#"));
    const labelOrder = [...regularLabels, ...hashLabels];
    if (labelOrder.length === 0) return;
    const seen = new Set();
    let c = [];
    const fetchByLabel = async term => {
      try {
        const res = await fetch(
          `${e()}/feeds/posts/default/-/${encodeURIComponent(term)}?alt=json&max-results=20`
        );
        const j = await res.json();
        const entries = j.feed?.entry || [];
        const filtered = entries.filter(p =>
          p.link.find(l => l.rel === "alternate").href.indexOf(o) === -1 &&
          !seen.has(p.id.$t)
        );
        for (const p of shuffle(filtered)) {
          if (c.length >= MAX) break;
          if (seen.has(p.id.$t)) continue;
          seen.add(p.id.$t);
          c.push(p)
        }
      } catch (err) {
        console.error("Related fetch error for label:", term, err)
      }
    };
    for (const term of labelOrder) {
      if (c.length >= MAX) break;
      await fetchByLabel(term)
    }
    if (c.length > 0) {
      s.innerHTML =
        ` <div class='related-posts-section'> <h3 class='related-posts-title'><i class="fa-brands fa-blogger" style="margin-right:8px;top: 6px;position: relative;font-size: 1.3rem;"></i>関連記事</h3> <div class='post-grid related-grid'> ${c.map(u).join("")} </div> </div> `
    }
  };
  const S = t => {
    const e = t.title.$t;
    const s = t.link.find(t => t.rel === "alternate").href;
    const n = t.published.$t;
    const a = t.updated.$t;
    const o = t.author[0].name.$t;
    const i = m(t);
    const l = t.summary ? c(t.summary.$t).substring(0, 200) : "";
    const r = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: e,
      url: s,
      datePublished: n,
      dateModified: a,
      author: {
        "@type": "Person",
        name: o,
        url: SNS_CONFIG.profile
      },
      description: l
    };
    if (i) {
      r.image = {
        "@type": "ImageObject",
        url: i
      }
    }
    const d = document.createElement("script");
    d.type = "application/ld+json";
    d.text = JSON.stringify(r);
    document.head.appendChild(d)
  };
  (function() {
    window.__applyTabsVisibility = function () {
      const t = document.getElementById("sidebar-tabs-widget");
      if (t) {
        const e = window.location;
        const s = e.pathname.replace(/\/+$/, "") || "/";
        const n = new URLSearchParams(e.search).get("page");
        const a = (s === "" || s === "/") && !n;
        t.style.display = a ? "none" : "";
      }
    };
    window.__applyTabsVisibility();
    const e = document.getElementById("pop-content");
    const s = document.getElementById("rec-content");
    const n = 5;
    const i = t => {
      if (!t) return "";
      const e = t.match(/(\d+)月\s+(\d+),\s+(\d+)/);
      if (e) {
        const t = ("0" + e[1]).slice(-2);
        const s = ("0" + e[2]).slice(-2);
        const n = e[3];
        return `${n}/${t}/${s}`
      }
      const s = new Date(t);
      if (!isNaN(s.getTime())) {
        const t = s.getFullYear();
        const e = ("0" + (s.getMonth() + 1)).slice(-2);
        const n = ("0" + s.getDate()).slice(-2);
        return `${t}/${e}/${n}`
      }
      return t
    };
    const l = (t, e, s, n, i, l) => {
      const r = resizeGoogleImage(e, "s80-c");
      const c = l === 1 ? "rank-1" : l === 2 ? "rank-2" : l === 3 ?
        "rank-3" : "rank-other";
      const d = l ? `<span class='rank-badge ${c}'>${l}</span>` : "";
      return ` <li class='recent-post-item'> <a href='${t}' class='recent-post-link'> <div class='recent-post-thumb-wrap'>${d}<img src='${r}' class='recent-post-thumb' alt='${s}' width='80' height='80' loading='lazy'/></div> <div class='recent-post-info'> <div class='recent-post-title'>${s}</div> <div class='recent-post-meta'> <span class='meta-item'>${o}${n}</span> ${i?`<span class='meta-item'>${a}${i}</span>`:""} </div> </div> </a> </li>`
    };
    const r = () => {
      const t = setInterval(() => {
        const s = document.querySelectorAll('[id^="PopularPosts"]');
        const n = Array.from(s).find(t => t.getAttribute("id") !==
          "PopularPosts1") || document.querySelector(
          "#PopularPosts99");
        if (n && n.querySelectorAll("li.item").length > 0) {
          clearInterval(t);
          const s = n.querySelectorAll("li.item");
          let a = "";
          s.forEach((t, e) => {
            const s = t.querySelector("a");
            if (!s) return;
            const n = t.getAttribute("data-date") || "";
            const o = i(n);
            a += l(s.href, t.querySelector("img")?.src || "", t
              .querySelector(".item-title").textContent.trim(),
              o, t.getAttribute("data-label") || "", e + 1)
          });
        document.querySelectorAll('#pop-content').forEach(function(el) {
          el.innerHTML = a;
        });
        n.style.display = "none";
        }
      }, 100);
      setTimeout(() => clearInterval(t), 5e3)
    };
    window.drawRecent = t => {
      if (!t.feed || !t.feed.entry) return;
      const html = t.feed.entry.map(t => {
        const e = t.title.$t;
        const s = t.link.find(t => t.rel === "alternate")?.href ||
        "#";
        const n = d(t.published.$t);
        const a = t.category && t.category.length > 0 ? t.category[0]
          .term : "";
        let o = t.media$thumbnail ? t.media$thumbnail.url :
          "https://via.placeholder.com/150?text=No+Image";
        return l(s, o, e, n, a)
      }).join("");
      document.querySelectorAll("#rec-content").forEach(t => {
        t.innerHTML = html
      })
    };
    const c = () => {
      const t = document.getElementById("tab-pop");
      const e = document.getElementById("tab-rec");
      const s = document.getElementById("panel-pop");
      const n = document.getElementById("panel-rec");
      const a = document.querySelector(".tab-lamp");
      if (!t || !e) return;
      t.onclick = () => {
        t.classList.add("active");
        e.classList.remove("active");
        s.classList.add("active");
        n.classList.remove("active");
        if (a) a.style.transform = "translateX(0)"
      };
      e.onclick = () => {
        t.classList.remove("active");
        e.classList.add("active");
        s.classList.remove("active");
        n.classList.add("active");
        if (a) a.style.transform = "translateX(100%)"
      };
      if (a) {
        var activeTab = document.querySelector(".tab-item.active");
        a.style.transform = (activeTab && activeTab.id === "tab-rec") ? "translateX(100%)" : "translateX(0)";
      }
    };
    r();
    c();
    const m = document.createElement("script");
    m.src =
      `/feeds/posts/summary?alt=json-in-script&callback=drawRecent&max-results=${BLOG_CONFIG.recentCount||5}`;
    document.body.appendChild(m)
  })();
	window.__msCollapseHashtags = (wrap) => {
    wrap = wrap || document.getElementById('sidebar-hashtags-wrap');
    if (!wrap) return;
    wrap.style.transition = 'none';
    wrap.style.maxHeight = '0';
    wrap.getBoundingClientRect();
    wrap.style.transition = 'max-height 400ms ease';
    let seeMoreH = wrap.parentElement && wrap.parentElement.querySelector('.hashtag-see-more');
    if (seeMoreH) seeMoreH.remove();
    seeMoreH = document.createElement('div');
    seeMoreH.className = 'hashtag-see-more';
    seeMoreH.innerHTML = '&raquo;&raquo; see more';
    seeMoreH.style.cssText = 'text-align:right;font-size:0.78rem;font-weight:600;color:var(--accent);cursor:pointer;padding:6px 0 0;user-select:none;';
    seeMoreH.addEventListener('click', () => {
      wrap.style.transition = 'none';
      wrap.style.maxHeight = 'none';
      const h = wrap.scrollHeight;
      wrap.style.maxHeight = '0';
      wrap.getBoundingClientRect();
      wrap.style.transition = 'max-height 400ms ease';
      wrap.style.maxHeight = h + 'px';
      seeMoreH.remove();
    });
    wrap.insertAdjacentElement('afterend', seeMoreH);
  };
  const A = () => {
    const t = document.querySelectorAll("#hidden-label-widget .raw-label");
    const e = document.getElementById("sidebar-labels");
    const s = document.getElementById("sidebar-hashtags");
    const n = document.getElementById("sidebar-hashtags-widget");
    const a = document.getElementById("mobile-menu-content");
    document.querySelectorAll(".search-submit").forEach(t => {
      t.innerHTML = l
    });
    let o = "";
    let i = "";
    if (t.length > 0) {
      t.forEach(t => {
        const e = t.textContent.trim();
        if (e.startsWith("#")) {
          i += `<a href='${t.href}' class='hashtag-pill'>${e.replace(/^#/, '')}</a>`
        } else {
          o += `<a href='${t.href}' class='tag'>${e}</a>`
        }
      })
    }
    if (e) {
      if (BLOG_CONFIG.showLabels) {
        e.innerHTML = o ||
          '<span style="color:var(--text-muted);font-size:0.9rem;">ラベルがありません</span>';
        e.closest(".sidebar-widget") && (e.closest(".sidebar-widget").style
          .display = "")
      } else {
        const t = e.closest(".sidebar-widget");
        if (t) t.style.display = "none"
      }
    }
    if (n) {
      if (BLOG_CONFIG.showHashtags && i) {
        s.innerHTML = i;
        n.style.display = "block";
        requestAnimationFrame(() => {
          const pills = s.querySelectorAll('a.hashtag-pill');
          if (pills.length <= 6) return;
          const wrap = document.createElement('div');
          wrap.id = 'sidebar-hashtags-wrap';
          wrap.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:0.4rem;grid-column:1/-1;overflow:hidden;max-height:0;transition:max-height 400ms ease;';
          pills.forEach((pill, idx) => {
            if (idx >= 6) wrap.appendChild(pill);
          });
          s.appendChild(wrap);
          window.__msCollapseHashtags(wrap);
        });
      } else {
        n.style.display = "none"
      }
    }
	const r = NAV_CONFIG.map(t => {
      const iconHtml = t.icon ? `<i class='${t.icon}'></i>` : "";
      if (t.mega || t.children) {
        const e = t.children ? t.children.map(child => {
          const childIcon = child.icon ? `<i class='${child.icon}'></i>` : "";
          return `<a class='dropdown-item' href='${child.url}'>${childIcon}${child.label}</a>`;
        }).join("") :
          `<a class='dropdown-item' href='${t.url}'>${t.label}の記事一覧</a>`;
        return ` <div class='has-dropdown mobile-accordion'> <a class='nav-link accordion-trigger' href='${t.url}'> ${iconHtml}${t.label} <i class='fa-solid fa-chevron-down' style='font-size:0.7rem;'></i> </a> <div class='dropdown-menu'>${e}</div> </div>`
      }
      return `<a class='nav-link' href='${t.url}'>${iconHtml}${t.label}</a>`
    }).join("");
    let c = "";
    if (BLOG_CONFIG.showLabels && o) {
      c =
        ` <div style='margin-bottom: 2rem;'> <h3 style='font-size:1rem;margin:0 0 0.8rem;padding-bottom:0.5rem;border-bottom:2px solid var(--border);'>ラベル</h3> <div class='tags'>${o}</div> </div>`
    }
    let d = "";
    if (BLOG_CONFIG.showHashtags && i) {
      d =
        ` <div style='margin-bottom: 2rem;'> <h3 style='font-size:1rem;margin:0 0 0.8rem;padding-bottom:0.5rem;border-bottom:2px solid var(--border);'>ハッシュタグ</h3> <div class='tags'>${i}</div> </div>`
    }
    const mobileProfileHtml = (() => {
      const domImg = document.getElementById("sidebar-author-img");
      const domName = document.getElementById("sidebar-author-name");
      const BLANK_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwC";
      const img = (domImg && domImg.src && !domImg.src.startsWith(BLANK_PNG)) ? domImg.src : (SNS_CONFIG.avatar || "");
      const name = (domName && domName.textContent.trim()) ? domName.textContent.trim() : "";
      const desc = SNS_CONFIG.description || "";
      const cover = SNS_CONFIG.cover || "";
      const profileUrl = SNS_CONFIG.profile || "#";
      const coverStyle = cover ? `background-image:url(${cover});background-size:cover;background-position:center;` : "background:var(--base-navy);";
      const imgHtml = img
        ? `<img id='mobile-profile-avatar' src='${img}' alt='${name}' style='width:100%;height:100%;object-fit:cover;display:block;'/>`
        : `<img id='mobile-profile-avatar' src='' alt='' style='width:100%;height:100%;object-fit:cover;display:block;display:none;'/><span style='width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--border);font-size:1.5rem;'>&#128100;</span>`;
      return `<div class='mobile-profile-card' style='margin-bottom:1rem;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);'>
        <div style='height:70px;${coverStyle}'></div>
        <div style='padding:0 1rem 1rem;'>
          <a href='${profileUrl}' target='_blank' style='display:block;margin-top:-28px;margin-bottom:0.5rem;width:56px;height:56px;border-radius:50%;overflow:hidden;border:3px solid var(--bg-color);'>
            ${imgHtml}
          </a>
          ${name ? `<div style='font-weight:700;font-size:0.95rem;color:var(--text-main);margin-bottom:0.3rem;' id='mobile-profile-name'>${name}</div>` : ""}
          <div style='font-size:0.8rem;color:var(--text-muted);line-height:1.5;'>${desc}</div>
        </div>
      </div>`;
    })();
    a.innerHTML =
      `${mobileProfileHtml} 
<div class='search-widget' style='margin-bottom: 2rem;'> <form action='/search' class='search-form' method='get'> <input class='search-input' name='q' placeholder='検索...' type='text' style='min-width:0;flex:1;width:0;'/> <button class='search-submit' type='submit' style='width:28px;height:28px;min-width:28px;max-width:28px;flex-shrink:0;padding:0;margin-right:1px;box-sizing:border-box;'>${l}</button> </form> </div> <div class='mobile-nav-navigation' style='margin-bottom: 2rem;'> <nav class='mobile-nav-nav'> ${r} </nav> </div> ${c} ${d} `;
    a.querySelectorAll(".accordion-trigger").forEach(t => {
      t.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        const s = t.closest(".has-dropdown");
        if (s) {
          s.classList.toggle("is-open")
        }
      })
    })
  };
  const N = () => {
    const t = document.getElementById("year");
    if (t) t.textContent = (new Date).getFullYear();
    const e = document.getElementById("menu-toggle");
    const s = document.getElementById("mobile-nav");
    const a = document.getElementById("nav-overlay");
    const o = document.getElementById("theme-toggle");
    if (e && s && a) {
      const t = () => {
        s.classList.remove("is-active");
        a.classList.remove("is-active")
      };
      e.addEventListener("click", () => {
        s.classList.add("is-active");
        a.classList.add("is-active")
      });
      a.addEventListener("click", t)
    }
    if (o) {
      if (window.location.hostname.includes("blogger.com")) {
        o.style.display = "none"
      } else {
        o.addEventListener("click", n)
      }
    }
    _()
  };
  const B = () => {
    const t = document.getElementById("slide-sidebar");
    const e = document.getElementById("slide-sidebar-overlay");
    if (t) t.classList.add("is-open");
    if (e) e.classList.add("is-active")
  };
  const T = () => {
    const t = document.getElementById("slide-sidebar");
    const e = document.getElementById("slide-sidebar-overlay");
    if (t) t.classList.remove("is-open");
    if (e) e.classList.remove("is-active")
  };
  const q = t => {
    const isPageNow = /^\/p\//.test(location.pathname);
    document.body.classList.toggle("is-static-page", isPageNow);

    if (window.innerWidth <= 900) {
      document.body.classList.add("sidebar-ready");
      return
    }
    const e = t.category || [];
    const cb = t.content && t.content.$t ? t.content.$t : "";
    const hasFullWidthTag = /<strike[^>]*>\s*full-width\s*<\/strike>/i.test(cb);
    const s = e.some(t => t.term && t.term.toUpperCase() === "#FULL") || isPageNow || hasFullWidthTag;
    if (s) {
      document.body.classList.add("is-full-mode");
      const t = document.querySelector(".sidebar");
      const e = document.getElementById("slide-sidebar-content");
      if (t && e && e.children.length === 0) {
        e.innerHTML = t.innerHTML;
        e.querySelectorAll('.archive-select').forEach(function(sel) {
          sel.removeAttribute('data-archive-ui-built');
          if (window.__buildArchiveSelectUI) window.__buildArchiveSelectUI(sel);
        });
        const tPop = e.querySelector('#tab-pop');
        const tRec = e.querySelector('#tab-rec');
        const pPop = e.querySelector('#panel-pop');
        const pRec = e.querySelector('#panel-rec');
        const lamp = e.querySelector('.tab-lamp');
        if (tPop && tRec) {
          tPop.onclick = () => {
            tPop.classList.add('active');
            tRec.classList.remove('active');
            pPop.classList.add('active');
            pRec.classList.remove('active');
            if (lamp) lamp.style.transform = 'translateX(0)'
          };
          tRec.onclick = () => {
            tRec.classList.add('active');
            tPop.classList.remove('active');
            pRec.classList.add('active');
            pPop.classList.remove('active');
            if (lamp) lamp.style.transform = 'translateX(100%)'
          };
          if (lamp) {
            var aTab = e.querySelector('.tab-item.active');
            lamp.style.transform = (aTab && aTab.id === 'tab-rec') ? 'translateX(100%)' : 'translateX(0)';
          }
        }

        e.querySelectorAll('[id]').forEach(function(clonedEl) {
          var KEEP_IDS = [
            'matsu-profile-container', 'sidebar-author-name', 'sidebar-author-img',
            'sidebar-author-desc', 'sidebar-profile-link', 'sidebar-social',
            'pop-content', 'rec-content', 'sidebar-random-posts-list'
          ];
          if (KEEP_IDS.indexOf(clonedEl.id) === -1) {
            clonedEl.removeAttribute('id');
          }
        });
      }
    } else {
      document.body.classList.remove("is-full-mode");
      T();
      document.body.classList.add("sidebar-ready")
    }
  };
  const M = () => {
    const t = document.getElementById("sidebar-toggle");
    if (t) t.addEventListener("click", () => {
      const t = document.getElementById("slide-sidebar");
      if (t && t.classList.contains("is-open")) T();
      else B()
    });
    const e = document.getElementById("slide-sidebar-close-btn");
    if (e) e.addEventListener("click", T);
    const s = document.getElementById("slide-sidebar-overlay");
    if (s) s.addEventListener("click", T)
  };
  const j = () => {
    const t = document.getElementById("pc-nav");
    if (!t) return;
    const e = NAV_CONFIG.map(t => {
      const iconHtml = t.icon ? `<i class='${t.icon}'></i>` : "";
      if (t.mega) {
        return ` <div class='has-mega has-dropdown' data-mega='${t.mega}' data-mega-url='${t.url}'> <a class='nav-link' href='${t.url}'> ${iconHtml}${t.label} <i class='fa-solid fa-chevron-down' style='font-size:0.7rem;margin-left:3px;'></i> </a> <div class='mega-dropdown' data-loaded='false'> <div class='mega-grid'> <div class='mega-loading'><span class='loading-spinner'></span></div> </div> <div class='mega-footer'> <a href='${t.url}'>${t.label}の記事一覧 &raquo;</a> </div> </div> </div>`
      }
      if (t.children) {
        const e = t.children.map(child => {
          const childIcon = child.icon ? `<i class='${child.icon}'></i>` : "";
          return `<a class='dropdown-item' href='${child.url}'>${childIcon}${child.label}</a>`;
        }).join("");
        return ` <div class='has-dropdown'> <a class='nav-link' href='${t.url}'> ${iconHtml}${t.label} <i class='fa-solid fa-chevron-down' style='font-size:0.7rem;margin-left:3px;'></i> </a> <div class='dropdown-menu'>${e}</div> </div>`
      }
      return `<a class='nav-link' href='${t.url}'>${iconHtml}${t.label}</a>`
    }).join("");
    t.innerHTML = e;
    t.querySelectorAll(".has-mega").forEach(t => {
      const e = t.querySelector(".mega-dropdown");
      if (!e) return;
      t.addEventListener("mouseenter", () => {
        const nav = document.querySelector(".global-nav");
        if (nav) {
          e.style.top = (nav.getBoundingClientRect().bottom - 0) + "px";
        }
        if (e.dataset.loaded !== "true") {
          e.dataset.loaded = "true";
          O(t, e)
        }
      });
    });
  };
  const O = async (t, s) => {
    const n = t.dataset.mega;
    const o = t.dataset.megaUrl;
    let i = "";
    if (n.startsWith("label$")) {
      const labelPart = n.split("label$")[1];
      const labels = labelPart.split("|").map(l => l.trim()).filter(Boolean);
      if (labels.length > 1) {
        i = "__multi__" + labels.join("|");
      } else {
        i =
          `${e()}/feeds/posts/default/-/${encodeURIComponent(labels[0])}?alt=json&max-results=4`
      }
    } else if (n === "recent") {
      i =
        `${e()}/feeds/posts/default?alt=json&max-results=4&orderby=published`
    } else if (n === "random") {
      i = `${e()}/feeds/posts/default?alt=json&max-results=20`
    }
    try {
      let o = [];
      if (i.startsWith("__multi__")) {
        const multiLabels = i.replace("__multi__", "").split("|");
        const results = await Promise.all(
          multiLabels.map(lb =>
            fetch(`${e()}/feeds/posts/default/-/${encodeURIComponent(lb)}?alt=json&max-results=10`)
              .then(r => r.json())
              .then(d => d.feed?.entry || [])
              .catch(() => [])
          )
        );
        const seen = new Set();
        results.forEach(entries => {
          entries.forEach(entry => {
            const url = entry.link?.find(l => l.rel === "alternate")?.href || "";
            if (url && !seen.has(url)) { seen.add(url); o.push(entry); }
          });
        });
        o = o.sort(() => Math.random() - 0.5).slice(0, 4);
      } else {
        const t = await fetch(i);
        const d = await t.json();
        o = d.feed?.entry || [];
        if (n === "random") {
          o = o.sort(() => Math.random() - .5).slice(0, 4)
        }
      }
      if (o.length === 0) {
        s.querySelector(".mega-grid").innerHTML =
          '<div class="mega-loading">記事が見つかりませんでした</div>';
        return
      }
      const l = o.map(t => {
        const e = t.title.$t;
        const s = t.link.find(t => t.rel === "alternate")?.href ||
        "#";
        const n = m(t);
        const o = (t.category?.[0]?.term || "").replace(/^#/, "");
        const i = n ?
          `<img class='mega-thumb' src='${n}' alt='${e}' loading='lazy'/>` :
          `<div class='mega-thumb-placeholder'>No Image</div>`;
        return ` <a class='mega-item' href='${s}'> ${n?`<img class='mega-thumb' src='${n}' alt='${e}' loading='lazy'/>`:`<div class='mega-thumb-placeholder'>No Image</div>`} <div class='mega-item-overlay'></div> <div class='mega-item-body'> ${o?`<div class='mega-item-label'>${a}${o}</div>`:""} <div class='mega-item-title'>${e}</div> </div> </a>`
      }).join("");
      s.querySelector(".mega-grid").innerHTML = l
    } catch (t) {
      console.error("Mega menu load error:", t);
      s.querySelector(".mega-grid").innerHTML =
        '<div class="mega-loading">読み込みに失敗しました</div>'
    }
  };
  const H = () => {
    const t = document.getElementById("sidebar-archive");
    const e = document.querySelectorAll(".hidden-archive-data li");
    if (!t || e.length === 0) return;
    const s = t.querySelector("select");
    const n = new Set;
    e.forEach(t => {
      const e = t.getAttribute("data-url");
      let a = t.textContent.trim();
      const o = e.match(/\/(\d{4})[_/](\d{2})[_/]/);
      if (o) {
        a = `${o[1]}年 ${parseInt(o[2])}月`
      }
      if (!n.has(e)) {
        const t = document.createElement("option");
        t.value = e;
        t.textContent = a;
        s.appendChild(t);
        n.add(e)
      }
    })
  };
  const _ = (t = {}) => {
    const l = t.name || "Author";
    const r = resizeGoogleImage(t.img || SNS_CONFIG.avatar, "s120-rw");
    const socialHtml = ` <a href="${SNS_CONFIG.twitter}" target="_blank" title='Twitter'><i class="fa-brands fa-twitter"></i></a> <a href="${SNS_CONFIG.instagram}" target="_blank" title='Github'><i class="fa-brands fa-github"></i></a> <a href="${SNS_CONFIG.tiktok}" target="_blank" title='Blogger'><i class="fa-brands fa-blogger"></i></a> <a href="${SNS_CONFIG.youtube}" target="_blank" title='YouTube'><i class="fa-brands fa-youtube"></i></a> <a href="https://blogmura.com/ranking/in?p_cid=11212823" target="_blank" title='ブログ村'><svg id="レイヤー_1" data-name="レイヤー 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><style>.cls-1{fill:#aa1520;}.cls-2{fill:#fff;}</style></defs><title>日本ブログ村</title><g id="_グループ_" data-name="&lt;グループ&gt;"><rect class="cls-1" width="400" height="400" rx="50"/><path class="cls-2" d="M87.5,330.92h220a152.11,152.11,0,0,0-215.08-5C90.77,327.57,89.11,329.23,87.5,330.92Z" transform="translate(0)"/><path class="cls-2" d="M239.2,212.87c0-10-8.85-16.11-15.23-16.11-11.18,0-15.22,8.46-15.22,14.11,0,9.74,9.18,16.58,17.43,16.58C235.67,227.42,239.2,218.5,239.2,212.87Z" transform="translate(0)"/><path class="cls-2" d="M179.69,175.73c-.14,0-13,.82-13,13.9,0,10.62,8.69,14.56,14.15,14.56,6,0,12.17-4.42,12.17-13C192.93,181.62,186.05,175.73,179.69,175.73Z" transform="translate(0)"/><path class="cls-2" d="M160.56,133.46S159.27,76.62,159.22,74H138.55c-.06,3.32-1.29,58.21-1.29,58.21V134s-30.48,2-33.48,2.21c-.06,2.72-.3,17.28-.38,20.24h2.39l31.13-.48v16.71l-.55.55C118.9,191,110.62,199.5,93.63,220.87c1.79,1.88,11.65,12.36,13.77,14.5l29.86-30.32.09,4.42s1.2,59.81,1.27,63.26H159.3c.48-15.93,1.54-62,1.54-100.13,0-5.67,0-11.15-.1-16.32v-1.76l25.44-2V133h-5Z" transform="translate(0)"/><path class="cls-2" d="M274.78,74.2h-21.3c0,3.48-.43,57.19-.43,57.19l-5.22.11-46.56,2.88c0,2.77.18,16,.21,18.91,3.47-.08,49.55-.85,49.55-.85h2l-.22,23.81.65,69.66-.15,1.91-26.4-.64c-.25,2.7-1.74,16.44-2,19.27A444.59,444.59,0,0,0,275,270.82c.59-14.95,1.55-64.13,1.55-100.62,0-6.06,0-11.74-.09-16.89v-1.83l25-1.76V131c-3.19,0-23.54.21-23.54.21H276S274.84,77.52,274.78,74.2Z" transform="translate(0)"/></g></svg></a> `;

    document.querySelectorAll("#matsu-profile-container").forEach(e => {
      const o = e.querySelector(".cover-area");
      if (o && SNS_CONFIG.cover) o.style.backgroundImage = `url(${SNS_CONFIG.cover})`;
      e.style.visibility = "visible";
    });
    document.querySelectorAll("#sidebar-author-name").forEach(s => {
      s.textContent = l;
      if (s.closest("a")) s.closest("a").href = SNS_CONFIG.profile;
    });
    document.querySelectorAll("#sidebar-author-img").forEach(n => {
      n.src = r || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    });
    document.querySelectorAll("#sidebar-profile-link").forEach(a => {
      a.href = SNS_CONFIG.profile;
    });
    document.querySelectorAll("#sidebar-social").forEach(i => {
      i.innerHTML = socialHtml;
    });
    document.querySelectorAll("#sidebar-author-desc").forEach(c => {
      c.textContent = SNS_CONFIG.description;
    });

    const mobileAv = document.getElementById("mobile-profile-avatar");
    const mobilePn = document.getElementById("mobile-profile-name");
    if (mobileAv && r) { mobileAv.src = r; mobileAv.style.display = "block"; }
    if (mobilePn && t.name) mobilePn.textContent = t.name;
  };
  const z = () => {
    const t = document.getElementById("back-to-top");
    if (!t) return;
    t.style.cssText =
      ` position: fixed !important; bottom: 30px !important; right: 30px !important; left: auto !important; top: auto !important; transform: none !important; z-index: 9999 !important; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background-color: #333; color: #fff; cursor: pointer; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0; visibility: hidden; transition: all 0.3s ease; `;
    window.addEventListener("scroll", () => {
      const e = window.pageYOffset || document.documentElement
      .scrollTop;
      if (e > 400) {
        t.style.opacity = "1";
        t.style.visibility = "visible"
      } else {
        t.style.opacity = "0";
        t.style.visibility = "hidden"
      }
    }, {
      passive: !0
    });
    t.addEventListener("click", t => {
      t.preventDefault();
      const e = -window.scrollY / (500 / 15);
      const s = setInterval(() => {
        if (window.scrollY !== 0) {
          window.scrollBy(0, e)
        } else {
          clearInterval(s)
        }
      }, 15)
    })
  };
  const G = () => {
    const t = document.getElementById("toc");
    if (!t) return;
    const e = document.querySelector(".post-body");
    if (!e) return;
    const s = Array.from(e.querySelectorAll("h2, h3, h4")).filter(t => !t
      .closest(".matsu-toc, #toc"));
    if (s.length === 0) {
      t.style.display = "none";
      return
    }
    const n = document.createElement("div");
    n.className = "matsu-toc";
    n.innerHTML =
      '<div class="matsu-toc-title"><i class="fa-solid fa-list-ul"></i> 目次</div>';
    const a = document.createElement("ul");
    s.forEach((t, e) => {
      const s = t.id || `toc-anchor-${e}`;
      t.id = s;
      const n = document.createElement("li");
      n.className = `toc-${t.tagName.toLowerCase()}`;
      const o = document.createElement("a");
      o.href = `#${s}`;
      o.textContent = t.textContent;
o.addEventListener("click", function(e) {
  e.preventDefault();
  e.stopPropagation();
  const target = document.getElementById(s);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: top, behavior: "smooth" });
});
      n.appendChild(o);
      a.appendChild(n)
    });
    n.appendChild(a);
    t.innerHTML = "";
    t.appendChild(n);
    t.style.display = "block"
  };
  const F = () => {
    const t = document.getElementById("sidebar-toc-widget");
    const e = document.getElementById("sidebar-toc-content");
    if (!t || !e || !BLOG_CONFIG.showSidebarTOC) return;
    const s = document.querySelector(".post-body");
    if (!s) {
      t.style.display = "none";
      return
    }
    const n = Array.from(s.querySelectorAll("h2, h3")).filter(t => !t
      .closest(".matsu-toc, #toc"));
    if (n.length === 0) {
      t.style.display = "none";
      return
    }
    n.forEach((t, e) => {
      if (!t.id) t.id = `toc-anchor-${e}`
    });
    const a = document.createElement("ul");
    a.className = "sidebar-toc-list";
    n.forEach(t => {
      const e = document.createElement("li");
      e.className = `sidebar-toc-${t.tagName.toLowerCase()}`;
      const s = document.createElement("a");
      s.href = `#${t.id}`;
      s.textContent = t.textContent;
      s.className = "sidebar-toc-link";
      s.addEventListener("click", e => {
        e.preventDefault();
        const s = t.getBoundingClientRect().top + window.scrollY -
          80;
        window.scrollTo({
          top: s,
          behavior: "smooth"
        })
      });
      e.appendChild(s);
      a.appendChild(e)
    });
    e.innerHTML = "";
    e.appendChild(a);
    t.style.display = "";
    const o = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const offset = 140;
      let s = n[0].id;
      n.forEach(el => {
        const rect = el.getBoundingClientRect();
        const absTop = rect.top + scrollY;
        if (absTop - offset <= scrollY) s = el.id;
      });
      e.querySelectorAll(".sidebar-toc-link").forEach(t => {
        t.classList.toggle("is-active", t.getAttribute("href") ===
          `#${s}`)
      })
    };
    window.addEventListener("scroll", o, {
      passive: !0
    });
    o()
  };
  const R = () => {
    if (window.__matsuLBReady) return;
    window.__matsuLBReady = true;
    const t = document.getElementById("matsu-lightbox");
    if (!t) return;
    const e = t.querySelector("img");
    const btn = t.querySelector(".lb-close");

    let lbOpenSrc = "";
    const lbImgObserver = new MutationObserver(() => {
      if (t.classList.contains("is-active") && lbOpenSrc && e.getAttribute("src") !== lbOpenSrc) {
        e.src = lbOpenSrc;
      }
    });
    lbImgObserver.observe(e, { attributes: true, attributeFilter: ["src"] });
    const isGcsUrl = url => {
      try {
        return new URL(url).hostname.includes("googleusercontent.com")
      } catch (err) {
        return false
      }
    };
    document.body.addEventListener("click", ev => {
      if (t.classList.contains("is-active")) return; 
      const s = ev.target.closest(".post-body a:has(img), .separator a:has(img)");
      if (!s) return;
      if (!isGcsUrl(s.href)) return; // external / non-GCS links act normally
      ev.preventDefault();
      ev.stopPropagation();
      e.onerror = null;
      e.src = s.href;
      lbOpenSrc = s.href;          
      t.classList.add("is-active");
      document.body.style.overflow = "hidden";
      if (window.__matsuArm) window.__matsuArm()
    }, true);
    const closeLightbox = () => {
      if (!t.classList.contains("is-active")) return;
      t.classList.remove("is-active");
      document.body.style.overflow = "";
      setTimeout(() => {
        if (!t.classList.contains("is-active")) e.src = ""
      }, 300)
    };
    t.addEventListener("click", ev => {
      if (ev.target.closest(".lb-close")) return; 
      if (!btnArmed) return;                      
      closeLightbox();
    });
    let btnArmed = false;
    let armTimer = null;
    if (btn) {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!btnArmed) return;            
        closeLightbox();
      });
      const arm = () => { btnArmed = false; clearTimeout(armTimer); armTimer = setTimeout(() => { btnArmed = true; }, 300); };
      window.__matsuArm = arm;  // called by the open handler above
    }
    window.addEventListener("keydown", ev => {
      if (ev.key === "Escape" && t.classList.contains("is-active")) {
        closeLightbox();
      }
    })
  };
  var MS_SCROLL_PREFIX = "msScrollPos:";
  function msSaveScrollPos(key) {
    if (!key) return;
    try { sessionStorage.setItem(MS_SCROLL_PREFIX + key, String(window.scrollY || window.pageYOffset || 0)); } catch (e) {}
  }
  function msRestoreScrollPos(key) {
    var y = 0;
    try {
      var raw = sessionStorage.getItem(MS_SCROLL_PREFIX + (key || ""));
      if (raw !== null) y = parseInt(raw, 10) || 0;
    } catch (e) {}
    window.scrollTo(0, y);
    requestAnimationFrame(function () {
      window.scrollTo(0, y);
      setTimeout(function () { window.scrollTo(0, y); }, 300);
    });
  }
  var __msScrollSaveTimer = null;
  window.addEventListener("scroll", function () {
    clearTimeout(__msScrollSaveTimer);
    __msScrollSaveTimer = setTimeout(function () {
      msSaveScrollPos(window.__msLastFullUrl || (location.pathname + location.search));
    }, 200);
  }, { passive: true });
  window.addEventListener("pagehide", function () {
    msSaveScrollPos(window.__msLastFullUrl || (location.pathname + location.search));
  });

  window.__msLastFullUrl = location.pathname + location.search;
  window.addEventListener("DOMContentLoaded", () => {
    z();
    if (window.location.hostname.includes("blogger.com")) {
      console.log("Preview mode detected. Skipping SPA initialization.");
      document.body.classList.add("sidebar-ready");
      N();
      M();
      j();
      A();
      return
    }
    N();
    M();
    j();
    A();
    H();
    x();
    k().then(() => y()).then(function() {
      var s = window.location.pathname;
      var isList = !/\/\d{4}\/\d{2}\/[^/]+\.html$/.test(s) && !/^\/p\//.test(s);
      var randomReady = (isList && typeof window.__initRandom === "function") ? window.__initRandom() : Promise.resolve();
      return Promise.resolve(randomReady).then(function () {
        var navEntries = (performance.getEntriesByType && performance.getEntriesByType("navigation")) || [];
        var navType = navEntries.length
          ? navEntries[0].type
          : (performance.navigation ? (performance.navigation.type === 2 ? "back_forward" : "navigate") : "navigate");
        if (navType === "back_forward") {
          msRestoreScrollPos(window.__msLastFullUrl || (location.pathname + location.search));
        }
      });
    });
    if (typeof loadSidebarRecent === "function") loadSidebarRecent();
    G();
    window.__vtRender = function (url, onNewNamed) {
      msSaveScrollPos(window.__msLastFullUrl || (location.pathname + location.search));
      var u = new URL(url, location.href);
      window.__lastUrl = location.href;
      history.pushState({}, "", u.pathname + u.search);
      window.__msLastFullUrl = u.pathname + u.search;
      var run = function () {
        window.scrollTo(0, 0);
        if (typeof window.__msCollapseHashtags === "function") window.__msCollapseHashtags();
        return k().then(() => y()).then(function(){
          var isList = !/\/\d{4}\/\d{2}\/[^/]+\.html$/.test(u.pathname) && !/^\/p\//.test(u.pathname);
          var randomReady = (isList && typeof window.__initRandom === "function")
            ? window.__initRandom()
            : Promise.resolve();
          return Promise.resolve(randomReady).then(function () {
            if (typeof onNewNamed === "function") return onNewNamed();
          });
        });
      };
      if (!window.__isMobileDevice() && document.startViewTransition) {
        return document.startViewTransition(run);
      }
      return run();
    };
    window.__vtSupports = function (url) {
      try {
        var u = new URL(url, location.href);
        if (u.origin !== location.origin) return false;
        if (u.pathname === location.pathname && u.search === location.search) return false;
        var ext = u.pathname.split(".").pop();
        if (["png","jpg","jpeg","gif","pdf","zip","xml","css","js"].indexOf(ext) >= 0) return false;
        if (u.search.indexOf("m=1") >= 0 || u.search.indexOf("m=0") >= 0) return false;
        if ((/\/\d{4}\/\d{2}\/[^/]+\.html$/.test(u.pathname) || u.pathname === "/" || u.pathname.startsWith("/search") || /\/\d{4}\/\d{2}\/?$/.test(u.pathname) || /_archive\.html$/.test(u.pathname))) {
          return typeof k === "function";
        }
        return false;
      } catch (e) { return false; }
    };
    window.addEventListener("popstate", function () {
      var U = window.__vtUtil || {};
      var oldUrl = window.__lastUrl || location.href;
      var newUrl = location.href;

      try {
        var loc = new URL(location.href);
        var curFullPath = loc.pathname + loc.search;
        var prevFullPath = window.__msLastFullUrl;
        if (prevFullPath !== undefined && prevFullPath === curFullPath) {
          return;
        }
        if (prevFullPath !== undefined) {
          msSaveScrollPos(prevFullPath); 
        }
        window.__msLastFullUrl = curFullPath;
      } catch (e) {}
      if (U.isArticleUrl(oldUrl) && !U.isArticleUrl(newUrl)) {
        var ai = document.querySelector(".post-body img");
        if (ai) U.setName(ai, U.slugOf(oldUrl));
      } else if (!U.isArticleUrl(oldUrl) && U.isArticleUrl(newUrl)) {
        var outLink = U.findThumb(newUrl);
        var outImg = outLink ? outLink.querySelector("img") : null;
        if (outImg) U.setName(outImg, U.slugOf(newUrl));
      }
      function waitDecode(img) {
        if (!img) return Promise.resolve();
        var p = (img.decode ? img.decode() : Promise.resolve()).catch(function(){ return Promise.resolve(); });
        var to = new Promise(function(res){ setTimeout(res, 1000); });
        return Promise.race([p, to]);
      }
      var render = function () {
        return k().then(() => y()).then(function () {
          var curUrl = location.href;
          var inProm = Promise.resolve();
          if (U.isArticleUrl(curUrl) && !U.isArticleUrl(oldUrl)) {
            var a2 = document.querySelector(".post-body img");
            inProm = waitDecode(a2).then(function(){ if (a2) U.setName(a2, U.slugOf(curUrl)); });
          } else if (!U.isArticleUrl(curUrl) && U.isArticleUrl(oldUrl)) {
            var link2 = U.findThumb(oldUrl);
            var li2 = link2 ? link2.querySelector("img") : null;
            inProm = waitDecode(li2).then(function(){ if (li2) U.setName(li2, U.slugOf(oldUrl)); });
          }
          return inProm.then(function () {
            var isList = !/\/\d{4}\/\d{2}\/[^/]+\.html$/.test(location.pathname) && !/^\/p\//.test(location.pathname);
            var rnd = (isList && typeof window.__initRandom === "function")
              ? window.__initRandom()
              : Promise.resolve();
            return Promise.resolve(rnd).then(function () {
              msRestoreScrollPos(window.__msLastFullUrl || (location.pathname + location.search));
            });
          });
        });
      };
      if (!window.__isMobileDevice() && document.startViewTransition) {
        document.startViewTransition(render);
      } else {
        render();
      }
    });
  })
})();

/* ==========================================================================
   9. フッター著作権クレジット描画
   Base64エンコードされた著作権表示HTMLのデコードとフッターへの挿入
   (元 Template.xml 行番号: L5538 - L5548)
   ========================================================================== */
(function () {
  var creditData =    "ICAgIDxkaXYgc3R5bGU9J21heC13aWR0aDogdmFyKC0tbWF4LXdpZHRoKTsgbWFyZ2luOiAwIGF1dG87IHBhZGRpbmc6IDAgMS41cmVtOyB0ZXh0LWFsaWduOiByaWdodDsnPgogICAgICA8cCBpZD0nZGVzaWduZWQtYnknIHN0eWxlPSdmb250LXNpemU6IDExcHg7IGNvbG9yOiAjODg4Oyc+CiAgICAgICAgPGEgaHJlZj0naHR0cHM6Ly9tLXN0cnV4Lm1hdHN1c2FuanBuLmNvbS8nIHN0eWxlPSdjb2xvcjogaW5oZXJpdDsgdGV4dC1kZWNvcmF0aW9uOiBub25lOycgdGFyZ2V0PSdfYmxhbmsnPiZjb3B5OyBtYXRzdXNhbjwvYT4KICAgICAgPC9wPgogICAgPC9kaXY+";
  var container = document.getElementById("footer-credit");
  if (container) {
    container.innerHTML = atob(creditData);
  }
})();

/* ==========================================================================
   10. 著作権・ライセンス保護検証スクリプト
   テーマライセンス表記の改変・削除を検知する難読化スクリプト
   (元 Template.xml 行番号: L5549 - L5553)
   ========================================================================== */
(function(_0x11928a,_0x214cfb){var _0x61ba65={_0x4cc2df:0x196,_0x183f07:0x18e,_0x5c1529:0x1db,_0x55731f:0x144},_0x3ea250=_0x4805,_0x4aab07=_0x11928a();while(!![]){try{var _0x4e5c6d=parseInt(_0x3ea250(_0x61ba65._0x4cc2df))/(-0x1f*0x55+0xa*-0x118+0x153c)*(-parseInt(_0x3ea250(_0x61ba65._0x183f07))/(0x108a+0xf7b+-0x2003))+parseInt(_0x3ea250(0x149))/(0x24a9+0x25*0xd7+-0x1*0x43b9)+-parseInt(_0x3ea250(_0x61ba65._0x5c1529))/(-0xe00+0x7b*0x51+-0x18e7)*(parseInt(_0x3ea250(0x1c2))/(0x2f*0x75+-0x225d+-0x9*-0x16f))+-parseInt(_0x3ea250(0x1b0))/(0x3b4+0x2*0x821+-0x13f0)+-parseInt(_0x3ea250(0x1ac))/(0x1031+0x2563*0x1+-0x358d)+parseInt(_0x3ea250(0x1bc))/(-0x1*-0x1ec7+-0x14fe+-0x9c1)*(-parseInt(_0x3ea250(0x1f5))/(-0x1*0x151f+-0x1bbd+0x30e5))+parseInt(_0x3ea250(0x130))/(-0x1d*0x13a+0x3f7*0x9+-0x13)*(parseInt(_0x3ea250(_0x61ba65._0x55731f))/(-0x10e1+0x240e+-0x1322));if(_0x4e5c6d===_0x214cfb)break;else _0x4aab07['push'](_0x4aab07['shift']());}catch(_0x25632b){_0x4aab07['push'](_0x4aab07['shift']());}}}(_0x537c,0x19b7+-0x39673+0x6e28d),!(function(){var _0x5c0931={_0x397674:0x120,_0x5c5872:0x124,_0x53e512:0x117,_0x50da60:0x13c,_0x407dc6:0x16e,_0x5341fb:0x1a7,_0x371a72:0x118,_0x570f71:0x179,_0x36f794:0x1e5,_0x480acd:0x204,_0x3a17c3:0x208,_0x59d812:0x180,_0x13cdd0:0x160,_0x58284a:0x11e,_0xfa4d5f:0x1f6,_0x4232df:0x1cb,_0x34574f:0x161,_0x3bbeff:0x183,_0x2f5a58:0x146,_0x44c7bb:0x155,_0x17df68:0x152,_0x3212ee:0x1e7,_0x56efcd:0x1d2,_0x57f5a2:0x1a1,_0x299212:0x16f,_0x26e733:0x1de,_0x41f94e:0x20b,_0x491be4:0x187,_0x2ccc32:0x159,_0x4bf728:0x173,_0x47d20e:0x16f,_0xe9dbae:0x17c,_0x11bea3:0x11c,_0x53457f:0x154,_0x3808f9:0x1a8,_0x390d9b:0x16d,_0x50c69e:0x1b6,_0x354771:0x1ec,_0x3d0afe:0x1b4,_0x4080d6:0x123,_0x3d1a1a:0x11d,_0x335a52:0x1b5,_0x39b4d8:0x125,_0x23ac29:0x188,_0x304048:0x16a,_0x1bd210:0x1d6,_0x1953b6:0x119,_0x25803e:0x1bb,_0x225808:0x198,_0x367450:0x184,_0x40556b:0x13d,_0x4249f2:0x170,_0x105891:0x1aa,_0x2b9d99:0x1a2,_0x130f17:0x138,_0x5f23bb:0x1c9,_0x526e83:0x112,_0x29b96d:0x181,_0x5a343f:0x186,_0x3440ec:0x1d1,_0x47deab:0x171,_0x5e139e:0x19a,_0x3a327e:0x126,_0x45534d:0x1c4,_0xc0b6af:0x1ca,_0x2c985f:0x1b7,_0x43c6c2:0x19a,_0x1c96a0:0x1e1,_0x5eaae2:0x1b8},_0x1449e3={_0x41d494:0x1dc,_0x33801b:0x18b,_0x83fdfa:0x156,_0x4d79fb:0x178,_0x2eff10:0x133,_0x18a269:0x177,_0x2dc26d:0x167,_0x395ee8:0x1ee,_0x59034f:0x156,_0x24ce45:0x15d,_0x64e13f:0x206,_0x5aef26:0x11f,_0x32f254:0x205,_0x383588:0x137,_0x56107d:0x162,_0x281150:0x1d0,_0x2190a4:0x113,_0x18d6b1:0x1da,_0x555e7f:0x1c1,_0x42e2e0:0x1cf,_0x54c98d:0x1fa,_0x1b8cb6:0x1e2,_0x7a3bc1:0x1e6,_0x348ab6:0x1d9,_0x350c27:0x1bf,_0x583af2:0x1e0,_0x1c0e44:0x1f9,_0x3da2d3:0x1bf,_0x1f8183:0x120,_0x3af1ab:0x1ef,_0x17e893:0x207,_0x254e7b:0x1b1,_0x29389f:0x18f,_0x1a2b12:0x145,_0x4524a9:0x15d,_0x88071e:0x1a9,_0xe299dd:0x157,_0x3d45f4:0x1fa,_0x236bb3:0x15d,_0x1ac8e7:0x201,_0x286388:0x1e9,_0x1b3e56:0x162,_0x232cbe:0x14e,_0x3fed49:0x1fb,_0x1075e8:0x1f4,_0x37d620:0x1d9,_0x41362b:0x194,_0x21f41b:0x1a4},_0x505c50={_0x32d1cc:0x178,_0x13c2ae:0x17a,_0x3afbc9:0x1eb,_0x486db0:0x18b,_0x2796b7:0x167},_0x38af27={_0x381570:0x147,_0x48a741:0x1c3,_0x294134:0x1c6,_0x176ed0:0x1f1,_0x3cacdd:0x1dc,_0x1fdb59:0x18a,_0x5e1d89:0x1ed,_0x1fe358:0x209,_0x4b51ab:0x1f0,_0x5b1f46:0x1d3,_0x98d503:0x1e8,_0x3218de:0x202,_0x132d8b:0x1ff,_0xc3f615:0x209,_0x4cebdd:0x1e4,_0x10a97e:0x200,_0x2958cd:0x1be},_0x13a65b={_0x206096:0x16c,_0xf527bd:0x1ae,_0x5e792e:0x202,_0x522567:0x202,_0x6cea79:0x1f8,_0x38bb78:0x209,_0x95fb5f:0x1e3,_0x44ce24:0x203,_0x2c3eb0:0x172},_0x31c541={_0xa9ac25:0x1ed},_0x4b813e={_0x2b673e:0x178},_0xe4d6a8={_0xbe645e:0x165},_0x22b912=_0x4805,_0x3aff96={'ZEtvi':_0x22b912(_0x5c0931._0x397674),'sebFC':function(_0x2f5a9b,_0x5a90f3){return _0x2f5a9b+_0x5a90f3;},'kxeXl':function(_0x407f3e,_0xfba2b3){return _0x407f3e+_0xfba2b3;},'mqAKJ':function(_0xb45017,_0x22e2aa){return _0xb45017<_0x22e2aa;},'gXeEm':function(_0x10b8ba,_0x1d23db){return _0x10b8ba===_0x1d23db;},'OseFF':function(_0x5489b9,_0x399c14){return _0x5489b9(_0x399c14);},'cuBCw':function(_0x20bbe3,_0x36b2a5){return _0x20bbe3+_0x36b2a5;},'viwRv':_0x22b912(0x1b9),'KkZUA':function(_0x30a3b5){return _0x30a3b5();},'kconH':_0x22b912(0x166),'VUtAZ':_0x22b912(0x16b),'nZCuM':function(_0xa1b72f,_0x47e79c){return _0xa1b72f<_0x47e79c;},'aavnx':function(_0x423de0,_0x4c2939){return _0x423de0===_0x4c2939;},'hzxrJ':function(_0x57d2fa,_0x4e1225){return _0x57d2fa+_0x4e1225;},'NoxyS':function(_0x5921ca){return _0x5921ca();},'AiCai':function(_0x691092,_0x5f39b5){return _0x691092+_0x5f39b5;},'JQUhG':_0x22b912(_0x5c0931._0x5c5872),'wXxci':_0x22b912(_0x5c0931._0x53e512)+'y','OmnXy':function(_0x5ddf9f,_0x25a3f3){return _0x5ddf9f!==_0x25a3f3;},'CjXhc':_0x22b912(0x15c),'euDnB':_0x22b912(_0x5c0931._0x50da60),'AWyvy':function(_0x2783a8,_0x197fd2){return _0x2783a8+_0x197fd2;},'ATgvv':function(_0x3aa0e8){return _0x3aa0e8();},'SAJQo':function(_0x2ab1ca){return _0x2ab1ca();},'aQdZW':_0x22b912(0x1fd),'oWAuY':_0x22b912(0x150),'iUhmk':_0x22b912(_0x5c0931._0x407dc6),'kOqCb':function(_0x5f3b3a,_0x246d27){return _0x5f3b3a+_0x246d27;},'GUYzF':_0x22b912(_0x5c0931._0x5341fb),'upcrW':_0x22b912(0x1ea),'hPcmo':_0x22b912(0x1d8)+'ce','NgafZ':_0x22b912(_0x5c0931._0x371a72),'WAGev':function(_0x2cb3aa,_0x56fcfa){return _0x2cb3aa+_0x56fcfa;},'shzdJ':_0x22b912(_0x5c0931._0x570f71),'xSksV':_0x22b912(_0x5c0931._0x36f794)+_0x22b912(0x1fc),'PYVNp':_0x22b912(0x12a)+'x','NqOqA':_0x22b912(_0x5c0931._0x480acd),'QYuHl':_0x22b912(0x12f)+_0x22b912(_0x5c0931._0x3a17c3),'SDdML':_0x22b912(0x142)+_0x22b912(_0x5c0931._0x59d812),'dCIYg':_0x22b912(_0x5c0931._0x13cdd0)+_0x22b912(_0x5c0931._0x58284a),'vyyhW':_0x22b912(_0x5c0931._0xfa4d5f)+_0x22b912(_0x5c0931._0x4232df),'NMxBT':_0x22b912(0x192),'rgsKZ':_0x22b912(_0x5c0931._0x34574f)+_0x22b912(0x1d5),'JCSDC':_0x22b912(0x195)+_0x22b912(_0x5c0931._0x3bbeff),'XygDv':_0x22b912(0x1c8)+_0x22b912(_0x5c0931._0x2f5a58),'EAuvG':_0x22b912(0x17b)+_0x22b912(0x1fe)+_0x22b912(0x18d)+_0x22b912(_0x5c0931._0x44c7bb),'cUSKL':_0x22b912(0x17f)+_0x22b912(_0x5c0931._0x17df68)+_0x22b912(0x14a)+'if','tVDon':_0x22b912(0x136),'rYYmg':_0x22b912(_0x5c0931._0x3212ee),'OECvN':_0x22b912(_0x5c0931._0x56efcd)+'n','WmfsN':_0x22b912(_0x5c0931._0x57f5a2),'qGhho':_0x22b912(_0x5c0931._0x299212)+_0x22b912(_0x5c0931._0x26e733)+_0x22b912(_0x5c0931._0x41f94e)+_0x22b912(_0x5c0931._0x491be4)+_0x22b912(0x168),'lWoXa':_0x22b912(_0x5c0931._0x2ccc32)+_0x22b912(_0x5c0931._0x4bf728),'psAMr':_0x22b912(_0x5c0931._0x47d20e)+_0x22b912(_0x5c0931._0xe9dbae)+_0x22b912(0x1bd),'ppVuH':_0x22b912(0x19c)+_0x22b912(0x115)+_0x22b912(_0x5c0931._0x11bea3)+_0x22b912(_0x5c0931._0x53457f),'oNPYx':_0x22b912(_0x5c0931._0x3808f9)+_0x22b912(_0x5c0931._0x390d9b)+_0x22b912(0x110)+_0x22b912(_0x5c0931._0x50c69e)+_0x22b912(_0x5c0931._0x354771),'XffZA':_0x22b912(_0x5c0931._0x3d0afe),'NSkaj':_0x22b912(0x163)+_0x22b912(0x134),'WmWbF':_0x22b912(0x185)+_0x22b912(_0x5c0931._0x4080d6)+_0x22b912(0x1df)+_0x22b912(0x1cc)+_0x22b912(0x141)+_0x22b912(0x1d7),'Qvfcl':_0x22b912(0x1a6)+'\x20→','eMZki':_0x22b912(_0x5c0931._0x3d1a1a),'fSGsD':_0x22b912(0x17e)+_0x22b912(0x14c),'lKcTw':_0x22b912(_0x5c0931._0x335a52),'tqxFy':_0x22b912(_0x5c0931._0x39b4d8),'YjDgi':_0x22b912(0x1f6)+_0x22b912(_0x5c0931._0x23ac29),'icBur':_0x22b912(_0x5c0931._0x304048)+'e','agYEC':_0x22b912(0x19f)+_0x22b912(0x164),'Njjka':_0x22b912(0x161)+_0x22b912(0x1a3),'bkVwA':_0x22b912(0x195)+_0x22b912(_0x5c0931._0x1bd210),'uqKMO':_0x22b912(0x19e),'fnVxN':_0x22b912(_0x5c0931._0x1953b6),'ueweU':_0x22b912(0x11a),'IvBiM':_0x22b912(0x1f7),'VgcOv':function(_0x46a405,_0xa2e5b){return _0x46a405(_0xa2e5b);},'BecsY':function(_0x58bd8c,_0x226acb){return _0x58bd8c+_0x226acb;},'CnINF':_0x22b912(0x129),'NZpUA':function(_0x5d2659,_0x118bcd){return _0x5d2659|_0x118bcd;},'ISLQY':function(_0x3bf748,_0x2716c2){return _0x3bf748*_0x2716c2;},'xcRkl':function(_0x5071a4,_0x541453){return _0x5071a4(_0x541453);},'jewuJ':_0x22b912(0x199),'tgcFS':_0x22b912(_0x5c0931._0x25803e),'AIIbt':_0x22b912(0x122),'vfgFN':_0x22b912(_0x5c0931._0x225808),'KpetB':function(_0x11aa93,_0x43e10d){return _0x11aa93(_0x43e10d);},'ksHfz':_0x22b912(0x1a0),'WYYYv':_0x22b912(_0x5c0931._0x367450)+'pn','Lhhnh':_0x22b912(_0x5c0931._0x40556b),'URlsd':_0x22b912(_0x5c0931._0x4249f2),'CNYKA':_0x22b912(_0x5c0931._0x105891),'odjdk':_0x22b912(0x14b),'QIYbr':_0x22b912(0x132)+_0x22b912(_0x5c0931._0x2b9d99),'IAffo':function(_0x2d6cb3,_0x204a5a,_0xae062){return _0x2d6cb3(_0x204a5a,_0xae062);}};performance[_0x22b912(_0x5c0931._0x130f17)]();var _0x314eb8=_0x3aff96[_0x22b912(_0x5c0931._0x5f23bb)](_0x3aff96[_0x22b912(_0x5c0931._0x526e83)](-0x1*0x164eab+-0x11e4eeb+0x2349d95,Math[_0x22b912(0x189)]()),-0x1*-0x698+-0xd1a+-0x11*-0x62)[_0x22b912(_0x5c0931._0x29b96d)](-0x1c7+0x7*-0x4f9+0x2*0x1253),_0x1268b0=function(_0x42cb57){var _0x1dde9f=_0x22b912,_0x5ee6d4={'rmzOq':_0x3aff96[_0x1dde9f(0x1e8)],'ZqrNJ':function(_0x2aeb47,_0x5efded){var _0x495250=_0x1dde9f;return _0x3aff96[_0x495250(0x1ff)](_0x2aeb47,_0x5efded);},'Szcig':function(_0x583f92,_0x1a0294){var _0x4635c6=_0x1dde9f;return _0x3aff96[_0x4635c6(0x14f)](_0x583f92,_0x1a0294);},'wmPOD':function(_0x167a5f,_0x4eafa4){var _0x58f0b3=_0x1dde9f;return _0x3aff96[_0x58f0b3(_0xe4d6a8._0xbe645e)](_0x167a5f,_0x4eafa4);},'QYWzL':function(_0x5517cf,_0x62825f){var _0x390a67=_0x1dde9f;return _0x3aff96[_0x390a67(_0x4b813e._0x2b673e)](_0x5517cf,_0x62825f);},'AdhCb':function(_0x1874ca,_0x26df7d){var _0x5cdf7f=_0x1dde9f;return _0x3aff96[_0x5cdf7f(0x1f0)](_0x1874ca,_0x26df7d);},'dEyCs':function(_0x18cbea,_0x53b467){var _0x56714a=_0x1dde9f;return _0x3aff96[_0x56714a(_0x31c541._0xa9ac25)](_0x18cbea,_0x53b467);},'rVTHn':_0x3aff96[_0x1dde9f(0x13f)],'psAyZ':function(_0xfb4897){var _0x20f4a3=_0x1dde9f;return _0x3aff96[_0x20f4a3(0x1be)](_0xfb4897);}};try{if(_0x3aff96[_0x1dde9f(0x178)](_0x3aff96[_0x1dde9f(0x182)],_0x3aff96[_0x1dde9f(_0x13a65b._0x206096)])){var _0x42447a=_0x48dc11[_0x1dde9f(0x1b3)+_0x1dde9f(0x14d)]('a');if(_0x42447a){var _0xec85fa=(_0x42447a[_0x1dde9f(_0x13a65b._0xf527bd)+'te'](_0x5ee6d4[_0x1dde9f(0x128)])||'')[_0x1dde9f(_0x13a65b._0x5e792e)](/\/$/,''),_0x5361b1=_0x2fd836[_0x1dde9f(_0x13a65b._0x522567)](/\/$/,''),_0x4a9f85=_0x5ee6d4[_0x1dde9f(_0x13a65b._0x6cea79)](_0x5ee6d4[_0x1dde9f(0x1dd)](_0xec85fa[_0x1dde9f(0x209)],_0x5361b1[_0x1dde9f(_0x13a65b._0x38bb78)]),_0x3a4810[_0x1dde9f(_0x13a65b._0x38bb78)]);_0x5ee6d4[_0x1dde9f(0x131)](_0x4a9f85,-0x2*0x120e+-0x59*0x1f+0x2ee3*0x1)&&(_0x4a9f85=-0x16*0xad+-0x10b7*0x2+0xc13*0x4),_0x5ee6d4[_0x1dde9f(_0x13a65b._0x95fb5f)](_0xec85fa,_0x5361b1)?_0x5ee6d4[_0x1dde9f(_0x13a65b._0x44ce24)](_0x34dc25,_0x5ee6d4[_0x1dde9f(0x191)](_0x5ee6d4[_0x1dde9f(0x12e)],_0x946823)):_0x5ee6d4[_0x1dde9f(0x127)](_0x5881a5);}else _0x5ee6d4[_0x1dde9f(0x127)](_0xe9809d);}else performance[_0x1dde9f(_0x13a65b._0x2c3eb0)]&&performance[_0x1dde9f(0x172)](_0x42cb57);}catch(_0x4418c6){}};_0x3aff96[_0x22b912(_0x5c0931._0x5a343f)](_0x1268b0,_0x3aff96[_0x22b912(_0x5c0931._0x3440ec)](_0x3aff96[_0x22b912(0x121)],_0x314eb8));var _0x4dc1b6=function(_0x3f6276){var _0xdce110=_0x22b912;return _0x3f6276[_0xdce110(0x1cf)]('');},_0x2fc974=(_0x3aff96[_0x22b912(0x126)](_0x4dc1b6,[_0x3aff96[_0x22b912(0x1a5)],':','//',_0x3aff96[_0x22b912(_0x5c0931._0x47deab)],_0x3aff96[_0x22b912(_0x5c0931._0x5e139e)]]),_0x3aff96[_0x22b912(0x19b)](_0x4dc1b6,[_0x3aff96[_0x22b912(0x1a5)],':','//',_0x3aff96[_0x22b912(0x1c4)],_0x3aff96[_0x22b912(0x13b)],_0x3aff96[_0x22b912(0x19a)]]),_0x3aff96[_0x22b912(_0x5c0931._0x3a327e)](_0x4dc1b6,[_0x3aff96[_0x22b912(0x1a5)],':','//',_0x3aff96[_0x22b912(_0x5c0931._0x45534d)],_0x3aff96[_0x22b912(0x197)],_0x3aff96[_0x22b912(_0x5c0931._0xc0b6af)],_0x3aff96[_0x22b912(_0x5c0931._0x2c985f)],_0x3aff96[_0x22b912(_0x5c0931._0x43c6c2)],'/'])),_0x5c311c=function(){var _0x14da1d=_0x22b912;_0x3aff96[_0x14da1d(0x1f0)](_0x1268b0,_0x3aff96[_0x14da1d(0x15e)](_0x3aff96[_0x14da1d(0x15f)],_0x314eb8));var _0x13b7b3=document[_0x14da1d(0x135)+_0x14da1d(0x1c7)][_0x14da1d(0x151)]||'',_0x5133bd=document[_0x14da1d(0x1b2)+'et']||document[_0x14da1d(_0x38af27._0x381570)]||'';_0x13b7b3||(_0x13b7b3='ja');var _0x11e2ee=document[_0x14da1d(_0x38af27._0x48a741)+_0x14da1d(_0x38af27._0x294134)](_0x3aff96[_0x14da1d(_0x38af27._0x176ed0)]);if(_0x11e2ee){if(_0x3aff96[_0x14da1d(_0x38af27._0x3cacdd)](_0x3aff96[_0x14da1d(_0x38af27._0x1fdb59)],_0x3aff96[_0x14da1d(0x13a)])){var _0x65c73c=_0x11e2ee[_0x14da1d(0x1b3)+_0x14da1d(0x14d)]('a');if(_0x65c73c){var _0x3d94e9=(_0x65c73c[_0x14da1d(0x1ae)+'te'](_0x3aff96[_0x14da1d(0x1e8)])||'')[_0x14da1d(0x202)](/\/$/,''),_0x592fc4=_0x2fc974[_0x14da1d(0x202)](/\/$/,''),_0x3e6cd9=_0x3aff96[_0x14da1d(_0x38af27._0x5e1d89)](_0x3aff96[_0x14da1d(0x148)](_0x3d94e9[_0x14da1d(0x209)],_0x592fc4[_0x14da1d(_0x38af27._0x1fe358)]),_0x5133bd[_0x14da1d(_0x38af27._0x1fe358)]);_0x3aff96[_0x14da1d(0x165)](_0x3e6cd9,0xd30+-0x1189+-0x3*-0x173)&&(_0x3e6cd9=0xc1*0x29+-0x172f+-0x3dd*0x2),_0x3aff96[_0x14da1d(0x1f2)](_0x3d94e9,_0x592fc4)?_0x3aff96[_0x14da1d(_0x38af27._0x4b51ab)](_0x1268b0,_0x3aff96[_0x14da1d(0x200)](_0x3aff96[_0x14da1d(0x13f)],_0x314eb8)):_0x3aff96[_0x14da1d(0x1ad)](_0x18d69f);}else _0x3aff96[_0x14da1d(_0x38af27._0x5b1f46)](_0x18d69f);}else{var _0x504da2=(_0x3b9ac2[_0x14da1d(0x1ae)+'te'](_0x3aff96[_0x14da1d(_0x38af27._0x98d503)])||'')[_0x14da1d(_0x38af27._0x3218de)](/\/$/,''),_0x2f9248=_0x36b29f[_0x14da1d(0x202)](/\/$/,''),_0x2fd86f=_0x3aff96[_0x14da1d(_0x38af27._0x132d8b)](_0x3aff96[_0x14da1d(0x14f)](_0x504da2[_0x14da1d(_0x38af27._0x1fe358)],_0x2f9248[_0x14da1d(_0x38af27._0xc3f615)]),_0x57b298[_0x14da1d(0x209)]);_0x3aff96[_0x14da1d(_0x38af27._0x4cebdd)](_0x2fd86f,0xa7a+0x432*0x2+-0x2b2*0x7)&&(_0x2fd86f=-0x1*-0x1aed+0x1b6c+0x1*-0x3659),_0x3aff96[_0x14da1d(0x1f2)](_0x504da2,_0x2f9248)?_0x3aff96[_0x14da1d(0x1f0)](_0x43011d,_0x3aff96[_0x14da1d(_0x38af27._0x10a97e)](_0x3aff96[_0x14da1d(0x13f)],_0x5c2e3c)):_0x3aff96[_0x14da1d(0x19d)](_0x12cb12);}}else _0x3aff96[_0x14da1d(_0x38af27._0x2958cd)](_0x18d69f);},_0x18d69f=function(){var _0x3b2702={_0x5b5338:0x158},_0xa639af=_0x22b912,_0xc14fdc={'Epgho':function(_0x328cf2,_0x2776b1){var _0x43496f=_0x4805;return _0x3aff96[_0x43496f(_0x3b2702._0x5b5338)](_0x328cf2,_0x2776b1);},'rELNK':_0x3aff96[_0xa639af(0x177)]};if(_0x3aff96[_0xa639af(_0x1449e3._0x41d494)](_0x3aff96[_0xa639af(0x1ab)],_0x3aff96[_0xa639af(0x1ab)]))_0x1c2d1f[_0xa639af(_0x1449e3._0x33801b)]&&_0x163922[_0xa639af(_0x1449e3._0x33801b)][_0xa639af(0x1eb)+'d'](_0xf291f0);else{if(!document[_0xa639af(0x1c3)+_0xa639af(0x1c6)](_0x3aff96[_0xa639af(_0x1449e3._0x83fdfa)])){if(_0x3aff96[_0xa639af(_0x1449e3._0x4d79fb)](_0x3aff96[_0xa639af(0x133)],_0x3aff96[_0xa639af(_0x1449e3._0x2eff10)])){try{var _0x28d578=_0x3aff96[_0xa639af(0x1d1)](_0x3aff96[_0xa639af(_0x1449e3._0x18a269)],_0x314eb8);sessionStorage[_0xa639af(_0x1449e3._0x2dc26d)](_0x28d578,'1');}catch(_0x5ab07f){}var _0x3c6c9c=document[_0xa639af(0x1fa)+_0xa639af(0x1bf)](_0x3aff96[_0xa639af(_0x1449e3._0x395ee8)]);_0x3c6c9c['id']=_0x3aff96[_0xa639af(_0x1449e3._0x59034f)],_0x3c6c9c[_0xa639af(_0x1449e3._0x24ce45)][_0xa639af(_0x1449e3._0x64e13f)]=[_0x3aff96[_0xa639af(0x15b)],_0x3aff96[_0xa639af(0x11b)],_0x3aff96[_0xa639af(_0x1449e3._0x5aef26)],_0x3aff96[_0xa639af(0x1f3)],_0x3aff96[_0xa639af(0x12c)],_0x3aff96[_0xa639af(_0x1449e3._0x32f254)],_0x3aff96[_0xa639af(_0x1449e3._0x383588)],_0x3aff96[_0xa639af(_0x1449e3._0x56107d)],_0x3aff96[_0xa639af(_0x1449e3._0x281150)],_0x3aff96[_0xa639af(_0x1449e3._0x2190a4)],_0x3aff96[_0xa639af(0x1af)],_0x3aff96[_0xa639af(_0x1449e3._0x18d6b1)],_0x3aff96[_0xa639af(_0x1449e3._0x555e7f)]][_0xa639af(_0x1449e3._0x42e2e0)](';');var _0x42ce9a=document[_0xa639af(_0x1449e3._0x54c98d)+_0xa639af(0x1bf)](_0x3aff96[_0xa639af(0x1ba)]);_0x42ce9a[_0xa639af(_0x1449e3._0x24ce45)][_0xa639af(0x116)]=_0x3aff96[_0xa639af(_0x1449e3._0x1b8cb6)],_0x42ce9a[_0xa639af(0x175)+'te'](_0x3aff96[_0xa639af(0x1ce)],_0x3aff96[_0xa639af(_0x1449e3._0x7a3bc1)]),_0x42ce9a[_0xa639af(0x1a9)+'t']=_0x314eb8,_0x3c6c9c[_0xa639af(_0x1449e3._0x348ab6)+'d'](_0x42ce9a);var _0x1896d2=document[_0xa639af(0x1fa)+_0xa639af(_0x1449e3._0x350c27)]('p');_0x1896d2[_0xa639af(0x15d)][_0xa639af(0x206)]=_0x3aff96[_0xa639af(_0x1449e3._0x583af2)],_0x1896d2[_0xa639af(0x1a9)+'t']=_0x3aff96[_0xa639af(0x114)],_0x3c6c9c[_0xa639af(0x1d9)+'d'](_0x1896d2);var _0x4dddd1=document[_0xa639af(0x1fa)+_0xa639af(0x1bf)]('p');_0x4dddd1[_0xa639af(0x15d)][_0xa639af(0x206)]=_0x3aff96[_0xa639af(0x1d4)],_0x4dddd1[_0xa639af(0x1a9)+'t']=_0x3aff96[_0xa639af(_0x1449e3._0x1c0e44)],_0x3c6c9c[_0xa639af(0x1d9)+'d'](_0x4dddd1);var _0x426bef=document[_0xa639af(_0x1449e3._0x54c98d)+_0xa639af(_0x1449e3._0x3da2d3)]('a');_0x426bef[_0xa639af(_0x1449e3._0x1f8183)]=_0x3aff96[_0xa639af(_0x1449e3._0x3af1ab)],_0x426bef[_0xa639af(_0x1449e3._0x17e893)]=_0x3aff96[_0xa639af(_0x1449e3._0x254e7b)],_0x426bef[_0xa639af(_0x1449e3._0x29389f)]=_0x3aff96[_0xa639af(_0x1449e3._0x1a2b12)],_0x426bef[_0xa639af(_0x1449e3._0x4524a9)][_0xa639af(0x206)]=_0x3aff96[_0xa639af(0x193)],_0x426bef[_0xa639af(_0x1449e3._0x88071e)+'t']=_0x3aff96[_0xa639af(_0x1449e3._0xe299dd)],_0x3c6c9c[_0xa639af(_0x1449e3._0x348ab6)+'d'](_0x426bef);var _0x25c6fe=document[_0xa639af(_0x1449e3._0x3d45f4)+_0xa639af(_0x1449e3._0x3da2d3)](_0x3aff96[_0xa639af(0x1c5)]);_0x25c6fe[_0xa639af(_0x1449e3._0x236bb3)][_0xa639af(0x206)]=[_0x3aff96[_0xa639af(0x169)],_0x3aff96[_0xa639af(0x143)],_0x3aff96[_0xa639af(0x12d)],_0x3aff96[_0xa639af(_0x1449e3._0x1ac8e7)],_0x3aff96[_0xa639af(_0x1449e3._0x286388)],_0x3aff96[_0xa639af(_0x1449e3._0x1b3e56)],_0x3aff96[_0xa639af(0x153)],_0x3aff96[_0xa639af(_0x1449e3._0x232cbe)],_0x3aff96[_0xa639af(0x1c0)],_0x3aff96[_0xa639af(0x174)]][_0xa639af(_0x1449e3._0x42e2e0)](';'),_0x25c6fe[_0xa639af(0x1a9)+'t']='×',_0x25c6fe[_0xa639af(0x175)+'te'](_0x3aff96[_0xa639af(_0x1449e3._0x3fed49)],_0x3aff96[_0xa639af(0x190)]),_0x25c6fe[_0xa639af(_0x1449e3._0x1075e8)]=function(){var _0x1fb876=_0xa639af;if(_0x3aff96[_0x1fb876(0x1dc)](_0x3aff96[_0x1fb876(0x1cd)],_0x3aff96[_0x1fb876(0x18c)]))try{if(_0x3aff96[_0x1fb876(_0x505c50._0x32d1cc)](_0x3aff96[_0x1fb876(_0x505c50._0x13c2ae)],_0x3aff96[_0x1fb876(0x17a)]))_0x3c6c9c[_0x1fb876(0x18b)]&&_0x3c6c9c[_0x1fb876(0x18b)][_0x1fb876(_0x505c50._0x3afbc9)+'d'](_0x3c6c9c);else try{_0x2d2154[_0x1fb876(_0x505c50._0x486db0)]&&_0x592aea[_0x1fb876(0x18b)][_0x1fb876(0x1eb)+'d'](_0xd03f34);}catch(_0x44ea21){}}catch(_0x150c37){}else{var _0x32cf85=_0xc14fdc[_0x1fb876(0x12b)](_0xc14fdc[_0x1fb876(0x20a)],_0x1cb6a5);_0x2ab2ea[_0x1fb876(_0x505c50._0x2796b7)](_0x32cf85,'1');}},_0x3c6c9c[_0xa639af(_0x1449e3._0x37d620)+'d'](_0x25c6fe),_0x3c6c9c[_0xa639af(_0x1449e3._0x4524a9)][_0xa639af(0x15a)]=_0x3aff96[_0xa639af(0x139)],document[_0xa639af(_0x1449e3._0x41362b)][_0xa639af(0x1d9)+'d'](_0x3c6c9c),_0x3aff96[_0xa639af(0x126)](_0x1268b0,_0x3aff96[_0xa639af(_0x1449e3._0x21f41b)](_0x3aff96[_0xa639af(0x17d)],_0x314eb8));}else return _0x4f230c[_0xa639af(0x1cf)]('');}}};_0x3aff96[_0x22b912(0x178)](_0x3aff96[_0x22b912(0x176)],document[_0x22b912(0x140)])?document[_0x22b912(0x13e)+_0x22b912(_0x5c0931._0x1c96a0)](_0x3aff96[_0x22b912(0x111)],_0x5c311c,{'once':!(-0x10ba+0x3*-0x235+0x1759)}):_0x3aff96[_0x22b912(_0x5c0931._0x5eaae2)](setTimeout,_0x5c311c,0x101*0x20+0x7*-0x14+-0x1f94);}()));function _0x4805(_0x56e394,_0x45d789){var _0x5d978b=_0x537c();return _0x4805=function(_0x562298,_0x553b16){_0x562298=_0x562298-(0x99*-0x39+-0x1d5f+0x2b0*0x18);var _0x4119c0=_0x5d978b[_0x562298];return _0x4119c0;},_0x4805(_0x56e394,_0x45d789);}function _0x537c(){var _0x2608e5=['Alert','uqKMO','setAttribu','odjdk','GUYzF','gXeEm','div','iUhmk','box-shadow','\x2010px;opac','CnINF','position:a','font-famil','300px','toString','kconH','t:1.6','.matsusanj','color:#f59','xcRkl',';font-size',':none','random','CjXhc','parentNode','oWAuY','x\x20rgba(0,0','476176YLHirX','rel','ueweU','dEyCs','color:#fff','WmWbF','body','line-heigh','1CMfUMO','Lhhnh','.com','ms-init-','vfgFN','KpetB','このサイトはM-St','NoxyS','padding:0','cursor:poi','m-strux','true','Loaded','16px','BecsY','tgcFS','公式サイトを確認する','__ms_','https://m-strux','textConten','','upcrW','2890132OaaWux','ATgvv','getAttribu','XygDv','1316916bWAPhS','XffZA','characterS','querySelec','_blank','top:8px','','CNYKA','IAffo','ms-ok-','tVDon','https','694704SoHgTN','ity:0.92;','KkZUA','ent','bkVwA','cUSKL','39805nxKtLg','getElement','ksHfz','eMZki','ById','ement','border-rad','NZpUA','URlsd',':#1e3a5f','text-decor','aQdZW','OECvN','join','rgsKZ','WAGev','aria-hidde','SAJQo','psAMr','12px','t:1','rline;','ms-lg-noti','appendChil','EAuvG','204ZELKjI','OmnXy','Szcig','\x208px;font-','eight:700;','qGhho','stener','rYYmg','QYWzL','nZCuM','position:f','WmfsN','none','ZEtvi','icBur','nNMNW','removeChil','','cuBCw','shzdJ','oNPYx','OseFF','wXxci','aavnx','QYuHl','onclick','27FycLam','background','fixed','ZqrNJ','ppVuH','createElem','fnVxN','ixed','eXBUG',':0\x204px\x2018p','sebFC','hzxrJ','YjDgi','replace','AdhCb','right:18px','dCIYg','cssText','target','47483647','length','rELNK','weight:700','.com/','QIYbr','ISLQY','JCSDC','lWoXa','ruXの著作権表記が','display','designed-b','iDIjX','aria-label','close','PYVNp','改変または削除されて','button','px\x2016px','NqOqA','href','jewuJ','example','e0b;font-w','ms-chk-','right:10px','VgcOv','psAyZ','rmzOq','ms-warn-','bottom:18p','Epgho','SDdML','tqxFy','rVTHn','z-index:21','14185130zKPACV','wmPOD','DOMContent','NgafZ','oreferrer','documentEl','span','vyyhW','now','IvBiM','euDnB','WYYYv','azAcH','.matsusanjpn','addEventLi','viwRv','readyState','ation:unde','max-width:','lKcTw','11nTVStJ','NSkaj','ius:6px','charset','AWyvy','1023405KMQkGl','i,sans-ser','loading','bsolute','tor','Njjka','kxeXl','rSwuE','lang','y:system-u','agYEC','います。',',0,0.35)','hPcmo','Qvfcl','kOqCb','⚠\x20License\x20','position','xSksV','xnnfJ','style','AiCai','JQUhG','padding:14','font-size:','NMxBT','noopener\x20n','nter','mqAKJ','LqSGq','setItem',':13px;','fSGsD','border:non','ClSOz','VUtAZ','.matsusanjpn','HegWF','margin:0\x200','','AIIbt','mark'];_0x537c=function(){return _0x2608e5;};return _0x537c();}

/* ==========================================================================
   11. Google 翻訳 UI 連携
   Google Translate 要素の初期化、バナー非表示、カスタム言語切り替えボタン制御
   (元 Template.xml 行番号: L5594 - L5645)
   ========================================================================== */
(function() {
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'ja',
      autoDisplay: false
    }, 'google_translate_hidden');
    hideBanner();
  };
  function hideBanner() {
    var banner = document.querySelector('.goog-te-banner-frame');
    if (banner) banner.style.display = 'none';
    document.body.style.top = '0';
    document.body.style.position = 'static';
    var obs = new MutationObserver(function() {
      var b = document.querySelector('.goog-te-banner-frame');
      if (b) b.style.display = 'none';
      document.body.style.top = '0';
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  }
  function translateTo(lang) {
    var select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else {
      setTimeout(function() { translateTo(lang); }, 300);
    }
  }
  var btn = document.getElementById('translate-btn');
  if (btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      btn.classList.toggle('open');
    });
    var links = btn.querySelectorAll('[data-lang]');
    links.forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        translateTo(this.getAttribute('data-lang'));
        btn.classList.remove('open');
      });
    });
  }
  document.addEventListener('click', function() {
    if (btn) btn.classList.remove('open');
  });
})();

/* ==========================================================================
   12. 記事ブックマーク (あとで読む) 機能
   localStorage を使用した記事のお気に入り保存・削除・一覧UI描画
   (元 Template.xml 行番号: L5646 - L5764)
   ========================================================================== */
(function() {
  var BM_KEY = 'mstrux-bookmarks';
  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BM_KEY) || '[]'); } catch(e) { return []; }
  }
  function saveBookmarks(list) {
    try { localStorage.setItem(BM_KEY, JSON.stringify(list)); } catch(e) {}
  }
  function isBookmarked(url) {
    return getBookmarks().some(function(b) { return b.url === url; });
  }
  function addBookmark(url, title) {
    var list = getBookmarks();
    if (!list.some(function(b) { return b.url === url; })) {
      list.unshift({ url: url, title: title });
      saveBookmarks(list);
    }
  }
  function removeBookmark(url) {
    saveBookmarks(getBookmarks().filter(function(b) { return b.url !== url; }));
  }
  function updatePanel() {
    var list = getBookmarks();
    var btn = document.getElementById('bookmark-list-btn');
    var badge = document.getElementById('bm-badge');
    var body = document.getElementById('bookmark-panel-body');
    if (!btn || !badge || !body) return;
    badge.textContent = list.length;
    btn.classList.toggle('has-bookmarks', list.length > 0);
    if (list.length === 0) {
      body.innerHTML = '<div class="bookmark-panel-empty">ブックマークはありません</div>';
    } else {
      var html = '<ul class="bookmark-panel-list">';
      list.forEach(function(b) {
        html += '<li class="bookmark-panel-item">'
          + '<a href="' + b.url + '">' + (b.title || b.url) + '</a>'
          + '<button class="bookmark-panel-remove" data-url="' + b.url + '" aria-label="削除">'
          + '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
          + '</button></li>';
      });
      html += '</ul>';
      body.innerHTML = html;
      body.querySelectorAll('.bookmark-panel-remove').forEach(function(el) {
        el.addEventListener('click', function(e) {
          e.stopPropagation();
          removeBookmark(this.dataset.url);
          updatePanel();
          updateMetaBtn();
        });
      });
    }
  }
  function updateMetaBtn() {
    var metaBtn = document.getElementById('post-bookmark-btn');
    if (!metaBtn) return;
    var url = metaBtn.dataset.url;
    var bmed = isBookmarked(url);
    metaBtn.classList.toggle('bookmarked', bmed);
    var label = metaBtn.querySelector('.bm-label');
    if (label) label.textContent = bmed ? '保存済み' : 'あとで読む';
  }
  function init() {
    var listBtn = document.getElementById('bookmark-list-btn');
    var wrapper = document.querySelector('.bookmark-wrapper');
    var panel = document.getElementById('bookmark-panel');
    if (listBtn && wrapper) {
      listBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        wrapper.classList.toggle('open');
        if (wrapper.classList.contains('open')) updatePanel();
      });
    }
    var clearBtn = document.getElementById('bm-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        saveBookmarks([]);
        updatePanel();
        updateMetaBtn();
      });
    }
    document.addEventListener('click', function() {
      if (wrapper) wrapper.classList.remove('open');
    });
    if (panel) {
      panel.addEventListener('click', function(e) { e.stopPropagation(); });
    }
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('#post-bookmark-btn');
      if (!btn) return;
      var url = btn.dataset.url;
      var title = btn.dataset.title;
      if (isBookmarked(url)) {
        removeBookmark(url);
      } else {
        addBookmark(url, title);
      }
      updateMetaBtn();
      updatePanel();
    });
    updatePanel();
    updateMetaBtn();
    var observer = new MutationObserver(function() {
      updateMetaBtn();
      updatePanel();
    });
    var target = document.getElementById('main-content') || document.body;
    observer.observe(target, { childList: true, subtree: false });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ==========================================================================
   13. モバイルパラメータ (?m=1) URLクリーンアップ
   URLクエリパラメータから "m" を除去して履歴を更新
   (元 Template.xml 行番号: L5765 - L5775)
   ========================================================================== */
(function() {
  	const url = new URL(window.location.href);
 	if (url.searchParams.has('m')) {
    url.searchParams.delete('m');
    window.history.replaceState({}, document.title, url.toString());
  	}
	})();

/* ==========================================================================
   14. 月別アーカイブ セレクトボックス UI 拡張
   Blogger標準のアーカイブドロップダウンをモダンなカスタムUIに再構築
   (元 Template.xml 行番号: L5776 - L5871)
   ========================================================================== */
(function() {
  function buildUI(sel) {
    if (sel.dataset.archiveUiBuilt === '1') return;
    if (sel.options.length <= 1) {
      var observer = new MutationObserver(function(_, obs) {
        if (sel.options.length > 1) {
          obs.disconnect();
          sel.dataset.archiveUiBuilt = '';
          buildUI(sel);
        }
      });
      observer.observe(sel, { childList: true });
      return;
    }
    sel.dataset.archiveUiBuilt = '1';
    var existing = sel.parentNode.querySelector('.custom-archive-select');
    if (existing) existing.parentNode.removeChild(existing);
    var wrapper = document.createElement('div');
    wrapper.className = 'custom-archive-select';
    var header = document.createElement('div');
    header.className = 'custom-archive-select__header';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-haspopup', 'listbox');
    header.setAttribute('aria-expanded', 'false');
    var labelSpan = document.createElement('span');
    labelSpan.textContent = sel.options[0].text;
    var arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('class', 'custom-archive-select__arrow');
    arrowSvg.setAttribute('width', '16');
    arrowSvg.setAttribute('height', '16');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('stroke', 'currentColor');
    arrowSvg.setAttribute('stroke-width', '2');
    arrowSvg.setAttribute('stroke-linecap', 'round');
    arrowSvg.setAttribute('stroke-linejoin', 'round');
    arrowSvg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M19 9l-7 7-7-7');
    arrowSvg.appendChild(path);
    header.appendChild(labelSpan);
    header.appendChild(arrowSvg);
    var optionsList = document.createElement('div');
    optionsList.className = 'custom-archive-select__options';
    optionsList.setAttribute('role', 'listbox');
	optionsList.setAttribute('data-lenis-prevent', '');
    Array.prototype.forEach.call(sel.options, function(opt, i) {
      if (i === 0) return;
      var item = document.createElement('div');
      item.className = 'custom-archive-select__option';
      item.setAttribute('role', 'option');
      item.setAttribute('data-value', opt.value);
      item.textContent = opt.text;
      optionsList.appendChild(item);
    });
    wrapper.appendChild(header);
    wrapper.appendChild(optionsList);
    sel.parentNode.insertBefore(wrapper, sel.nextSibling);
    function openUI()  { wrapper.classList.add('open');    header.setAttribute('aria-expanded', 'true');  }
    function closeUI() { wrapper.classList.remove('open'); header.setAttribute('aria-expanded', 'false'); }
    header.addEventListener('click', function(e) {
      e.stopPropagation();
      wrapper.classList.contains('open') ? closeUI() : openUI();
    });
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wrapper.classList.contains('open') ? closeUI() : openUI(); }
      if (e.key === 'Escape') closeUI();
    });
    optionsList.addEventListener('click', function(e) {
      var item = e.target.closest('.custom-archive-select__option');
      if (!item) return;
      var val = item.getAttribute('data-value');
      labelSpan.textContent = item.textContent;
      optionsList.querySelectorAll('.custom-archive-select__option').forEach(function(o) { o.classList.remove('selected'); });
      item.classList.add('selected');
      closeUI();
      if (val) window.location.href = val;
    });
    document.addEventListener('click', function() { closeUI(); });
    wrapper.addEventListener('click', function(e) { e.stopPropagation(); });
  }
  function initAll() {
    document.querySelectorAll('.archive-select').forEach(buildUI);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  window.__buildArchiveSelectUI = buildUI;
})();

/* ==========================================================================
   15. 記事読了時間 計算・表示
   本文文字数をカウントし（400文字/分換算）、読了目安時間を記事上部に自動挿入
   (元 Template.xml 行番号: L5874 - L5908)
   ========================================================================== */
(function() {
    var wpm = 400;

    function insertReadingTime() {
      var $content = document.querySelector('.post-body');
      if (!$content) return;
      if (!$content.querySelector('h1, h2, h3, p')) return;
      if ($content.querySelector('.reading-time-msg')) return;

      var clone = $content.cloneNode(true);
      clone.querySelectorAll('pre code, pre, style, script').forEach(function(el) {
        el.parentNode.removeChild(el);
      });
      var text = (clone.textContent || clone.innerText || '').replace(/[\n\r]/g, '').trim();
      var minutes = Math.ceil(text.length / wpm);

      var message = document.createElement('p');
      message.className = 'reading-time-msg';
      message.style.cssText = 'font-size:80%;color:#999;text-align:right;display:flex;align-items:center;justify-content:space-between;';
      message.innerHTML = '<span style="display:inline-block;border:1px solid #999;color:#999;font-size:90%;padding:1px 5px;border-radius:3px;line-height:1.4;">PR</span><span class="reading-time"><i class="fa-solid fa-hourglass-half"></i> この記事は約' + minutes + '分で読めます。</span>';
      $content.insertBefore(message, $content.firstChild);
    }
    var timer = null;
    var observer = new MutationObserver(function() {
      clearTimeout(timer);
      timer = setTimeout(insertReadingTime, 50);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('DOMContentLoaded', insertReadingTime);
  })();

/* ==========================================================================
   16. いいねボタン (GAS 連携)
   Google Apps Script をバックエンドにした記事ごとのいいね数取得・カウントアップ送信
   (元 Template.xml 行番号: L5909 - L5985)
   ========================================================================== */
var GAS_URL =
  	"https://script.google.com/macros/s/AKfycbx_vl7skxZ-bwyi0hFmJvbwIg4UsLHkTXuzbxna9ypAToU9m9KRNgheJkwc0gyu2wcA/exec";
	function fetchLikeCount(url, countSpan, retry) {
  	fetch(GAS_URL + "?titleURL=" + encodeURIComponent(url))
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then((data) => {
      if (parseInt(data.likeCount) > 0) {
        countSpan.textContent = data.likeCount;
        countSpan.setAttribute("data-count", data.likeCount);
      } else {
        countSpan.textContent = "";
        countSpan.setAttribute("data-count", "0");
      }
    })
    .catch((err) => {
      console.error("[like] count fetch failed:", err);
      if (!retry) {
        setTimeout(() => fetchLikeCount(url, countSpan, true), 1500);
      }
    });
 	}
	function initLikeButtons() {
  	document.querySelectorAll(".heart-btn").forEach(function (btn) {
    if (btn.dataset.initialized) return;
    btn.dataset.initialized = "true";
    var url = btn.dataset.url;
    var wrapper = btn.closest(".like-wrapper");
    var countSpan = wrapper.querySelector(".like-count");
    var heart = btn.querySelector("i");

    fetchLikeCount(url, countSpan, false);

    btn.addEventListener("click", function () {
      if (btn.disabled) return;

      btn.disabled = true;
      var currentCount = parseInt(countSpan.getAttribute("data-count") || 0);
      var newCount = currentCount + 1;
      countSpan.textContent = newCount;
      countSpan.setAttribute("data-count", newCount);
      heart.classList.remove("far");
      heart.classList.add("fas");
      btn.classList.add("liked", "animate");
      setTimeout(() => btn.classList.remove("animate"), 600);

      fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({ titleURL: url }),
      })
        .then((res) =>
          res.ok ? res.text() : Promise.reject("HTTP " + res.status),
        )
        .catch((err) => {
          console.error("[like] post failed:", err);
          countSpan.textContent = currentCount > 0 ? currentCount : "";
          countSpan.setAttribute("data-count", currentCount);
          heart.classList.remove("fas");
          heart.classList.add("far");
          btn.classList.remove("liked");
          btn.disabled = false;
          alert("送信に失敗しました。もう一度お試しください。");
        });
    });
  	});
	}
	document.addEventListener("DOMContentLoaded", initLikeButtons);
	var likeObserver = new MutationObserver(function (mutations) {
  	initLikeButtons();
	});
	likeObserver.observe(document.body, { childList: true, subtree: true });

/* ==========================================================================
   17. Prism.js 1.30.0 (シンタックスハイライター)
   コードブロックのシンタックスハイライトライブラリ本体
   (元 Template.xml 行番号: L5987 - L6009)
   ========================================================================== */
/* PrismJS 1.30.0
https://prismjs.com/download.html#themes=prism-twilight&languages=markup+css+clike+javascript */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(e){var n=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,t=0,r={},a={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(n){return n instanceof i?new i(n.type,e(n.content),n.alias):Array.isArray(n)?n.map(e):n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++t}),e.__id},clone:function e(n,t){var r,i;switch(t=t||{},a.util.type(n)){case"Object":if(i=a.util.objId(n),t[i])return t[i];for(var l in r={},t[i]=r,n)n.hasOwnProperty(l)&&(r[l]=e(n[l],t));return r;case"Array":return i=a.util.objId(n),t[i]?t[i]:(r=[],t[i]=r,n.forEach((function(n,a){r[a]=e(n,t)})),r);default:return n}},getLanguage:function(e){for(;e;){var t=n.exec(e.className);if(t)return t[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,t){e.className=e.className.replace(RegExp(n,"gi"),""),e.classList.add("language-"+t)},currentScript:function(){if("undefined"==typeof document)return null;if(document.currentScript&&"SCRIPT"===document.currentScript.tagName)return document.currentScript;try{throw new Error}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var n=document.getElementsByTagName("script");for(var t in n)if(n[t].src==e)return n[t]}return null}},isActive:function(e,n,t){for(var r="no-"+n;e;){var a=e.classList;if(a.contains(n))return!0;if(a.contains(r))return!1;e=e.parentElement}return!!t}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,n){var t=a.util.clone(a.languages[e]);for(var r in n)t[r]=n[r];return t},insertBefore:function(e,n,t,r){var i=(r=r||a.languages)[e],l={};for(var o in i)if(i.hasOwnProperty(o)){if(o==n)for(var s in t)t.hasOwnProperty(s)&&(l[s]=t[s]);t.hasOwnProperty(o)||(l[o]=i[o])}var u=r[e];return r[e]=l,a.languages.DFS(a.languages,(function(n,t){t===u&&n!=e&&(this[n]=l)})),l},DFS:function e(n,t,r,i){i=i||{};var l=a.util.objId;for(var o in n)if(n.hasOwnProperty(o)){t.call(n,o,n[o],r||o);var s=n[o],u=a.util.type(s);"Object"!==u||i[l(s)]?"Array"!==u||i[l(s)]||(i[l(s)]=!0,e(s,t,o,i)):(i[l(s)]=!0,e(s,t,null,i))}}},plugins:{},highlightAll:function(e,n){a.highlightAllUnder(document,e,n)},highlightAllUnder:function(e,n,t){var r={callback:t,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};a.hooks.run("before-highlightall",r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),a.hooks.run("before-all-elements-highlight",r);for(var i,l=0;i=r.elements[l++];)a.highlightElement(i,!0===n,r.callback)},highlightElement:function(n,t,r){var i=a.util.getLanguage(n),l=a.languages[i];a.util.setLanguage(n,i);var o=n.parentElement;o&&"pre"===o.nodeName.toLowerCase()&&a.util.setLanguage(o,i);var s={element:n,language:i,grammar:l,code:n.textContent};function u(e){s.highlightedCode=e,a.hooks.run("before-insert",s),s.element.innerHTML=s.highlightedCode,a.hooks.run("after-highlight",s),a.hooks.run("complete",s),r&&r.call(s.element)}if(a.hooks.run("before-sanity-check",s),(o=s.element.parentElement)&&"pre"===o.nodeName.toLowerCase()&&!o.hasAttribute("tabindex")&&o.setAttribute("tabindex","0"),!s.code)return a.hooks.run("complete",s),void(r&&r.call(s.element));if(a.hooks.run("before-highlight",s),s.grammar)if(t&&e.Worker){var c=new Worker(a.filename);c.onmessage=function(e){u(e.data)},c.postMessage(JSON.stringify({language:s.language,code:s.code,immediateClose:!0}))}else u(a.highlight(s.code,s.grammar,s.language));else u(a.util.encode(s.code))},highlight:function(e,n,t){var r={code:e,grammar:n,language:t};if(a.hooks.run("before-tokenize",r),!r.grammar)throw new Error('The language "'+r.language+'" has no grammar.');return r.tokens=a.tokenize(r.code,r.grammar),a.hooks.run("after-tokenize",r),i.stringify(a.util.encode(r.tokens),r.language)},tokenize:function(e,n){var t=n.rest;if(t){for(var r in t)n[r]=t[r];delete n.rest}var a=new s;return u(a,a.head,e),o(e,a,n,a.head,0),function(e){for(var n=[],t=e.head.next;t!==e.tail;)n.push(t.value),t=t.next;return n}(a)},hooks:{all:{},add:function(e,n){var t=a.hooks.all;t[e]=t[e]||[],t[e].push(n)},run:function(e,n){var t=a.hooks.all[e];if(t&&t.length)for(var r,i=0;r=t[i++];)r(n)}},Token:i};function i(e,n,t,r){this.type=e,this.content=n,this.alias=t,this.length=0|(r||"").length}function l(e,n,t,r){e.lastIndex=n;var a=e.exec(t);if(a&&r&&a[1]){var i=a[1].length;a.index+=i,a[0]=a[0].slice(i)}return a}function o(e,n,t,r,s,g){for(var f in t)if(t.hasOwnProperty(f)&&t[f]){var h=t[f];h=Array.isArray(h)?h:[h];for(var d=0;d<h.length;++d){if(g&&g.cause==f+","+d)return;var v=h[d],p=v.inside,m=!!v.lookbehind,y=!!v.greedy,k=v.alias;if(y&&!v.pattern.global){var x=v.pattern.toString().match(/[imsuy]*$/)[0];v.pattern=RegExp(v.pattern.source,x+"g")}for(var b=v.pattern||v,w=r.next,A=s;w!==n.tail&&!(g&&A>=g.reach);A+=w.value.length,w=w.next){var P=w.value;if(n.length>e.length)return;if(!(P instanceof i)){var E,S=1;if(y){if(!(E=l(b,A,e,m))||E.index>=e.length)break;var L=E.index,O=E.index+E[0].length,C=A;for(C+=w.value.length;L>=C;)C+=(w=w.next).value.length;if(A=C-=w.value.length,w.value instanceof i)continue;for(var j=w;j!==n.tail&&(C<O||"string"==typeof j.value);j=j.next)S++,C+=j.value.length;S--,P=e.slice(A,C),E.index-=A}else if(!(E=l(b,0,P,m)))continue;L=E.index;var N=E[0],_=P.slice(0,L),M=P.slice(L+N.length),W=A+P.length;g&&W>g.reach&&(g.reach=W);var I=w.prev;if(_&&(I=u(n,I,_),A+=_.length),c(n,I,S),w=u(n,I,new i(f,p?a.tokenize(N,p):N,k,N)),M&&u(n,w,M),S>1){var T={cause:f+","+d,reach:W};o(e,n,t,w.prev,A,T),g&&T.reach>g.reach&&(g.reach=T.reach)}}}}}}function s(){var e={value:null,prev:null,next:null},n={value:null,prev:e,next:null};e.next=n,this.head=e,this.tail=n,this.length=0}function u(e,n,t){var r=n.next,a={value:t,prev:n,next:r};return n.next=a,r.prev=a,e.length++,a}function c(e,n,t){for(var r=n.next,a=0;a<t&&r!==e.tail;a++)r=r.next;n.next=r,r.prev=n,e.length-=a}if(e.Prism=a,i.stringify=function e(n,t){if("string"==typeof n)return n;if(Array.isArray(n)){var r="";return n.forEach((function(n){r+=e(n,t)})),r}var i={type:n.type,content:e(n.content,t),tag:"span",classes:["token",n.type],attributes:{},language:t},l=n.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(i.classes,l):i.classes.push(l)),a.hooks.run("wrap",i);var o="";for(var s in i.attributes)o+=" "+s+'="'+(i.attributes[s]||"").replace(/"/g,"&quot;")+'"';return"<"+i.tag+' class="'+i.classes.join(" ")+'"'+o+">"+i.content+"</"+i.tag+">"},!e.document)return e.addEventListener?(a.disableWorkerMessageHandler||e.addEventListener("message",(function(n){var t=JSON.parse(n.data),r=t.language,i=t.code,l=t.immediateClose;e.postMessage(a.highlight(i,a.languages[r],r)),l&&e.close()}),!1),a):a;var g=a.util.currentScript();function f(){a.manual||a.highlightAll()}if(g&&(a.filename=g.src,g.hasAttribute("data-manual")&&(a.manual=!0)),!a.manual){var h=document.readyState;"loading"===h||"interactive"===h&&g&&g.defer?document.addEventListener("DOMContentLoaded",f):window.requestAnimationFrame?window.requestAnimationFrame(f):window.setTimeout(f,16)}return a}(_self);"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism);
Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",(function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))})),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(a,e){var s={};s["language-"+e]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[e]},s.cdata=/^<!\[CDATA\[|\]\]>$/i;var t={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:s}};t["language-"+e]={pattern:/[\s\S]+/,inside:Prism.languages[e]};var n={};n[a]={pattern:RegExp("(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g,(function(){return a})),"i"),lookbehind:!0,greedy:!0,inside:t},Prism.languages.insertBefore("markup","cdata",n)}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(a,e){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp("(^|[\"'\\s])(?:"+a+")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))","i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[e,"language-"+e],inside:Prism.languages[e]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml;
!function(s){var e=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;s.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|"+e.source+")*?(?:;|(?=\\s*\\{))"),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+e.source+"|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+e.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+e.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:e,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},s.languages.css.atrule.inside.rest=s.languages.css;var t=s.languages.markup;t&&(t.tag.addInlined("style","css"),t.tag.addAttribute("style","css"))}(Prism);
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/};
Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp("(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp("((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute("on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)","javascript")),Prism.languages.js=Prism.languages.javascript;
function mtxHighlightNewCode() {
  document.querySelectorAll('code[class*="language-"]:not(.mtx-highlighted)').forEach(function(el) {
    Prism.highlightElement(el);
    el.classList.add('mtx-highlighted');
  });
}
mtxHighlightNewCode();
var _mtxPrismObs = new MutationObserver(function() { mtxHighlightNewCode(); });
document.addEventListener('DOMContentLoaded', function() {
  mtxHighlightNewCode();
  _mtxPrismObs.observe(document.body, { childList: true, subtree: true });
});

/* ==========================================================================
   18. コードブロック コピーボタン
   pre / code 要素へのワンクリックコピーボタンの自動追加とクリップボード書き込み
   (元 Template.xml 行番号: L6010 - L6050)
   ========================================================================== */
(function() {
  function attachCopyButton(pre) {
    if (!pre || pre.querySelector('.code-copy-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', function() {
      var code = pre.querySelector('code');
      var text = code ? code.innerText : pre.innerText;
      navigator.clipboard ? navigator.clipboard.writeText(text).then(function() {
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(function() { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
      }) : (function() {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(function() { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
      })();
    });
    pre.appendChild(btn);
  }
  Prism.hooks.add('after-highlight', function(env) {
    var pre = env.element && env.element.parentElement;
    if (pre && pre.nodeName.toLowerCase() === 'pre') {
      attachCopyButton(pre);
    }
  });
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('pre[class*="language-"]').forEach(attachCopyButton);
  });
})();

/* ==========================================================================
   19. ハッシュタグ整形 & タブウィジェット
   サイドバー等のハッシュタグから不要な "#" 記号を除去し、タブの初期化を行う
   (元 Template.xml 行番号: L6051 - L6089)
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(
      "#sidebar-hashtags .hashtag-pill, #toc-nav .toc-nav-item, .blossom-label a",
    )
    .forEach((element) => {
      const text = element.textContent;
      if (text.includes("#")) {
        element.textContent = text.replace(/#/g, "");
      }
    });
  const tabWidget = document.getElementById("sidebar-tabs-widget");
  if (tabWidget) {
    const removeTabHashtags = () => {
      tabWidget.querySelectorAll(".meta-item").forEach((element) => {
        element.childNodes.forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.includes("#")
          ) {
            node.textContent = node.textContent.replace(/#/g, "");
          }
        });
      });
    };
    removeTabHashtags();
    const observer = new MutationObserver(() => {
      removeTabHashtags();
    });
    observer.observe(tabWidget, {
      childList: true,
      subtree: true,
    });
  }
});

/* ==========================================================================
   20. インフィード おすすめカード読み込み
   最新記事フィードを取得してインフィードおすすめ記事カードを生成
   (元 Template.xml 行番号: L6090 - L6166)
   ========================================================================== */
(function() {
  function loadInfeedCard(container) {
    if (container.getAttribute('data-infeed-loaded') === 'true') return;
    container.setAttribute('data-infeed-loaded', 'true');

    fetch('/feeds/posts/summary?alt=json&max-results=100')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (!data || !data.feed || !data.feed.entry) return;
        const entries = data.feed.entry;
        const entry = entries[Math.floor(Math.random() * entries.length)];        
        const title = entry.title ? entry.title.$t : '';
        const alternateLink = entry.link ? entry.link.find(l => l.rel === 'alternate') : null;
        const link = alternateLink ? alternateLink.href : '#';
        let labelsHtml = '';
        const icon = '<i class="fa-solid fa-tag"></i>';
        if (entry.category && entry.category.length > 0) {
          labelsHtml = entry.category.map(cat => {
            const cleanTerm = (cat.term || '').replace(/#/g, '');
            return `<span class="category-label">${icon}${cleanTerm}</span>`;
          }).join('');
        } else {
          labelsHtml = `<span class="category-label">${icon}RECOMMEND</span>`;
        }
        let rawSummary = '';
        if (entry.summary && entry.summary.$t) {
          rawSummary = entry.summary.$t;
        } else if (entry.content && entry.content.$t) {
          rawSummary = entry.content.$t;
        }
        const summary = rawSummary.replace(/<[^>]*>/g, '').substring(0, 150);
        let img = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPDYu4ibLWCVdJdTwQa2zoBViIfND-ZB0Y9g8IU1Csk_7AoRwVi1efzTdGFKjaiXh9LPWyCllES9iKlhik8b2G2liUUd8oeAA4NOVflZO3VqPtxhzuUteSAIGCRkyw2Ps8R5FjyFd1FzhmgPYCeAUGBM2qx3Z-lXUGUft6xgiKGUORq3Uz2ULqbSZFEsQ/s1600/NoImage.png';
        if (entry.media$thumbnail && entry.media$thumbnail.url) {
          img = entry.media$thumbnail.url.replace(/\/s[0-9]+[^\/]*\//, '/w600/').replace(/\/s[0-9]+[^\/]*$/, '/w600');
        } else if (entry.content && entry.content.$t && typeof entry.content.$t === 'string' && entry.content.$t.includes('<img')) {
          const imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) img = imgMatch[1];
        }
        container.innerHTML = `
          <a href="${link}" class="infeed-blog-card">
            <div class="meta">
              <div class="photo" style="background-image: url(${img})"></div>
            </div>
            <div class="description">
              <div class="label-container">${labelsHtml}</div>
              <div><b>${title}</b></div>
              <p>${summary}</p>
            </div>
          </a>
        `;
      })
      .catch(error => {
        console.error('Infeed card load error:', error);
      });
  }
  const immediateContainer = document.getElementById('infeed-slanted-card-container');
  if (immediateContainer) {
    loadInfeedCard(immediateContainer);
  }
  const observer = new MutationObserver(function() {
    const dynamicContainer = document.getElementById('infeed-slanted-card-container');
    if (dynamicContainer) {
      loadInfeedCard(dynamicContainer);
    }
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();

/* ==========================================================================
   21. ラヴァランプ タブアニメーション
   タブ切り替え時に背景インジケーターがスライドするアニメーション制御
   (元 Template.xml 行番号: L6167 - L6224)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const initLavaLampGroup = ($wrapper) => {
    if ($wrapper.dataset.lavalampInitialized) return;
    const $buttons = $wrapper.querySelectorAll(".tab-buttons span");
    const $lamp = $wrapper.querySelector(".lamp");
    const $contentContainer = $wrapper.querySelector(".tab-content");
    if (!$buttons.length || !$contentContainer) return;
    const $panels = $contentContainer.querySelectorAll(".content1, .content2, .content3, .content4");
    if (!$panels.length) return;
    const lampWidth = 100 / $buttons.length;
    if ($lamp) {
      $lamp.style.width = `${lampWidth}%`;
      $lamp.style.position = "absolute";
      $lamp.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    }
    $buttons.forEach((button, index) => {
      button.onclick = () => {
        $buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        if ($lamp) {
          $lamp.style.transform = `translateX(${index * 100}%)`;
        }
        $panels.forEach(panel => panel.classList.remove("active"));
        if ($panels[index]) {
          $panels[index].classList.add("active");
        }
      };
    });
    let activeIndex = 0;
    $buttons.forEach((btn, idx) => {
      if (btn.classList.contains("active")) {
        activeIndex = idx;
      }
    });
    $buttons[activeIndex].classList.add("active");
    if ($lamp) {
      $lamp.style.transform = `translateX(${activeIndex * 100}%)`;
    }
    $panels.forEach(panel => panel.classList.remove("active"));
    if ($panels[activeIndex]) {
      $panels[activeIndex].classList.add("active");
    }
    $wrapper.dataset.lavalampInitialized = "true";
  };
  document.querySelectorAll(".lava-lamp-wrapper").forEach($wrapper => {
    initLavaLampGroup($wrapper);
  });
  const _tabObs = new MutationObserver(() => {
    document.querySelectorAll(".lava-lamp-wrapper").forEach($wrapper => {
      initLavaLampGroup($wrapper);
    });
  });
  _tabObs.observe(document.body || document.documentElement, { childList: true, subtree: true });
});

/* ==========================================================================
   22. ヘッダー背景画像 プリローダー
   ヘッダー背景画像を事前読み込みし、読み込み完了後にヘッダーにクラスを付与
   (元 Template.xml 行番号: L6225 - L6245)
   ========================================================================== */
(function() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var bgUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVZbMAogx2LneA2z_8LuHLg8NI6wiruiwl98SftmpYTJwPE-2-tvWlpn4hzbgqWhd9E_OQ1YCnhTvxp0nOwhgZrQE7yoPrM6BYWn8w2HTWn_uFjHbr_yOiS3keIKM1IWlrUxFWJTTOy9EPITk3v2BsUgPhlpUwQg9KjMQKKtH8ge3GbbnAUc0TYGDjQgw/w1920/aig-esports_7525009-xl_TP_V.webp";
  
  var img = new Image();
  img.src = bgUrl;
  
    if (img.complete) {
    header.classList.add('is-loaded');
  } else {
    img.onload = img.onerror = function() {
      header.classList.add('is-loaded');
    };
  }
})();

/* ==========================================================================
   23. Cookie 同意ポップアップ制御
   Cookie同意バナーの表示判定および「了解」ボタン押下時の保存・フェードアウト処理
   (元 Template.xml 行番号: L6256 - L6272)
   ========================================================================== */
(function() {
    if (!localStorage.getItem('cookie_consent')) {
      document.getElementById('cookie-popup').style.display = 'flex';
    }
  })();
  function acceptCookies() {
    localStorage.setItem('cookie_consent', '1');
    const el = document.getElementById('cookie-popup');
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.25s, transform 0.25s';
    setTimeout(() => el.style.display = 'none', 250);
  }

/* ==========================================================================
   24. グローバル人気ランキング (GAS 連携)
   GASからサイト全体のアクセス・人気記事ランキングデータを取得して描画
   (元 Template.xml 行番号: L6273 - L6337)
   ========================================================================== */
(function() {
  var GAS_RANKING_URL = "https://script.google.com/macros/s/AKfycby3MRkDpz_QhPwB5scSrxHj1qO9xJo_sugPX9caoJ8nNBThV9SBsZAsouKziHqW16MqPA/exec";
  function loadGlobalRanking() {
    var container = document.getElementById('global-ranking-container');
    if (!container) return;
    fetch(GAS_RANKING_URL + '?action=getRanking&t=' + Date.now())
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) {
        var rows = Array.isArray(data) ? data : (data.ranking || data.data || []);
        if (!rows.length) {
          container.innerHTML = '<div class="ranking-no-data">データがありません</div>';
          return;
        }
        var COEFFICIENT = 100;

        rows.sort(function(a, b) {
          return (a.finalScore || 0) - (b.finalScore || 0);
        });
        container.innerHTML = rows.map(function(item, i) {
          var rank = rows.length - i; 
          var medal = '';
          var rankDisplay = '<span class="rank-number">' + rank + '</span>'; 
          if (rank === 1) {
            rankDisplay = '<i class="fas fa-crown rank-icon gold"></i>';
          } else if (rank === 2) {
            rankDisplay = '<i class="fas fa-crown rank-icon silver"></i>';
          } else if (rank === 3) {
            rankDisplay = '<i class="fas fa-crown rank-icon bronze"></i>';
          }          
          var title = item.title || item.url || '---';
          var url = item.url || item.titleURL || '#';          
          var rawScore = item.finalScore || item.count || 0;
          var score = Math.floor(rawScore * COEFFICIENT);          
          return '<div class="ranking-item">'
            + '<div class="col-rank">' + rankDisplay + '</div>'
            + '<div class="col-title"><a href="' + url + '" class="ranking-link" target="_blank">' + title + '</a></div>'
            + '<div class="col-score">' + score.toLocaleString() + ' pt</div>'
            + '</div>';
        }).join('');
      })
      .catch(function(err) {
        console.error('Ranking load error:', err);
        container.innerHTML = '<div class="ranking-error">読み込みに失敗しました</div>';
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGlobalRanking);
  } else {
    loadGlobalRanking();
  }
  var _rankObs = new MutationObserver(function() {
    if (document.getElementById('global-ranking-container')) {
      loadGlobalRanking();
      _rankObs.disconnect();
    }
  });
  _rankObs.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();

/* ==========================================================================
   25. Firefox 向け 3D ポスターアニメーション調整
   Firefoxにおける3D transformアニメーション表示の不具合回避処理
   (元 Template.xml 行番号: L6338 - L6357)
   ========================================================================== */
if (navigator.userAgent.indexOf('Firefox') !== -1) {
  var box = document.getElementById('eva_poster_box');
  var titleArea = document.getElementById('eva_poster_title_area');
  var imageFront = document.getElementById('eva_poster_image_front');  
  if (box) {
    box.style.setProperty('animation', 'none', 'important');
    box.style.setProperty('transform', 'none', 'important');
    box.style.setProperty('transform-style', 'flat', 'important');
  }
  if (titleArea) {
    titleArea.style.setProperty('transform', 'none', 'important');
  }
  if (imageFront) {
    imageFront.style.setProperty('transform', 'none', 'important');
  }
}

/* ==========================================================================
   26. てがろぐ RSS フィード取得・表示ウィジェット
   外部ミニブログ「てがろぐ」の最新RSSをプロキシ経由で取得してカード表示
   (元 Template.xml 行番号: L6358 - L6442)
   ========================================================================== */
(function () {
  var RSS_URL = "https://matsusan.minim.ne.jp/tegalog/?mode=rss";
  var PROXY_URL = "https://tegalog-rss-proxy.youtpd.workers.dev/";
  var AVATAR_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi380UnXWc7qx7L2Vf7gAo9GrmajjCz78AKoyguXthsGyslvB7xtfZ4BzdBZW0K8BEZDULNIbC4Yb2fwJ26WSeA6GGF6MPCdAd_W6-kH9Q_IWvzBnb5GLpn8eyXeKBYmG91CmOv9oEA9FudVYJavCed2vi-P2k2bUZAPxuJSMSsiWnyfeQ/s120-rw/Q2oUGyNL98qvY6c1714843519_1714843529.png"; 
  var elCard = document.getElementById("tg-card");
  var elError = document.getElementById("tg-error");
  var elAvatar = document.getElementById("tg-avatar");
  var elDate = document.getElementById("tg-date");
  var elText = document.getElementById("tg-text");
  var elImage = document.getElementById("tg-image"); 
  if (AVATAR_URL) elAvatar.src = AVATAR_URL; 
  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    });
  } 
  function render(xmlText) {
    var parser = new DOMParser();
    var xml = parser.parseFromString(xmlText, "text/xml"); 
    var parseError = xml.querySelector("parsererror");
    if (parseError) throw new Error("XML parse error"); 
    var item = xml.querySelector("item");
    if (!item) throw new Error("no item found"); 
    var pubDateEl = item.querySelector("pubDate");
    var descEl = item.querySelector("description");
    var pubDate = pubDateEl ? pubDateEl.textContent : "";
    var descHtml = descEl ? descEl.textContent : ""; 
    var temp = document.createElement("div");
    temp.innerHTML = descHtml; 
    var tagLinks = temp.querySelectorAll("a.taglink");
    for (var i = 0; i < tagLinks.length; i++) {
      var a = tagLinks[i];
      var tagText = a.textContent.replace(/^#/, "");
      var newA = document.createElement("a");
      newA.href = "https://x.com/hashtag/" + encodeURIComponent(tagText);
      newA.target = "_blank";
      newA.rel = "noopener noreferrer";
      newA.textContent = a.textContent;
      a.parentNode.replaceChild(newA, a);
    } 
    var imgs = temp.querySelectorAll("img.embeddedimage");
    var imageUrl = imgs.length ? imgs[0].getAttribute("src") : null;
    for (var j = 0; j < imgs.length; j++) {
      imgs[j].parentNode.removeChild(imgs[j]);
    } 
    var html = temp.innerHTML; 
    html = html.replace(/--\s*Posted by[\s\S]*$/i, "");
    html = html.replace(/(\s*<br\s*\/?>\s*)+$/i, ""); 
    elText.innerHTML = html.trim(); 
    if (imageUrl) {
      elImage.src = imageUrl;
      elImage.style.display = "block";
    } 
    elDate.textContent = formatDate(pubDate);
    elCard.style.display = "flex";
    elError.style.display = "none";
  } 
  function formatDate(pubDateStr) {
    var d = new Date(pubDateStr);
    if (isNaN(d.getTime())) return "";
    return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
  } 
  function showError() {
    elCard.style.display = "none";
    elError.style.display = "block";
  } 
  fetchText(RSS_URL)
    .then(render)
    .catch(function (err) {
      if (!PROXY_URL) {
        console.error("tegalog widget: direct fetch failed", err);
        showError();
        return;
      }
      fetchText(PROXY_URL).then(render).catch(function (err2) {
        console.error("tegalog widget: proxy fetch failed", err2);
        showError();
      });
    });
})();

/* ==========================================================================
   27. 記事アンケート・投票ウィジェット
   PHPバックエンドAPIと連携した記事ごとの投票・アンケートUIと結果集計表示
   (元 Template.xml 行番号: L6443 - L6607)
   ========================================================================== */
(function () {
  var API_URL = 'https://matsusan.minim.ne.jp/poll/poll.php';
  var STORAGE_PREFIX = 'matsu_poll_voted_';
  function getAutoPostId() {
    var path = (window.location.pathname || '').replace(/\/$/, '');
    var id = path.replace(/[^a-zA-Z0-9_\-]/g, '_');
    return id || 'top';
  }
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'text') e.textContent = attrs[k];
        else e.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function renderResult(container, data, votedChoice) {
    var total = (data.a || 0) + (data.b || 0);
    var pctA = total > 0 ? Math.round((data.a / total) * 100) : 0;
    var pctB = total > 0 ? Math.round((data.b / total) * 100) : 0;
    container.innerHTML = '';
    var result = el('div', { class: 'matsu-poll-result' });
    [
      { key: 'a', label: data.label_a, pct: pctA, count: data.a },
      { key: 'b', label: data.label_b, pct: pctB, count: data.b }
    ].forEach(function (item) {
      var row = el('div', { class: 'matsu-poll-row' });
      var labelLine = el('div', { class: 'matsu-poll-row-label' });
      labelLine.appendChild(el('span', {
        text: item.label + (votedChoice === item.key ? ' (あなたの回答)' : '')
      }));
      labelLine.appendChild(el('span', { class: 'matsu-poll-pct', text: item.pct + '%' }));

      var bar = el('div', { class: 'matsu-poll-bar' });
      var fill = el('div', { class: 'matsu-poll-bar-fill' + (votedChoice === item.key ? ' is-you' : '') });
      fill.style.width = item.pct + '%';
      bar.appendChild(fill);

      row.appendChild(labelLine);
      row.appendChild(bar);
      result.appendChild(row);
    });
    result.appendChild(el('div', { class: 'matsu-poll-total', text: '合計 ' + total + '票' }));
    container.appendChild(result);
  }
  function fetchAndRender(container, postId, labelA, labelB, votedChoice) {
    fetch(API_URL + '?post_id=' + encodeURIComponent(postId) +
      '&label_a=' + encodeURIComponent(labelA) +
      '&label_b=' + encodeURIComponent(labelB))
      .then(function (r) { return r.json(); })
      .then(function (data) { renderResult(container, data, votedChoice); })
      .catch(function () {
        container.innerHTML = '<p class="matsu-poll-error">結果を読み込めませんでした</p>';
      });
  }
  function vote(container, postId, choice, labelA, labelB) {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: postId,
        choice: choice,
        label_a: labelA,
        label_b: labelB
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        localStorage.setItem(STORAGE_PREFIX + postId, choice);
        renderResult(container, data, choice);
      })
      .catch(function () {
        container.innerHTML = '<p class="matsu-poll-error">送信に失敗しました</p>';
      });
  }
  function init(box) {
    var postIdAttr = box.getAttribute('data-post-id') || '';
    var isBroken = postIdAttr === '' || postIdAttr.indexOf('data:post.id') !== -1 || postIdAttr.indexOf('<') !== -1;
    var postId = isBroken ? getAutoPostId() : postIdAttr;
    var question = box.getAttribute('data-question') || '';
    var labelA = box.getAttribute('data-label-a') || 'A';
    var labelB = box.getAttribute('data-label-b') || 'B';
    var pollId = box.getAttribute('data-poll-id') || ''; 
    var pollKey = pollId ? (postId + '__' + pollId) : postId;
    var wrapper = el('div', { class: 'matsu-poll-wrapper' });
    if (question) {
      wrapper.appendChild(el('p', { class: 'matsu-poll-question', text: question }));
    }
    var body = el('div', { class: 'matsu-poll-body' });
    wrapper.appendChild(body);
    box.innerHTML = '';
    box.appendChild(wrapper);
    var votedChoice = localStorage.getItem(STORAGE_PREFIX + pollKey);
    if (votedChoice) {
      fetchAndRender(body, pollKey, labelA, labelB, votedChoice);
      return;
    }
    var buttons = el('div', { class: 'matsu-poll-buttons' });
    var btnA = el('button', { class: 'matsu-poll-btn', type: 'button', text: labelA });
    var btnB = el('button', { class: 'matsu-poll-btn', type: 'button', text: labelB });
    btnA.addEventListener('click', function () { vote(body, pollKey, 'a', labelA, labelB); });
    btnB.addEventListener('click', function () { vote(body, pollKey, 'b', labelA, labelB); });
    buttons.appendChild(btnA);
    buttons.appendChild(btnB);
    body.appendChild(buttons);
    var skip = el('a', {
      class: 'matsu-poll-skip',
      href: 'javascript:void(0)',
      text: '投票せずに結果を見る'
    });
    skip.addEventListener('click', function () {
      fetchAndRender(body, pollKey, labelA, labelB, null);
    });
    body.appendChild(skip);
  }
  function injectStyles() {
    if (document.getElementById('matsu-poll-styles')) return;
    var style = document.createElement('style');
    style.id = 'matsu-poll-styles';
    style.textContent =
      '.matsu-poll-wrapper{border:1px solid #e0e0e0;border-radius:10px;padding:16px 20px;margin:24px 0;background:#fafafa;}' +
      '.matsu-poll-question{font-weight:bold;margin:0 0 12px;font-size:1.05em;}' +
      '.matsu-poll-buttons{display:flex;gap:12px;}' +
      '.matsu-poll-btn{flex:1;padding:10px 16px;border:1px solid #999;border-radius:8px;background:#fff;cursor:pointer;font-size:0.95em;transition:background .15s,border-color .15s;}' +
      '.matsu-poll-btn:hover{background:#f0f6ff;border-color:#4a90d9;}' +
      '.matsu-poll-row{margin-bottom:10px;}' +
      '.matsu-poll-row-label{display:flex;justify-content:space-between;font-size:0.9em;margin-bottom:4px;}' +
      '.matsu-poll-pct{font-weight:bold;color:#4a90d9;}' +
      '.matsu-poll-bar{background:#e6e6e6;border-radius:6px;height:10px;overflow:hidden;}' +
      '.matsu-poll-bar-fill{background:#a8c8ee;height:100%;transition:width .4s ease;}' +
      '.matsu-poll-bar-fill.is-you{background:#4a90d9;}' +
      '.matsu-poll-total{text-align:right;font-size:0.8em;color:#888;margin-top:6px;}' +
      '.matsu-poll-error{color:#c0392b;font-size:0.9em;}' +
      '.matsu-poll-skip{display:block;text-align:right;margin-top:8px;font-size:0.8em;color:#888;text-decoration:underline;cursor:pointer;}';
    document.head.appendChild(style);
  }
  var INIT_FLAG = 'data-matsu-poll-initialized';
  function initAll() {
    injectStyles();
    var boxes = document.querySelectorAll('.matsu-poll:not([' + INIT_FLAG + '])');
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].setAttribute(INIT_FLAG, '1');
      init(boxes[i]);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  if (window.MutationObserver) {
    var observer = new MutationObserver(function () {
      initAll();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

/* ==========================================================================
   28. はてなブックマーク ランキングウィジェット
   Cloudflare Worker 経由ではてなブックマーク人気エントリーを取得して描画
   (元 Template.xml 行番号: L6608 - L6732)
   ========================================================================== */
(function () {
  'use strict'; 
  var WORKER_ENDPOINT = 'https://hatebu.youtpd.workers.dev/';
  var LIMIT = 3;
  var INIT_FLAG = 'data-matsu-hatebu-initialized';
  var WIDGET_SELECTOR = '.matsu-hatebu-ranking'; 
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  } 
 function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  } 
  function render(box, items) {
    if (!items || items.length === 0) {
      box.innerHTML = '';
      return;
    } 
    var html = '<div class="matsu-hatebu-ranking-grid">'; 
    items.forEach(function (item) {
      var thumbHtml = item.thumbnail
        ? '<img src="' + escapeHtml(item.thumbnail) + '" alt="" loading="lazy">'
        : '<div class="matsu-hatebu-card-noimg"></div>';
 
      html += '<a class="matsu-hatebu-card" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener" data-external-link>'
            +   '<span class="matsu-hatebu-card-count">'
            +     '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>'
            +     ' ' + item.count
            +   '</span>'
            +   '<span class="matsu-hatebu-card-title">' + escapeHtml(item.title) + '</span>'
            +   thumbHtml
            +   '<span class="matsu-hatebu-card-site">'
            +     '<img class="matsu-hatebu-card-favicon" src="https://www.google.com/s2/favicons?domain=' + escapeHtml(item.domain) + '&sz=32" alt="" loading="lazy">'
            +     escapeHtml(item.domain)
            +   '</span>'
            + '</a>';
    }); 
    html += '</div>';
    box.innerHTML = html;
  } 
  function updateHatebWrapper(box, tag) {
    var wrapper = box.closest('.hateb');
    if (!wrapper) return; 
    var titleEl = wrapper.querySelector('.hateb-ttl-text') || wrapper.querySelector('.hateb-ttl');
    if (titleEl) {
      titleEl.textContent = titleEl.textContent.replace('**', tag);
    } 
    var linkEl = wrapper.querySelector('a[href*="b.hatena.ne.jp"]');
    if (linkEl) {
      var span = linkEl.querySelector('span');
      if (span) {
        span.textContent = span.textContent.replace('**', tag);
      }
      try {
        var linkUrl = new URL(linkEl.getAttribute('href'), location.href);
        linkUrl.pathname = '/q/' + encodeURIComponent(tag); 
        linkEl.setAttribute('href', linkUrl.toString());
      } catch (e) { /* noop */ }
    }
  } 
  function initOne(box) {
    var tag = box.getAttribute('data-tag') || '';
    if (!tag) {
      box.innerHTML = ''; 
      return;
    }
    var sort = box.getAttribute('data-sort') === 'recent' ? 'recent' : 'popular'; 
    updateHatebWrapper(box, tag); 
    var url = WORKER_ENDPOINT + '?tag=' + encodeURIComponent(tag) + '&limit=' + LIMIT + '&sort=' + sort; 
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        render(box, data);
      })
      .catch(function (err) {
        console.error('はてなブックマークランキング取得失敗:', err);
        box.innerHTML = '';
      });
  } 
  function initAll() {
    var boxes = document.querySelectorAll(WIDGET_SELECTOR + ':not([' + INIT_FLAG + '])');
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].setAttribute(INIT_FLAG, '1');
      initOne(boxes[i]);
    }
  } 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  } 
  if (window.MutationObserver) {
    var observer = new MutationObserver(function () {
      initAll();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function injectStyles() {
    if (document.getElementById('matsu-hatebu-ranking-styles')) return;
    var style = document.createElement('style');
    style.id = 'matsu-hatebu-ranking-styles';
    style.textContent =
      '.matsu-hatebu-ranking-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.8em;margin:1.5em 0;}' +
      '.matsu-hatebu-card{display:flex;flex-direction:column;border:1px solid rgba(0,0,0,0.1);border-radius:8px;overflow:hidden;text-decoration:none;color:inherit;background:#fff;transition:box-shadow .15s ease;}' +
      '.matsu-hatebu-card:hover{box-shadow:0 2px 8px rgba(0,0,0,0.12);}' +
      '.matsu-hatebu-card-count{display:flex;align-items:center;gap:.3em;font-size:.85em;color:#1e3a5f;font-weight:bold;padding:.6em .8em 0;text-decoration:none;}' +
      '.matsu-hatebu-card-title{font-size:.9em;line-height:1.4;min-height:2.8em;height:3.0rem;padding:.3em .8em .6em;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}' +
      '.matsu-hatebu-card img:not(.matsu-hatebu-card-favicon){width:calc(100% - 1.6em);margin:0 .8em;aspect-ratio:16/9;object-fit:cover;display:block;background:#eee;border-radius:4px;margin-top:0.8rem;}' +
      '.matsu-hatebu-card-noimg{width:calc(100% - 1.6em);margin:0 .8em;aspect-ratio:16/9;background:#eee;border-radius:4px;margin-top:.8rem}' +
      '.matsu-hatebu-card-site{display:flex;align-items:center;gap:.4em;font-size:.78em;opacity:.7;padding:.5em .8em;}' +
      '.matsu-hatebu-card-favicon{width:14px;height:14px;}' +
	  '.matsu-hatebu-card:hover {text-decoration: none !important;}' +
      '@media (max-width:600px){.matsu-hatebu-ranking-grid{grid-template-columns:1fr;}.matsu-hatebu-card:nth-child(n+2){display:none;}}';
    document.head.appendChild(style);
  }
  injectStyles();
})();

/* ==========================================================================
   29. Lenis スムーススクロール ライブラリ
   スムーズな慣性スクロールを提供する Lenis v1.0.18 ライブラリ本体
   (元 Template.xml 行番号: L6733 - L6765)
   ========================================================================== */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t||self).Lenis=e()}(this,function(){function t(t,e){for(var i=0;i<e.length;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,"symbol"==typeof(n=function(t,e){if("object"!=typeof t||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var o=i.call(t,"string");if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(o.key))?n:String(n),o)}var n}function e(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),Object.defineProperty(e,"prototype",{writable:!1}),e}function i(){return i=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])}return t},i.apply(this,arguments)}function o(t,e,i){return Math.max(t,Math.min(e,i))}var n=/*#__PURE__*/function(){function t(){}var e=t.prototype;return e.advance=function(t){var e,i,n,s;if(this.isRunning){var r=!1;if(this.lerp)this.value=(i=this.value,n=this.to,(1-(s=1-Math.exp(-60*this.lerp*t)))*i+s*n),Math.round(this.value)===this.to&&(this.value=this.to,r=!0);else{this.currentTime+=t;var l=o(0,this.currentTime/this.duration,1),h=(r=l>=1)?1:this.easing(l);this.value=this.from+(this.to-this.from)*h}null==(e=this.onUpdate)||e.call(this,this.value,{completed:r}),r&&this.stop()}},e.stop=function(){this.isRunning=!1},e.fromTo=function(t,e,i){var o=i.lerp,n=void 0===o?.1:o,s=i.duration,r=void 0===s?1:s,l=i.easing,h=void 0===l?function(t){return t}:l,a=i.onUpdate;this.from=this.value=t,this.to=e,this.lerp=n,this.duration=r,this.easing=h,this.currentTime=0,this.isRunning=!0,this.onUpdate=a},t}(),s=/*#__PURE__*/function(){function t(t){var e,i,o=this,n=void 0===t?{}:t,s=n.wrapper,r=n.content,l=n.autoResize,h=void 0===l||l;if(this.resize=function(){o.onWrapperResize(),o.onContentResize()},this.onWrapperResize=function(){o.wrapper===window?(o.width=window.innerWidth,o.height=window.innerHeight):(o.width=o.wrapper.clientWidth,o.height=o.wrapper.clientHeight)},this.onContentResize=function(){o.scrollHeight=o.content.scrollHeight,o.scrollWidth=o.content.scrollWidth},this.wrapper=s,this.content=r,h){var a=(e=this.resize,function(){var t=arguments,o=this;clearTimeout(i),i=setTimeout(function(){e.apply(o,t)},250)});this.wrapper!==window&&(this.wrapperResizeObserver=new ResizeObserver(a),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(a),this.contentResizeObserver.observe(this.content)}this.resize()}return t.prototype.destroy=function(){var t,e;null==(t=this.wrapperResizeObserver)||t.disconnect(),null==(e=this.contentResizeObserver)||e.disconnect()},e(t,[{key:"limit",get:function(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}}]),t}(),r=/*#__PURE__*/function(){function t(){this.events={}}var e=t.prototype;return e.emit=function(t){for(var e=this.events[t]||[],i=0,o=e.length;i<o;i++)e[i].apply(e,[].slice.call(arguments,1))},e.on=function(t,e){var i,o=this;return(null==(i=this.events[t])?void 0:i.push(e))||(this.events[t]=[e]),function(){var i;o.events[t]=null==(i=o.events[t])?void 0:i.filter(function(t){return e!==t})}},e.destroy=function(){this.events={}},t}(),l=/*#__PURE__*/function(){function t(t,e){var i=this,n=e.wheelMultiplier,s=void 0===n?1:n,l=e.touchMultiplier,h=void 0===l?2:l,a=e.normalizeWheel,c=void 0!==a&&a;this.onTouchStart=function(t){var e=t.targetTouches?t.targetTouches[0]:t,o=e.clientY;i.touchStart.x=e.clientX,i.touchStart.y=o,i.lastDelta={x:0,y:0}},this.onTouchMove=function(t){var e=t.targetTouches?t.targetTouches[0]:t,o=e.clientX,n=e.clientY,s=-(o-i.touchStart.x)*i.touchMultiplier,r=-(n-i.touchStart.y)*i.touchMultiplier;i.touchStart.x=o,i.touchStart.y=n,i.lastDelta={x:s,y:r},i.emitter.emit("scroll",{type:"touch",deltaX:s,deltaY:r,event:t})},this.onTouchEnd=function(t){i.emitter.emit("scroll",{type:"touch",inertia:!0,deltaX:i.lastDelta.x,deltaY:i.lastDelta.y,event:t})},this.onWheel=function(t){var e=t.deltaX,n=t.deltaY;i.normalizeWheel&&(e=o(-100,e,100),n=o(-100,n,100)),i.emitter.emit("scroll",{type:"wheel",deltaX:e*=i.wheelMultiplier,deltaY:n*=i.wheelMultiplier,event:t})},this.element=t,this.wheelMultiplier=s,this.touchMultiplier=h,this.normalizeWheel=c,this.touchStart={x:null,y:null},this.emitter=new r,this.element.addEventListener("wheel",this.onWheel,{passive:!1}),this.element.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.addEventListener("touchend",this.onTouchEnd,{passive:!1})}var e=t.prototype;return e.on=function(t,e){return this.emitter.on(t,e)},e.destroy=function(){this.emitter.destroy(),this.element.removeEventListener("wheel",this.onWheel,{passive:!1}),this.element.removeEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.removeEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.removeEventListener("touchend",this.onTouchEnd,{passive:!1})},t}();
return function(){function t(t){var e=this,o=void 0===t?{}:t,h=o.wrapper,a=void 0===h?window:h,c=o.content,u=void 0===c?document.documentElement:c,p=o.wheelEventsTarget,d=void 0===p?a:p,v=o.smoothWheel,m=void 0===v||v,f=o.smoothTouch,g=void 0!==f&&f,y=o.syncTouch,S=void 0!==y&&y,w=o.syncTouchLerp,T=void 0===w?.1:w,b=o.__iosNoInertiaSyncTouchLerp,z=void 0===b?.4:b,M=o.touchInertiaMultiplier,E=void 0===M?35:M,L=o.duration,_=o.easing,O=void 0===_?function(t){return Math.min(1,1.001-Math.pow(2,-10*t))}:_,R=o.lerp,W=void 0===R?L&&.1:R,k=o.infinite,x=void 0!==k&&k,H=o.orientation,j=void 0===H?"vertical":H,A=o.gestureOrientation,X=void 0===A?"vertical":A,Y=o.touchMultiplier,D=void 0===Y?1:Y,I=o.wheelMultiplier,P=void 0===I?1:I,C=o.normalizeWheel,U=void 0!==C&&C,N=o.autoResize,V=void 0===N||N;this.onVirtualScroll=function(t){var o=t.type,n=t.inertia,s=t.deltaX,r=t.deltaY,l=t.event;if(!l.ctrlKey){var h="touch"===o,a="wheel"===o;if(!("vertical"===e.options.gestureOrientation&&0===r||"horizontal"===e.options.gestureOrientation&&0===s||h&&"vertical"===e.options.gestureOrientation&&0===e.scroll&&!e.options.infinite&&r<=0||l.composedPath().find(function(t){return(null==t||null==t.hasAttribute?void 0:t.hasAttribute("data-lenis-prevent"))||h&&(null==t||null==t.hasAttribute?void 0:t.hasAttribute("data-lenis-prevent-touch"))||a&&(null==t||null==t.hasAttribute?void 0:t.hasAttribute("data-lenis-prevent-wheel"))})))if(e.isStopped||e.isLocked)l.preventDefault();else{if(e.isSmooth=(e.options.smoothTouch||e.options.syncTouch)&&h||e.options.smoothWheel&&a,!e.isSmooth)return e.isScrolling=!1,void e.animate.stop();l.preventDefault();var c=r;"both"===e.options.gestureOrientation?c=Math.abs(r)>Math.abs(s)?r:s:"horizontal"===e.options.gestureOrientation&&(c=s);var u=h&&e.options.syncTouch,p=h&&n&&Math.abs(c)>1;p&&(c=e.velocity*e.options.touchInertiaMultiplier),e.scrollTo(e.targetScroll+c,i({programmatic:!1},u&&{lerp:p?e.syncTouchLerp:e.options.__iosNoInertiaSyncTouchLerp}))}}},this.onScroll=function(){if(!e.isScrolling){var t=e.animatedScroll;e.animatedScroll=e.targetScroll=e.actualScroll,e.velocity=0,e.direction=Math.sign(e.animatedScroll-t),e.emit()}},window.lenisVersion="1.0.18",a!==document.documentElement&&a!==document.body||(a=window),this.options={wrapper:a,content:u,wheelEventsTarget:d,smoothWheel:m,smoothTouch:g,syncTouch:S,syncTouchLerp:T,__iosNoInertiaSyncTouchLerp:z,touchInertiaMultiplier:E,duration:L,easing:O,lerp:W,infinite:x,gestureOrientation:X,orientation:j,touchMultiplier:D,wheelMultiplier:P,normalizeWheel:U,autoResize:V},this.dimensions=new s({wrapper:a,content:u,autoResize:V}),this.rootElement.classList.add("lenis"),this.velocity=0,this.isStopped=!1,this.isSmooth=m||g,this.isScrolling=!1,this.targetScroll=this.animatedScroll=this.actualScroll,this.animate=new n,this.emitter=new r,this.options.wrapper.addEventListener("scroll",this.onScroll,{passive:!1}),this.virtualScroll=new l(d,{touchMultiplier:D,wheelMultiplier:P,normalizeWheel:U}),this.virtualScroll.on("scroll",this.onVirtualScroll)}var h=t.prototype;return h.destroy=function(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onScroll,{passive:!1}),this.virtualScroll.destroy(),this.dimensions.destroy(),this.rootElement.classList.remove("lenis"),this.rootElement.classList.remove("lenis-smooth"),this.rootElement.classList.remove("lenis-scrolling"),this.rootElement.classList.remove("lenis-stopped")},h.on=function(t,e){return this.emitter.on(t,e)},h.off=function(t,e){var i;this.emitter.events[t]=null==(i=this.emitter.events[t])?void 0:i.filter(function(t){return e!==t})},h.setScroll=function(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t},h.resize=function(){this.dimensions.resize()},h.emit=function(){this.emitter.emit("scroll",this)},h.reset=function(){this.isLocked=!1,this.isScrolling=!1,this.velocity=0,this.animate.stop()},h.start=function(){this.isStopped=!1,this.reset()},h.stop=function(){this.isStopped=!0,this.animate.stop(),this.reset()},h.raf=function(t){var e=t-(this.time||t);this.time=t,this.animate.advance(.001*e)},h.scrollTo=function(t,e){var i=this,n=void 0===e?{}:e,s=n.offset,r=void 0===s?0:s,l=n.immediate,h=void 0!==l&&l,a=n.lock,c=void 0!==a&&a,u=n.duration,p=void 0===u?this.options.duration:u,d=n.easing,v=void 0===d?this.options.easing:d,m=n.lerp,f=void 0===m?!p&&this.options.lerp:m,g=n.onComplete,y=void 0===g?null:g,S=n.force,w=n.programmatic,T=void 0===w||w;if(!this.isStopped||void 0!==S&&S){if(["top","left","start"].includes(t))t=0;else if(["bottom","right","end"].includes(t))t=this.limit;else{var b,z;if("string"==typeof t?z=document.querySelector(t):null!=(b=t)&&b.nodeType&&(z=t),z){if(this.options.wrapper!==window){var M=this.options.wrapper.getBoundingClientRect();r-=this.isHorizontal?M.left:M.top}var E=z.getBoundingClientRect();t=(this.isHorizontal?E.left:E.top)+this.animatedScroll}}if("number"==typeof t){if(t+=r,t=Math.round(t),this.options.infinite?T&&(this.targetScroll=this.animatedScroll=this.scroll):t=o(0,t,this.limit),h)return this.animatedScroll=this.targetScroll=t,this.setScroll(this.scroll),this.reset(),this.emit(),void(null==y||y());if(!T){if(t===this.targetScroll)return;this.targetScroll=t}this.animate.fromTo(this.animatedScroll,t,{duration:p,easing:v,lerp:f,onUpdate:function(t,e){var o=e.completed;c&&(i.isLocked=!0),i.isScrolling=!0,i.velocity=t-i.animatedScroll,i.direction=Math.sign(i.velocity),i.animatedScroll=t,i.setScroll(i.scroll),T&&(i.targetScroll=t),o&&(c&&(i.isLocked=!1),requestAnimationFrame(function(){i.isScrolling=!1}),i.velocity=0,null==y||y()),i.emit()}})}}},e(t,[{key:"rootElement",get:function(){return this.options.wrapper===window?this.options.content:this.options.wrapper}},{key:"limit",get:function(){return this.dimensions.limit[this.isHorizontal?"x":"y"]}},{key:"isHorizontal",get:function(){return"horizontal"===this.options.orientation}},{key:"actualScroll",get:function(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}},{key:"scroll",get:function(){return this.options.infinite?(this.animatedScroll%(t=this.limit)+t)%t:this.animatedScroll;var t}},{key:"progress",get:function(){return 0===this.limit?1:this.scroll/this.limit}},{key:"isSmooth",get:function(){return this.__isSmooth},set:function(t){this.__isSmooth!==t&&(this.rootElement.classList.toggle("lenis-smooth",t),this.__isSmooth=t)}},{key:"isScrolling",get:function(){return this.__isScrolling},set:function(t){this.__isScrolling!==t&&(this.rootElement.classList.toggle("lenis-scrolling",t),this.__isScrolling=t)}},{key:"isStopped",get:function(){return this.__isStopped},set:function(t){this.__isStopped!==t&&(this.rootElement.classList.toggle("lenis-stopped",t),this.__isStopped=t)}}]),t}()});
document.addEventListener('DOMContentLoaded', function () {
  var lenis = new Lenis({
    lerp: 0.1
  });
  window.matsuLenis = lenis;
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  (function () {
    var timer = null;
    var safeResize = function () {
      clearTimeout(timer);
      timer = setTimeout(function () { lenis.resize(); }, 150);
    };
    new MutationObserver(safeResize).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'height', 'width', 'class']
    });
    window.addEventListener('load', safeResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(safeResize);

    window.matsuSafeResize = safeResize;
  })();
});

/* ==========================================================================
   30. Lenis 初期化 & 読了プログレスバー
   Lenisインスタンスの生成、モバイル判定、スクロール進捗バー更新
   (元 Template.xml 行番号: L6766 - L6849)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const hostname = window.location.hostname;
    const search = window.location.search;

    const isBloggerPreview =
        hostname === 'draft.blogger.com' ||
        hostname.endsWith('.blogger.com') ||
        /[?&]preview(?:=|&|$)/i.test(search) ||
        /[?&]view=preview(?:&|$)/i.test(search);

    const isMobile =
        /Android|iPhone|iPad|iPod|Mobile/i.test(
            window.navigator.userAgent
        );

    const isMobileView = /[?&]m=1(?:&|$)/i.test(search);

    if (isBloggerPreview || isMobile || isMobileView) {
        return;
    }
    const modal = document.getElementById('adblockModal');
    if (!modal) return;

    const EXCLUDED_IP = '60.103.251.89';

    fetch('https://api.ipify.org?format=json')
        .then(response => {
            if (!response.ok) {
                throw new Error('IP address lookup failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.ip === EXCLUDED_IP) {
                return;
            }

            initAdBlockCheck(modal);
        })
        .catch(() => {
        });
});

function initAdBlockCheck(modal) {
    let adChecked = false;

    function checkAdBlock() {
        if (adChecked) return;

        const adSlots = document.querySelectorAll('.adsense-slot');

        if (adSlots.length === 0) {
            adChecked = true;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            return;
        }
        let blockedCount = 0;
        adSlots.forEach(slot => {
            const style = window.getComputedStyle(slot);
            const isHidden =
                style.display === 'none' ||
                style.visibility === 'hidden';
            const isCollapsed =
                slot.offsetHeight === 0 &&
                slot.offsetWidth === 0;
            const isEmpty = slot.innerHTML.trim() === '';

            if (isHidden || isCollapsed || isEmpty) {
                blockedCount++;
            }
        });
        if (blockedCount >= adSlots.length) {
            adChecked = true;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    setTimeout(checkAdBlock, 4500);
}

/* ==========================================================================
   31. スムーススクロール・アンカージャンプ調整
   目次リンク等のアンカージャンプ時のスクロール位置補正とユーザー操作検知
   (元 Template.xml 行番号: L6850 - L6887)
   ========================================================================== */
(function () {
  var w = window, last = null; 
  function run(e) {
    var m = false, t0 = Date.now();
    var stop = function () { m = true; };
    ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (t) {
      w.addEventListener(t, stop, { passive: true, once: true });
    });
    (function tick() {
      if (m || !document.body.contains(e) || Date.now() - t0 > 5000) { return; }
      var y = Math.round(e.getBoundingClientRect().top + w.pageYOffset);
      if (Math.abs(w.pageYOffset - y) > 1) {
        if (w.lenis && w.lenis.scrollTo) { w.lenis.scrollTo(y, { immediate: true, force: true }); }
        w.scrollTo({ top: y, left: 0, behavior: 'instant' });
      }
      requestAnimationFrame(tick);
    })();
  } 
  function check() {
    var e = document.getElementById('wf-sum');
    if (!e) { last = null; return; }
    if (e !== last) { last = e; run(e); }
  }
   new MutationObserver(check).observe(document.body, { childList: true, subtree: true });
  check();
  document.addEventListener('change', function(e) {
    if (e.target && e.target.matches('input[name="wf-sum-set"]')) {
      var wfSum = document.getElementById('wf-sum');
      if (wfSum) {
        run(wfSum);
      }
    }
  });
})();

/* ==========================================================================
   32. サイドバー ハッシュタグ「もっと見る」アコーディオン
   ハッシュタグ一覧の「もっと見る」ボタン押下時のスムーズな展開アニメーション
   (元 Template.xml 行番号: L6898 - L6915)
   ========================================================================== */
document.addEventListener('click', function (e) {
  var btn = e.target.closest ? e.target.closest('#slide-sidebar .hashtag-see-more') : null;
  if (!btn) return;
  var wrap = btn.previousElementSibling;
  if (!wrap) return;
  wrap.style.transition = 'none';
  wrap.style.maxHeight = 'none';
  var h = wrap.scrollHeight;
  wrap.style.maxHeight = '0';
  wrap.getBoundingClientRect();
  wrap.style.transition = 'max-height 400ms ease';
  wrap.style.maxHeight = h ? h + 'px' : 'none';
  btn.remove();
});

