const maxnum = 50;
  const maxstr = 200;
  const c_link = true;
  let a_names = [], a_imgs = [], a_times = [], csums = [], curls = [];

  function loadcmt(json) {
    if (typeof (json) === 'undefined' || !('entry' in json.feed)) {
      document.getElementById('recent-cmt').innerHTML = '表示できるコメントがありません。';
      return;
    }

    function getData() {
      for (let i = 0; i < json.feed.entry.length; i++) {
        const entry = json.feed.entry[i];
        let a_name = entry.author[0].name.$t;
        if (a_name === 'Anonymous') a_name = '匿名';
        let a_img = entry.author[0].gd$image.src;
        if (a_img.includes('blank.gif')) {
          a_img = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1WLXoit5wbywP-medekmQAuu7RVv-k6Tl9qZq8ni4c-XH06K60I7cYmOQ1zvy07b6II4pEv4-k5HTvz6cAgpA43y3Sw9WF_oBH6HCLAx-0dxL0xNeYFuS6g0jkWxQUrjn35Y3a8t2O6BU/s35/user.png";
        }
        const date = new Date(entry.published.$t);
        const a_time = `${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;

        // 元のコメントHTMLから改行を表すタグを<br/>に変換し、他のタグは除去
        let csum = entry.summary.$t
          .replace(/<\/?(div|p)[^>]*>/gi, '<br/>')
          .replace(/<(?!br\s*\/?)[^>]+>/gi, '');

        if (csum.length > maxstr) csum = csum.substring(0, maxstr) + ' ...';

        let curl = '';
        let curl2 = '';
        for (let j = 0; j < entry.link.length; j++) {
          if (entry.link[j].rel == 'alternate') {
            curl = entry.link[j].href;
            if (!c_link) curl = curl.replace(/\?showComment.*$/, '');
          } else if (entry.link[j].rel == 'self') {
            curl2 = entry.link[j].href;
          }
        }
        if (curl.indexOf('#') == -1 && c_link) {
          const id = curl2.split('/').pop();
          curl += '#c' + id;
        }

        a_names.push(a_name);
        a_imgs.push(a_img);
        a_times.push(a_time);
        csums.push(csum);
        curls.push(curl);
      }
    }

    getData();
    displaycmt();
  }

  function displaycmt() {
    let html = '<div class="rc-note">最新' + maxnum + '件を表示しています。</div>';
    for (let i = 0; i < maxnum && i < curls.length; i++) {
      html += '<div class="rc-wrapper">';
      html += '<a class="rc-block" href="' + curls[i] + '">'
            + '<div class="rc-head">'
            + '<img loading="lazy" alt="" width="38" height="38" src="' + a_imgs[i] + '"/>'
            + '<div class="rc-author">' + a_names[i] + '</div>'
            + '<div class="rc-time">' + a_times[i] + '</div>'
            + '</div>'
            + '<div class="rc-body">' + csums[i] + '</div>'
            + '</a>'
            + '<div class="comment-actions secondary-text">'
            + '<a href="https://www.blogger.com/comment/fullpage/page/4861204913995350776/5929042444471849962" target="_blank">返信・削除</a>'
            + '</div>';
      html += '</div>';
    }
    document.getElementById('recent-cmt').innerHTML = html;
  }

  const scr_rc = document.createElement('script');
  scr_rc.src = '/feeds/comments/summary?alt=json-in-script&max-results=' + maxnum + '&callback=loadcmt';
  document.getElementById('recent-cmt').after(scr_rc);
