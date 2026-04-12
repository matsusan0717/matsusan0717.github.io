/* ==========================================================
   Blogger Custom Scripts (matsusan0717) - Legacy Load Version
   ========================================================== */

const GAS_URL_POST = "https://script.google.com/macros/s/AKfycbx2h91Hn0jKy04oLEAdYyFAZcGXbxintxOKwvK6hYJLLF2GKwE4w8ZLkx3SrPByWqDLeA/exec"; // 新しいGAS（記録用）
const GAS_URL_GET  = "https://script.google.com/macros/s/AKfycbxS5Q2evDdaZ6D13BE3ikIeTMUEVsPlL6XtchE6VELFHu9OhmSYCJNXm6_onlrBna-G4w/exec"; // 前のGAS（読み込み用）

const BLOG_URL = 'https://blogger.matsusanjpn.com/';
const EXCLUDE_PATH = "/p/";
const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

document.addEventListener('DOMContentLoaded', function() {

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

  // 2. ランキング表示 (以前のGAS読み込み仕様を再現)
  (function() {
    const rankContainer = document.getElementById('global-ranking-container');
    if (!rankContainer) return;

    fetch(GAS_URL_GET)
      .then(res => res.json())
      .then(data => {
        // データが存在しない、または空の場合
        if (!data || data.length === 0) {
          rankContainer.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#999;">集計データがありません</td></tr>';
          return;
        }
        
        let html = '';
        // 以前のGASが配列をそのまま返していた場合と、オブジェクト配列の場合の両方に対応
        data.forEach((item, index) => {
          if (index >= 10) return; // 最大10件

          const rankLabel = circleNumbers[index] || (index + 1);
          // item[1]がパス、item[0]がタイトルなど、配列形式だった場合も考慮
          const path = item.path || (Array.isArray(item) ? item[1] : '');
          const title = item.title || (Array.isArray(item) ? item[0] : '');
          const score = item.finalScore || (Array.isArray(item) ? item[2] : 0);

          if (!path) return;

          html += `
            <tr class="ranking-item">
              <td class="col-rank">${rankLabel}</td>
              <td class="col-title">
                <a href="${path}" class="ranking-link">${title || path}</a>
              </td>
              <td class="col-score">${Math.round(score * 100) || 0}点</td>
            </tr>`;
        });
        rankContainer.innerHTML = html;
      })
      .catch(err => {
        console.error("Ranking Load Error:", err);
        rankContainer.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:red;">読み込みエラー</td></tr>';
      });
  })();

  // 3. ログ記録 (Beacon API / Blob送信形式)
  (function() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
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
        const payload = {
          path: currentPath, 
          title: document.title.trim(),
          score: stayTimeSec * Math.max(maxScrollRate, 0.1),
          count: 1, 
          stayTime: stayTimeSec
        };
        if (navigator.sendBeacon) {
          navigator.sendBeacon(GAS_URL_POST, new Blob([JSON.stringify(payload)], {type: 'text/plain'}));
        }
      }
    });
  })();

  // 4. レーダーチャート生成
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

  // 5. 日付形式の統一
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
    };
    window.addEventListener('load', formatDates);
  })();

  // 6. タイピング演出
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

  // 7. インフィード関連記事
  (function() {
    const container = document.getElementById('infeed-slanted-card-container');
    if (!container) return;
    window.callback_infeed_final = function(data) {
      if (!data?.feed?.entry) return;
      const entries = data.feed.entry;
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === 'alternate').href;
      const summary = (entry.summary?.$t || '').replace(/<[^>]*>/g, '').substring(0, 150);
      let img = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPDYu4ibLWCVdJdTwQa2zoBViIfND-ZB0Y9g8IU1Csk_7AoRwVi1efzTdGFKjaiXh9LPWyCllES9iKlhik8b2G2liUUd8oeAA4NOVflZO3VqPtxhzuUteSAIGCRkyw2Ps8R5FjyFd1FzhmgPYCeAUGBM2qx3Z-lXUGUft6xgiKGUORq3Uz2ULqbSZFEsQ/s1600/NoImage.png';
      if (entry.media$thumbnail) img = entry.media$thumbnail.url.replace(/\/s[0-9]+[^\/]*\//, '/w600/');
      container.innerHTML = `<a href="${link}" class="infeed-blog-card"><div class="description"><b>${title}</b><p>${summary}</p></div></a>`;
    };
    const domain = window.location.hostname;
    const script = document.createElement('script');
    script.src = `https://${domain}/feeds/posts/default?alt=json-in-script&callback=callback_infeed_final&max-results=10&t=${Date.now()}`;
    document.body.appendChild(script);
  })();

  // 8. 広告遅延読み込み
  window.addEventListener("load", () => {
    setTimeout(() => {
      const ad = document.createElement("script");
      ad.async = true;
      ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8301948456376927";
      ad.crossOrigin = "anonymous";
      document.head.appendChild(ad);
    }, 2000);
  });

  // 9. ページャー非表示
  (function() {
    const hidePager = () => {
      const pagers = document.querySelectorAll('.blog-pager, #blog-pager, .paging-control');
      pagers.forEach(p => p.style.display = 'none');
    };
    hidePager();
    setTimeout(hidePager, 500);
  })();
});
