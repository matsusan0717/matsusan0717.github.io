$(document).ready(function() {
    var items1 = $('.random-item1');
    var items2 = $('.random-item2');

    // CSSで display: none; または visibility: hidden; が設定されていることを前提とします。
    // そのため、JavaScriptでの hide() / css('visibility', 'hidden') 呼び出しは不要です。

    // ランダムなインデックスを取得
    var randomIndex1 = Math.floor(Math.random() * items1.length);
    var randomIndex2 = Math.floor(Math.random() * items2.length);

    // ランダムに選ばれた要素をアニメーションで表示
    if (items1.length > 0) {
        items1.eq(randomIndex1).fadeIn(200); // 200ミリ秒でフェードイン
        // または items1.eq(randomIndex1).css('opacity', 0).animate({opacity: 1}, 200);
        // (visibility: hidden を使っている場合は css('visibility', 'visible') と併用)
    }
    if (items2.length > 0) {
        items2.eq(randomIndex2).fadeIn(200); // 200ミリ秒でフェードイン
    }
});
