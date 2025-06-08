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
    return { div, mmdd };
  }).filter(item => item !== null);

  const sameDayDivs = datedDivs.filter(item => item.mmdd === todayMMDD);

  // 対象divすべて一旦非表示
  targetDivs.forEach(div => div.style.display = 'none');

  if (sameDayDivs.length > 0) {
    // 同日の中からランダムに1つ表示
    const randomIndex = Math.floor(Math.random() * sameDayDivs.length);
    sameDayDivs[randomIndex].div.style.display = '';
  } else {
    // 今日より前の中から最も近い1つだけ表示
    const pastDivs = datedDivs.filter(item => item.mmdd < todayMMDD);
    if (pastDivs.length > 0) {
      const closest = pastDivs.reduce((a, b) => a.mmdd > b.mmdd ? a : b);
      closest.div.style.display = '';
    }
  }
