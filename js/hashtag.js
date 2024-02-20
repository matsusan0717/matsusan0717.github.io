document.addEventListener("DOMContentLoaded", function() {
   // <b>タグ内のテキストから#を除去する処理
   var boldElements = document.querySelectorAll("b");
   boldElements.forEach(function(element) {
      var text = element.textContent;
      var textWithoutHash = text.replace(/#/g, "");
      element.innerHTML = textWithoutHash;
   });
   // 指定された要素の内部のテキストから#を除去する処理
   document.querySelectorAll('.label-size, .status-msg-body, .breadcrumbs').forEach(function(item) {
      var tmp = item.innerHTML;
      tmp = tmp.replace(/#/g, "");
      item.innerHTML = tmp;
   });
});
