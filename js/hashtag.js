//<![CDATA[
document.querySelectorAll('.label-size, .status-msg-body, .label-info,.query-info, .breadcrumbs').forEach(function(item) {
let tmp = item.innerHTML;
tmp = tmp.replace(/#/g, "");
item.innerHTML = tmp;
});//]]>
