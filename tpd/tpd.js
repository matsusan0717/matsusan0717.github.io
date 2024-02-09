<script>
    $(document).ready(function() {
        var items = $('.random-item'); // 全ての要素を取得
        var randomIndex = Math.floor(Math.random() * items.length); // ランダムなインデックスを取得

        items.hide(); // 全ての要素を非表示にする
        items.eq(randomIndex).show(); // ランダムに選ばれた要素を表示

        // もう1つの処理も同じブロック内に統合
        var items2 = $('.random-item2'); // 別の要素を取得
        var randomIndex2 = Math.floor(Math.random() * items2.length); // ランダムなインデックスを取得

        items2.hide(); // 別の要素を非表示にする
        items2.eq(randomIndex2).show(); // ランダムに選ばれた要素を表示
    });
</script>
  
<script>//<![CDATA[
document.querySelectorAll('.label-size, .status-msg-body, .label-info, .breadcrumbs').forEach(function(item) {
let tmp = item.innerHTML;
tmp = tmp.replace(/#/g, "");
item.innerHTML = tmp;
});
//]]></script>

<script>//<![CDATA[  
//==============================================
// [jQuery] 表示文字数を制限
//==============================================
$(function() {
    const len = 37; // 最大文字数を指定します

    $('.post-info .post-title').each(function() {
        const els = $.trim($(this).text());

        if (els.length > len) {
            const textContent = els.substring(0, len) + '...';
            $(this).text(textContent);
        }
    });
});
//]]></script>
