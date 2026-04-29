/* ==========================================================
   Blogger Custom Scripts (matsusan0717) - Full Integration (Tabs Removed)
   ========================================================== */

// 【設定】URL
const GAS_URL_POST = "https://script.google.com/macros/s/AKfycbx2h91Hn0jKy04oLEAdYyFAZcGXbxintxOKwvK6hYJLLF2GKwE4w8ZLkx3SrPByWqDLeA/exec";
const GAS_URL_GET  = "https://script.google.com/macros/s/AKfycbxS5Q2evDdaZ6D13BE3ikIeTMUEVsPlL6XtchE6VELFHu9OhmSYCJNXm6_onlrBna-G4w/exec";
const BLOG_URL = 'https://blogger.matsusanjpn.com/';
const EXCLUDE_PATH = "/p/";
const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

document.addEventListener('DOMContentLoaded', () => {

  const BLOG_URL_HOSTNAME = window.location.hostname;

  // 1. 画像最適化 (WebP/リサイズ) & 広告制御
  const optimizeContent = () => {
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (!src || src.includes('data:image')) return;
      if (src.match(/\/s\d+(-rw)?\//)) {
        img.setAttribute('src', src.replace(/\/s\d+(-rw)?\//, '/w750-rw/'));
      }
      if (img.closest('.md-thumb') && src.includes('/s1600/')) {
        img.setAttribute('src', src.replace('/s1600/', '/w400-rw/'));
      }
    });
    document.querySelectorAll('.google-auto-placed, .adsbygoogle[data-ad-status="unfilled"]').forEach(ad => ad.remove());
  };
  window.addEventListener('load', optimizeContent);
  new MutationObserver(optimizeContent).observe(document.body, { childList: true, subtree: true });

  // 2. ランキング表示 (GET)
  (function() {
    const rankContainer = document.getElementById('global-ranking-container');
    if (!rankContainer) return;

    fetch(GAS_URL_GET).then(res => res.json()).then(data => {
      if (!data || data.length === 0) return;
      let html = '';
      data.forEach((item, index) => {
        const rank = circleNumbers[index] || (index + 1);
        const path = item.path || (Array.isArray(item) ? item[1] : '');
        const title = item.title || (Array.isArray(item) ? item[0] : '');
        const score = item.finalScore || (Array.isArray(item) ? item[2] : 0);
        if (!path) return;
        html += `<tr class="ranking-item"><td class="col-rank">${rank}</td><td class="col-title"><a href="${path}">${title || path}</a></td><td class="col-score">${Math.round(score * 100)}点</td></tr>`;
      });
      rankContainer.innerHTML = html;
    }).catch(err => console.error("Ranking Load Error:", err));
  })();

  // 3. レーダーチャート生成
  (function() {
    const updateRadar = () => {
      const container = document.querySelector('.radar-chart-2');
      if (!container) return;
      const poly = container.querySelector('path[fill="#d0582530"]');
      const dotsGroup = container.querySelector('g[fill="#d05825"]');
      const dds = container.querySelectorAll('dd');
      const centerX = 100, centerY = 100, radius = 100, count = dds.length;
      let points = [];
      if (dotsGroup) dotsGroup.innerHTML = '';
      dds.forEach((dd, i) => {
        const val = parseFloat(dd.textContent) || 0;
        const angle = (Math.PI * 2 / count) * i - (Math.PI / 2);
        const x = centerX + (radius * (val / 10)) * Math.cos(angle);
        const y = centerY + (radius * (val / 10)) * Math.sin(angle);
        points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
        if (dotsGroup) {
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("r", "3");
          dotsGroup.appendChild(c);
        }
      });
      if (poly) poly.setAttribute("d", "M " + points.join(" L ") + " Z");
    };
    updateRadar();
  })();

  // 4. 日付形式の統一
  (function() {
    const formatDates = () => {
      document.querySelectorAll('#ArchiveList ul.flat li.archivedate a').forEach(link => {
        const m = link.textContent.match(/(\d+月)\s+(\d{4})/);
        if (m) link.textContent = `${m[2]} ${m[1]}`;
      });
      document.querySelectorAll('.published-info .date').forEach(u => {
        if (!u.dataset.publishd) return;
        const tp = new Date(u.dataset.publishd);
        u.textContent = tp.getFullYear()+'/'+('0'+(tp.getMonth()+1)).slice(-2)+'/'+('0'+tp.getDate()).slice(-2)+' '+tp.getHours()+':'+('0'+tp.getMinutes()).slice(-2);
        u.parentElement.style.display = 'inline';
      });
      document.querySelectorAll('.thetime').forEach(el => {
        const m = el.textContent.match(/(\d+)月\s+(\d+),\s+(\d+)/);
        if (m) {
          const formatted = `${m[3]}/${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}`;
          const icon = el.querySelector('i');
          el.innerHTML = icon ? icon.outerHTML + formatted : formatted;
        }
      });
    };
    window.addEventListener('load', formatDates);
  })();

  // 5. タイピング演出
  (function() {
    const origin = document.getElementById('tpd-origin-data'), 
          target = document.getElementById('tpd-title-text'), 
          con = document.getElementById('tpd-title-console');
    if (!origin || !target || !con) return;
    const blogTitle = origin.textContent.trim();
    let letterCount = 0;
    const typingTimer = setInterval(() => {
      target.textContent = blogTitle.substring(0, ++letterCount);
      if (letterCount >= blogTitle.length) clearInterval(typingTimer);
    }, 150);
    setInterval(() => { con.style.visibility = (con.style.visibility === "hidden") ? "visible" : "hidden"; }, 400);
  })();

  // 6. インフィード関連記事
  (function() {
    const container = document.getElementById('infeed-slanted-card-container');
    if (!container) return;
    window.callback_infeed_final = function(data) {
      if (!data?.feed?.entry) return;
      const entries = data.feed.entry;
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === 'alternate').href;
      const icon = '<i class="fa-solid fa-tag"></i>';
      const labelsHtml = entry.category?.length > 0 
        ? entry.category.map(cat => `<span class="category-label">${icon}${cat.term}</span>`).join('')
        : `<span class="category-label">${icon}RECOMMEND</span>`;
      const summary = (entry.summary?.$t || entry.content?.$t || '').replace(/<[^>]*>/g, '').substring(0, 150);
      let img = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPDYu4ibLWCVdJdTwQa2zoBViIfND-ZB0Y9g8IU1Csk_7AoRwVi1efzTdGFKjaiXh9LPWyCllES9iKlhik8b2G2liUUd8oeAA4NOVflZO3VqPtxhzuUteSAIGCRkyw2Ps8R5FjyFd1FzhmgPYCeAUGBM2qx3Z-lXUGUft6xgiKGUORq3Uz2ULqbSZFEsQ/s1600/NoImage.png';
      if (entry.media$thumbnail) {
        img = entry.media$thumbnail.url.replace(/\/s[0-9]+[^\/]*\//, '/w600/').replace(/\/w[0-9]+-h[0-9]+[^\/]*\//, '/w600/');
      }
      container.innerHTML = `<a href="${link}" class="infeed-blog-card"><div class="meta"><div class="photo" style="background-image: url('${img}')"></div></div><div class="description"><div class="label-container">${labelsHtml}</div><div><b>${title}</b></div><p>${summary}</p></div></a>`;
    };
    const script = document.createElement('script');
    script.src = `https://${BLOG_URL_HOSTNAME}/feeds/posts/default?alt=json-in-script&callback=callback_infeed_final&max-results=10&t=${Date.now()}`;
    document.body.appendChild(script);
  })();

  // 7. 広告遅延読み込み
  window.addEventListener("load", () => {
    setTimeout(() => {
      const ad = document.createElement("script");
      ad.async = true;
      ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8301948456376927";
      ad.crossOrigin = "anonymous";
      document.head.appendChild(ad);
    }, 2000);
  });

  // 8. jQuery依存機能 (読了率・ラベル)
  if (typeof jQuery !== 'undefined') {
    (function($) {
      // 読了率
      $(window).on('scroll resize', function() {
        const $content = $('.post-body, .entry-content').first();
        if (!$content.length) return;
        const st = $(window).scrollTop(), cTop = $content.offset().top;
        $('#reading-progress-container').toggleClass('is-scrolled', st > 10);
        let prog = (st > cTop) ? ((st - cTop) / ($content.outerHeight() - $(window).height() + 200)) * 100 : 0;
        $('#reading-progress-bar').css('width', Math.min(100, Math.max(0, prog)) + '%');
      });

      // ラベルリンクの修正
      $('a[href*="/search/label/"]').each(function() {
        const base = $(this).attr("href").split('?')[0];
        $(this).attr("href", base + "?&max-results=10");
      });
    })(jQuery);
  }

  // 9. アクセスログ記録 (POST)
  (function() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
    if (currentPath.indexOf(EXCLUDE_PATH) !== -1 || /preview|draft/.test(currentUrl)) return;

    const startTime = Date.now();
    let maxScrollRate = 0;
    let isSent = false;

    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentRate = docHeight > 0 ? window.scrollY / docHeight : 0;
      if (currentRate > maxScrollRate) maxScrollRate = currentRate;
    }, { passive: true });

    const sendLog = () => {
      if (isSent) return;
      const stayTimeSec = (Date.now() - startTime) / 1000;
      const payload = {
        path: currentPath, 
        title: document.title.trim(),
        score: stayTimeSec * Math.max(maxScrollRate, 0.1),
        count: 1, 
        stayTime: stayTimeSec
      };
      const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' });
      if (navigator.sendBeacon && navigator.sendBeacon(GAS_URL_POST, blob)) {
        isSent = true;
      } else {
        fetch(GAS_URL_POST, { method: 'POST', body: JSON.stringify(payload), keepalive: true, mode: 'no-cors' });
        isSent = true;
      }
    };

    window.addEventListener("visibilitychange", () => { if (document.visibilityState === 'hidden') sendLog(); });
    window.addEventListener("pagehide", sendLog);
  })();

  // 10. ページャー非表示
  (function() {
    const hidePager = () => {
      const pagers = document.querySelectorAll('.blog-pager, #blog-pager, .paging-control');
      pagers.forEach(p => p.style.display = 'none');
    };
    hidePager();
    setTimeout(hidePager, 500);
    setTimeout(hidePager, 1500);
  })();

// 11. お気に入り機能
(function() {
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  if (!favoriteButtons.length) return;

  // LocalStorageからお気に入りリストを取得
  function getFavorites() {
    const favorites = localStorage.getItem('blogFavorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  // お気に入りリストを保存
  function saveFavorites(favorites) {
    localStorage.setItem('blogFavorites', JSON.stringify(favorites));
  }

  // 指定URLがお気に入り済みかチェック
  function isFavorited(url) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.url === url);
  }

  // お気に入りに追加
  function addFavorite(url, title) {
    const favorites = getFavorites();
    favorites.push({
      url: url,
      title: title,
      date: new Date().toISOString()
    });
    saveFavorites(favorites);
  }

  // お気に入りから削除
  function removeFavorite(url) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.url !== url);
    saveFavorites(favorites);
  }

  // ボタンの表示を更新（←ここだけ修正済み）
  function updateButtonState(button, isFav) {
    const icon = button.querySelector('i');
    const text = button.querySelector('.favorite-text');

    if (isFav) {
      button.classList.add('active');
      if (icon) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      }
      if (text) text.textContent = 'お気に入り済み';
    } else {
      button.classList.remove('active');
      if (icon) {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
      if (text) text.textContent = 'お気に入り';
    }
  }

  // 各ボタンに処理を適用
  favoriteButtons.forEach(function(button) {
    const postUrl = button.dataset.url;
    const postTitle = button.dataset.title;
    if (!postUrl) return;

    // 初期状態を設定
    updateButtonState(button, isFavorited(postUrl));

    // クリックイベント
    button.addEventListener('click', function(e) {
      e.preventDefault();

      if (isFavorited(postUrl)) {
        removeFavorite(postUrl);
        updateButtonState(button, false);
      } else {
        addFavorite(postUrl, postTitle);
        updateButtonState(button, true);
      }
    });
  });
})();

});
