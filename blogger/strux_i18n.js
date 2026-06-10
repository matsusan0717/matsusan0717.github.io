/* ==========================================
   1. Google Translate Integration
   ========================================== */
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

// strux_i18n.js
window.STRUX_I18N = (function() {
  // localStorage に保存済み言語を優先、なければ data-lang 属性、なければ 'ja'
  var savedLang;
  try { savedLang = localStorage.getItem('strux-lang'); } catch(e) {}
  const currentLang = savedLang
    || document.documentElement.getAttribute('data-lang')
    || 'ja';

  // 起動時に html 要素へ反映
  document.documentElement.setAttribute('data-lang', currentLang);

  const messages = {
    ja: {
      searchPlaceholder: 'キーワードを入力...',
      bookmarkTitle: 'あとで読む',
      bookmarkEmpty: 'あとで読むはありません',
      bookmarkClearAll: 'すべて削除',
      bookmarkLabel: 'あとで読む',
      tocTitle: '目次',
      popularTitle: '人気記事',
      recentTitle: '新着記事',
      labelTitle: 'LABEL',
      labelLoading: '読み込み中...',
      tagTitle: 'TAG',
      archiveTitle: 'ARCHIVES',
      archiveSelectDefault: '月を選択...',
      newsletterTitle: 'NEWSLETTER',
      contactTitle: '連絡フォーム',
      profileDownload: 'テンプレートのダウンロードはこちら',
      pagerPrev: '前へ',
      pagerNext: '次へ',
      readMore: '続きを読む &raquo;',
      loading: '記事を取得中...',
      notFound: '記事が見つかりませんでした。',
      home: 'HOME',
      report: 'Report',
      previewNotice: 'Preview mode detected. Skipping SPA initialization.',
      commentsTitle: 'Comments',
      commentSubmit: 'コメントを投稿する',
      reply: '返信',
      readingTime: 'この記事は約',
      readingTimeSuffix: '分で読めます。',
      licenseLabel: '⚠ License',
      copyrightNotice: 'このサイトはM-StruXの著作権表記が...',
      cookieTitle: 'クッキーに関するお知らせ',
      cookieBody: '当サイトでは、ご利用状況の把握・サービス改善のためにクッキーを使用しています。Googleの広告関連クッキーも含まれます。',
      cookiePolicy: 'クッキーポリシー',
      cookieAccept: '了解しました'
    },
    en: {
      searchPlaceholder: 'Search...',
      bookmarkTitle: 'Read later',
      bookmarkEmpty: 'No bookmarks yet.',
      bookmarkClearAll: 'Clear all',
      bookmarkLabel: 'Bookmarks',
      tocTitle: 'Table of Contents',
      popularTitle: 'Popular Posts',
      recentTitle: 'Recent Posts',
      labelTitle: 'LABELS',
      labelLoading: 'Loading...',
      tagTitle: 'TAGS',
      archiveTitle: 'ARCHIVES',
      archiveSelectDefault: 'Select a month...',
      newsletterTitle: 'NEWSLETTER',
      contactTitle: 'Contact Form',
      profileDownload: 'Download this template',
      pagerPrev: 'Previous',
      pagerNext: 'Next',
      readMore: 'Read more &raquo;',
      loading: 'Loading posts...',
      notFound: 'No posts found.',
      home: 'HOME',
      report: 'Report',
      previewNotice: 'Preview mode detected. Skipping SPA initialization.',
      commentsTitle: 'Comments',
      commentSubmit: 'Post a comment',
      reply: 'Reply',
      readingTime: 'This article takes about',
      readingTimeSuffix: 'minutes to read.',
      licenseLabel: '⚠ License',
      copyrightNotice: 'This site uses the M-StruX copyright notice...',
      cookieTitle: 'Cookie Notice',
      cookieBody: 'We use cookies to enhance your experience and analyze site traffic. Google advertising cookies are also included.',
      cookiePolicy: 'Cookie Policy',
      cookieAccept: 'Got it'
    },
    zh_CN: {
      searchPlaceholder: '搜索...',
      bookmarkTitle: '稍后阅读',
      bookmarkEmpty: '暂无书签。',
      bookmarkClearAll: '全部清除',
      bookmarkLabel: '书签',
      tocTitle: '目录',
      popularTitle: '热门文章',
      recentTitle: '最新文章',
      labelTitle: '标签',
      labelLoading: '加载中...',
      tagTitle: '话题标签',
      archiveTitle: '归档',
      archiveSelectDefault: '请选择月份...',
      newsletterTitle: '订阅简报',
      contactTitle: '联系表单',
      profileDownload: '下载此模板',
      pagerPrev: '上一页',
      pagerNext: '下一页',
      readMore: '阅读更多 &raquo;',
      loading: '正在加载文章...',
      notFound: '没有找到文章。',
      home: '首页',
      report: '报告',
      previewNotice: '检测到预览模式。跳过 SPA 初始化。',
      commentsTitle: '评论',
      commentSubmit: '发表评论',
      reply: '回复',
      readingTime: '阅读时间约',
      readingTimeSuffix: '分钟。',
      licenseLabel: '⚠ 许可',
      copyrightNotice: '本网站使用 M-StruX 版权声明...',
      cookieTitle: 'Cookie 通知',
      cookieBody: '我们使用 Cookie 来改善用户体验和分析网站流量，其中包含 Google 广告相关 Cookie。',
      cookiePolicy: 'Cookie 政策',
      cookieAccept: '知道了'
    },
    zh_TW: {
      searchPlaceholder: '搜尋...',
      bookmarkTitle: '稍後閱讀',
      bookmarkEmpty: '尚無書籤。',
      bookmarkClearAll: '全部清除',
      bookmarkLabel: '書籤',
      tocTitle: '目次',
      popularTitle: '熱門文章',
      recentTitle: '最新文章',
      labelTitle: '標籤',
      labelLoading: '載入中...',
      tagTitle: '話題標籤',
      archiveTitle: '歸檔',
      archiveSelectDefault: '請選擇月份...',
      newsletterTitle: '訂閱電子報',
      contactTitle: '聯絡表單',
      profileDownload: '下載此模板',
      pagerPrev: '上一頁',
      pagerNext: '下一頁',
      readMore: '閱讀更多 &raquo;',
      loading: '正在載入文章...',
      notFound: '沒有找到文章。',
      home: '首頁',
      report: '回報',
      previewNotice: '偵測到預覽模式。跳過 SPA 初始化。',
      commentsTitle: '留言',
      commentSubmit: '發表留言',
      reply: '回覆',
      readingTime: '閱讀時間約',
      readingTimeSuffix: '分鐘。',
      licenseLabel: '⚠ 授權',
      copyrightNotice: '本網站使用 M-StruX 版權聲明...',
      cookieTitle: 'Cookie 通知',
      cookieBody: '我們使用 Cookie 來增進使用者體驗並分析站點流量，其中也包含 Google 廣告相關 Cookie。',
      cookiePolicy: 'Cookie 政策',
      cookieAccept: '知道了'
    },
    ko: {
      searchPlaceholder: '검색...',
      bookmarkTitle: '나중에 읽기',
      bookmarkEmpty: '북마크가 없습니다.',
      bookmarkClearAll: '전체 삭제',
      bookmarkLabel: '북마크',
      tocTitle: '목차',
      popularTitle: '인기 글',
      recentTitle: '최신 글',
      labelTitle: '라벨',
      labelLoading: '로딩 중...',
      tagTitle: '태그',
      archiveTitle: '아카이브',
      archiveSelectDefault: '월 선택...',
      newsletterTitle: '뉴스레터',
      contactTitle: '문의 양식',
      profileDownload: '템플릿 다운로드',
      pagerPrev: '이전',
      pagerNext: '다음',
      readMore: '더 읽기 &raquo;',
      loading: '글 로딩 중...',
      notFound: '글을 찾을 수 없습니다.',
      home: '홈',
      report: '보고',
      previewNotice: '미리보기 모드 감지. SPA 초기화를 건너뜁니다.',
      commentsTitle: '댓글',
      commentSubmit: '댓글 달기',
      reply: '답변',
      readingTime: '이 글은 약',
      readingTimeSuffix: '분이 걸립니다.',
      licenseLabel: '⚠ 라이선스',
      copyrightNotice: '이 사이트는 M-StruX 저작권 표시를 사용합니다...',
      cookieTitle: '쿠키 공지',
      cookieBody: '사용 환경 개선과 서비스 향상을 위해 쿠키를 사용합니다. Google 광고 관련 쿠키도 포함됩니다.',
      cookiePolicy: '쿠키 정책',
      cookieAccept: '확인'
    },
    es: {
      searchPlaceholder: 'Buscar...',
      bookmarkTitle: 'Leer más tarde',
      bookmarkEmpty: 'Sin marcadores.',
      bookmarkClearAll: 'Borrar todo',
      bookmarkLabel: 'Marcadores',
      tocTitle: 'Tabla de contenidos',
      popularTitle: 'Entradas populares',
      recentTitle: 'Entradas recientes',
      labelTitle: 'ETIQUETAS',
      labelLoading: 'Cargando...',
      tagTitle: 'TAGS',
      archiveTitle: 'ARCHIVO',
      archiveSelectDefault: 'Selecciona un mes...',
      newsletterTitle: 'BOLETÍN',
      contactTitle: 'Formulario de contacto',
      profileDownload: 'Descargar esta plantilla',
      pagerPrev: 'Anterior',
      pagerNext: 'Siguiente',
      readMore: 'Leer más &raquo;',
      loading: 'Cargando entradas...',
      notFound: 'No se encontraron entradas.',
      home: 'INICIO',
      report: 'Informar',
      previewNotice: 'Modo vista previa detectado. Omitiendo inicialización SPA.',
      commentsTitle: 'Comentarios',
      commentSubmit: 'Publicar un comentario',
      reply: 'Responder',
      readingTime: 'Este artículo tarda aproximadamente',
      readingTimeSuffix: 'minutos en leerse.',
      licenseLabel: '⚠ Licencia',
      copyrightNotice: 'Este sitio utiliza el aviso de copyright de M-StruX...',
      cookieTitle: 'Aviso de cookies',
      cookieBody: 'Utilizamos cookies para mejorar su experiencia y analizar el tráfico del sitio. También se incluyen cookies publicitarias de Google.',
      cookiePolicy: 'Política de cookies',
      cookieAccept: 'Entendido'
    },
    fr: {
      searchPlaceholder: 'Rechercher...',
      bookmarkTitle: 'Lire plus tard',
      bookmarkEmpty: 'Aucun favori.',
      bookmarkClearAll: 'Tout supprimer',
      bookmarkLabel: 'Favoris',
      tocTitle: 'Sommaire',
      popularTitle: 'Articles populaires',
      recentTitle: 'Articles récents',
      labelTitle: 'ÉTIQUETTES',
      labelLoading: 'Chargement...',
      tagTitle: 'MOTS-CLÉS',
      archiveTitle: 'ARCHIVES',
      archiveSelectDefault: 'Sélectionnez un mois...',
      newsletterTitle: 'NEWSLETTER',
      contactTitle: 'Formulaire de contact',
      profileDownload: 'Télécharger ce modèle',
      pagerPrev: 'Précédent',
      pagerNext: 'Suivant',
      readMore: 'Lire la suite &raquo;',
      loading: 'Chargement des articles...',
      notFound: 'Aucun article trouvé.',
      home: 'ACCUEIL',
      report: 'Signaler',
      previewNotice: "Mode aperçu détecté. Saut de l'initialisation SPA.",
      commentsTitle: 'Commentaires',
      commentSubmit: 'Publier un commentaire',
      reply: 'Répondre',
      readingTime: 'Cet article prend environ',
      readingTimeSuffix: 'minutes à lire.',
      licenseLabel: '⚠ Licence',
      copyrightNotice: 'Ce site utilise la mention de copyright M-StruX...',
      cookieTitle: 'Avis sur les cookies',
      cookieBody: 'Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site. Des cookies publicitaires Google sont également inclus.',
      cookiePolicy: 'Politique de cookies',
      cookieAccept: 'Compris'
    },
    de: {
      searchPlaceholder: 'Suchen...',
      bookmarkTitle: 'Später lesen',
      bookmarkEmpty: 'Keine Lesezeichen.',
      bookmarkClearAll: 'Alle löschen',
      bookmarkLabel: 'Lesezeichen',
      tocTitle: 'Inhaltsverzeichnis',
      popularTitle: 'Beliebte Artikel',
      recentTitle: 'Neueste Artikel',
      labelTitle: 'SCHLAGWÖRTER',
      labelLoading: 'Wird geladen...',
      tagTitle: 'TAGS',
      archiveTitle: 'ARCHIV',
      archiveSelectDefault: 'Monat auswählen...',
      newsletterTitle: 'NEWSLETTER',
      contactTitle: 'Kontaktformular',
      profileDownload: 'Diese Vorlage herunterladen',
      pagerPrev: 'Zurück',
      pagerNext: 'Weiter',
      readMore: 'Weiterlesen &raquo;',
      loading: 'Beiträge werden geladen...',
      notFound: 'Keine Beiträge gefunden.',
      home: 'STARTSEITE',
      report: 'Melden',
      previewNotice: 'Vorschaumodus erkannt. SPA-Initialisierung übersprungen.',
      commentsTitle: 'Kommentare',
      commentSubmit: 'Kommentar abschicken',
      reply: 'Antworten',
      readingTime: 'Dieser Artikel dauert etwa',
      readingTimeSuffix: 'Minuten zu lesen.',
      licenseLabel: '⚠ Lizenz',
      copyrightNotice: 'Diese Seite verwendet den M-StruX-Copyright-Hinweis...',
      cookieTitle: 'Cookie-Hinweis',
      cookieBody: 'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern und den Website-Verkehr zu analysieren. Google-Werbung-Cookies sind ebenfalls enthalten.',
      cookiePolicy: 'Cookie-Richtlinie',
      cookieAccept: 'Verstanden'
    },
    pt: {
      searchPlaceholder: 'Buscar...',
      bookmarkTitle: 'Ler mais tarde',
      bookmarkEmpty: 'Sem favoritos.',
      bookmarkClearAll: 'Limpar tudo',
      bookmarkLabel: 'Favoritos',
      tocTitle: 'Índice',
      popularTitle: 'Artigos populares',
      recentTitle: 'Artigos recentes',
      labelTitle: 'RÓTULOS',
      labelLoading: 'Carregando...',
      tagTitle: 'TAGS',
      archiveTitle: 'ARQUIVO',
      archiveSelectDefault: 'Selecione um mês...',
      newsletterTitle: 'NEWSLETTER',
      contactTitle: 'Formulário de contato',
      profileDownload: 'Baixar este template',
      pagerPrev: 'Anterior',
      pagerNext: 'Próximo',
      readMore: 'Ler mais &raquo;',
      loading: 'Carregando artigos...',
      notFound: 'Nenhum artigo encontrado.',
      home: 'INÍCIO',
      report: 'Reportar',
      previewNotice: 'Modo de visualização detectado. Pulando inicialização SPA.',
      commentsTitle: 'Comentários',
      commentSubmit: 'Publicar comentário',
      reply: 'Responder',
      readingTime: 'Este artigo demora aproximadamente',
      readingTimeSuffix: 'minutos para ler.',
      licenseLabel: '⚠ Licença',
      copyrightNotice: 'Este site utiliza o aviso de copyright M-StruX...',
      cookieTitle: 'Aviso de cookies',
      cookieBody: 'Usamos cookies para melhorar sua experiência e analisar o tráfego do site. Cookies de publicidade do Google também estão incluídos.',
      cookiePolicy: 'Política de cookies',
      cookieAccept: 'Entendido'
    },
    ar: {
      searchPlaceholder: 'بحث...',
      bookmarkTitle: 'قراءة لاحقاً',
      bookmarkEmpty: 'لا توجد إشارات مرجعية.',
      bookmarkClearAll: 'مسح الكل',
      bookmarkLabel: 'المحفوظات',
      tocTitle: 'فهرس',
      popularTitle: 'المقالات الشائعة',
      recentTitle: 'المقالات الحديثة',
      labelTitle: 'التصنيفات',
      labelLoading: 'جار التحميل...',
      tagTitle: 'الوسوم',
      archiveTitle: 'الأرشيف',
      archiveSelectDefault: 'اختر شهراً...',
      newsletterTitle: 'النشرة البريدية',
      contactTitle: 'نموذج الاتصال',
      profileDownload: 'تنزيل هذا القالب',
      pagerPrev: 'السابق',
      pagerNext: 'التالي',
      readMore: 'اقرأ المزيد &raquo;',
      loading: 'جارٍ تحميل المقالات...',
      notFound: 'لم يُعثر على مقالات.',
      home: 'الرئيسية',
      report: 'الإبلاغ',
      previewNotice: 'تم اكتشاف وضع المعاينة. تخطي تهيئة SPA.',
      commentsTitle: 'التعليقات',
      commentSubmit: 'أضف تعليقاً',
      reply: 'رد',
      readingTime: 'تقريباً',
      readingTimeSuffix: 'دقائق للقراءة.',
      licenseLabel: '⚠ الترخيص',
      copyrightNotice: 'هذا الموقع uses إشعار حقوق النشر M-StruX...',
      cookieTitle: 'إشعار ملفات تعريف الارتباط',
      cookieBody: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة الموقع. كما نستخدم ملفات تعريف ارتباط إعلانية من Google.',
      cookiePolicy: 'سياسة ملفات الارتباط',
      cookieAccept: 'فهمت'
    }
  };

  const langAlias = {
    ja: 'ja', en: 'en',
    'zh-CN': 'zh_CN', 'zh-TW': 'zh_TW',
    ko: 'ko', es: 'es', fr: 'fr',
    de: 'de', pt: 'pt', ar: 'ar'
  };

  var resolved = langAlias[currentLang] || 'ja';

  function t(key) {
    const dict = messages[resolved] || messages.ja;
    return dict[key] !== undefined ? dict[key] : (messages.ja[key] || key);
  }

  // ★ switch(): 言語切替 + DOM 再適用（リロードなし）
  function switchLang(lang) {
    resolved = langAlias[lang] || 'ja';
    try { localStorage.setItem('strux-lang', lang); } catch(e) {}
    document.documentElement.setAttribute('data-lang', lang);

    // data-i18n 属性を持つ要素を再適用
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var val = t(el.getAttribute('data-i18n'));
      if (val) el.textContent = val;
    });
    // placeholder の更新
    document.querySelectorAll('input[data-i18n="searchPlaceholder"]').forEach(function(el) {
      el.setAttribute('placeholder', t('searchPlaceholder'));
    });
    // select default option
    document.querySelectorAll('option[data-i18n="archiveSelectDefault"]').forEach(function(el) {
      el.textContent = t('archiveSelectDefault');
    });
    // window.t も更新済みなので SPA が次に描画するコンテンツは新言語になる
    // 既に描画済みの動的コンテンツ（記事カード等）はリロードが必要
    location.reload();
  }

  return {
    t: t,
    switch: switchLang,
    lang: resolved,
    currentLang: currentLang
  };
})();

// グローバル window.t を定義（mstrux.js から呼べるように）
window.t = function(key) {
  return window.STRUX_I18N ? window.STRUX_I18N.t(key) : key;
};
var translateInit = function() {
  var btn = document.getElementById('translate-btn');
  var dropdown = document.getElementById('translate-dropdown');
  if (!btn || !dropdown) return;
  if (btn.getAttribute('data-i18n-bound') === 'true') return;
  btn.setAttribute('data-i18n-bound', 'true');

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', dropdown.classList.contains('is-open') ? 'true' : 'false');
  });

  document.addEventListener('click', function() {
    dropdown.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  });

  dropdown.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  dropdown.querySelectorAll('a[data-lang]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var lang = this.getAttribute('data-lang');
      dropdown.classList.remove('is-open');
      if (window.STRUX_I18N && window.STRUX_I18N.switch) {
        window.STRUX_I18N.switch(lang);
      } else {
        try { localStorage.setItem('strux-lang', lang); } catch(err) {}
        location.reload();
      }
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    translateInit();
    if (document.getElementById('translate-btn')) return;
    window._i18nObserver = new MutationObserver(function(mutations) {
      if (document.getElementById('translate-btn')) {
        translateInit();
      }
    });
    window._i18nObserver.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  });
} else {
  translateInit();
  if (document.getElementById('translate-btn')) return;
  window._i18nObserver = new MutationObserver(function() {
    if (document.getElementById('translate-btn')) translateInit();
  });
  window._i18nObserver.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });
}
