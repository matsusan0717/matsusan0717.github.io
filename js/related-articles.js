<script type='text/javascript'>
    const rp_current = &quot;<data:post.url/>&quot;;
    const rp_max = 6; // 表示記事数
    const rp_head = &quot;関連記事&quot;; // タイトル

    //<![CDATA[
    (function(root, func) {
      if (!root.RelatedPosts) {
        root.RelatedPosts = func();
      }
    })(this, function() {
      let _this = function RelatedPosts_constructor() {};
      let count = 0;
      let limit = 0;
      let urls = [];
      let titles = [];
      let dates = [];
      let imgs = [];

      // フィード数分をカウント
      _this.counter = function RelatedPosts_counter() {
        limit++;
      };

      // 関連記事の書き込み
      function RelatedPosts_write() {
        // 重複処理
        let dups = [];
        let indexs = [];
        for (let i = 0; i < urls.length; i++) {
          if (dups.indexOf(urls[i]) == -1) {
            dups.push(urls[i]);
            indexs.push(i);
          }
        }

        // ランダムインデックス生成
        let idx, items = [];
        let a = [...Array(indexs.length).keys()];
        while (a.length > 0) {
          idx = Math.floor(Math.random() * a.length);
          items.push(a[idx]);
          a.splice(idx, 1);
        }

        // 関連一覧の作成
        let html;
        let i = 0;
        if (indexs.length > 0) {
          html = '<div class="related-text">' + rp_head + '</div><div class="p-container">';
          while (i < indexs.length && i < rp_max) {
            html += '<a href="' + urls[indexs[items[i]]] + '"><figure class="related-img"><img alt="" width="250" height="150" src="' + imgs[indexs[items[i]]] + '"/></figure><div class="related-date">' + dates[indexs[items[i]]] + '</div><div class="related-title">' + titles[indexs[items[i]]] + '</div></a>';
            i++;
          }
          html += '</div>';
          document.getElementById("related-posts").innerHTML = html;
        }
      }

      // フィードデータ追加
      _this.add = function RelatedPosts_add(json) {
        let m = rp_current.match(/^https?:\/\/(.+$)/);
        let http  = '';
        let https = '';
        if (m != null) {
          http  = 'http://' + m[1];
          https = 'https://' + m[1];
        }
        for (let i = 0; i < json.feed.entry.length; i++) {
          let entry = json.feed.entry[i];
          for (let j = 0; j < entry.link.length; j++) {
            if (entry.link[j].rel == 'alternate') {
              if (!(http == entry.link[j].href || https == entry.link[j].href)) {
                urls.push(entry.link[j].href);
                titles.push(entry.title.$t);
                let date = entry.published.$t.substr(0, 10).replace(/-/g, "/");
                dates.push(date);
                let img;
                if ("media$thumbnail" in entry) {
                  img = entry.media$thumbnail.url;
                  let re1 = /\/s72-.*\//;
                  let re2 = /=s72-.*$/;
                  if (img.match(re1)) {
                    img = img.replace(re1, '/w250-h150-n/');
                  } else if (img.match(re2)) {
                    img = img.replace(re2, '=w250-h150-n');
                  } else if (img.match(/default.jpg/)) {
                    img = img.replace('default.jpg', 'mqdefault.jpg');
                  }
                } else {
                  // NoImage画像
                  img = "https://1.bp.blogspot.com/-yTPWsH8gv-s/YQv_7ZdiVaI/AAAAAAAADUM/M7RJkYAwtXoz87stjiaX1_mC4OgNjnT7wCLcBGAsYHQ/w250-h150-n-e365/noimg.jpg";
                }
                imgs.push(img);
              }
              break;
            }
          }
        }
        count++;
        if (count == limit) {
          RelatedPosts_write();
        }
      };

      return _this;
    });
    //]]>
</script>
