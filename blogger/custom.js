/* ==========================================================
   Blogger Custom Scripts (matsusan0717)
   1. ログ記録 & ランキング
   2. 読了率プログレスバー
   3. 画像リサイズ & WebP最適化
   4. タブ切り替え（Lava Lamp機能）
   ========================================================== */

document.addEventListener("DOMContentLoaded", function() {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxa1Z3HGKSlkuYhWqrqaaqRj1_IDx-iilHnrbDTfvTvni0smaxsabxx4ACC_aAjNFryVg/exec";
  const EXCLUDE_PATH = "/p/";
  const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

  /* --------------------------------------------------------
     1. ログ記録 (navigator.sendBeacon)
  -------------------------------------------------------- */
  (function() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
    if (currentPath.indexOf(EXCLUDE_PATH) !== -1 || currentUrl.indexOf("preview") !== -1) return;

    const startTime = Date.now();
    let maxScrollRate = 0;
    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentRate = docHeight > 0 ? window.scrollY / docHeight : 0;
      if (currentRate > maxScrollRate) maxScrollRate = currentRate;
    }, { passive: true });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'hidden') {
        const stayTimeSec = (Date.now() - startTime) / 1000;
        if (stayTimeSec < 5) return;
        const payload = {
          path: currentPath, title: document.title.trim(),
          score: stayTimeSec * Math.max(maxScrollRate, 0.1),
          count: 1, stayTime: stayTimeSec
        };
        navigator.sendBeacon(GAS_URL, new Blob([JSON.stringify(payload)], {type: 'text/plain'}));
      }
    });
  })();

  /* --------------------------------------------------------
     2. 画像リサイズ & WebP最適化 (MutationObserver搭載)
  -------------------------------------------------------- */
  (function() {
    const resizeImages = () => {
      document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        // 基本リサイズ (s1600系を w750-rw に)
        if (src.match(/\/s\d+(-rw)?\//)) {
          img.setAttribute('src', src.replace(/\/s\d+(-rw)?\//, '/w750-rw/'));
        }
        // md-thumb内のリサイズ
        if (img.closest('.md-thumb') && src.includes('/s1600/')) {
          img.setAttribute('src', src.replace('/s1600/', '/w400-rw/'));
        }
      });
    };
    window.addEventListener('load', resizeImages);
    new MutationObserver(resizeImages).observe(document.body, { childList: true, subtree: true });
  })();

  /* --------------------------------------------------------
     3. 読了率プログレスバー / 4. タブ機能 (jQuery依存)
  -------------------------------------------------------- */
  if (typeof jQuery !== 'undefined') {
    (function($) {
      // --- 読了率表示 ---
      $(window).on('scroll resize', function() {
        const $content = $('.post-body, .entry-content, .item-post-inner').first();
        if (!$content.length) return;
        const st = $(window).scrollTop();
        const cTop = $content.offset().top;
        
        // 透明度コントロール
        $('#reading-progress-container').toggleClass('is-scrolled', st > 10);
        
        // 進行度計算
        let progress = 0;
        if (st > cTop) {
          progress = ((st - cTop) / ($content.outerHeight() - $(window).height() + 200)) * 100;
        }
        $('#reading-progress-bar').css('width', Math.min(100, Math.max(0, progress)) + '%');
      });

      // --- タブ切り替え（Lava Lamp） ---
      $(function() {
        $('.lava-lamp-wrapper').each(function() {
          const $wrapper = $(this), $lamp = $wrapper.find('.lamp'), $buttons = $wrapper.find('.tab-buttons span'), $contentArea = $wrapper.find('.tab-content');
          const tabCount = $buttons.length, lampWidth = 100 / tabCount;
          
          $lamp.css({ 'width': lampWidth + '%', 'transition': 'left 0.4s cubic-bezier(0.23, 1, 0.32, 1)', 'position': 'absolute', 'z-index': '1' });
          $buttons.on('click', function(e) {
            const index = $buttons.index(this), targetClass = $(this).attr('class').replace('active', '').trim();
            $buttons.removeClass('active'); $(this).addClass('active');
            $lamp.css('left', (index * lampWidth) + '%');
            $contentArea.find('> div').hide().css({'opacity':'0','visibility':'hidden'}).removeClass('active');
            $contentArea.find('> div.' + targetClass).show().css({'opacity':'1','visibility':'visible'}).addClass('active');
          }).eq(0).trigger('click');
        });
      });

      // --- ランキング表示 ---
      const container = document.getElementById('global-ranking-container');
      if (container) {
        fetch(GAS_URL).then(res => res.json()).then(data => {
          if (!data || data.length === 0) return;
          let html = '';
          data.forEach((item, index) => {
            const rank = circleNumbers[data.length - index - 1] || (data.length - index);
            html += `<tr class="ranking-item"><td class="col-rank">${rank}</td><td class="col-title"><a href="${item.path}">${item.title || item.path}</a></td><td class="col-score">${Math.round(item.finalScore * 100)}点</td></tr>`;
          });
          container.innerHTML = html;
        });
      }
    })(jQuery);
  }
});

/* ==========================================================
   Blogger Custom Scripts (matsusan0717)
   - ログ・ランキング・画像リサイズ・目次・タブ
   - レーダーチャート・日付整形・ラベル制御・タイピング演出
   ========================================================== */

document.addEventListener("DOMContentLoaded", function() {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxW5Y9eiqkCMoZHPropEO9voGsyGJ16QhO4AZZfOT3N462_Vwf19ecpccHzoyuOl7vG4g/exec";
  const EXCLUDE_PATH = "/p/";
  const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

  /* 1. ログ記録 & ランキング表示 --------------------------- */
  // (中略：以前のコードをここに集約)

  /* 2. 画像リサイズ & WebP最適化 --------------------------- */
  (function() {
    const resizeImages = () => {
      document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;
        if (src.match(/\/s\d+(-rw)?\//)) img.setAttribute('src', src.replace(/\/s\d+(-rw)?\//, '/w750-rw/'));
        if (img.closest('.md-thumb') && src.includes('/s1600/')) img.setAttribute('src', src.replace('/s1600/', '/w400-rw/'));
      });
    };
    window.addEventListener('load', resizeImages);
    new MutationObserver(resizeImages).observe(document.body, { childList: true, subtree: true });
  })();

  /* 3. レーダーチャート生成 ------------------------------- */
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
        points.push(x.toFixed(1) + " " + y.toFixed(1));
        if (dotsGroup) {
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("r", "3");
          dotsGroup.appendChild(c);
        }
      });
      if (poly) poly.setAttribute("d", "M " + points.join(" L ") + " Z");
    };
    updateRadar();
    window.addEventListener('load', updateRadar);
  })();

  /* 4. 日付形式の統一整形 --------------------------------- */
  (function() {
    // アーカイブリスト (2月 2026 -> 2026 2月)
    document.querySelectorAll('#ArchiveList ul.flat li.archivedate a').forEach(link => {
      const m = link.textContent.match(/(\d+月)\s+(\d{4})/);
      if (m) link.textContent = m[2] + " " + m[1];
    });
    // 投稿日時 (published-info)
    document.querySelectorAll('.published-info .date').forEach(u => {
      const tp = new Date(u.dataset.publishd);
      u.textContent = tp.getFullYear()+'/'+('0'+(tp.getMonth()+1)).slice(-2)+'/'+('0'+tp.getDate()).slice(-2)+' '+tp.getHours()+':'+('0'+tp.getMinutes()).slice(-2);
      u.parentElement.style.display = 'inline';
    });
    // 記事ページ個別 (thetime)
    const fixTime = () => {
      document.querySelectorAll('.thetime').forEach(el => {
        const m = el.textContent.match(/(\d+)月\s+(\d+),\s+(\d+)/);
        if (m) {
          const formatted = `${m[3]}/${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}`;
          const icon = el.querySelector('i');
          el.innerHTML = icon ? icon.outerHTML + formatted : formatted;
        }
      });
    };
    window.addEventListener('load', fixTime);
    setTimeout(fixTime, 1000);
  })();

  /* 5. タイピング演出（ヘッダータイトル） ------------------ */
  (function() {
    const origin = document.getElementById('tpd-origin-data'), target = document.getElementById('tpd-title-text'), con = document.getElementById('tpd-title-console');
    if (!origin || !target || !con) return;
    const blogTitle = origin.textContent.trim();
    let letterCount = 0;
    const typingTimer = setInterval(() => {
      target.textContent = blogTitle.substring(0, ++letterCount);
      if (letterCount >= blogTitle.length) clearInterval(typingTimer);
    }, 150);
    setInterval(() => { con.style.visibility = (con.style.visibility === "hidden") ? "visible" : "hidden"; }, 400);
  })();

  /* 6. jQuery依存の機能（読了率・タブ・ラベル制御） --------- */
  if (typeof jQuery !== 'undefined') {
    (function($) {
      // 読了率バー
      $(window).on('scroll resize', function() {
        const $content = $('.post-body, .entry-content').first();
        if (!$content.length) return;
        const st = $(window).scrollTop(), cTop = $content.offset().top;
        $('#reading-progress-container').toggleClass('is-scrolled', st > 10);
        let prog = (st > cTop) ? ((st - cTop) / ($content.outerHeight() - $(window).height() + 200)) * 100 : 0;
        $('#reading-progress-bar').css('width', Math.min(100, Math.max(0, prog)) + '%');
      });

      // ラベル検索件数制限 (max-results=7)
      $('a[href*="/search/label/"]').each(function() {
        $(this).attr("href", $(this).attr("href").split('?')[0] + "?&max-results=7");
      });

      // タブ・ラバランプ
      $('.lava-lamp-wrapper').each(function() {
        const $w = $(this), $l = $w.find('.lamp'), $b = $w.find('.tab-buttons span'), $c = $w.find('.tab-content');
        const lw = 100 / $b.length;
        $l.css({ 'width': lw + '%', 'transition': 'left 0.4s ease', 'position': 'absolute' });
        $b.on('click', function() {
          const idx = $b.index(this), tc = $(this).attr('class').replace('active','').trim();
          $b.removeClass('active'); $(this).addClass('active');
          $l.css('left', (idx * lw) + '%');
          $c.find('> div').hide().css({'opacity':'0'}).removeClass('active');
          $c.find('> div.' + tc).show().css({'opacity':'1'}).addClass('active');
        }).eq(0).trigger('click');
      });
    })(jQuery);
  }
});

/* ==========================================================
   Blogger Custom Scripts (matsusan0717)
   - ログ・ランキング・画像リサイズ・目次・タブ
   - レーダーチャート・日付整形・ラベル制御・タイピング演出
   - インフィードカード・記事数制限・広告制御
   ========================================================== */

document.addEventListener("DOMContentLoaded", function() {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxS5Q2evDdaZ6D13BE3ikIeTMUEVsPlL6XtchE6VELFHu9OhmSYCJNXm6_onlrBna-G4w/exec";
  const BLOG_URL = 'https://blogger.matsusanjpn.com/';
  const EXCLUDE_PATH = "/p/";
  const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

  /* 1. ログ記録 & ランキング表示 --------------------------- */
  (function() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
    if (currentPath.indexOf(EXCLUDE_PATH) !== -1 || currentUrl.indexOf("preview") !== -1 || currentUrl.indexOf("draft.blogger.com") !== -1) return;

    const startTime = Date.now();
    let maxScrollRate = 0;
    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentRate = docHeight > 0 ? window.scrollY / docHeight : 0;
      if (currentRate > maxScrollRate) maxScrollRate = currentRate;
    }, { passive: true });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'hidden') {
        const stayTimeSec = (Date.now() - startTime) / 1000;
        if (stayTimeSec < 5) return;
        const payload = {
          path: currentPath, title: document.title.trim(),
          score: stayTimeSec * Math.max(maxScrollRate, 0.1),
          count: 1, stayTime: stayTimeSec
        };
        navigator.sendBeacon(GAS_URL, new Blob([JSON.stringify(payload)], {type: 'text/plain'}));
      }
    });

    const rankContainer = document.getElementById('global-ranking-container');
    if (rankContainer) {
      fetch(GAS_URL).then(res => res.json()).then(data => {
        if (!data || data.length === 0) return;
        let html = '';
        data.forEach((item, index) => {
          const rank = circleNumbers[data.length - index - 1] || (data.length - index);
          html += `<tr class="ranking-item"><td class="col-rank">${rank}</td><td class="col-title"><a href="${item.path}">${item.title || item.path}</a></td><td class="col-score">${Math.round(item.finalScore * 100)}点</td></tr>`;
        });
        rankContainer.innerHTML = html;
      });
    }
  })();

  /* 2. インフィード関連記事カード ------------------------- */

   (function() {
  const blogURL = 'https://blogger.matsusanjpn.com/';
  const domain = blogURL.replace(/^https?:\/\//, '').split('/')[0];
  const container = document.getElementById('infeed-slanted-card-container');

  // コンテナが存在しない場合は処理を中断
  if (!container) return;

  window.callback_infeed_final = function(data) {
    if (!data || !data.feed || !data.feed.entry) return;

    const entries = data.feed.entry;
    const entry = entries[Math.floor(Math.random() * entries.length)];
    const title = entry.title.$t;
    const link = entry.link.find(l => l.rel === 'alternate').href;

    let labelsHtml = '';
    const icon = '<i class="fa-solid fa-tag"></i>';
    if (entry.category && entry.category.length > 0) {
      labelsHtml = entry.category.map(cat => `<span class="category-label">${icon}${cat.term}</span>`).join('');
    } else {
      labelsHtml = `<span class="category-label">${icon}RECOMMEND</span>`;
    }

    const summary = entry.summary 
      ? entry.summary.$t.replace(/<[^>]*>/g, '').substring(0, 150) 
      : (entry.content ? entry.content.$t.replace(/<[^>]*>/g, '').substring(0, 150) : '');

    let img = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPDYu4ibLWCVdJdTwQa2zoBViIfND-ZB0Y9g8IU1Csk_7AoRwVi1efzTdGFKjaiXh9LPWyCllES9iKlhik8b2G2liUUd8oeAA4NOVflZO3VqPtxhzuUteSAIGCRkyw2Ps8R5FjyFd1FzhmgPYCeAUGBM2qx3Z-lXUGUft6xgiKGUORq3Uz2ULqbSZFEsQ/s1600/NoImage.png';

    if (entry.media$thumbnail && entry.media$thumbnail.url) {
      let originalUrl = entry.media$thumbnail.url;
      img = originalUrl.replace(/\/s[0-9]+[^\/]*\//, '/w600/').replace(/\/w[0-9]+-h[0-9]+[^\/]*\//, '/w600/');
      img = img.replace(/\/s[0-9]+[^\/]*$/, '/w600').replace(/\/w[0-9]+-h[0-9]+[^\/]*$/, '/w600');
      
      if (img === originalUrl) {
          img = originalUrl.replace(/\/s[0-9]+(-c)?/, '/s1600');
      }
    } else if (entry.content && entry.content.$t.includes('<img')) {
      const imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) img = imgMatch[1];
    }

    container.innerHTML = `
      <a href="${link}" class="infeed-blog-card">
        <div class="meta">
          <div class="photo" style="background-image: url('${img}')"></div>
        </div>
        <div class="description">
          <div class="label-container">${labelsHtml}</div>
          <div><b>${title}</b></div>
          <p>${summary}</p>
        </div>
      </a>
    `;
  };

  const script = document.createElement('script');
  script.src = `https://${domain}/feeds/posts/default?alt=json-in-script&callback=callback_infeed_final&max-results=10&t=${new Date().getTime()}`;
  document.body.appendChild(script);
})();

  /* 3. アーカイブウィジェット制御 ------------------------- */
  // ※ この機能はBloggerテンプレート内のXML側に集約したため、外部JSからは削除しました。

  /* 4. 広告制御 (自動広告削除 & 遅延読み込み) -------------- */
  (function() {
    const removeAds = () => document.querySelectorAll('.google-auto-placed, .adsbygoogle[data-ad-status="unfilled"]').forEach(ad => ad.remove());
    removeAds();
    new MutationObserver(removeAds).observe(document.body, { childList: true, subtree: true });
    
    window.addEventListener("load", () => {
      setTimeout(() => {
        const ad = document.createElement("script"); ad.async = true;
        ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8301948456376927";
        ad.crossOrigin = "anonymous"; document.head.appendChild(ad);
      }, 2000);
    });
  })();

  /* 6. jQuery依存 (読了率・ラベル件数・タブ) -------------- */
  if (typeof jQuery !== 'undefined') {
    (function($) {
      // ラベルリンクに7件制限を付与
      $('a[href*="/search/label/"]').each(function() {
        const base = $(this).attr("href").split('?')[0];
        $(this).attr("href", base + "?&max-results=10");
      });
    })(jQuery);
  }
});
