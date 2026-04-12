/* ==========================================================
   Blogger Custom Scripts (matsusan0717) - Optimized Version
   ========================================================== */

document.addEventListener("DOMContentLoaded", function() {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbx2h91Hn0jKy04oLEAdYyFAZcGXbxintxOKwvK6hYJLLF2GKwE4w8ZLkx3SrPByWqDLeA/exec";
  const BLOG_URL = 'https://blogger.matsusanjpn.com/';
  const EXCLUDE_PATH = "/p/";
  const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

  // 1. ログ記録 (Beacon API) ---------------------------
  (function() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;

     // プレビューや特定パスを除外
    if (currentPath.indexOf(EXCLUDE_PATH) !== -1 || /preview|draft/.test(currentUrl)) return;
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

        // 滞在時間制限を撤廃（全アクセス送信）
        const payload = {
          path: currentPath, 
          title: document.title.trim(),
          score: stayTimeSec * Math.max(maxScrollRate, 0.1),
          count: 1, 
          stayTime: stayTimeSec
        };
        navigator.sendBeacon(GAS_URL, new Blob([JSON.stringify(payload)], {type: 'text/plain'}));
      }
    });
  })();

  // 2. 画像最適化 (WebP/リサイズ) & 広告制御 -------------------
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

  // 3. ランキング表示 -----------------------------------
  (function() {
    const rankContainer = document.getElementById('global-ranking-container');
    if (!rankContainer) return;

    fetch(GAS_URL).then(res => res.json()).then(data => {
      if (!data || data.length === 0) return;
      let html = '';
      data.forEach((item, index) => {
        const rank = circleNumbers[data.length - index - 1] || (data.length - index);
        html += `<tr class="ranking-item"><td class="col-rank">${rank}</td><td class="col-title"><a href="${item.path}">${item.title || item.path}</a></td><td class="col-score">${Math.round(item.finalScore * 100)}点</td></tr>`;
      });
      rankContainer.innerHTML = html;
    }).catch(err => console.error("Ranking Load Error:", err));
  })();

  // 4. レーダーチャート生成 -------------------------------
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

  // 5. 日付形式の統一 -----------------------------------
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

  // 6. タイピング演出 -----------------------------------
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

  // 7. インフィード関連記事 -------------------------------
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

      container.innerHTML = `
        <a href="${link}" class="infeed-blog-card">
          <div class="meta"><div class="photo" style="background-image: url('${img}')"></div></div>
          <div class="description">
            <div class="label-container">${labelsHtml}</div>
            <div><b>${title}</b></div>
            <p>${summary}</p>
          </div>
        </a>`;
    };

    const domain = BLOG_URL.replace(/^https?:\/\//, '').split('/')[0];
    const script = document.createElement('script');
    script.src = `https://${domain}/feeds/posts/default?alt=json-in-script&callback=callback_infeed_final&max-results=10&t=${Date.now()}`;
    document.body.appendChild(script);
  })();

  // 8. 広告遅延読み込み ---------------------------------
  window.addEventListener("load", () => {
    setTimeout(() => {
      const ad = document.createElement("script");
      ad.async = true;
      ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8301948456376927";
      ad.crossOrigin = "anonymous";
      document.head.appendChild(ad);
    }, 2000);
  });

  // 9. jQuery依存機能 (読了率・タブ) ---------------------
  if (typeof jQuery !== 'undefined') {
    (function($) {
      $(window).on('scroll resize', function() {
        const $content = $('.post-body, .entry-content').first();
        if (!$content.length) return;
        const st = $(window).scrollTop(), cTop = $content.offset().top;
        $('#reading-progress-container').toggleClass('is-scrolled', st > 10);
        let prog = (st > cTop) ? ((st - cTop) / ($content.outerHeight() - $(window).height() + 200)) * 100 : 0;
        $('#reading-progress-bar').css('width', Math.min(100, Math.max(0, prog)) + '%');
      });

      $('a[href*="/search/label/"]').each(function() {
        const base = $(this).attr("href").split('?')[0];
        $(this).attr("href", base + "?&max-results=10");
      });

      $('.lava-lamp-wrapper').each(function() {
        const $w = $(this), $l = $w.find('.lamp'), $b = $w.find('.tab-buttons span'), $c = $w.find('.tab-content');
        const lw = 100 / $b.length;
        $l.css({ 'width': lw + '%', 'transition': 'left 0.4s ease', 'position': 'absolute' });
        $b.on('click', function() {
          const idx = $b.index(this), tc = $(this).attr('class').replace('active','').trim();
          $b.removeClass('active'); $(this).addClass('active');
          $l.css('left', (idx * lw) + '%');
          $c.find('> div').hide().css('opacity','0').removeClass('active');
          $c.find('> div.' + tc).show().css('opacity','1').addClass('active');
        }).filter('.active').trigger('click'); 
        if (!$b.hasClass('active')) $b.eq(0).trigger('click');
      });
    })(jQuery);
  }
});
