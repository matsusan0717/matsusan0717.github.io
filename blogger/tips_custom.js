/* ==========================================================
   Blogger Custom Scripts (matsusan0717) - Full Integration (Tabs Removed)
   ========================================================== */

// 【設定】URL
const GAS_URL_POST = "https://script.google.com/macros/s/AKfycbx2h91Hn0jKy04oLEAdYyFAZcGXbxintxOKwvK6hYJLLF2GKwE4w8ZLkx3SrPByWqDLeA/exec";
const GAS_URL_GET  = "https://script.google.com/macros/s/AKfycby3MRkDpz_QhPwB5scSrxHj1qO9xJo_sugPX9caoJ8nNBThV9SBsZAsouKziHqW16MqPA/exec";
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

      // w750-rw/ から w900-rw/ に変更
      if (src.match(/\/s\d+(-rw)?\//)) {
        img.setAttribute('src', src.replace(/\/s\d+(-rw)?\//, '/w900-rw/'));
      }
      
      if (img.closest('.md-thumb') && src.includes('/s1600/')) {
        img.setAttribute('src', src.replace('/s1600/', '/w400-rw/'));
      }
    });

    // 不要な広告ユニットの削除
    document.querySelectorAll('.google-auto-placed, .adsbygoogle[data-ad-status="unfilled"]').forEach(ad => ad.remove());
  };

  window.addEventListener('load', optimizeContent);
  new MutationObserver(optimizeContent).observe(document.body, { childList: true, subtree: true });

  // 3. レーダーチャート生成
(function() {
    const update = () => {
        const containers = document.querySelectorAll('.radar-chart-2');
        containers.forEach(container => {
            const poly = container.querySelector('path[fill="#d0582530"]');
            const dots = container.querySelectorAll('g[fill="#d05825"] circle');
            const dds = container.querySelectorAll('dd');

            if (dds.length === 0) return;

            const centerX = 100, centerY = 100, radius = 100, count = dds.length;
            let points = [];

            for (let i = 0; i < count; i++) {
                const val = parseFloat(dds[i].textContent) || 0;
                const angle = (Math.PI * 2 / count) * i - (Math.PI / 2);
                const x = (centerX + (radius * (val / 10)) * Math.cos(angle)).toFixed(1);
                const y = (centerY + (radius * (val / 10)) * Math.sin(angle)).toFixed(1);
                
                points.push(x + " " + y);
                if (dots[i]) {
                    dots[i].setAttribute("cx", x);
                    dots[i].setAttribute("cy", y);
                }
            }
            if (poly) poly.setAttribute("d", "M " + points.join(" L ") + " Z");
        });
    };

    const targetNode = document.getElementById('view-root') || document.documentElement;

    const observer = new MutationObserver(() => {
        update();
    });

    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', update);
    } else {
        update();
    }
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

    function getFavorites() {
      const favorites = localStorage.getItem('blogFavorites');
      return favorites ? JSON.parse(favorites) : [];
    }

    function saveFavorites(favorites) {
      localStorage.setItem('blogFavorites', JSON.stringify(favorites));
    }

    function isFavorited(url) {
      const favorites = getFavorites();
      return favorites.some(fav => fav.url === url);
    }

    function addFavorite(url, title) {
      const favorites = getFavorites();
      favorites.push({ url: url, title: title, date: new Date().toISOString() });
      saveFavorites(favorites);
    }

    function removeFavorite(url) {
      let favorites = getFavorites();
      favorites = favorites.filter(fav => fav.url !== url);
      saveFavorites(favorites);
    }

    function updateButtonState(button, isFav) {
      const icon = button.querySelector('i');
      const text = button.querySelector('.favorite-text');
      if (isFav) {
        button.classList.add('active');
        if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
        if (text) text.textContent = '保存済み';
      } else {
        button.classList.remove('active');
        if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
        if (text) text.textContent = '保存して後で読む';
      }
    }

    favoriteButtons.forEach(function(button) {
      const postUrl = button.dataset.url;
      const postTitle = button.dataset.title;
      if (!postUrl) return;
      updateButtonState(button, isFavorited(postUrl));
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

/* ==========================================================
   Last.fm Now Playing
   (テンプレートのメインscriptブロックから移設)
   ========================================================== */
(function() {
  var LASTFM_USER = "macco";
  var API_KEY = "a0bd7482e5a0eef8244954b4e2e30286";
  var proxy = "https://images.weserv.nl/?url=";
  function lpUpdate() {
    var wrap = document.getElementById("lp-v-wrap");
    var msg = document.getElementById("lp-v-msg");
    var titleEl = document.getElementById("lp-v-title");
    var artistEl = document.getElementById("lp-v-artist");
    var trackLink = document.getElementById("lp-v-track-url");
    var artistLink = document.getElementById("lp-v-artist-url");
    var artEl = document.getElementById("lp-v-art");
    if (!wrap || !msg || !titleEl || !artistEl || !trackLink || !artistLink || !artEl) return;
    fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + LASTFM_USER + "&api_key=" + API_KEY + "&format=json&limit=1")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.recenttracks || !data.recenttracks.track || !data.recenttracks.track[0]) return;
        var track = data.recenttracks.track[0];
        var isPlaying = track["@attr"] && track["@attr"].nowplaying === "true";
        var imgObj = track.image.find(function(i) { return i.size === "large"; });
        var img = imgObj ? imgObj["#text"] : "";
        var artistName = track.artist["#text"];
        var trackName = track.name;
        var trackUrl = track.url;
        var artistUrl = "https://www.last.fm/music/" + encodeURIComponent(artistName);
        titleEl.textContent = trackName;
        artistEl.textContent = artistName;
        trackLink.href = trackUrl;
        artistLink.href = artistUrl;
        artEl.style.backgroundImage = img ? "url(" + proxy + img.replace(/^https?:\/\//, "") + ")" : "none";
        if (isPlaying) {
          wrap.classList.add("is-playing");
          msg.textContent = "Now Playing";
        } else {
          wrap.classList.remove("is-playing");
          msg.textContent = "Last Played";
        }
      })
      .catch(function(e) { console.error("LastFM error:", e); });
  }
  function lpInit() {
    if (!document.getElementById("lp-v-wrap")) return;
    lpUpdate();
    setInterval(lpUpdate, 30000);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lpInit);
  } else {
    lpInit();
  }
})();
