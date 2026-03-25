# パターン：戦略的・動的関連記事エンジン（Digital Garden Edition）

## 課題
Bloggerの標準的な関連記事表示やラベル抽出は柔軟性に欠け、以下の運用上の課題がある。
1. **抽出ロジックの不透明さ:** システム側の判断でラベルが選ばれるため、サイト戦略上重要なカテゴリの記事を優先的に露出させることができない。
2. **情報の重複によるノイズ:** 関連記事リストの中に「現在閲覧中の記事」が混入し、読者の回遊を妨げる物理的なノイズが発生する。
3. **ユーザビリティの欠如:** URLパラメータ（`?m=1`等）の有無により除外判定が失敗し、同一記事が二重に表示されるなどの技術的欠陥が目立つ。

## やったこと（実践内容）

### 1. 戦略的優先順位（Priority）の導入
特定のカテゴリを最優先で探索するロジックをJavaScriptに組み込み。
- **意図的な抽出:** `PRIORITY_LABELS` 配列に定義したラベルを最優先でスキャン。システムの抽出順序を物理的に上書きし、運営者が「次に読んでほしい」コンテンツを確実に提示する。
- **フォールバック探索:** 優先ラベルに該当がない場合、自動的に次の候補ラベルを順次探索する完遂型アルゴリズムを実装。

### 2. URL正規化による物理的重複排除
あらゆる条件下で「今見ている記事」をリストから完全に消し去る判定ロジック。
- **正規化処理:** `split(/[?#]/)[0]` と `replace(/\/$/, "")` を組み合わせ、パラメータや末尾スラッシュの有無に関わらず、純粋なURL文字列のみで比較を実行。
- **非破壊的フィルタリング:** 取得したフィードから自分自身を確実に除外した上で、指定件数（6件）を表示。

### 3. バニラJSによる非破壊導入プロセスの確立
- **テンプレートへの低負荷:** 外部ライブラリを一切使用せず、BloggerのJSONフィードとJSONP通信のみで完結。`post-outer` 内へシームレスに統合し、既存構造を破壊しない。

## なぜ効くのか（洞察）

- **「運営者の意図」の物理的反映:** システムの制約をコードで上書きし、読者に対して論理的かつ戦略的な導線（UX）を強制的に提供できる。
- **回遊率の向上:** 同一記事の重複や無関係なラベルの混入を排除することで、読者の興味を削ぐことなく次のアクションへ誘導できる。
- **デジタルガーデンの剪定:** 記事が増えるほど複雑化するラベル管理を、フロントエンド側のロジックで制御することで、メンテナンスコストを抑えつつサイトの完成度を維持できる。

---

### 1. デザインのタイプ
**ロジック駆動型・関連記事抽出エンジン**

### 2. デザインの特徴
* **PRIORITY制御:** 戦略上重要なラベルを最優先で探索するカスタムソート。
* **URL正規化:** パラメータやフラグメントを無視した完全一致による自記事除外。
* **多段階探索:** 候補ラベルを順次スキャンし、表示の空欄化を防止。
* **バニラJS実装:** 高速・軽量・非破壊的な導入。

### 3. 紹介コード
```xml
<b:if cond='data:view.isSingleItem'>
  <div class='post-outer'>
    <style>
      #custom-related-gadget-container { margin: 40px 0; border-top: 2px solid #555555; padding-top: 30px; clear: both; }
      #related-posts-canvas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
      .related-card-item { text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: transform 0.2s ease; }
      .related-card-item:hover { transform: translateY(-3px); }
      .related-card-inner { background: #ffffff; border: 1px solid #dddddd; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; height: 100%; }
      .related-card-item img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }
      .related-card-content { padding: 12px 15px; flex-grow: 1; }
      .related-card-date { font-size: 12px; color: #888888; margin-bottom: 5px; display: block; }
      .related-card-title { font-size: 15px; font-weight: 400; line-height: 1.5; color: #555555; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      @media (max-width: 900px) { #related-posts-canvas { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 600px) { #related-posts-canvas { grid-template-columns: 1fr; } }
    </style>
    <div id='custom-related-gadget-container'>
      <h3 style='font-size: 20px; font-weight: 900; color: #555555; margin-bottom: 25px; display: flex; align-items: center;'>
        <span style='background: #2c3e50; color: #fff; padding: 2px 10px; margin-right: 10px; border-radius: 3px; font-size: 14px;'>NEXT</span> あわせて読みたい
      </h3>
      <div id='related-posts-canvas'></div>
    </div>
    <script type='text/javascript'>
    // <![CDATA[
    (function() {
      const canvas = document.getElementById('related-posts-canvas');
      const PRIORITY_LABELS = ['ガジェット', '東京パフォーマンスドール']; 
      function normalizeUrl(url) { return url.split(/[?#]/)[0].replace(/\/$/, ""); }
      const currentUrl = normalizeUrl(window.location.href);
      const labelLinks = document.querySelectorAll('a[rel="tag"]');
      let labels = Array.from(labelLinks).map(el => el.innerText.trim());
      labels.sort((a, b) => {
        let indexA = PRIORITY_LABELS.indexOf(a);
        let indexB = PRIORITY_LABELS.indexOf(b);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
      let labelIndex = 0;
      function fetchRelated(labelName) {
        if (!labelName) { render([]); return; }
        const script = document.createElement('script');
        script.src = `/feeds/posts/summary/-/${encodeURIComponent(labelName)}?alt=json-in-script&callback=processRelated&max-results=10`;
        document.body.appendChild(script);
      }
      window.processRelated = function(data) {
        const entries = data.feed.entry || [];
        const filtered = entries.filter(e => {
          const link = e.link.find(l => l.rel === 'alternate').href;
          return normalizeUrl(link) !== currentUrl;
        });
        if (filtered.length > 0 || labelIndex >= labels.length - 1) { render(filtered); }
        else { labelIndex++; fetchRelated(labels[labelIndex]); }
      };
      function render(posts) {
        if (posts.length === 0) { canvas.innerHTML = '<p>準備中</p>'; return; }
        let html = '';
        posts.slice(0, 6).forEach(entry => {
          const title = entry.title.$t;
          const link = entry.link.find(l => l.rel === 'alternate').href;
          const pub = entry.published.$t.substring(0, 10).replace(/-/g, '/');
          const thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', 'w640-h360-p') : '[https://via.placeholder.com/640x360](https://via.placeholder.com/640x360)';
          html += `<a href="${link}" class="related-card-item"><div class="related-card-inner"><img src="${thumb}"><div class="related-card-content"><span class="related-card-date">${pub}</span><div class="related-card-title">${title}</div></div></div></a>`;
        });
        canvas.innerHTML = html;
      }
      fetchRelated(labels[0]);
    })();
    // ]]>
    </script>
  </div>
</b:if>
