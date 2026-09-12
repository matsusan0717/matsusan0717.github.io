/* ==========================================================
   Blogger Custom Scripts (matsusan0717) 
   ========================================================== */
// 【設定】URL
const GAS_URL_POST = "https://script.google.com/macros/s/AKfycbz1r4vTFTaFObmrKFJsin5VjuKxXBdO9sF2AvDmxCHVZ9TjYsxyLbnq-FpLQSOHK_e8Mg/exec";
const GAS_URL_GET = "https://script.google.com/macros/s/AKfycby3MRkDpz_QhPwB5scSrxHj1qO9xJo_sugPX9caoJ8nNBThV9SBsZAsouKziHqW16MqPA/exec";
const BLOG_URL = 'https://blogger.matsusanjpn.com/';
const EXCLUDE_PATH = "/p/";
const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
document.addEventListener('DOMContentLoaded', () => {
  const BLOG_URL_HOSTNAME = window.location.hostname;
  // 1. 画像最適化 (WebP/リサイズ) & 広告制御
  const optimizeContent = () => {
    document.querySelectorAll('img').forEach(img => {
      if (img.closest('#matsu-lightbox')) return; // never touch the lightbox image (it holds the enlarged URL)
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
  new MutationObserver(optimizeContent).observe(document.body, {
    childList: true,
    subtree: true
  });
  // 3. レーダーチャート生成
  (function() {
    const update = () => {
      const containers = document.querySelectorAll('.radar-chart-2');
      containers.forEach(container => {
        const poly = container.querySelector('path[fill="#d0582530"]');
        const dots = container.querySelectorAll('g[fill="#d05825"] circle');
        const dds = container.querySelectorAll('dd');
        if (dds.length === 0) return;
        const centerX = 100,
          centerY = 100,
          radius = 100,
          count = dds.length;
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
        u.textContent = tp.getFullYear() + '/' + ('0' + (tp.getMonth() + 1)).slice(-2) + '/' + ('0' + tp.getDate()).slice(-2) + ' ' + tp.getHours() + ':' + ('0' + tp.getMinutes()).slice(-2);
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
  // 6. インフィード関連記事
  (function() {
    const container = document.getElementById('infeed-slanted-card-container');
    if (!container) return;
    window.callback_infeed_final = function(data) {
      if (!data ? .feed ? .entry) return;
      const entries = data.feed.entry;
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === 'alternate').href;
      const icon = '<i class="fa-solid fa-tag"></i>';
      const labelsHtml = entry.category ? .length > 0 ? entry.category.map(cat => `<span class="category-label">${icon}${cat.term}</span>`).join('') : `<span class="category-label">${icon}RECOMMEND</span>`;
      const summary = (entry.summary ? .$t || entry.content ? .$t || '').replace(/<[^>]*>/g, '').substring(0, 150);
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
        const st = $(window).scrollTop(),
          cTop = $content.offset().top;
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
    if (currentPath.indexOf(EXCLUDE_PATH) !== -1 || /preview|draft/.test(currentUrl) || document.title.includes("404")) return;
    const startTime = Date.now();
    let maxScrollRate = 0;
    let isSent = false;
    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentRate = docHeight > 0 ? window.scrollY / docHeight : 0;
      if (currentRate > maxScrollRate) maxScrollRate = currentRate;
    }, {
      passive: true
    });
    const sendLog = () => {
      if (isSent) return;
      if (document.title.includes("404")) return;
      const stayTimeSec = (Date.now() - startTime) / 1000;
      const payload = {
        path: currentPath,
        title: document.title.trim(),
        score: stayTimeSec * Math.max(maxScrollRate, 0.1),
        count: 1,
        stayTime: stayTimeSec
      };
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'text/plain'
      });
      if (navigator.sendBeacon && navigator.sendBeacon(GAS_URL_POST, blob)) {
        isSent = true;
      } else {
        fetch(GAS_URL_POST, {
          method: 'POST',
          body: JSON.stringify(payload),
          keepalive: true,
          mode: 'no-cors'
        });
        isSent = true;
      }
    };
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'hidden') sendLog();
    });
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
      favorites.push({
        url: url,
        title: title,
        date: new Date().toISOString()
      });
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
        if (icon) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        }
        if (text) text.textContent = '保存済み';
      } else {
        button.classList.remove('active');
        if (icon) {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
        }
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
// 12. Last.fm Now Playing
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
    fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + LASTFM_USER + "&api_key=" + API_KEY + "&format=json&limit=1").then(function(r) {
      return r.json();
    }).then(function(data) {
      if (!data.recenttracks || !data.recenttracks.track || !data.recenttracks.track[0]) return;
      var track = data.recenttracks.track[0];
      var isPlaying = track["@attr"] && track["@attr"].nowplaying === "true";
      var imgObj = track.image.find(function(i) {
        return i.size === "large";
      });
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
    }).catch(function(e) {
      console.error("LastFM error:", e);
    });
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
// 13. Lenis
! function(t, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t || self).Lenis = e()
}(this, function() {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var o = e[i];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, "symbol" == typeof(n = function(t, e) {
        if ("object" != typeof t || null === t) return t;
        var i = t[Symbol.toPrimitive];
        if (void 0 !== i) {
          var o = i.call(t, "string");
          if ("object" != typeof o) return o;
          throw new TypeError("@@toPrimitive must return a primitive value.")
        }
        return String(t)
      }(o.key)) ? n : String(n), o)
    }
    var n
  }

  function e(e, i, o) {
    return i && t(e.prototype, i), o && t(e, o), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e
  }

  function i() {
    return i = Object.assign ? Object.assign.bind() : function(t) {
      for (var e = 1; e < arguments.length; e++) {
        var i = arguments[e];
        for (var o in i) Object.prototype.hasOwnProperty.call(i, o) && (t[o] = i[o])
      }
      return t
    }, i.apply(this, arguments)
  }

  function o(t, e, i) {
    return Math.max(t, Math.min(e, i))
  }
  var n = /*#__PURE__*/ function() {
      function t() {}
      var e = t.prototype;
      return e.advance = function(t) {
        var e, i, n, s;
        if (this.isRunning) {
          var r = !1;
          if (this.lerp) this.value = (i = this.value, n = this.to, (1 - (s = 1 - Math.exp(-60 * this.lerp * t))) * i + s * n), Math.round(this.value) === this.to && (this.value = this.to, r = !0);
          else {
            this.currentTime += t;
            var l = o(0, this.currentTime / this.duration, 1),
              h = (r = l >= 1) ? 1 : this.easing(l);
            this.value = this.from + (this.to - this.from) * h
          }
          null == (e = this.onUpdate) || e.call(this, this.value, {
            completed: r
          }), r && this.stop()
        }
      }, e.stop = function() {
        this.isRunning = !1
      }, e.fromTo = function(t, e, i) {
        var o = i.lerp,
          n = void 0 === o ? .1 : o,
          s = i.duration,
          r = void 0 === s ? 1 : s,
          l = i.easing,
          h = void 0 === l ? function(t) {
            return t
          } : l,
          a = i.onUpdate;
        this.from = this.value = t, this.to = e, this.lerp = n, this.duration = r, this.easing = h, this.currentTime = 0, this.isRunning = !0, this.onUpdate = a
      }, t
    }(),
    s = /*#__PURE__*/ function() {
      function t(t) {
        var e, i, o = this,
          n = void 0 === t ? {} : t,
          s = n.wrapper,
          r = n.content,
          l = n.autoResize,
          h = void 0 === l || l;
        if (this.resize = function() {
            o.onWrapperResize(), o.onContentResize()
          }, this.onWrapperResize = function() {
            o.wrapper === window ? (o.width = window.innerWidth, o.height = window.innerHeight) : (o.width = o.wrapper.clientWidth, o.height = o.wrapper.clientHeight)
          }, this.onContentResize = function() {
            o.scrollHeight = o.content.scrollHeight, o.scrollWidth = o.content.scrollWidth
          }, this.wrapper = s, this.content = r, h) {
          var a = (e = this.resize, function() {
            var t = arguments,
              o = this;
            clearTimeout(i), i = setTimeout(function() {
              e.apply(o, t)
            }, 250)
          });
          this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(a), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(a), this.contentResizeObserver.observe(this.content)
        }
        this.resize()
      }
      return t.prototype.destroy = function() {
        var t, e;
        null == (t = this.wrapperResizeObserver) || t.disconnect(), null == (e = this.contentResizeObserver) || e.disconnect()
      }, e(t, [{
        key: "limit",
        get: function() {
          return {
            x: this.scrollWidth - this.width,
            y: this.scrollHeight - this.height
          }
        }
      }]), t
    }(),
    r = /*#__PURE__*/ function() {
      function t() {
        this.events = {}
      }
      var e = t.prototype;
      return e.emit = function(t) {
        for (var e = this.events[t] || [], i = 0, o = e.length; i < o; i++) e[i].apply(e, [].slice.call(arguments, 1))
      }, e.on = function(t, e) {
        var i, o = this;
        return (null == (i = this.events[t]) ? void 0 : i.push(e)) || (this.events[t] = [e]),
          function() {
            var i;
            o.events[t] = null == (i = o.events[t]) ? void 0 : i.filter(function(t) {
              return e !== t
            })
          }
      }, e.destroy = function() {
        this.events = {}
      }, t
    }(),
    l = /*#__PURE__*/ function() {
      function t(t, e) {
        var i = this,
          n = e.wheelMultiplier,
          s = void 0 === n ? 1 : n,
          l = e.touchMultiplier,
          h = void 0 === l ? 2 : l,
          a = e.normalizeWheel,
          c = void 0 !== a && a;
        this.onTouchStart = function(t) {
          var e = t.targetTouches ? t.targetTouches[0] : t,
            o = e.clientY;
          i.touchStart.x = e.clientX, i.touchStart.y = o, i.lastDelta = {
            x: 0,
            y: 0
          }
        }, this.onTouchMove = function(t) {
          var e = t.targetTouches ? t.targetTouches[0] : t,
            o = e.clientX,
            n = e.clientY,
            s = -(o - i.touchStart.x) * i.touchMultiplier,
            r = -(n - i.touchStart.y) * i.touchMultiplier;
          i.touchStart.x = o, i.touchStart.y = n, i.lastDelta = {
            x: s,
            y: r
          }, i.emitter.emit("scroll", {
            type: "touch",
            deltaX: s,
            deltaY: r,
            event: t
          })
        }, this.onTouchEnd = function(t) {
          i.emitter.emit("scroll", {
            type: "touch",
            inertia: !0,
            deltaX: i.lastDelta.x,
            deltaY: i.lastDelta.y,
            event: t
          })
        }, this.onWheel = function(t) {
          var e = t.deltaX,
            n = t.deltaY;
          i.normalizeWheel && (e = o(-100, e, 100), n = o(-100, n, 100)), i.emitter.emit("scroll", {
            type: "wheel",
            deltaX: e *= i.wheelMultiplier,
            deltaY: n *= i.wheelMultiplier,
            event: t
          })
        }, this.element = t, this.wheelMultiplier = s, this.touchMultiplier = h, this.normalizeWheel = c, this.touchStart = {
          x: null,
          y: null
        }, this.emitter = new r, this.element.addEventListener("wheel", this.onWheel, {
          passive: !1
        }), this.element.addEventListener("touchstart", this.onTouchStart, {
          passive: !1
        }), this.element.addEventListener("touchmove", this.onTouchMove, {
          passive: !1
        }), this.element.addEventListener("touchend", this.onTouchEnd, {
          passive: !1
        })
      }
      var e = t.prototype;
      return e.on = function(t, e) {
        return this.emitter.on(t, e)
      }, e.destroy = function() {
        this.emitter.destroy(), this.element.removeEventListener("wheel", this.onWheel, {
          passive: !1
        }), this.element.removeEventListener("touchstart", this.onTouchStart, {
          passive: !1
        }), this.element.removeEventListener("touchmove", this.onTouchMove, {
          passive: !1
        }), this.element.removeEventListener("touchend", this.onTouchEnd, {
          passive: !1
        })
      }, t
    }();
  return function() {
    function t(t) {
      var e = this,
        o = void 0 === t ? {} : t,
        h = o.wrapper,
        a = void 0 === h ? window : h,
        c = o.content,
        u = void 0 === c ? document.documentElement : c,
        p = o.wheelEventsTarget,
        d = void 0 === p ? a : p,
        v = o.smoothWheel,
        m = void 0 === v || v,
        f = o.smoothTouch,
        g = void 0 !== f && f,
        y = o.syncTouch,
        S = void 0 !== y && y,
        w = o.syncTouchLerp,
        T = void 0 === w ? .1 : w,
        b = o.__iosNoInertiaSyncTouchLerp,
        z = void 0 === b ? .4 : b,
        M = o.touchInertiaMultiplier,
        E = void 0 === M ? 35 : M,
        L = o.duration,
        _ = o.easing,
        O = void 0 === _ ? function(t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t))
        } : _,
        R = o.lerp,
        W = void 0 === R ? L && .1 : R,
        k = o.infinite,
        x = void 0 !== k && k,
        H = o.orientation,
        j = void 0 === H ? "vertical" : H,
        A = o.gestureOrientation,
        X = void 0 === A ? "vertical" : A,
        Y = o.touchMultiplier,
        D = void 0 === Y ? 1 : Y,
        I = o.wheelMultiplier,
        P = void 0 === I ? 1 : I,
        C = o.normalizeWheel,
        U = void 0 !== C && C,
        N = o.autoResize,
        V = void 0 === N || N;
      this.onVirtualScroll = function(t) {
        var o = t.type,
          n = t.inertia,
          s = t.deltaX,
          r = t.deltaY,
          l = t.event;
        if (!l.ctrlKey) {
          var h = "touch" === o,
            a = "wheel" === o;
          if (!("vertical" === e.options.gestureOrientation && 0 === r || "horizontal" === e.options.gestureOrientation && 0 === s || h && "vertical" === e.options.gestureOrientation && 0 === e.scroll && !e.options.infinite && r <= 0 || l.composedPath().find(function(t) {
              return (null == t || null == t.hasAttribute ? void 0 : t.hasAttribute("data-lenis-prevent")) || h && (null == t || null == t.hasAttribute ? void 0 : t.hasAttribute("data-lenis-prevent-touch")) || a && (null == t || null == t.hasAttribute ? void 0 : t.hasAttribute("data-lenis-prevent-wheel"))
            })))
            if (e.isStopped || e.isLocked) l.preventDefault();
            else {
              if (e.isSmooth = (e.options.smoothTouch || e.options.syncTouch) && h || e.options.smoothWheel && a, !e.isSmooth) return e.isScrolling = !1, void e.animate.stop();
              l.preventDefault();
              var c = r;
              "both" === e.options.gestureOrientation ? c = Math.abs(r) > Math.abs(s) ? r : s : "horizontal" === e.options.gestureOrientation && (c = s);
              var u = h && e.options.syncTouch,
                p = h && n && Math.abs(c) > 1;
              p && (c = e.velocity * e.options.touchInertiaMultiplier), e.scrollTo(e.targetScroll + c, i({
                programmatic: !1
              }, u && {
                lerp: p ? e.syncTouchLerp : e.options.__iosNoInertiaSyncTouchLerp
              }))
            }
        }
      }, this.onScroll = function() {
        if (!e.isScrolling) {
          var t = e.animatedScroll;
          e.animatedScroll = e.targetScroll = e.actualScroll, e.velocity = 0, e.direction = Math.sign(e.animatedScroll - t), e.emit()
        }
      }, window.lenisVersion = "1.0.18", a !== document.documentElement && a !== document.body || (a = window), this.options = {
        wrapper: a,
        content: u,
        wheelEventsTarget: d,
        smoothWheel: m,
        smoothTouch: g,
        syncTouch: S,
        syncTouchLerp: T,
        __iosNoInertiaSyncTouchLerp: z,
        touchInertiaMultiplier: E,
        duration: L,
        easing: O,
        lerp: W,
        infinite: x,
        gestureOrientation: X,
        orientation: j,
        touchMultiplier: D,
        wheelMultiplier: P,
        normalizeWheel: U,
        autoResize: V
      }, this.dimensions = new s({
        wrapper: a,
        content: u,
        autoResize: V
      }), this.rootElement.classList.add("lenis"), this.velocity = 0, this.isStopped = !1, this.isSmooth = m || g, this.isScrolling = !1, this.targetScroll = this.animatedScroll = this.actualScroll, this.animate = new n, this.emitter = new r, this.options.wrapper.addEventListener("scroll", this.onScroll, {
        passive: !1
      }), this.virtualScroll = new l(d, {
        touchMultiplier: D,
        wheelMultiplier: P,
        normalizeWheel: U
      }), this.virtualScroll.on("scroll", this.onVirtualScroll)
    }
    var h = t.prototype;
    return h.destroy = function() {
      this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onScroll, {
        passive: !1
      }), this.virtualScroll.destroy(), this.dimensions.destroy(), this.rootElement.classList.remove("lenis"), this.rootElement.classList.remove("lenis-smooth"), this.rootElement.classList.remove("lenis-scrolling"), this.rootElement.classList.remove("lenis-stopped")
    }, h.on = function(t, e) {
      return this.emitter.on(t, e)
    }, h.off = function(t, e) {
      var i;
      this.emitter.events[t] = null == (i = this.emitter.events[t]) ? void 0 : i.filter(function(t) {
        return e !== t
      })
    }, h.setScroll = function(t) {
      this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t
    }, h.resize = function() {
      this.dimensions.resize()
    }, h.emit = function() {
      this.emitter.emit("scroll", this)
    }, h.reset = function() {
      this.isLocked = !1, this.isScrolling = !1, this.velocity = 0, this.animate.stop()
    }, h.start = function() {
      this.isStopped = !1, this.reset()
    }, h.stop = function() {
      this.isStopped = !0, this.animate.stop(), this.reset()
    }, h.raf = function(t) {
      var e = t - (this.time || t);
      this.time = t, this.animate.advance(.001 * e)
    }, h.scrollTo = function(t, e) {
      var i = this,
        n = void 0 === e ? {} : e,
        s = n.offset,
        r = void 0 === s ? 0 : s,
        l = n.immediate,
        h = void 0 !== l && l,
        a = n.lock,
        c = void 0 !== a && a,
        u = n.duration,
        p = void 0 === u ? this.options.duration : u,
        d = n.easing,
        v = void 0 === d ? this.options.easing : d,
        m = n.lerp,
        f = void 0 === m ? !p && this.options.lerp : m,
        g = n.onComplete,
        y = void 0 === g ? null : g,
        S = n.force,
        w = n.programmatic,
        T = void 0 === w || w;
      if (!this.isStopped || void 0 !== S && S) {
        if (["top", "left", "start"].includes(t)) t = 0;
        else if (["bottom", "right", "end"].includes(t)) t = this.limit;
        else {
          var b, z;
          if ("string" == typeof t ? z = document.querySelector(t) : null != (b = t) && b.nodeType && (z = t), z) {
            if (this.options.wrapper !== window) {
              var M = this.options.wrapper.getBoundingClientRect();
              r -= this.isHorizontal ? M.left : M.top
            }
            var E = z.getBoundingClientRect();
            t = (this.isHorizontal ? E.left : E.top) + this.animatedScroll
          }
        }
        if ("number" == typeof t) {
          if (t += r, t = Math.round(t), this.options.infinite ? T && (this.targetScroll = this.animatedScroll = this.scroll) : t = o(0, t, this.limit), h) return this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), this.reset(), this.emit(), void(null == y || y());
          if (!T) {
            if (t === this.targetScroll) return;
            this.targetScroll = t
          }
          this.animate.fromTo(this.animatedScroll, t, {
            duration: p,
            easing: v,
            lerp: f,
            onUpdate: function(t, e) {
              var o = e.completed;
              c && (i.isLocked = !0), i.isScrolling = !0, i.velocity = t - i.animatedScroll, i.direction = Math.sign(i.velocity), i.animatedScroll = t, i.setScroll(i.scroll), T && (i.targetScroll = t), o && (c && (i.isLocked = !1), requestAnimationFrame(function() {
                i.isScrolling = !1
              }), i.velocity = 0, null == y || y()), i.emit()
            }
          })
        }
      }
    }, e(t, [{
      key: "rootElement",
      get: function() {
        return this.options.wrapper === window ? this.options.content : this.options.wrapper
      }
    }, {
      key: "limit",
      get: function() {
        return this.dimensions.limit[this.isHorizontal ? "x" : "y"]
      }
    }, {
      key: "isHorizontal",
      get: function() {
        return "horizontal" === this.options.orientation
      }
    }, {
      key: "actualScroll",
      get: function() {
        return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop
      }
    }, {
      key: "scroll",
      get: function() {
        return this.options.infinite ? (this.animatedScroll % (t = this.limit) + t) % t : this.animatedScroll;
        var t
      }
    }, {
      key: "progress",
      get: function() {
        return 0 === this.limit ? 1 : this.scroll / this.limit
      }
    }, {
      key: "isSmooth",
      get: function() {
        return this.__isSmooth
      },
      set: function(t) {
        this.__isSmooth !== t && (this.rootElement.classList.toggle("lenis-smooth", t), this.__isSmooth = t)
      }
    }, {
      key: "isScrolling",
      get: function() {
        return this.__isScrolling
      },
      set: function(t) {
        this.__isScrolling !== t && (this.rootElement.classList.toggle("lenis-scrolling", t), this.__isScrolling = t)
      }
    }, {
      key: "isStopped",
      get: function() {
        return this.__isStopped
      },
      set: function(t) {
        this.__isStopped !== t && (this.rootElement.classList.toggle("lenis-stopped", t), this.__isStopped = t)
      }
    }]), t
  }()
});
document.addEventListener('DOMContentLoaded', function() {
  var lenis = new Lenis({
    lerp: 0.1
  });
  window.matsuLenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  (function() {
    var timer = null;
    var safeResize = function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        lenis.resize();
      }, 150);
    };
    new MutationObserver(safeResize).observe(document.body, {
      childList: true,
      subtree: true
    });
    window.addEventListener('load', safeResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(safeResize);
  })();
  // 14. てがろぐ
  (function() {
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
      return fetch(url).then(function(res) {
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
    fetchText(RSS_URL).then(render).catch(function(err) {
      if (!PROXY_URL) {
        console.error("tegalog widget: direct fetch failed", err);
        showError();
        return;
      }
      fetchText(PROXY_URL).then(render).catch(function(err2) {
        console.error("tegalog widget: proxy fetch failed", err2);
        showError();
      });
    });
  })();
});
