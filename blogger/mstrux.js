/* ==========================================
   2. Bookmark System
   ========================================== */
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

/* ==========================================
   3. Custom Archive Select UI
   ========================================== */
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

/* ==========================================
   4. Reading Time Counter
   ========================================== */
(function() {
  function insertReadingTime() {
    var wpm = 400;
    var $content = document.querySelector('.post-body, .entry-content');
    if (!$content) return;
    var clone = $content.cloneNode(true);
    clone.querySelectorAll('pre code, pre, style, script').forEach(function(el) {
      el.parentNode.removeChild(el);
    });
    var text = (clone.textContent || clone.innerText || '').replace(/[\n\r]/g, '').trim();
    var length = text.length;
    var minutes = Math.ceil(length / wpm);
    var message = document.createElement('p');
    message.style.cssText = 'font-size:80%;color:#999;text-align:right;display:flex;align-items:center;justify-content:space-between;';
    message.innerHTML = '<span style="display:inline-block;border:1px solid #999;color:#999;font-size:90%;padding:1px 5px;border-radius:3px;line-height:1.4;">PR</span><span><i class="fa-solid fa-hourglass-half"></i> この記事は約' + minutes + '分で読めます。</span>';
    $content.insertBefore(message, $content.firstChild);
  }
  var observer = new MutationObserver(function(mutations, obs) {
    var target = document.querySelector('.entry-content');
    if (target && target.querySelector('h1, h2, p')) {
      obs.disconnect();
      insertReadingTime();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', function() {
    insertReadingTime();
  });
})();

/* ==========================================
   5. GAS Like Buttons
   ========================================== */
var GAS_URL = "https://script.google.com/macros/s/AKfycbx_vl7skxZ-bwyi0hFmJvbwIg4UsLHkTXuzbxna9ypAToU9m9KRNgheJkwc0gyu2wcA/exec";
function initLikeButtons() {
    document.querySelectorAll('.heart-btn').forEach(function(btn) {
    if (btn.dataset.initialized) return;
    btn.dataset.initialized = "true";    
    var url = btn.dataset.url;
    var wrapper = btn.closest('.like-wrapper');
    var countSpan = wrapper.querySelector('.like-count');
    var heart = btn.querySelector('i');    
    fetch(GAS_URL + "?titleURL=" + encodeURIComponent(url))
        .then(res => res.json())
        .then(data => {
        if (parseInt(data.likeCount) > 0) {
            countSpan.textContent = data.likeCount;
            countSpan.setAttribute('data-count', data.likeCount);
        } else {
            countSpan.textContent = "";
            countSpan.setAttribute('data-count', "0");
        }
        });    
    btn.addEventListener("click", function(){
        if (btn.disabled) return;
        fetch(GAS_URL, {
        method: "POST",
        body: new URLSearchParams({ titleURL: url })
      })
      .then(res => res.ok ? res.text() : Promise.reject("送信失敗"))
      .then(() => {
        var currentCount = parseInt(countSpan.getAttribute('data-count') || 0);
        var newCount = currentCount + 1;
        countSpan.textContent = newCount;
        countSpan.setAttribute('data-count', newCount);
        heart.classList.remove("far");
        heart.classList.add("fas");
        btn.classList.add("liked", "animate");
        btn.disabled = true;
        setTimeout(() => btn.classList.remove("animate"), 600);
      })
      .catch(err => { console.log(err); alert("送信失敗"); });
    });
  });
}
document.addEventListener('DOMContentLoaded', initLikeButtons);
var observerLikes = new MutationObserver(function(mutations) {
    initLikeButtons();
});
observerLikes.observe(document.body, { childList: true, subtree: true });

