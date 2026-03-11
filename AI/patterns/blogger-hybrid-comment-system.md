# 💬 Bloggerハイブリッド・コメントシステム構築

## 🚀 概要
Blogger標準のコメント欄を隠蔽し、GitHub Discussionsを利用した「giscus」をメインに据えつつ、GitHub非ユーザー向けに「Blogger標準のポップアウト窓」を共存させるハック。

## 🛠️ 実装のポイント
1. **giscusの導入**: モダンな議論空間の確保。
2. **標準機能の戦略的隠蔽**: `display: none !important;` を使い、デフォルトの重たいコメント欄を消去。
3. **ポップアウト窓への誘導**: `window.open` を利用し、軽量な別窓で標準コメントを受け付けるバイパスを設置。
4. **設定の変更**: Blogger管理画面で「コメントの埋め込み」を「ポップアウト」に変更することで、インラインの表示を完全に制御下に置く。

## 💻 建築コード

### 1. 記事ページ（item）用：giscus + バイパスボタン
```xml
<b:if cond='data:blog.pageType == "item"'>
  <div id='custom-giscus-container' style='margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;'>
    <div style='display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;'>
      <h3 style='font-size: 1.2rem; margin: 0;'><i class='fa-solid fa-comments'/> この記事への感想・コメント</h3>
      <small>
        <a expr:href='"[https://www.blogger.com/comment-iframe.g?blogID=](https://www.blogger.com/comment-iframe.g?blogID=)" + data:blog.blogId + "&amp;postID=" + data:post.id + "&amp;isPopup=true"' 
           onclick='window.open(this.href, "blogger_comment", "width=600,height=600,scrollbars=yes,resizable=yes"); return false;' 
           style='color: #888; text-decoration: underline; cursor: pointer;'>
           <i class='fa-solid fa-comments'/> GitHub以外でコメントする
        </a>
      </small>
    </div>
    <script async='async' crossorigin='anonymous' 
            data-category='Announcements' 
            data-category-id='DIC_kwDORj0uG84ClC7w' 
            data-repo='matsusan0717/my-digital-garden-comments' 
            src='[https://giscus.app/client.js'/](https://giscus.app/client.js'/)>
  </div>
  <style>
    #comments { display: none !important; } /* 標準コメント欄を強制非表示 */
  </style>
</b:if>

Gemini の回答
いいですね！これはBloggerハックの中でも**「外部サービス（GitHub/giscus）と標準機能を共存させる」**という、かなり高度で戦略的な工事記録になります。

「giscus（GitHub）でスマートに交流したいけど、GitHubアカウントがない人の居場所も奪わない」という、まつさんの**「庭師としての優しさ（UX設計）」**が詰まったドキュメントに仕上げましょう。

この内容を、patterns フォルダの中に blogger-hybrid-comment-system.md という名前で保存する想定で構成しました。

📝 ドキュメント案：patterns/blogger-hybrid-comment-system.md
Markdown
# 💬 Bloggerハイブリッド・コメントシステム構築

## 🚀 概要
Blogger標準のコメント欄を隠蔽し、GitHub Discussionsを利用した「giscus」をメインに据えつつ、GitHub非ユーザー向けに「Blogger標準のポップアウト窓」を共存させるハック。

## 🛠️ 実装のポイント
1. **giscusの導入**: モダンな議論空間の確保。
2. **標準機能の戦略的隠蔽**: `display: none !important;` を使い、デフォルトの重たいコメント欄を消去。
3. **ポップアウト窓への誘導**: `window.open` を利用し、軽量な別窓で標準コメントを受け付けるバイパスを設置。
4. **設定の変更**: Blogger管理画面で「コメントの埋め込み」を「ポップアウト」に変更することで、インラインの表示を完全に制御下に置く。

## 💻 建築コード

### 1. 記事ページ（item）用：giscus + バイパスボタン
```xml
<b:if cond='data:blog.pageType == "item"'>
  <div id='custom-giscus-container' style='margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;'>
    <div style='display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;'>
      <h3 style='font-size: 1.2rem; margin: 0;'><i class='fa-solid fa-comments'/> この記事への感想・コメント</h3>
      <small>
        <a expr:href='"[https://www.blogger.com/comment-iframe.g?blogID=](https://www.blogger.com/comment-iframe.g?blogID=)" + data:blog.blogId + "&amp;postID=" + data:post.id + "&amp;isPopup=true"' 
           onclick='window.open(this.href, "blogger_comment", "width=600,height=600,scrollbars=yes,resizable=yes"); return false;' 
           style='color: #888; text-decoration: underline; cursor: pointer;'>
           <i class='fa-solid fa-comments'/> GitHub以外でコメントする
        </a>
      </small>
    </div>
    <script async='async' crossorigin='anonymous' 
            data-category='Announcements' 
            data-category-id='DIC_kwDORj0uG84ClC7w' 
            data-repo='matsusan0717/my-digital-garden-comments' 
            src='[https://giscus.app/client.js'/](https://giscus.app/client.js'/)>
  </div>
  <style>
    #comments { display: none !important; } /* 標準コメント欄を強制非表示 */
  </style>
</b:if>
2. 固定ページ（static_page）用：ボタン化ハック
XML
<b:if cond='data:blog.pageType == "static_page"'>
  <style>
    /* 不要な「0 comments」等の文言を消去 */
    #comments h4, #comments #Blog1_comments-block-wrapper, #comments #backlinks-container {
      display: none !important;
    }
    /* 標準リンクをボタンとして再定義 */
    #comments .comment-footer a {
      display: inline-block !important;
      padding: 10px 20px;
      background-color: #24292f;
      color: #ffffff !important;
      border-radius: 6px;
      font-weight: bold;
    }
    /* 外枠を排除し中央寄せ */
    #comments.card.cpadding {
      border: none !important;
      background: transparent !important;
      text-align: center;
    }
  </style>
</b:if>

🧠 設計思想の「真」の定義（修正版）
まつさんの設計意図を正しく反映したドキュメントの「思想部分」はこうなります。

なぜ「標準コメント」をポップアウトにするのか？

デザインの純度を保つ:
モダンな giscus をメインに埋め込むことで、デザインの統一感を維持。Blogger標準のやや古風なUIが、メインコンテンツの美しさ（静止画）を邪魔しないようにする。

GitHub非ユーザーへの配慮:
「GitHubアカウントがないから書けない」という壁を作らない。しかし、それをメインに置くとデザインが崩れるため、「ポップアウト（別窓）」という別ルートを用意し、必要な人にだけ機能を開放する。

読み込み負荷の最適化:
重いBlogger標準のコメント欄をインラインで読み込まず、必要な時にだけポップアウトさせることで、ページの表示速度を最大化する。
