/*<![CDATA[*/
$(document).ready(function() {
    // ランダム1のグループ内の全記事要素を取得
    var items1 = $('.random-item1-group > .random-item1'); // ★ここを変更！

    // ランダム2の全記事要素を取得 (こちらは現状のまま)
    var items2 = $('.random-item2');

    // 初期表示のちらつき防止のため、CSSで display: none; を設定していることを前提とします。
    // そのため、JavaScriptでの hide() 呼び出しは不要です。
    // items1.hide(); // 不要
    // items2.hide(); // 不要

    // random-item1 の中からランダムなインデックスを取得し、該当要素を表示
    if (items1.length > 0) { // 念のため、要素が存在するかチェック
        var randomIndex1 = Math.floor(Math.random() * items1.length);
        items1.eq(randomIndex1).show();
    }

    // random-item2 の中からランダムなインデックスを取得し、該当要素を表示
    if (items2.length > 0) { // 念のため、要素が存在するかチェック
        var randomIndex2 = Math.floor(Math.random() * items2.length);
        items2.eq(randomIndex2).show();
    }
});
/*]]>*/
