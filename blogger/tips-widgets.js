/**
 * ==========================================================================
 * M-StruX - External JavaScript Bundle (external.js)
 * 
 * 外部に預けてもブログの基本表示に影響を与えない独立機能・ライブラリ・追加ウィジェット群
 * （Prism.js、Lenis、各種ランキング・投票・いいね・装飾機能など 合計27モジュール）
 * ==========================================================================
 */

/* ==========================================================================
   1. ナビゲーションバー追従制御 (Peek.js 初期化)
   上部グローバルナビのスクロール連動表示・非表示クラス制御
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
   2. Google AdSense アンカー広告 非表示制御
   画面下部等のアンカー広告 (ins.adsbygoogle) を非表示化
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
   3. A/Bテスト アイテム ランダム表示
   .strux-ab-item 要素の中からランダムで1つを表示
   ========================================================================== */
(function() {
    		const struxAbElements = document.querySelectorAll('.strux-ab-item');
    		if (struxAbElements.length > 0) {
        		const struxSelectedIdx = Math.floor(Math.random() * struxAbElements.length);
        		struxAbElements[struxSelectedIdx].style.display = 'block';
    		}
		})();

/* ==========================================================================
   4. サイドバー ランダム記事ウィジェット
   フィードから記事をランダム取得してサイドバーにカード描画
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
   5. A8.net ランダムバナーB
   サイドバー下部のA8バナーをランダム選定して挿入
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
   6. Google 翻訳 UI 連携
   Google Translate 要素の初期化、バナー非表示、言語切り替えボタン制御
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
   7. 記事ブックマーク (あとで読む) 機能
   localStorage を使用した記事のお気に入り保存・削除・一覧UI描画
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
   8. モバイルパラメータ (?m=1) URLクリーンアップ
   URLクエリパラメータから "m" を除去して履歴を更新
   ========================================================================== */
(function() {
  	const url = new URL(window.location.href);
 	if (url.searchParams.has('m')) {
    url.searchParams.delete('m');
    window.history.replaceState({}, document.title, url.toString());
  	}
	})();

/* ==========================================================================
   9. 月別アーカイブ セレクトボックス UI 拡張
   Blogger標準のアーカイブドロップダウンをカスタムUIに拡張
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
   10. 記事読了時間 計算・表示
   本文文字数をカウントし（400文字/分換算）、読了目安時間を自動挿入
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
   11. いいねボタン (GAS 連携)
   Google Apps Script と連携した記事ごとのいいね数取得・送信
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
   12. Prism.js 1.30.0 (シンタックスハイライター)
   コードブロックのシンタックスハイライトライブラリ本体
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
   13. コードブロック コピーボタン
   pre / code 要素へのワンクリックコピーボタンの自動追加
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
   14. ハッシュタグ整形 & タブウィジェット
   ハッシュタグから "#" を除去し、タブウィジェットを初期化
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
   15. インフィード おすすめカード読み込み
   フィードを取得してインフィードおすすめ記事カードを生成
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
   16. ラヴァランプ タブアニメーション
   タブ切り替え時に背景インジケーターがスライドするアニメーション制御
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
   17. ヘッダー背景画像 プリローダー
   ヘッダー背景画像を事前読み込みし、完了後にクラスを付与
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
   18. Cookie 同意ポップアップ制御
   Cookie同意バナーの表示判定および「了解」ボタン押下時の保存処理
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
   19. グローバル人気ランキング (GAS 連携)
   GASからアクセス・人気記事ランキングデータを取得して描画
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
   20. Firefox 向け 3D ポスターアニメーション調整
   Firefoxにおける3D transformアニメーションの表示不具合回避
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
   21. てがろぐ RSS フィード取得・表示ウィジェット
   外部ミニブログ「てがろぐ」の最新RSSを取得してカード表示
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
   22. 記事アンケート・投票ウィジェット
   PHPバックエンドAPIと連携した記事ごとの投票・アンケートUI
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
   23. はてなブックマーク ランキングウィジェット
   Cloudflare Worker 経由ではてなブックマーク人気エントリーを描画
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
   24. Lenis スムーススクロール ライブラリ
   スムーズな慣性スクロールを提供する Lenis v1.0.18 ライブラリ本体
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
   25. Lenis 初期化 & 読了プログレスバー
   Lenisインスタンスの生成、モバイル判定、スクロール進捗バー更新
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
   26. スムーススクロール・アンカージャンプ調整
   目次リンク等のアンカージャンプ時のスクロール位置補正
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
   27. サイドバー ハッシュタグ「もっと見る」アコーディオン
   ハッシュタグ一覧の「もっと見る」ボタン押下時のアコーディオン開閉
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

