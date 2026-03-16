# PATTERN: Blogger × Steam API「私を構成するゲーム」チャートジェネレーター

## APPLIES_TO
- Blogger
- Google Apps Script
- Steam Web API
- Steam Store API
- Canvas API（クライアントサイド画像生成）

---

## OVERVIEW

Blogger上で Steam Web API をGASプロキシ経由で取得し、プレイ時間ランキング上位のゲームカバー画像をグリッド表示・PNG出力するクライアントサイドジェネレーター。

Last.fmアルバムチャートジェネレーターと同じ「データ取得 → Canvas描画 → 画像保存」の構造を持つが、以下の点で異なる。

- **APIキーをGAS側に隠蔽する**（ブラウザに露出しない）
- **CORSをGAS自体がプロキシとして解決する**（`images.weserv.nl`不使用）
- **Steam Store APIで発売年を付加取得する**（2段階API連携）

---

## PROBLEM

Steam APIはCORSブロックがあるため、ブラウザから直接叩けない。
またAPIキーをフロントエンドに露出させることはセキュリティ上許容できない。

さらにSteam Web APIが返すゲームデータには発売年が含まれないため、
カード表示に発売年を付加するには別途Steam Store APIを叩く必要がある。

---

## SOLUTION

```
ブラウザ（Blogger）
　↓ SteamID64を送信
GAS Web App（プロキシ兼APIキー管理）
　↓ Steam Web API（GetOwnedGames）を叩く
　↓ プレイ時間上位20件を抽出
　↓ 各ゲームのSteam Store APIを叩いて発売年を付加
　↓ JSONを返す
ブラウザ
　↓ images.weserv.nl経由でゲーム画像を取得
　↓ Canvas描画
　↓ PNG出力・保存
```

GASが「プロキシ」「APIキー管理」「発売年取得」の3役を担う構造。

---

## SYSTEM ARCHITECTURE

### データ層：Steam API（2種）

| API | エンドポイント | 用途 |
|-----|--------------|------|
| Steam Web API | `IPlayerService/GetOwnedGames/v1/` | 所持ゲーム一覧・プレイ時間取得 |
| Steam Store API | `store.steampowered.com/api/appdetails` | 発売年取得 |

### 通信層：GAS Web App

- `doGet(e)` でSteamIDを受け取り、Steam APIを順次叩く
- APIキーはGAS内の定数として管理（ブラウザに露出しない）
- Store APIは上位20件分のみ叩く（GASの実行時間制限対策）
- レート制限対策として各リクエスト間に`Utilities.sleep(300)`を挿入

### 表示層：Blogger + JavaScript + Canvas

- シングル・フェッチ戦略：GASから全データを一括取得
- Canvas APIでグリッド描画・PNG出力
- `images.weserv.nl`で画像をプロキシ取得（CORS回避）

---

## TECHNIQUES

### APIキーの隠蔽

```javascript
// GAS側（ブラウザに露出しない）
const STEAM_API_KEY = "YOUR_STEAM_API_KEY";

function doGet(e) {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`
    + `?key=${STEAM_API_KEY}&steamid=${e.parameter.steamid}...`;
  const response = UrlFetchApp.fetch(url);
  // ...
}
```

### 2段階API連携（発売年の付加取得）

```javascript
// プレイ時間上位20件を取得後、各ゲームの発売年をStore APIから取得
const top20 = games.sort(...).slice(0, 20);

const result = top20.map(g => {
  let releaseYear = null;
  const storeRes = UrlFetchApp.fetch(
    `https://store.steampowered.com/api/appdetails?appids=${g.appid}&filters=release_date`
  );
  const releaseDate = JSON.parse(storeRes.getContentText())[g.appid]?.data?.release_date?.date;
  if (releaseDate) {
    const yearMatch = releaseDate.match(/\d{4}/);
    if (yearMatch) releaseYear = parseInt(yearMatch[0]);
  }
  Utilities.sleep(300); // レート制限対策
  return { ...g, release_year: releaseYear };
});
```

### Blogger数値文字参照問題の回避

Bloggerエディタが `·`（中点）を `&#183;` に強制変換する問題を`decodeURIComponent`で回避。

```javascript
// ❌ NG：Bloggerが &#183; に変換する
subParts.join('  ·  ')

// ✅ OK：実行時にデコードされるためBloggerのパーサーをスルーする
const sep = decodeURIComponent('%20%C2%B7%20'); // " · "
subParts.join(sep)
```

### Canvas描画：カード構成

```
┌─────────────────────────────┐
│  My Steam Library           │  ← ヘッダー（タイトル + サブテキスト）
├──────┬──────┬──────┬────────┤
│ 🥇  │ 🥈  │ 🥉  │  #4   │  ← 順位バッジ（金・銀・銅・通常）
│      │      │      │        │
│ img  │ img  │ img  │  img  │  ← ゲームカバー画像
│──────│──────│──────│────────│
│ タイ │ トル │      │        │  ← ゲーム名（1行目）
│ 年 · │ Xh  │      │        │  ← 発売年 · プレイ時間（2行目）
└──────┴──────┴──────┴────────┘
```

### 画像プロキシ

```javascript
// Steam CDNの画像をimages.weserv.nl経由で取得（CORS回避 + リサイズ）
img.src = `https://images.weserv.nl/?url=${encodeURIComponent(game.image)}&w=220&h=130&fit=cover`;
```

---

## USER FLOW

1. SteamID64を入力して「生成する」をクリック
2. GASがSteam APIと Store APIを叩く（20〜30秒）
3. カスタマイズパネルが表示される
   - 列数（3/4/5列）
   - 表示件数（8/12/16/20件）
   - 背景色・文字色
   - ゲーム名・発売年・プレイ時間・順位バッジの表示切替
4. Canvasにグリッド画像がリアルタイム描画される
5. 「画像を保存」でPNG出力

---

## SETUP

### 前提条件

- Steamアカウント（過去に5ドル以上課金済み）
- SteamプロフィールおよびゲームライブラリをPublicに設定

### Steam APIキーの取得

1. `https://steamcommunity.com/dev/apikey` にアクセス
2. ドメイン名欄に任意の文字列を入力（ブログURLでも可）
3. 利用規約に同意して登録
4. 表示されたAPIキーをメモ

### SteamID64の確認

プロフィールURLが `steamcommunity.com/id/ユーザー名` の形式の場合は [steamid.io](https://steamid.io/) で検索。

### GASのデプロイ

1. `steam_gas_final.js` をGASに貼り付け
2. `STEAM_API_KEY` に取得したキーを入力
3. 初回実行時に `test()` 関数を追加して手動実行 → `UrlFetchApp` の権限を承認
4. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」→「全員がアクセス可能」で公開
5. 発行されたURLをコピー

### Bloggerへの設置

1. `steam_chart_final.html` の `GAS_PROXY_URL` を上記URLに書き換え
2. 記事のHTML編集モードに貼り付け

---

## CONSTRAINTS

| 制約 | 内容 |
|------|------|
| Steamプロフィール | Public設定が必須 |
| APIキー | 5ドル以上課金済みアカウントのみ取得可能 |
| 発売年取得 | 上位20件のみ（全件はGAS実行時間制限に抵触） |
| 生成時間 | Store APIの順次取得により20〜30秒かかる |
| 年別フィルター | Steam APIが購入日・プレイ開始日を公開していないため実現不可 |

---

## INSIGHT

### Last.fmチャートとの構造比較

| | Last.fm アルバムチャート | Steam チャート |
|---|---|---|
| データ取得 | Last.fm API（直接） | Steam API（GASプロキシ経由） |
| APIキー | 不要 | 必須（GAS側で隠蔽） |
| CORS回避 | `images.weserv.nl` | GAS自体がプロキシ |
| 画像取得 | `images.weserv.nl` 経由 | 同じく `images.weserv.nl` 経由 |
| 期間フィルター | API側が対応（1週間〜全期間） | 非対応（APIの構造的制限） |
| 生成時間 | 数秒 | 20〜30秒（Store API取得のため） |

### 「APIキーをGASに隠す」という設計の意味

通常のAPI連携ではAPIキーをフロントエンドに書くことが多いが、
GASをプロキシとして挟むことでキーをサーバーサイド（GAS）に閉じ込められる。

これはBloggerという「サーバーを持てないプラットフォーム」において、
GASが「サーバーの代替」として機能している典型的なパターンである。

### 「動く範囲で最善を出す」という判断

年別フィルター（例：2020年発売のゲームトップ20）はユーザーの要望として上がったが、
Steam APIの構造上、全件の発売年を取得するにはGASの実行時間制限（6分）に抵触する。

この制約を受け入れた上で「プレイ時間トップ20の発売年を表示する」という
現時点での最適解を選択した。これは「完成は静止画である」という設計思想の実践例。

---

## REUSE

このパターンは以下の用途に応用できる。

- ゲーム実績トラッカー（Steam Achievement API）
- PSNトロフィーチャート（PSN APIに差し替え）
- 任意の「ランキング × 画像グリッド × PNG出力」ツール全般
