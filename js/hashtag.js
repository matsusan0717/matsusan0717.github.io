<script>
//<![CDATA[
document.querySelectorAll('.label-size, .status-msg-body, .breadcrumbs').forEach(function(item) {
let tmp = item.innerHTML;
tmp = tmp.replace(/#/g, "");
item.innerHTML = tmp;
});//]]>
</script>
