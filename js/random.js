$(document).ready(function() {
    var items1 = $('.random-item1');
    var items2 = $('.random-item2');

    // まず、念のため全てのランダム要素を確実に非表示にする
    // visibility: hidden; を使用 (CSSでも設定済みであれば省略可)
    items1.css('visibility', 'hidden');
    items2.css('visibility', 'hidden');

    // ランダムなインデックスを取得
    var randomIndex1 = Math.floor(Math.random() * items1.length);
    var randomIndex2 = Math.floor(Math.random() * items2.length);

    // ランダムに選ばれた要素を表示
    if (items1.length > 0) {
        items1.eq(randomIndex1).css('visibility', 'visible');
    }
    if (items2.length > 0) {
        items2.eq(randomIndex2).css('visibility', 'visible');
    }
});
