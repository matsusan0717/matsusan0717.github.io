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
