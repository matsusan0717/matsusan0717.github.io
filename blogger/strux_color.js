<img alt="M-StruX カラーパターンサンプル" border="0" style="width:100%;" data-original-height="1000" data-original-width="1600" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCy7FgzFU4fMyhz23T9JdZ7n3bhaOQvBO6teXc8AqsnOKs68pYbqmy5dJWRWQniOGqfHwFATpOh8SpsAcqQI1UopS2t3K6ramhQU091jbNXte0FGXZfX14Htez2TU4Rv_VONENMKMcEB6IPd4BmI4QLFse5oGgUJql4ntZrjxDMI84MhU6-V3LN7ug_Uw/s900/M-StruX%E6%A7%8B%E6%88%90%E5%86%8D%E7%8F%BE%E3%83%AC%E3%83%9D%E3%83%BC%E3%83%88.jpg"/>

<style>
/* ===== Layout ===== */
.tp-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}
.tp-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  margin-bottom: 0.3rem;
}
.tp-sub {
  font-size: 1rem;
  color: var(--text-muted, #64748b);
  margin-bottom: 2rem;
}

/* ===== Theme Grid ===== */
.tp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 16px;
  margin-bottom: 2rem;
}
.tp-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.18s, transform 0.15s;
  background: #fff;
}
.tp-card:hover { border-color: #94a3b8; transform: translateY(-2px); }
.tp-card.active { border-color: #2563eb; }

/* ===== Mini Mockup ===== */
.mock {
  width: 100%;
  height: 160px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.mock-header {
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 6px;
  flex-shrink: 0;
}
.mock-logo {
  height: 10px;
  width: 52px;
  border-radius: 3px;
  opacity: 0.9;
}
.mock-nav {
  display: flex;
  gap: 5px;
  margin-left: auto;
}
.mock-nav span {
  height: 7px;
  width: 22px;
  border-radius: 2px;
  opacity: 0.45;
}
.mock-body {
  flex: 1;
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  overflow: hidden;
}
.mock-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.mock-card-row {
  display: flex;
  gap: 6px;
  flex: 1;
}
.mock-card-item {
  flex: 1;
  border-radius: 5px;
  opacity: 0.18;
}
.mock-card-item.accent-fill { opacity: 1; }
.mock-text-line {
  height: 6px;
  border-radius: 2px;
  opacity: 0.22;
}
.mock-sidebar {
  width: 50px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.mock-sidebar-block {
  height: 28px;
  border-radius: 4px;
  opacity: 0.15;
}
.mock-sidebar-block.s-accent { opacity: 0.7; height: 12px; }

/* ===== Theme Info Row ===== */
.tp-info {
  padding: 10px 12px 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tp-swatch-row {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}
.tp-swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.08);
}
.tp-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tp-badge {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 20px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
  flex-shrink: 0;
  display: none;
}
.tp-card.active .tp-badge { display: block; }

/* ===== Pagination ===== */
.tp-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.tp-page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.tp-page-btn:hover:not(:disabled) { border-color: #94a3b8; background: #f8fafc; }
.tp-page-btn.active { border-color: #2563eb; background: #2563eb; color: #fff; }
.tp-page-btn:disabled { opacity: 0.35; cursor: default; }
.tp-page-info {
  font-size: 0.8rem;
  color: #94a3b8;
  padding: 0 4px;
}

/* ===== Preview Panel ===== */
.tp-preview-panel {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}
.tp-preview-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  padding: 10px 16px 8px;
  background: var(--bg-color, #f8fafc);
  border-bottom: 1px solid var(--border, #e2e8f0);
  display: flex;
  align-items: center;
  gap: 8px;
}
.tp-preview-label span {
  color: var(--text-main, #1e293b);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
}

/* ===== Large Preview ===== */
.large-preview {
  width: 100%;
  height: 280px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.lp-header {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  flex-shrink: 0;
}
.lp-logo-block { display: flex; flex-direction: column; gap: 3px; }
.lp-logo-text { height: 11px; width: 80px; border-radius: 3px; opacity: 0.9; }
.lp-logo-sub { height: 5px; width: 50px; border-radius: 2px; opacity: 0.4; }
.lp-nav { display: flex; gap: 8px; margin-left: auto; align-items: center; }
.lp-nav-item { height: 8px; width: 36px; border-radius: 2px; opacity: 0.5; }
.lp-nav-btn { height: 22px; width: 22px; border-radius: 50%; opacity: 0.85; flex-shrink: 0; }

.lp-body {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  overflow: hidden;
}
.lp-main { flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.lp-card-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.lp-card-item {
  border-radius: 8px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 6px;
  gap: 3px;
}
.lp-card-item .lp-line { height: 5px; border-radius: 2px; opacity: 0.5; }
.lp-card-item .lp-line.short { width: 60%; }
.lp-card-item .lp-thumb { flex: 1; border-radius: 4px; opacity: 0.4; margin-bottom: 2px; }

.lp-post-list { display: flex; flex-direction: column; gap: 6px; }
.lp-post-item { height: 22px; border-radius: 5px; opacity: 0.15; }

.lp-sidebar { width: 90px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }
.lp-sidebar-title { height: 7px; width: 60px; border-radius: 2px; opacity: 0.35; }
.lp-sidebar-block { height: 36px; border-radius: 6px; opacity: 0.12; }
.lp-sidebar-links { display: flex; flex-direction: column; gap: 4px; }
.lp-sidebar-link { height: 6px; border-radius: 2px; opacity: 0.2; }
.lp-sidebar-link.accent { opacity: 0.7; }
.lp-dark { filter: brightness(0.92) saturate(1.1); }

/* ===== Dark Toggle ===== */
.tp-toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 10px;
  background: var(--bg-color, #f8fafc);
  border-top: 1px solid var(--border, #e2e8f0);
}
.tp-toggle-label { font-size: 0.78rem; color: var(--text-muted, #64748b); }
.toggle-switch {
  position: relative;
  width: 38px;
  height: 20px;
  flex-shrink: 0;
}
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-track {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: #cbd5e1;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle-track::after {
  content: '';
  position: absolute;
  left: 2px; top: 2px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.toggle-switch input:checked + .toggle-track { background: #2563eb; }
.toggle-switch input:checked + .toggle-track::after { transform: translateX(18px); }

/* ===== CSS Output ===== */
.tp-output-wrap {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 12px;
  overflow: hidden;
}
.tp-output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-color, #f8fafc);
  border-bottom: 1px solid var(--border, #e2e8f0);
}
.tp-output-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.tp-copy-btn {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid #2563eb;
  background: #fff;
  color: #2563eb;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.tp-copy-btn:hover { background: #2563eb; color: #fff; }
.tp-copy-btn.copied { background: #16a34a; border-color: #16a34a; color: #fff; }
pre#css-output {
  margin: 0;
  padding: 14px 16px;
  font-size: 0.73rem;
  line-height: 1.75;
  color: var(--text-main, #334155);
  font-family: 'Fira Code', 'Courier New', monospace;
  white-space: pre;
  overflow-x: auto;
  background: var(--bg-color, #fff);
  max-height: 340px;
  overflow-y: auto;
}

/* ===== Apply Banner ===== */
.tp-apply-banner {
  margin-bottom: 2rem;
  border: 1.5px solid var(--border, #e2e8f0);
  border-radius: 14px;
  overflow: hidden;
}
.tp-apply-header {
  background: #0f172a;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.tp-apply-title { font-size: 1rem; color: rgba(255,255,255,0.75); }
.tp-apply-title strong { display: block; font-size: 0.95rem; color: #fff; font-weight: 700; margin-bottom: 2px; }
.tp-apply-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px; border-radius: 30px; border: none;
  background: #f59e0b; color: #1a0900; font-size: 1rem; font-weight: 700;
  cursor: pointer; transition: background 0.15s, transform 0.1s;
  white-space: nowrap; flex-shrink: 0;
  text-decoration: none;
}
.tp-apply-btn:hover { background: #fbbf24; transform: translateY(-1px); }
.tp-apply-btn:active { transform: scale(0.97); }

/* ===== How-to Steps ===== */
.tp-howto {
  margin-top: 2.5rem;
  padding: 1.25rem 1.5rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
}
.tp-howto-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1d4ed8;
  margin-bottom: 0.75rem;
}
.tp-howto ol {
  padding-left: 1.2rem;
  font-size: 1rem;
  color: #1e3a5f;
  line-height: 2;
}
.tp-howto code {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.78rem;
}

/* ===== Reference Links ===== */
.tp-ref-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border, #e2e8f0);
}
.tp-ref-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  margin-bottom: 1rem;
}
.tp-ref-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.tp-ref-card {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 12px;
  padding: 16px;
  background: var(--bg-color, #fff);
  transition: border-color 0.2s, transform 0.15s, box-shadow 0.15s;
  text-decoration: none;
  color: inherit;
  display: block;
}
.tp-ref-card:hover {
  border-color: #94a3b8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.tp-ref-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  margin-bottom: 4px;
}
.tp-ref-desc {
  font-size: 0.78rem;
  color: var(--text-muted, #64748b);
  line-height: 1.5;
}
.tp-ref-arrow {
  display: inline-block;
  margin-left: 4px;
  color: #94a3b8;
  transition: color 0.2s, transform 0.2s;
}
.tp-ref-card:hover .tp-ref-arrow {
  color: #2563eb;
  transform: translateX(4px);
}
.tp-ref-grid a:hover {
  color: var(--accent-hover);
  text-decoration: none;
}
div#color-preview-widget div {
  background: #854819 !important;
}
</style>

<div class="tp-wrap">
  <h2 class="tp-heading">カラーテーマを選択</h2>
  <p class="tp-sub">配色テーマをクリックするとプレビューとCSSが切り替わります。適用したい配色のCSSをコピーして、テンプレートXMLの <code style="background: rgb(241, 245, 249); border-radius: 4px; font-size: 0.78rem; padding: 1px 5px;">:root</code> 部分と置き換えてください。</p>

  <div class="tp-preview-panel">
    <div class="tp-preview-label">
      プレビュー &nbsp;—&nbsp; <span id="preview-name">Amber Classic</span>
    </div>
    <div class="large-preview" id="large-preview"></div>
    <div class="tp-toggle-row">
      <span class="tp-toggle-label">ダークモード</span>
      <label class="toggle-switch">
        <input id="dark-toggle" type="checkbox" />
        <div class="toggle-track"></div>
      </label>
    </div>
  </div>

  <div class="tp-grid" id="tp-grid"></div>

  <div class="tp-pagination" id="tp-pagination"></div>

  <div class="tp-apply-banner">
    <div class="tp-apply-header">
      <div class="tp-apply-title">
        <strong>公式サイトでその場プレビュー</strong>
        配色テーマを選んでボタンを押すと新しいタブが開き、この公式サイトに配色を適用した状態の確認が可能になります。
      </div>
      <button class="tp-apply-btn" id="tp-apply-btn">▶ このテーマを公式サイトで試す</button>
    </div>
  </div>

  <div class="tp-output-wrap">
    <div class="tp-output-header">
      <span class="tp-output-title">CSS コード</span>
      <button class="tp-copy-btn" id="tp-copy-btn">コピー</button>
    </div>
    <pre id="css-output"></pre>
  </div>

  <div class="tp-howto">
    <p class="tp-howto-title">&#128203; 適用方法</p>
    <ol>
      <li>上のCSSコードをコピー</li>
      <li>Blogger管理画面 → テーマ → HTMLを編集</li>
      <li><code>&lt;b:skin&gt;&lt;![CDATA[</code> の直後にある <code>:root { ... }</code> ブロック（<code>@media</code> と <code>html[data-theme]</code> も含む）を丸ごと置き換え</li>
      <li>保存して完了</li>
    </ol>
  </div>

  <div class="tp-ref-section">
    <p class="tp-ref-title">&#127912; 配色参考サイト</p>
    <div class="tp-ref-grid">
      <a class="tp-ref-card" href="https://mycolor.space/" rel="noopener" target="_blank">
        <p class="tp-ref-name">MyColor.space <span class="tp-ref-arrow">→</span></p>
        <p class="tp-ref-desc">グラデーションや配色パターンを生成できるツール</p>
      </a>
      <a class="tp-ref-card" href="https://colormind.io/" rel="noopener" target="_blank">
        <p class="tp-ref-name">Colormind <span class="tp-ref-arrow">→</span></p>
        <p class="tp-ref-desc">AIが配色を提案してくれるカラーパレット生成ツール</p>
      </a>
      <a class="tp-ref-card" href="https://www.schemecolor.com/" rel="noopener" target="_blank">
        <p class="tp-ref-name">SchemeColor <span class="tp-ref-arrow">→</span></p>
        <p class="tp-ref-desc">画像から配色を抽出できるカラースキームツール</p>
      </a>
      <a class="tp-ref-card" href="https://colorhunt.co/" rel="noopener" target="_blank">
        <p class="tp-ref-name">Color Hunt <span class="tp-ref-arrow">→</span></p>
        <p class="tp-ref-desc">コミュニティが作成した配色パレットを閲覧・検索</p>
      </a>
    </div>
  </div>
</div>

<script>
(function() {

var SITE_URL = 'https://m-strux.matsusanjpn.com/';
var PAGE_SIZE = 12;

var themes = [
  {
    id: "amber", name: "Amber Classic", tag: "デフォルト",
    swatches: ["#800000", "#1e3a5f", "#e97834"],
    light: {
      "--bg-color": "#f8fafc", "--text-main": "#555555", "--text-muted": "#64748b",
      "--card-bg": "transparent", "--border": "#e2e8f0", "--accent": "#1e3a5f",
      "--accent-hover": "#e97834", "--base-navy": "#1e3a5f", "--sub-amber": "#f59e0b",
      "--bq-bg": "#f3f3f3", "--bq-border": "#c4c4c4",
      "--header-bg": "#800000",
      "--tab-text-active": "#333", "--tab-text-muted": "#aaaaaa",
      "--tab-lamp-color": "#333", "--tab-border-color": "#eeeeee",
    },
    dark: {
      "--bg-color": "#1a0a0a", "--text-main": "#f0eded", "--text-muted": "#b0a8a8",
      "--card-bg": "transparent", "--border": "#3a1a1a", "--accent": "#e97834",
      "--accent-hover": "#f59e0b", "--header-bg": "#5a0000",
      "--bq-bg": "#2a1010", "--bq-border": "#4a2020",
      "--tab-text-active": "#f0eded", "--tab-text-muted": "#6a4040",
      "--tab-lamp-color": "#e97834", "--tab-border-color": "#3a1a1a",
    },
  },
  {
    id: "deepblue", name: "Deep Blue", tag: "",
    swatches: ["#113246", "#1e4a6b", "#2d6a8a"],
    light: {
      "--bg-color": "#f0f7fa", "--text-main": "#113246", "--text-muted": "#1e4a6b",
      "--card-bg": "transparent", "--border": "#b8d4e3", "--accent": "#113246",
      "--accent-hover": "#1e4a6b", "--base-navy": "#113246", "--sub-amber": "#2d6a8a",
      "--bq-bg": "#e1f0f5", "--bq-border": "#8fc4dc",
      "--header-bg": "#113246",
      "--tab-text-active": "#113246", "--tab-text-muted": "#8fc4dc",
      "--tab-lamp-color": "#1e4a6b", "--tab-border-color": "#b8d4e3",
    },
    dark: {
      "--bg-color": "#0a1e2d", "--text-main": "#e1f0f5", "--text-muted": "#8fc4dc",
      "--card-bg": "transparent", "--border": "#113246", "--accent": "#2d6a8a",
      "--accent-hover": "#8fc4dc", "--header-bg": "#0a1e2d",
      "--bq-bg": "#113246", "--bq-border": "#1e4a6b",
      "--tab-text-active": "#e1f0f5", "--tab-text-muted": "#1e4a6b",
      "--tab-lamp-color": "#2d6a8a", "--tab-border-color": "#113246",
    },
  },
  {
    id: "darkgreen", name: "Dark Green", tag: "",
    swatches: ["#1B2017", "#2d3a2a", "#4a5a45"],
    light: {
      "--bg-color": "#f2f3f0", "--text-main": "#1B2017", "--text-muted": "#202118",
      "--card-bg": "transparent", "--border": "#c5c9c0", "--accent": "#1B2017",
      "--accent-hover": "#2d3a2a", "--base-navy": "#1B2017", "--sub-amber": "#4a5a45",
      "--bq-bg": "#e8eae4", "--bq-border": "#a8b0a0",
      "--header-bg": "#1B2017",
      "--tab-text-active": "#1B2017", "--tab-text-muted": "#a8b0a0",
      "--tab-lamp-color": "#2d3a2a", "--tab-border-color": "#c5c9c0",
    },
    dark: {
      "--bg-color": "#0f120d", "--text-main": "#F4F6F3", "--text-muted": "#F6F6F3",
      "--card-bg": "transparent", "--border": "#1B2017", "--accent": "#799272",
      "--accent-hover": "#a8b0a0", "--header-bg": "#0f120d",
      "--bq-bg": "#1B2017", "--bq-border": "#2d3a2a",
      "--tab-text-active": "#F4F6F3", "--tab-text-muted": "#2d3a2a",
      "--tab-lamp-color": "#799272", "--tab-border-color": "#1B2017",
    },
  },
  {
    id: "terracotta", name: "Deep Maroon", tag: "",
    swatches: ["#3B060A", "#7a1018", "#b83040"],
    light: {
      "--bg-color": "#fdf5f5", "--text-main": "#3B060A", "--text-muted": "#3C1D06",
      "--card-bg": "transparent", "--border": "#f0d0d0", "--accent": "#6B630B",
      "--accent-hover": "#7a1018", "--base-navy": "#3B060A", "--sub-amber": "#b83040",
      "--bq-bg": "#fae8e8", "--bq-border": "#e0b0b0",
      "--header-bg": "#3B060A",
      "--tab-text-active": "#3B060A", "--tab-text-muted": "#e0b0b0",
      "--tab-lamp-color": "#7a1018", "--tab-border-color": "#f0d0d0",
    },
    dark: {
      "--bg-color": "#150204", "--text-main": "#FAEBEC", "--text-muted": "#FAF1EB",
      "--card-bg": "transparent", "--border": "#3B060A", "--accent": "#D55D6B",
      "--accent-hover": "#d4a0a0", "--header-bg": "#150204",
      "--bq-bg": "#2a0508", "--bq-border": "#5a1015",
      "--tab-text-active": "#FAEBEC", "--tab-text-muted": "#5a1015",
      "--tab-lamp-color": "#D55D6B", "--tab-border-color": "#3B060A",
    },
  },
  {
    id: "olive", name: "Burnt Orange", tag: "",
    swatches: ["#E6501B", "#f07040", "#f59060"],
    light: {
      "--bg-color": "#fff8f5", "--text-main": "#3D1100", "--text-muted": "#3D3000",
      "--card-bg": "transparent", "--border": "#fad0b8", "--accent": "#8A2700",
      "--accent-hover": "#f07040", "--base-navy": "#8a2800", "--sub-amber": "#f59060",
      "--bq-bg": "#fde8d8", "--bq-border": "#f5b898",
      "--header-bg": "#8a2800",
      "--tab-text-active": "#8a2800", "--tab-text-muted": "#f5b898",
      "--tab-lamp-color": "#E6501B", "--tab-border-color": "#fad0b8",
    },
    dark: {
      "--bg-color": "#1a0d08", "--text-main": "#fde8d8", "--text-muted": "#FDFBD8",
      "--card-bg": "transparent", "--border": "#5a2010", "--accent": "#F09675",
      "--accent-hover": "#f07040", "--header-bg": "#1a0d08",
      "--bq-bg": "#2a1508", "--bq-border": "#7a3020",
      "--tab-text-active": "#fde8d8", "--tab-text-muted": "#5a2010",
      "--tab-lamp-color": "#F09675", "--tab-border-color": "#5a2010",
    },
  },
  {
    id: "indigo", name: "Midnight Blue", tag: "",
    swatches: ["#121358", "#2a2b9a", "#4a4bcc"],
    light: {
      "--bg-color": "#f3f3fc", "--text-main": "#010104", "--text-muted": "#040401",
      "--card-bg": "transparent", "--border": "#c8c8f0", "--accent": "#151556",
      "--accent-hover": "#2a2b9a", "--base-navy": "#121358", "--sub-amber": "#4a4bcc",
      "--bq-bg": "#e8e8fa", "--bq-border": "#a8a8e8",
      "--header-bg": "#121358",
      "--tab-text-active": "#121358", "--tab-text-muted": "#a8a8e8",
      "--tab-lamp-color": "#2a2b9a", "--tab-border-color": "#c8c8f0",
    },
    dark: {
      "--bg-color": "#08082a", "--text-main": "#e8e8fa", "--text-muted": "#EAF2FA",
      "--card-bg": "transparent", "--border": "#1e1e5a", "--accent": "#98BFE7",
      "--accent-hover": "#a8a8e8", "--header-bg": "#08082a",
      "--bq-bg": "#121358", "--bq-border": "#2a2b9a",
      "--tab-text-active": "#e8e8fa", "--tab-text-muted": "#2a2b9a",
      "--tab-lamp-color": "#98BFE7", "--tab-border-color": "#1e1e5a",
    },
  },
  {
    id: "coral", name: "Coral Red", tag: "",
    swatches: ["#C44545", "#d65a5a", "#e86f6f"],
    light: {
      "--bg-color": "#fff5f5", "--text-main": "#0D0C0C", "--text-muted": "#3E4242",
      "--card-bg": "transparent", "--border": "#ffd4d4", "--accent": "#636969",
      "--accent-hover": "#d65a5a", "--base-navy": "#433f3f", "--sub-amber": "#e86f6f",
      "--bq-bg": "#ffe8e8", "--bq-border": "#ffb8b8",
      "--header-bg": "#433f3f",
      "--tab-text-active": "#C44545", "--tab-text-muted": "#ffb8b8",
      "--tab-lamp-color": "#d65a5a", "--tab-border-color": "#ffd4d4",
    },
    dark: {
      "--bg-color": "#2e0f0f", "--text-main": "#ffe8e8", "--text-muted": "#FFF2E5",
      "--card-bg": "transparent", "--border": "#C48545", "--accent": "#E7AB6E",
      "--accent-hover": "#ffb8b8", "--header-bg": "#433f3f",
      "--bq-bg": "#C44545", "--bq-border": "#d65a5a",
      "--tab-text-active": "#ffe8e8", "--tab-text-muted": "#d65a5a",
      "--tab-lamp-color": "#E7AB6E", "--tab-border-color": "#C44545",
    },
  },
  {
    id: "peach", name: "Peach", tag: "",
    swatches: ["#FFC570", "#ffcf8a", "#ffd9a4"],
    light: {
      "--bg-color": "#fffbf2", "--text-main": "#170F07", "--text-muted": "#07170F",
      "--card-bg": "transparent", "--border": "#ffe8cc", "--accent": "#523619",
      "--accent-hover": "#ffcf8a", "--base-navy": "#8B5A2B", "--sub-amber": "#FFC570",
      "--bq-bg": "#fff5e6", "--bq-border": "#ffd699",
      "--header-bg": "#8B5A2B",
      "--tab-text-active": "#8B5A2B", "--tab-text-muted": "#a07040",
      "--tab-lamp-color": "#FFC570", "--tab-border-color": "#ffe8cc",
    },
    dark: {
      "--bg-color": "#1a1208", "--text-main": "#fff5e6", "--text-muted": "#FCFFE5",
      "--card-bg": "transparent", "--border": "#8B5A2B", "--accent": "#FFC570",
      "--accent-hover": "#ffd699", "--header-bg": "#1a1208",
      "--bq-bg": "#8B5A2B", "--bq-border": "#a07040",
      "--tab-text-active": "#fff5e6", "--tab-text-muted": "#a07040",
      "--tab-lamp-color": "#FFC570", "--tab-border-color": "#8B5A2B",
    },
  },
  {
    id: "salmon", name: "Salmon", tag: "",
    swatches: ["#F96E5B", "#ff8470", "#ff9a85"],
    light: {
      "--bg-color": "#fff5f2", "--text-main": "#220501", "--text-muted": "#23010E",
      "--card-bg": "transparent", "--border": "#ffd4cc", "--accent": "#a3650e",
      "--accent-hover": "#b05b4d", "--base-navy": "#ee897b", "--sub-amber": "#ff9a85",
      "--bq-bg": "#ffe8e4", "--bq-border": "#ffb8b0",
      "--header-bg": "#ee897b",
      "--tab-text-active": "#F96E5B", "--tab-text-muted": "#a3650e",
      "--tab-lamp-color": "#ff8470", "--tab-border-color": "#ffd4cc",
    },
    dark: {
      "--bg-color": "#2e1512", "--text-main": "#ffe8e4", "--text-muted": "#FFF6E5",
      "--card-bg": "transparent", "--border": "#FFE8E4", "--accent": "#ff9a85",
      "--accent-hover": "#F96E5B", "--header-bg": "#2e1512",
      "--bq-bg": "#673932", "--bq-border": "#ff8470",
      "--tab-text-active": "#ffe8e4", "--tab-text-muted": "#ff8470",
      "--tab-lamp-color": "#ff9a85", "--tab-border-color": "#F96E5B",
    },
  },
  {
    id: "earthkhaki", name: "Earth Khaki", tag: "",
    swatches: ["#C2C2C2", "#A69855", "#917051"],
    light: {
      "--bg-color": "#f5f4f0", "--text-main": "#3a3523", "--text-muted": "#6b6348",
      "--card-bg": "transparent", "--border": "#c2c2c2", "--accent": "#917051",
      "--accent-hover": "#a68463", "--base-navy": "#c2c2c2", "--sub-amber": "#a69855",
      "--bq-bg": "#ecebe6", "--bq-border": "#a69855",
      "--header-bg": "#a69855",
      "--tab-text-active": "#3a3523", "--tab-text-muted": "#a69855",
      "--tab-lamp-color": "#917051", "--tab-border-color": "#c2c2c2",
    },
    dark: {
      "--bg-color": "#1e1b15", "--text-main": "#f5f4f0", "--text-muted": "#a69855",
      "--card-bg": "transparent", "--border": "#3a3523", "--accent": "#917051",
      "--accent-hover": "#b59272", "--header-bg": "#1e1b15",
      "--bq-bg": "#2a251b", "--bq-border": "#917051",
      "--tab-text-active": "#f5f4f0", "--tab-text-muted": "#6b6348",
      "--tab-lamp-color": "#917051", "--tab-border-color": "#3a3523",
    },
  },
  {
    id: "ivory", name: "Slate Ivory", tag: "",
    swatches: ["#708090", "#FAF3E0", "#A9A9A9"],
    light: {
      "--bg-color": "#FAF3E0", "--text-main": "#2C2C2C", "--text-muted": "#6B6B6B",
      "--card-bg": "transparent", "--border": "#D4C9B0", "--accent": "#708090",
      "--accent-hover": "#8A9BAD", "--base-navy": "#4A5A6A", "--sub-amber": "#A9A9A9",
      "--bq-bg": "#EDE8DC", "--bq-border": "#C4B89A",
      "--header-bg": "#708090",
      "--tab-text-active": "#2C2C2C", "--tab-text-muted": "#A9A9A9",
      "--tab-lamp-color": "#708090", "--tab-border-color": "#D4C9B0",
    },
    dark: {
      "--bg-color": "#1C1F22", "--text-main": "#FAF3E0", "--text-muted": "#B8B0A0",
      "--card-bg": "transparent", "--border": "#3A3F44", "--accent": "#A9A9A9",
      "--accent-hover": "#C8C8C8", "--header-bg": "#252A2F",
      "--bq-bg": "#2A2F34", "--bq-border": "#4A5058",
      "--tab-lamp-color": "#A9A9A9", "--tab-border-color": "#3A3F44",
    },
  },
  {
    id: "spring", name: "Spring", tag: "",
    swatches: ["#A7D8F0", "#FCE77C", "#F8AFA6"],
    light: {
      "--bg-color": "#fdfefd", "--text-main": "#334155", "--text-muted": "#64748b",
      "--card-bg": "transparent", "--border": "#d9ecf5", "--accent": "#f8afa6",
      "--accent-hover": "#ffc818", "--base-navy": "#8ecfe8", "--sub-amber": "#FCE77C",
      "--bq-bg": "#fff1ef", "--bq-border": "#f8afa6",
      "--header-bg": "#8ecfe8",
      "--tab-text-active": "#334155", "--tab-text-muted": "#94a3b8",
      "--tab-lamp-color": "#f4c84f", "--tab-border-color": "#d9ecf5",
    },
    dark: {
      "--bg-color": "#17212b", "--text-main": "#f8fafc", "--text-muted": "#b6c2cf",
      "--card-bg": "transparent", "--border": "#355064", "--accent": "#FCE77C",
      "--accent-hover": "#ffe98f", "--header-bg": "#213547",
      "--bq-bg": "#3a2d34", "--bq-border": "#f8afa6",
      "--tab-text-active": "#f8fafc", "--tab-text-muted": "#6b7d8c",
      "--tab-lamp-color": "#FCE77C", "--tab-border-color": "#355064",
    },
  },
  {
    id: "ashrose", name: "Ash Rose", tag: "",
    swatches: ["#363034", "#7c6c77", "#b1a3ad", "#e8e3e7"],
    light: {
      "--bg-color": "#e8e3e7", "--text-main": "#363034", "--text-muted": "#7c6c77",
      "--card-bg": "transparent", "--border": "#b1a3ad", "--accent": "#7c6c77",
      "--accent-hover": "#363034", "--base-navy": "#363034", "--sub-amber": "#b1a3ad",
      "--bq-bg": "#f3f1f2", "--bq-border": "#b1a3ad",
      "--header-bg": "#363034",
      "--tab-text-active": "#363034", "--tab-text-muted": "#7c6c77",
      "--tab-lamp-color": "#363034", "--tab-border-color": "#b1a3ad",
    },
    dark: {
      "--bg-color": "#363034", "--text-main": "#e8e3e7", "--text-muted": "#b1a3ad",
      "--card-bg": "transparent", "--border": "#7c6c77", "--accent": "#b1a3ad",
      "--accent-hover": "#e8e3e7", "--header-bg": "#363034",
      "--bq-bg": "#292427", "--bq-border": "#7c6c77",
      "--tab-text-active": "#e8e3e7", "--tab-text-muted": "#7c6c77",
      "--tab-lamp-color": "#b1a3ad", "--tab-border-color": "#7c6c77",
    },
  },
];

var selected = 0;
var isDark = false;
var currentPage = 1;
var totalPages = Math.ceil(themes.length / PAGE_SIZE);

function vget(theme, key) {
  var vars = isDark ? theme.dark : theme.light;
  return vars[key] || '';
}

function buildMiniMock(t) {
  var bg = vget(t, '--bg-color');
  var hdr = vget(t, '--header-bg');
  var acc = vget(t, '--accent');
  var brd = vget(t, '--border');
  var txt = vget(t, '--text-muted');
  return '<div class="mock" style="background:' + bg + '">'
    + '<div class="mock-header" style="background:' + hdr + '">'
    + '<div class="mock-logo" style="background:rgba(255,255,255,0.25)"></div>'
    + '<div class="mock-nav">'
    + '<span style="background:rgba(255,255,255,0.3)"></span>'
    + '<span style="background:rgba(255,255,255,0.3)"></span>'
    + '<span style="background:rgba(255,255,255,0.3)"></span>'
    + '</div></div>'
    + '<div class="mock-body">'
    + '<div class="mock-main">'
    + '<div class="mock-card-row">'
    + '<div class="mock-card-item" style="background:' + brd + '"></div>'
    + '<div class="mock-card-item" style="background:' + brd + '"></div>'
    + '<div class="mock-card-item accent-fill" style="background:' + acc + '"></div>'
    + '</div>'
    + '<div class="mock-text-line" style="background:' + txt + ';width:80%"></div>'
    + '<div class="mock-text-line" style="background:' + txt + ';width:55%"></div>'
    + '</div>'
    + '<div class="mock-sidebar">'
    + '<div class="mock-sidebar-block s-accent" style="background:' + acc + '"></div>'
    + '<div class="mock-sidebar-block" style="background:' + brd + '"></div>'
    + '<div class="mock-sidebar-block" style="background:' + brd + '"></div>'
    + '</div></div></div>';
}

function buildLargeMock(t) {
  var bg = vget(t, '--bg-color');
  var hdr = vget(t, '--header-bg');
  var acc = vget(t, '--accent');
  var brd = vget(t, '--border');
  var txt = vget(t, '--text-muted');
  var textMain = vget(t, '--text-main');
  var darkClass = isDark ? ' lp-dark' : '';
  var cards = [0,1,2].map(function(i) {
    return '<div class="lp-card-item" style="background:' + brd + '">'
      + '<div class="lp-thumb" style="background:' + (i===2?acc:txt) + '"></div>'
      + '<div class="lp-line" style="background:' + textMain + '"></div>'
      + '<div class="lp-line short" style="background:' + txt + '"></div>'
      + '</div>';
  }).join('');
  var posts = [80,65,72,50].map(function(w) {
    return '<div class="lp-post-item" style="background:' + brd + ';width:' + w + '%"></div>';
  }).join('');
  var sideLinks = [1,0,1,0,1].map(function(a) {
    return '<div class="lp-sidebar-link' + (a?' accent':'') + '" style="background:' + (a?acc:txt) + '"></div>';
  }).join('');
  return '<div class="large-preview' + darkClass + '" style="background:' + bg + '">'
    + '<div class="lp-header" style="background:' + hdr + '">'
    + '<div class="lp-logo-block">'
    + '<div class="lp-logo-text" style="background:rgba(255,255,255,0.3)"></div>'
    + '<div class="lp-logo-sub" style="background:rgba(255,255,255,0.18)"></div>'
    + '</div>'
    + '<div class="lp-nav">'
    + '<div class="lp-nav-item" style="background:rgba(255,255,255,0.35)"></div>'
    + '<div class="lp-nav-item" style="background:rgba(255,255,255,0.35)"></div>'
    + '<div class="lp-nav-item" style="background:rgba(255,255,255,0.35)"></div>'
    + '<div class="lp-nav-btn" style="background:' + acc + '"></div>'
    + '</div></div>'
    + '<div class="lp-body">'
    + '<div class="lp-main">'
    + '<div class="lp-card-row">' + cards + '</div>'
    + '<div class="lp-post-list">' + posts + '</div>'
    + '</div>'
    + '<div class="lp-sidebar">'
    + '<div class="lp-sidebar-title" style="background:' + textMain + '"></div>'
    + '<div class="lp-sidebar-block" style="background:' + acc + ';opacity:0.35"></div>'
    + '<div class="lp-sidebar-links">' + sideLinks + '</div>'
    + '<div class="lp-sidebar-block" style="background:' + brd + '"></div>'
    + '</div>'
    + '</div></div>';
}

function buildCSS(t) {
  var li = t.light;
  var dk = t.dark;
  var lLines = Object.keys(li).map(function(k){ return '      ' + k + ': ' + li[k] + ';'; }).join('\n');
  var dLines = Object.keys(dk).map(function(k){ return '         ' + k + ': ' + dk[k] + ';'; }).join('\n');
  var dLines2 = Object.keys(dk).map(function(k){ return '      ' + k + ': ' + dk[k] + ';'; }).join('\n');
  return ':root {\n' + lLines + '\n      color-scheme: light;\n   }\n\n'
    + '@media (prefers-color-scheme: dark) {\n\thtml:not([data-theme="light"]) {\n' + dLines + '\n         color-scheme: dark;\n      }\n   }\n\n'
    + 'html[data-theme="dark"] {\n' + dLines2 + '\n      color-scheme: dark;\n   }\n\n'
    + 'html[data-theme="light"] {\n\tcolor-scheme: light;\n   }';
}

/* ===== ページネーション描画 ===== */
function renderPagination() {
  var el = document.getElementById('tp-pagination');
  if (!el) return;

  /* テーマが PAGE_SIZE 以下ならページネーション不要 */
  if (themes.length <= PAGE_SIZE) {
    el.innerHTML = '';
    return;
  }

  totalPages = Math.ceil(themes.length / PAGE_SIZE);
  var html = '';

  /* 前へ */
  html += '<button class="tp-page-btn" id="pg-prev"'
    + (currentPage <= 1 ? ' disabled' : '') + '>&#8592; 前へ</button>';

  /* ページ番号ボタン */
  for (var p = 1; p <= totalPages; p++) {
    html += '<button class="tp-page-btn' + (p === currentPage ? ' active' : '')
      + '" data-pg="' + p + '">' + p + '</button>';
  }

  /* 次へ */
  html += '<button class="tp-page-btn" id="pg-next"'
    + (currentPage >= totalPages ? ' disabled' : '') + '>次へ &#8594;</button>';

  /* 件数情報 */
  var start = (currentPage - 1) * PAGE_SIZE + 1;
  var end = Math.min(currentPage * PAGE_SIZE, themes.length);
  html += '<span class="tp-page-info">' + start + '–' + end + ' / ' + themes.length + ' テーマ</span>';

  el.innerHTML = html;

  /* イベント */
  var prev = el.querySelector('#pg-prev');
  var next = el.querySelector('#pg-next');
  if (prev) prev.addEventListener('click', function() { goPage(currentPage - 1); });
  if (next) next.addEventListener('click', function() { goPage(currentPage + 1); });
  el.querySelectorAll('[data-pg]').forEach(function(btn) {
    btn.addEventListener('click', function() { goPage(parseInt(this.getAttribute('data-pg'))); });
  });
}

function goPage(p) {
  totalPages = Math.ceil(themes.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderGrid();
  renderPagination();
  /* グリッドの先頭へスクロール */
  var grid = document.getElementById('tp-grid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== グリッド描画（現在ページ分のみ） ===== */
function renderGrid() {
  var grid = document.getElementById('tp-grid');
  if (!grid) return;

  var start = (currentPage - 1) * PAGE_SIZE;
  var end = Math.min(start + PAGE_SIZE, themes.length);
  var pageThemes = themes.slice(start, end);

  var html = '';
  for (var i = 0; i < pageThemes.length; i++) {
    var globalIdx = start + i;
    var t = pageThemes[i];
    var swHtml = t.swatches.map(function(c){
      return '<div class="tp-swatch" style="background:' + c + '"></div>';
    }).join('');
    html += '<div class="tp-card' + (globalIdx === selected ? ' active' : '')
      + '" data-i="' + globalIdx + '">'
      + buildMiniMock(t)
      + '<div class="tp-info">'
      + '<div class="tp-swatch-row">' + swHtml + '</div>'
      + '<span class="tp-name">' + t.name + '</span>'
      + '<span class="tp-badge">選択中</span>'
      + '</div></div>';
  }
  grid.innerHTML = html;

  grid.querySelectorAll('.tp-card').forEach(function(card) {
    card.addEventListener('click', function() {
      selected = parseInt(this.getAttribute('data-i'));
      render();
    });
  });
}

function renderPreview() {
  var t = themes[selected];
  var nameEl = document.getElementById('preview-name');
  if (nameEl) nameEl.textContent = t.name;
  var panel = document.querySelector('.tp-preview-panel');
  if (!panel) return;
  var existing = panel.querySelector('.large-preview');
  if (existing) {
    var dummy = document.createElement('div');
    dummy.innerHTML = buildLargeMock(t);
    existing.parentNode.replaceChild(dummy.firstElementChild, existing);
  }
}

function renderCSS() {
  var el = document.getElementById('css-output');
  if (el) el.textContent = buildCSS(themes[selected]);
}

function renderApplyBtn() {
  var slugMap = {
    amber:'amber-classic', deepblue:'deep-blue', darkgreen:'dark-green',
    terracotta:'deep-maroon', olive:'burnt-orange', indigo:'midnight-blue',
    coral:'coral-red', peach:'peach', salmon:'salmon', earthkhaki:'earth-khaki',
    ivory:'slate-ivory', spring:'spring', ashrose:'ash-rose'
  };
  var t = themes[selected];
  var slug = slugMap[t.id] || t.id;
  var sideLink = document.getElementById('color-preview-link');
  if (sideLink) sideLink.href = 'https://m-strux.matsusanjpn.com/p/color-' + slug + '.html';
}

function render() {
  renderGrid();
  renderPagination();
  renderPreview();
  renderCSS();
  renderApplyBtn();
}

/* ===== 「公式サイトで試す」ボタン ===== */
var applyBtn = document.getElementById('tp-apply-btn');
if (applyBtn) {
  applyBtn.addEventListener('click', function() {
    var slugMap = {
      amber:'amber-classic', deepblue:'deep-blue', darkgreen:'dark-green',
      terracotta:'deep-maroon', olive:'burnt-orange', indigo:'midnight-blue',
      coral:'coral-red', peach:'peach', salmon:'salmon', earthkhaki:'earth-khaki',
      ivory:'slate-ivory', spring:'spring', ashrose:'ash-rose'
    };
    var t = themes[selected];
    var slug = slugMap[t.id] || t.id;
    location.href = 'https://m-strux.matsusanjpn.com/p/color-' + slug + '.html';
  });
}

/* ===== ダークモード toggle ===== */
var darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  darkToggle.addEventListener('change', function() {
    isDark = this.checked;
    document.body.classList.toggle('dark-mode', isDark);
    render();
  });
}

/* ===== CSSコピー ===== */
var copyBtn = document.getElementById('tp-copy-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', function() {
    var self = this;
    var text = document.getElementById('css-output').textContent;
    var done = function() {
      self.textContent = 'コピー完了 ✓';
      self.classList.add('copied');
      setTimeout(function() { self.textContent = 'コピー'; self.classList.remove('copied'); }, 2000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }
  });
}

/* ===== 初期描画 ===== */
function init() {
  var grid = document.getElementById('tp-grid');
  if (!grid) {
    var observer = new MutationObserver(function(_, obs) {
      if (document.getElementById('tp-grid')) {
        obs.disconnect();
        render();
      }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    return;
  }
  render();
}

init();

})();
</script>
