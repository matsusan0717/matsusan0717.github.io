const today = new Date();
const todayMMDD = (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    today.getDate().toString().padStart(2, '0');

// .tpd内の data-date 属性を持つdivだけ対象にする
const targetDivs = Array.from(document.querySelectorAll('.tpd > div[data-date]'));

// 日付の抽出と整形
const datedDivs = targetDivs.map(div => {
  const dateStr = div.getAttribute('data-date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [, mm, dd] = dateStr.split('-');
  const mmdd = mm + '-' + dd;
  // div内のiframe要素を取得し、data-srcを保持しておく
  const iframe = div.querySelector('iframe');
  const iframeSrc = iframe ? iframe.getAttribute('data-src') : null;
  return { div, mmdd, iframe, iframeSrc };
}).filter(item => item !== null);

const sameDayDivs = datedDivs.filter(item => item.mmdd === todayMMDD);

// すべてのdivを一旦非表示に設定
// ここではiframeのsrcはセットしないため、余計な読み込みは発生しない
targetDivs.forEach(div => div.style.display = 'none');

if (sameDayDivs.length > 0) {
  // 同日の中からランダムに1つ表示
  const randomIndex = Math.floor(Math.random() * sameDayDivs.length);
  const divToShow = sameDayDivs[randomIndex];
  divToShow.div.style.display = '';
  // 表示するiframeのsrcをセットして読み込みを開始
  if (divToShow.iframe && divToShow.iframeSrc) {
    divToShow.iframe.src = divToShow.iframeSrc;
  }
} else {
  // 今日より前の中から最も近い1つだけ表示
  const pastDivs = datedDivs.filter(item => item.mmdd < todayMMDD);
  if (pastDivs.length > 0) {
    const closest = pastDivs.reduce((a, b) => a.mmdd > b.mmdd ? a : b);
    closest.div.style.display = '';
    // 表示するiframeのsrcをセットして読み込みを開始
    if (closest.iframe && closest.iframeSrc) {
      closest.iframe.src = closest.iframeSrc;
    }
  }
}
