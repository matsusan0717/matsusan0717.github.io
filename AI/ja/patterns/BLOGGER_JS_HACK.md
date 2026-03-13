## 1. コア知識
- **現象:** Bloggerエディタが保存時に「！」や「。」を数値文字参照へ強制置換する。
- **課題:** JSの文字列比較（if文など）が一致しなくなり、ロジックが崩壊する。
- **解決策:** decodeURIComponent("%形式") を使用。Bloggerのパーサーをスルーさせ、実行時にのみデコードする。

## 2. 実装パターン
    // ❌ NG (置換対象)
    const msg = "完了！";

    // ✅ OK (回避策)
    const msg = decodeURIComponent("%E5%AE%8C%E4%BA%86%EF%BC%81");

## 3. 変換マトリクス（常用兵装）
| 記号 | URIエンコード | 実装コード例 |
| :--- | :--- | :--- |
| ！ | %EF%BC%81 | decodeURIComponent("%EF%BC%81") |
| 。 | %E3%80%82 | decodeURIComponent("%E3%80%82") |
| 、 | %E3%80%81 | decodeURIComponent("%E3%80%81") |
| ： | %EF%BC%9A | decodeURIComponent("%EF%BC%9A") |
| ？ | %EF%BC%9F | decodeURIComponent("%EF%BC%9F") |

## 4. 管理戦略
メッセージ群は定数オブジェクトに集約し、AIへのコンテキスト入力を効率化する。


