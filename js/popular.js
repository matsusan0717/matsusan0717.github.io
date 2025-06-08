    // PopularPostsウィジェットの投稿に順位を表示して画像の左上隅に重ねるスクリプト
    function customPopularPosts() {
        var widgetId = 'PopularPosts1'; // PopularPostsウィジェットのIDを設定
        var imageSize = 120; // 画像のサイズを設定 (120px &#215; 120px)

        // PopularPostsウィジェットの投稿を取得
        var posts = document.querySelectorAll('#' + widgetId + ' .post');

        // 投稿を1から5までの順位で表示する
        posts.forEach(function(post, index) {
            var rank = index + 1; // 順位を計算
            var rankElement = document.createElement('span');
            rankElement.classList.add('rank');
            rankElement.textContent = rank; // 順位を表示する要素を作成

            // 画像の上に順位を重ねる
            var postImage = post.querySelector('.post-thumb');
            postImage.parentNode.insertBefore(rankElement, postImage.nextSibling);
            rankElement.style.position = 'absolute';
            rankElement.style.top = '0';
            rankElement.style.left = '0';
            rankElement.style.padding = '4px 8px'; // 横8px&#12289;縦は現在のままで
            rankElement.style.background = '#e91e63'; // テキストの背景色を設定
            rankElement.style.borderRadius = '0'; // 角丸をなしにする

            // テキストのスタイルを調整する
            rankElement.style.color = '#fff'; // テキストの色を白に設定
            rankElement.style.fontWeight = 'bold'; // フォントの太さを設定
            rankElement.style.zIndex = '999'; // テキストを最前面に表示
        });
    }

    // ページが読み込まれたらcustomPopularPosts関数を実行
    document.addEventListener('DOMContentLoaded', customPopularPosts);
