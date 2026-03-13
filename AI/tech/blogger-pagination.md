# Blogger ページネーションの実装パターン

## 概要
Bloggerで標準の「次の投稿」リンクを数字付きナビゲーションに置き換える際の技術的要点。

## コア知識
- **フィード取得:** `/feeds/posts/summary?alt=json` を使用。
- **課題:** OR検索 (`label:A|label:B`) 時、総件数が不正確になる。
- **解決策:** `max-results` を 0 ではなく 50 程度に設定してフェッチし、entry.length で補完する。

## AIへの指示出しのコツ
「既存の pager 関数と整合性を保ちつつ、updated-max パラメータで日付順を維持せよ」と伝えると、無限ループを防げる。

# PATTERN: Blogger Client-Side Smart Pagination

APPLIES_TO
Blogger index pages
Label pages
Search pages
Monthly archive pages

---

PROBLEM

Bloggerの標準ページネーションには次の制約がある。

- UIカスタマイズが難しい
- ページ番号ナビゲーションが弱い
- ラベル / 検索 / 月別アーカイブで挙動が不統一
- 投稿数が増えると回遊性が低下する

また、Bloggerの標準ナビゲーションは  
テンプレート構造に依存しているため

デザイン変更
UI改善
ナビゲーション拡張

が困難である。

---

SOLUTION

Blogger JSON Feed を利用し  
クライアントサイドでページネーションを生成する。

ページ遷移時に

- 投稿総数取得
- 現在ページ計算
- ページ番号生成

をJavaScriptで処理することで

完全カスタムのページネーションUIを実現する。

---

TECHNIQUES

Feed API


/feeds/posts/summary?alt=json


取得データ

- openSearch$totalResults
- entry.published

これにより

- 投稿総数
- ページ境界

を算出する。

---

Pagination Logic

ページ計算


totalPage = ceil(totalPosts / maxResults)
currentPage = floor(start / maxResults) + 1


表示範囲制御


maxResults = 7
dispPage = 2


これにより

- 現在ページ周辺のみ表示
- 先頭と末尾は常に表示
- 中間は `...` 省略

というスマートなナビゲーションを生成。

---

Archive Compatibility

月別アーカイブでは


published-min
published-max


を使用して

該当月の記事のみを対象に  
ページネーションを構築する。

---

Search Compatibility

検索ページでは


?q=keyword


をフィード取得時に付与し  
検索結果のみを対象としたページネーションを生成。

---

DOM Manipulation

既存の Blogger pager が存在しない場合

JavaScriptで自動生成する。


#blog-pager


生成後に

- ページ番号
- Prev / Next
- 省略ドット

を動的挿入する。

---

Post Visibility Control

Bloggerはページ内に余分な記事を読み込むことがあるため

DOM内の `.post-outer` を監視し


index >= maxResults


の記事を非表示にする。

これにより

- ページ表示件数を厳密に制御
- アーカイブページの表示崩れ防止

を実現。

---

UX Enhancements

ページネーションUIはCSSで完全カスタマイズ可能。

特徴

- カプセル型ナビゲーション
- Prev / Next ボタン
- アクティブページ強調
- スマホレスポンシブ対応
- Font Awesome 矢印アイコン

---

INSIGHT

Bloggerのページネーションは  
本来 **サーバーサイド構造** に依存している。

このパターンでは


Feed取得
↓
投稿総数計算
↓
ページ番号生成
↓
DOMへ描画


という

**データ駆動型ナビゲーション**

へ置き換えている。

これにより

- テンプレート依存の排除
- UI完全自由化
- 全ページ種別への対応

が可能になる。

---

REUSE

このページネーションパターンは

- ブログトップ
- ラベル一覧
- 検索結果
- 月別アーカイブ
- カスタム記事一覧

すべてに適用可能。

---
