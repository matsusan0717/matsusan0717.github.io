/* ==========================================
   共通ユーティリティ：要素が存在する場合のみ実行する
   ========================================== */

// 1. タグから#を消す
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.tag-name').forEach(function(span) {
    let text = span.innerText;
    if (text.startsWith('#')) text = text.slice(1);
    span.innerHTML = `<i class="fa-solid fa-tag"></i> ${text}`;
  });
});

// 2. Materiapollo 初期化
$(document).ready(function(){
  if (typeof $.fn.tooltip !== 'undefined') $('.tooltipped').tooltip({delay: 50});
  if (typeof $.fn.carousel !== 'undefined') $('.carousel.carousel-slider').carousel({fullWidth: true});
  if (typeof $.fn.leanModal !== 'undefined') $('.modal-trigger').leanModal();
});

// 3. 目次生成
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    const tocContainer = document.getElementById("sticky-toc");
    const postBody = document.querySelector(".post-body, .entry-content, #post-body");
    if (!tocContainer || !postBody) return;
    const headings = Array.from(postBody.querySelectorAll("h2, h3"));
    if (headings.length === 0) {
      const container = document.getElementById("sticky-toc-container");
      if(container) container.style.display = "none";
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

// 4. 読了率
(function($) {
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
        if (scrollTop > contentTop) progress = ((scrollTop - contentTop) / (contentHeight - windowHeight + 200)) * 100;
        progress = Math.min(100, Math.max(0, progress));
        $('#reading-progress-bar').css('width', progress + '%');
    });
})(jQuery);

// 5. 画像リサイズ & WebP変換
(function() {
  const resizeImages = () => {
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.match(/\/s\d+(-rw)?\//)) img.setAttribute('src', src.replace(/\/s\d+(-rw)?\//, '/w750-rw/'));
    });
  };
  window.addEventListener('load', resizeImages);
  new MutationObserver(resizeImages).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.md-thumb img').forEach(function(img) {
      var src = img.getAttribute('src');
      if (src && src.includes('/s1600/')) img.setAttribute('src', src.replace('/s1600/', '/w400-rw/'));
    });
  });
})();

// 6. タブ切り替え（Lava Lamp）
jQuery(document).ready(function($){
  $('.lava-lamp-wrapper').each(function(){
    var $wrapper = $(this), $lamp = $wrapper.find('.lamp'), $buttons = $wrapper.find('.tab-buttons span'), $contentArea = $wrapper.find('.tab-content');
    var lampWidth = 100 / $buttons.length;
    $lamp.css({'width': lampWidth + '%', 'transition': 'left 0.4s cubic-bezier(0.23, 1, 0.32, 1)', 'position': 'absolute', 'z-index': '1'});
    $buttons.off('click').on('click', function(e){
      e.preventDefault();
      var index = $buttons.index(this), targetClass = $(this).attr('class').replace('active', '').trim();
      $buttons.removeClass('active'); $(this).addClass('active');
      $lamp.css('left', (index * lampWidth) + '%');
      $contentArea.find('> div').css({'display': 'none', 'opacity': '0', 'visibility': 'hidden'}).removeClass('active');
      $contentArea.find('> div.' + targetClass).css({'display': 'block', 'opacity': '1', 'visibility': 'visible'}).addClass('active');
    });
    $buttons.eq(0).trigger('click');
  });
});

// 7. レーダーチャート
(function() {
    const update = () => {
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
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", x.toFixed(1)); circle.setAttribute("cy", y.toFixed(1)); circle.setAttribute("r", "3");
                dotsGroup.appendChild(circle);
            }
        });
        if (poly) poly.setAttribute("d", "M " + points.join(" L ") + " Z");
    };
    window.addEventListener('load', update);
})();

// 8. タイトルタイピング
(function() {
  function initTitleTyping() {
    const origin = document.getElementById('tpd-origin-data'), target = document.getElementById('tpd-title-text'), con = document.getElementById('tpd-title-console');
    if (!origin || !target || !con) return;
    const blogTitle = origin.textContent.trim();
    let letterCount = 0;
    const typingTimer = setInterval(function() {
      target.textContent = blogTitle.substring(0, ++letterCount);
      if (letterCount >= blogTitle.length) clearInterval(typingTimer);
    }, 150);
    setInterval(function() { con.style.visibility = (con.style.visibility === "hidden") ? "visible" : "hidden"; }, 400);
  }
  document.addEventListener('DOMContentLoaded', initTitleTyping);
})();

// 9. ラベル件数コントロール
jQuery(function($){
    $('a[href*="/search/label/"]').each(function() {
        var baseHref = $(this).attr("href").split('?')[0];
        $(this).attr("href", baseHref + "?&max-results=7");
    });
});
