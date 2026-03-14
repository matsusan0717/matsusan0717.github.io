# PATTERN: Blogger GAS Music Database

## APPLIES_TO

- Blogger
- Google Apps Script
- Google Spreadsheet
- Client-side database UI

---

# OVERVIEW

Blogger上で  
**Google Spreadsheet をデータベースとして利用し、  
楽曲データをカードUIで表示するクライアントサイド検索システム。**

データ取得は **Google Apps Script Web App API** を使用し  
JavaScriptで以下を行う。

- フィルタリング
- 検索
- ソート
- UI生成

また **いいね機能（THUMBSUP）** を  
GAS経由でスプレッドシートへ書き戻す。

---

# DATA STRUCTURE

データは **Google Spreadsheet** で管理する。

## 主なカラム

```
ジャケット
トラック
タイトル
アーティスト
Spotify
Vocal
Cho
アルバム名
発売日
品番
作詞
作曲
編曲
別名
S/U
ユニットメンバー
備考
規格
THUMBSUP
```

## 主な役割

| 列 | 用途 |
|---|---|
| ジャケット | カード画像 |
| タイトル | 楽曲名 |
| アーティスト | 歌唱者 |
| Spotify | Spotifyリンク |
| Vocal | メインボーカル |
| Cho | コーラス |
| S/U | ソロ or ユニット |
| ユニットメンバー | ユニット構成 |
| 発売日 | 年フィルター |
| 品番 | Blogger検索用キー |
| THUMBSUP | いいね数 |

---

# DATA FETCH

データは **GAS Web App API** から取得する。

```
https://script.google.com/macros/s/xxxxx/exec
```

## 処理

```javascript
fetch(GAS_WEB_APP_URL)
```

取得後

```javascript
allData = data.map(item => ({
  ...item,
  THUMBSUP: Number(item["THUMBSUP"]) || 0
}))
```

---

# CARD UI RENDERING

データは **カードUIとして描画**する。

## カード構成

- ジャケット画像
- タイトル
- アルバム
- 発売日
- 品番
- 作詞
- 作曲
- 編曲
- Vocal
- Cho
- 備考
- Spotifyリンク
- いいねボタン

## DOM生成

```javascript
renderCards(data)
```

## 特徴

- レスポンシブ対応
- スマホでは縦レイアウト
- Spotifyアイコン表示

---

# FILTER SYSTEM

複数条件を組み合わせた **クライアントサイド検索**を実装。

## フィルター

- 年
- メンバー
- ソロ / ユニット
- コーラス
- アルバム
- キーワード

## 状態管理

```javascript
currentFilters = {
  year,
  searchTerm,
  selectedMembers,
  suType,
  selectedAlbum
}
```

## フィルタリング処理

```javascript
applyFilters()
```

---

# MEMBER FILTER LOGIC

メンバー検索は **AND検索**

例

```
篠原涼子 + 川村知砂
```

処理

```javascript
selectedMembers.every()
```

検索対象

- アーティスト
- 別名
- Vocal
- ユニットメンバー
- Cho

---

# KEYWORD SEARCH

キーワード検索は

```
スペース区切り AND検索
```

例

```
篠原涼子 ライブ
```

処理

```javascript
keywords.every(keyword =>
  textToSearch.includes(keyword)
)
```

検索対象列

- タイトル
- アーティスト
- Vocal
- Cho
- 作詞
- 作曲
- 編曲
- 品番
- 備考
- アルバム名

---

# YEAR FILTER

発売日から **年を自動生成**

処理

```javascript
populateYearFilter()
```

アルゴリズム

```
Setで重複排除
↓
sort
↓
select生成
```

---

# ALBUM LINK FILTER

アルバム名をクリックすると  
同一アルバムの楽曲のみ表示。

処理

```
data-album-name
```

クリック時

```javascript
currentFilters.selectedAlbum = albumName
```

---

# THUMBS UP SYSTEM

いいね機能は **GAS POST API** を使用。

## 送信

```javascript
fetch(GAS_WEB_APP_URL, {
  method: "POST",
  body: FormData
})
```

## パラメータ

```
hinban
```

## GAS側処理

```
THUMBSUP++
```

更新後

```javascript
countSpan.textContent = result.newThumbsUp
```

---

# UI COMPONENTS

## インターフェース構成

- 年フィルター
- 検索フォーム
- メンバーチェックボックス
- ソロ / ユニット ラジオ
- カード一覧

## UX

- カスタムチェックボックス
- カスタムラジオボタン
- ローディングスピナー
- リセットボタン

---

# BLOGGER INTEGRATION

タイトルクリック時

```
Blogger内検索
```

URL

```
/search?q=品番
```

これにより

```
楽曲DB → 関連記事
```

へ遷移できる。

---

# SPOTIFY INTEGRATION

Spotifyリンクが存在する場合のみ  
Spotifyアイコンを表示。

```
target="_blank"
```

---

# PERFORMANCE DESIGN

処理はすべて **クライアントサイド**

サーバー処理

```
GAS
↓
JSON取得
```

以降

```
ブラウザ内処理
```

メリット

- Bloggerテンプレート非依存
- DB検索UIを自由に構築可能
- 表示速度が高速

---

# UX FEATURES

- カードUI
- フィルタ検索
- AND検索
- アルバムリンク検索
- いいね機能
- Spotify連携
- モバイルレスポンシブ

---

# INSIGHT

Bloggerは本来  
**データベース型サイトには向いていない。**

このパターンでは

```
Spreadsheet
↓
GAS API
↓
JSON
↓
Client-side rendering
```

という構造により

**Bloggerを軽量CMSとして利用しつつ  
データベースUIを実現している。**

---

# REUSE

このパターンは次の用途に再利用できる。

- 楽曲データベース
- 書籍DB
- 映画DB
- 商品カタログ
- アーカイブサイト
- コレクション管理
