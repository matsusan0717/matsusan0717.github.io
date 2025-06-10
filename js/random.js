$(document).ready(function() {
    var items1 = $('.random-item1'); // .random-item1 要素を取得
    var items2 = $('.random-item2'); // .random-item2 要素を取得

    // まず、念のため全てのランダム要素を確実に非表示にする
    // !important を付けてCSSの優先度を上書き
    items1.css('display', 'none !important');
    items2.css('display', 'none !important');

    // ランダムなインデックスを取得
    var randomIndex1 = Math.floor(Math.random() * items1.length);
    var randomIndex2 = Math.floor(Math.random() * items2.length);

    // ランダムに選ばれた要素を !important を付けて表示
    if (items1.length > 0) {
        items1.eq(randomIndex1).css('display', 'block !important');
    }
    if (items2.length > 0) {
        items2.eq(randomIndex2).css('display', 'block !important');
    }
});
