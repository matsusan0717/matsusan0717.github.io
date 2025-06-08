/*<![CDATA[*/ 
$(document).ready(function() {
    var items1 = $('.random-item1'); // .random-item1 要素を取得
    var items2 = $('.random-item2'); // .random-item2 要素を取得

    // すべての要素を非表示にする
    items1.hide();
    items2.hide();

    // ランダムなインデックスを取得
    var randomIndex1 = Math.floor(Math.random() * items1.length);
    var randomIndex2 = Math.floor(Math.random() * items2.length);

    // ランダムに選ばれた要素を表示
    items1.eq(randomIndex1).show();
    items2.eq(randomIndex2).show();
});
/*]]>*/
