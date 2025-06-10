$(document).ready(function() {
    var items1 = $('.random-item1');
    var items2 = $('.random-item2');

    // まず、念のため全てのランダム要素を確実に非表示にする（visibility: hiddenを強制）
    // CSSで既に設定済みであれば不要ですが、確実性を高めるために残してもOK
    items1.css('visibility', 'hidden !important');
    items2.css('visibility', 'hidden !important');

    // ランダムなインデックスを取得
    var randomIndex1 = Math.floor(Math.random() * items1.length);
    var randomIndex2 = Math.floor(Math.random() * items2.length);

    // ランダムに選ばれた要素を visibility: visible で表示（!importantを付けて強制）
    if (items1.length > 0) {
        items1.eq(randomIndex1).css('visibility', 'visible !important');
    }
    if (items2.length > 0) {
        items2.eq(randomIndex2).css('visibility', 'visible !important');
    }
});
