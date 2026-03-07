/* ==========================================
   Blogger Integrated Scripts
   ========================================== */

// --- 1. 目次（Table of Contents） ---
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    const tocContainer = document.getElementById("sticky-toc");
    const postBody = document.querySelector(".post-body, .entry-content, #post-body");
    if (!tocContainer || !postBody) return;

    const headings = Array.from(postBody.querySelectorAll("h2, h3"));
    if (headings.length === 0) {
      const parent = document.getElementById("sticky-toc-container");
      if (parent) parent.style.display = "none";
      return;
    }

    const tocList = document.createElement("ul");
    headings.forEach((heading, index) => {
      const id = "section-node-" + index;
      heading.id = id;
      const li = document.createElement("li");
      li.className = heading.tagName.toLowerCase() === "h3" ? "toc-h3" : "toc-h2";
      const a = document.createElement("a");
      a.href = "#" + id;
      a.className = "toc-link";
      a.textContent = heading.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
    });
    tocContainer.appendChild(tocList);

    const tocLinks = document.querySelectorAll(".toc-link");
    function updateActiveHeader() {
      const scrollPosition = window.scrollY + 120;
      let activeId = "";
      headings.forEach(heading => {
        if (heading.offsetTop <= scrollPosition) activeId = heading.id;
      });
      tocLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + activeId) link.classList.add("active");
      });
    }
    window.addEventListener("scroll", updateActiveHeader);
    updateActiveHeader();
  });
})();

// --- 2. 読了率（Reading Progress） ---
(function($) {
  if (!$) return;
  $(window).on('scroll resize', function() {
    var $content = $('.post-body, .entry-content, .item-post-inner').first();
    if ($content.length === 0) return;
    var scrollTop = $(window).scrollTop();
    var contentTop = $content.offset().top;
    var contentHeight = $content.outerHeight();
    var windowHeight = $(window).height();

    if (scrollTop > 10) $('#reading-progress-container').addClass('is-scrolled');
    else $('#reading-progress-container').removeClass('is-scrolled');

    var progress = 0;
    if (scrollTop > contentTop) {
      progress = ((scrollTop - contentTop) / (contentHeight - windowHeight + 200)) * 100;
    }
    progress = Math.min(100, Math.max(0, progress));
    $('#reading-progress-bar').css('width', progress + '%');
  });
})(window.jQuery);

// --- 3. 画像リサイズ・監視 ---
(function() {
  const resizeImages = () => {
    document.querySelectorAll('img, .md-thumb img').forEach(img => {
      const src = img.getAttribute('src');
      if (!src) return;
      if (src.match(/\/s\d+(-rw)?\//)) {
        img.setAttribute('src', src.replace(/\/s\d+(-rw)?\//, '/w750-rw/'));
      } else if (src.includes('/s1600/')) {
        img.setAttribute('src', src.replace('/s1600/', img.closest('.md-thumb') ? '/w400-rw/' : '/w750-rw/'));
      }
    });
  };
  window.addEventListener('load', resizeImages);
  const observer = new MutationObserver(resizeImages);
  observer.observe(document.body, { childList: true, subtree: true });
})();

// --- 4. タブ（Lava Lamp Tab） ---
(function($) {
  if (!$) return;
  $(function() {
    $('.lava-lamp-wrapper').each(function() {
      var $wrapper = $(this), $lamp = $wrapper.find('.lamp'), $buttons = $wrapper.find('.tab-buttons span'), $contentArea = $wrapper.find('.tab-content');
      var tabCount = $buttons.length, lampWidth = 100 / tabCount;
      $lamp.css({ 'width': lampWidth + '%', 'transition': 'left 0.4s cubic-bezier(0.23, 1, 0.32, 1)', 'position': 'absolute', 'z-index': '1' });
      $buttons.off('click').on('click', function(e) {
        e.preventDefault();
        var $this = $(this), index = $buttons.index(this), targetClass = $this.attr('class').replace('active', '').trim();
        $buttons.removeClass('active'); $this.addClass('active');
        $lamp.css('left', (index * lampWidth) + '%');
        $contentArea.find('> div').css({ 'display': 'none', 'opacity': '0', 'visibility': 'hidden' }).removeClass('active');
        var $target = $contentArea.find('> div.' + targetClass);
        if ($target.length > 0) $target.css({ 'display': 'block', 'opacity': '1', 'visibility': 'visible' }).addClass('active');
      });
      $buttons.eq(0).trigger('click');
    });
  });
})(window.jQuery);

// --- 5. 日付・タイトル形式 ---
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    // アーカイブリスト形式
    document.querySelectorAll('#ArchiveList ul.flat li.archivedate a').forEach(link => {
      const m = link.textContent.match(/(\d+月)\s+(\d{4})/);
      if (m) link.textContent = m[2] + " " + m[1];
    });
    // タイピングタイトル
    const origin = document.getElementById('tpd-origin-data'), target = document.getElementById('tpd-title-text'), con = document.getElementById('tpd-title-console');
    if (origin && target && con) {
      const blogTitle = origin.textContent.trim();
      let letterCount = 0;
      const typingTimer = setInterval(() => {
        target.textContent = blogTitle.substring(0, ++letterCount);
        if (letterCount >= blogTitle.length) clearInterval(typingTimer);
      }, 150);
      setInterval(() => { con.style.visibility = (con.style.visibility === "hidden") ? "visible" : "hidden"; }, 400);
    }
  });
  // 投稿日時・記事内日付
  const fixDates = () => {
    document.querySelectorAll('.published-info .date').forEach(u => {
      let tp = new Date(u.dataset.publishd);
      u.textContent = tp.getFullYear()+'/'+('0'+(tp.getMonth()+1)).slice(-2)+'/'+('0'+tp.getDate()).slice(-2)+' '+tp.getHours()+':'+('0'+tp.getMinutes()).slice(-2);
      u.parentElement.style.display = 'inline';
    });
    document.querySelectorAll('.thetime').forEach(el => {
      const m = el.textContent.match(/(\d+)月\s+(\d+),\s+(\d+)/);
      if (m) {
        const icon = el.querySelector('i'), newDate = `${m[3]}/${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}`;
        el.innerHTML = icon ? icon.outerHTML + newDate : newDate;
      }
    });
  };
  window.addEventListener('load', fixDates);
})();

// --- 6. ラベル件数・クエリ制御 ---
(function($) {
  if (!$) return;
  $(function() {
    $('a[href*="/search/label/"], .post-per-page').each(function() {
      var $el = $(this), href = $el.attr("href");
      if (href) $el.attr("href", href.split('?')[0] + "?&max-results=7");
    });
  });
})(window.jQuery);

// --- 7. ログ・記録係（GAS送信） ---
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    const GAS_URL = "https://script.google.com/macros/s/AKfycbxW5Y9eiqkCMoZHPropEO9voGsyGJ16QhO4AZZfOT3N462_Vwf19ecpccHzoyuOl7vG4g/exec";
    if (window.location.pathname.includes("/p/") || window.location.href.match(/preview|blog-preview|draft/)) return;
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
        const payload = { path: window.location.pathname, title: document.title.trim(), score: stayTimeSec * Math.max(maxScrollRate, 0.1), count: 1, stayTime: stayTimeSec };
        navigator.sendBeacon(GAS_URL, new Blob([JSON.stringify(payload)], {type: 'text/plain'}));
      }
    });
    // ランキング表示
    const container = document.getElementById('global-ranking-container');
    if (container) {
      fetch(GAS_URL).then(r => r.json()).then(data => {
        if (!data || data.length === 0) { container.innerHTML = "<tr><td colspan='3'>集計中...</td></tr>"; return; }
        const circles = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
        container.innerHTML = data.map((item, i) => {
          const rank = data.length - i;
          return `<tr class="ranking-item"><td>${circles[rank-1]||rank}</td><td><a href="${item.path}">${item.title||item.path}</a></td><td>${Math.round(item.finalScore*100)}点</td></tr>`;
        }).join('');
      });
    }
  });
})();

// --- 8. レーダーチャート ---
(function() {
  const updateRadar = () => {
    const container = document.querySelector('.radar-chart-2');
    if (!container) return;
    const poly = container.querySelector('path[fill="#d0582530"]'), dotsGroup = container.querySelector('g[fill="#d05825"]'), dds = container.querySelectorAll('dd');
    const centerX = 100, centerY = 100, radius = 100, count = dds.length;
    let points = [];
    if (dotsGroup) dotsGroup.innerHTML = '';
    dds.forEach((dd, i) => {
      const val = parseFloat(dd.textContent) || 0, angle = (Math.PI * 2 / count) * i - (Math.PI / 2);
      const x = centerX + (radius * (val / 10)) * Math.cos(angle), y = centerY + (radius * (val / 10)) * Math.sin(angle);
      points.push(x.toFixed(1) + " " + y.toFixed(1));
      if (dotsGroup) {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("r", "3");
        dotsGroup.appendChild(c);
      }
    });
    if (poly) poly.setAttribute("d", "M " + points.join(" L ") + " Z");
  };
  window.addEventListener('load', updateRadar);
})();

// --- 9. 記事内関連カード ---
(function() {
  const container = document.getElementById('infeed-slanted-card-container');
  if (!container) return;
  window.callback_infeed_final = function(data) {
    if (!data?.feed?.entry) return;
    const entry = data.feed.entry[Math.floor(Math.random() * data.feed.entry.length)];
    const title = entry.title.$t, link = entry.link.find(l => l.rel === 'alternate').href;
    const labels = entry.category ? entry.category.map(c => `<span class="category-label"><i class="fa-solid fa-tag"></i>${c.term}</span>`).join('') : '';
    const summary = (entry.summary?.$t || entry.content?.$t || '').replace(/<[^>]*>/g, '').substring(0, 150);
    const img = entry.media$thumbnail ? entry.media$thumbnail.url.replace(/\/s[0-9]+(-c)?/, '/w600') : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPDYu4ibLWCVdJdTwQa2zoBViIfND-ZB0Y9g8IU1Csk_7AoRwVi1efzTdGFKjaiXh9LPWyCllES9iKlhik8b2G2liUUd8oeAA4NOVflZO3VqPtxhzuUteSAIGCRkyw2Ps8R5FjyFd1FzhmgPYCeAUGBM2qx3Z-lXUGUft6xgiKGUORq3Uz2ULqbSZFEsQ/s1600/NoImage.png';
    container.innerHTML = `<a href="${link}" class="infeed-blog-card"><div class="meta"><div class="photo" style="background-image: url(${img})"></div></div><div class="description"><div class="label-container">${labels}</div><div><b>${title}</b></div><p>${summary}</p></div></a>`;
  };
  const s = document.createElement('script');
  const domain = window.location.hostname;
  s.src = `https://${domain}/feeds/posts/default?alt=json-in-script&callback=callback_infeed_final&max-results=10&t=${Date.now()}`;
  document.body.appendChild(s);
})();
