/*<![CDATA[*/
$(document).ready(function() {
    var items1 = $('.random-item1');
    var items2 = $('.random-item2');

    // すべての要素を非表示にする処理は不要になる（CSSで既に非表示）

    // random-item1 からランダムなインデックスを取得し、表示
    var randomIndex1 = Math.floor(Math.random() * items1.length);
    items1.eq(randomIndex1).show();

    // random-item2 からランダムなインデックスを取得し、表示
    var randomIndex2 = Math.floor(Math.random() * items2.length);
    items2.eq(randomIndex2).show();
});
/*]]>*/
