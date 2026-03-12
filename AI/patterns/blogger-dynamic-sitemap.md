# Dynamic Sitemap: Auto-Labeling Index Generator

BloggerのAPIを活用し、全記事をラベル（カテゴリ）ごとに自動で分類・表示する動的なサイトマップ生成パターンです。

## 🧠 Logic: The "Auto-Garden" Approach
Blogger標準のリスト表示ではなく、クライアントサイドでデータを再構築することで、以下の価値を提供します。

- **自動メンテナンス:** 記事が増えても、コードを書き換える必要はありません。
- **ラベル・ファースト:** 読者が「興味のあるジャンル」から記事を探せる構造を提供します。
- **高速なフェッチ:** Google API (v3) を直接叩くことで、最新の情報を即座に反映します。

---

## 🛠 Implementation (Japanese)
Bloggerの「固定ページ」を作成し、HTMLモードで以下のコードを貼り付けてください。
※ `BLOG_ID` と `API_KEY` は自身の環境に合わせて設定が必要です。

[Code View (JavaScript/CSS)](./blogger-dynamic-sitemap.md) 

---

## 🚨 Troubleshooting: The "Blogger Mire"
BloggerのHTML編集画面では、記号（`&` や `<`）が勝手に書き換えられる現象が起きます。
これを回避するために、コードを外部JS（`custom.js`）へパージするか、記号の取り扱いに注意して配置してください。
