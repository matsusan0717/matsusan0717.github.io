📝 BloggerにおけるJavaScript文字化け（数値文字参照）対策メモBloggerのHTMLエディタでJavaScriptを保存する際、特定の全角文字や記号が勝手に「数値文字参照」に書き換えられてしまう現象への対策。1. 現象Bloggerのエディタは、保存時に親切心で以下の置換を行う：！ → &#65281;。 → &#12290;、 → &#12289;これがJavaScriptの文字列（String）内で起きると、画面表示が崩れるだけでなく、if (status === "完了！") などの条件分岐が一致しなくなり、プログラムが壊れる。2. 根本的な解決策：URIエンコード戦術JavaScriptコード内に直接全角記号を書かず、URIエンコード（%形式）した文字列を、実行時にデコードして生成することで、Bloggerの自動置換を完全にスルーさせる。実装パターンJavaScript// ❌ NG: Bloggerに書き換えられて文字化けする
const message = "作成完了！"; 

// ✅ OK: Bloggerが検知できない形式で書き、実行時に戻す
const message = decodeURIComponent("%E4%BD%9C%E6%88%90%E5%AE%8C%E4%BA%86%EF%BC%81");
3. よく使う記号の変換リストBloggerで特に化けやすい記号の「安全な書き方」：記号URIエンコードJSでの書き方例！%EF%BC%81decodeURIComponent("%EF%BC%81")。%E3%80%82decodeURIComponent("%E3%80%82")、%E3%80%81decodeURIComponent("%E3%80%81")：%EF%BC%9AdecodeURIComponent("%EF%BC%9A")？%EF%BC%9FdecodeURIComponent("%EF%BC%9F")4. 応用：メッセージの一括管理ツール内で使うメッセージが多い場合は、以下のようにオブジェクトでまとめておくと管理しやすい。JavaScriptconst MSG = {
  success: decodeURIComponent("%E4%BD%9C%E6%88%90%E5%AE%8C%E4%BA%86%EF%BC%81"), // 作成完了！
  error:   decodeURIComponent("%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%A7%E3%81%99%E3%80%82")  // エラーです。
};
注意: 将来的にBloggerの仕様が変わったとしても、この decodeURIComponent 方式は標準的なJavaScriptの挙動であるため、コードが動かなくなる心配はない。
