/*<![CDATA[*/
$(document).ready(function() {
    // 現在のページのURLを取得
    var currentUrl = window.location.href;

    // トップページのURL
    var homepageUrl = 'https://www.performancedoll.com/';

    // ランダム1のグループ内の全記事要素を取得
    var items1 = $('.random-item1-group > .random-item1');
    // ランダム2の全記事要素を取得
    var items2 = $('.random-item2');

    // トップページの場合 (ランダム1とランダム2の両方を処理)
    if (currentUrl === homepageUrl || currentUrl === homepageUrl + 'index.html') { // index.html も考慮
        if (items1.length > 0) {
            var randomIndex1 = Math.floor(Math.random() * items1.length);
            items1.eq(randomIndex1).show();
        }
        if (items2.length > 0) {
            var randomIndex2 = Math.floor(Math.random() * items2.length);
            items2.eq(randomIndex2).show();
        }
    }
    // トップページ以外の場合 (ランダム1のみ処理)
    else {
        if (items1.length > 0) {
            var randomIndex1 = Math.floor(Math.random() * items1.length);
            items1.eq(randomIndex1).show();
            // トップページ以外でランダム2が存在する場合、非表示を徹底する
            items2.hide();
        }
    }
});
/*]]>*/
