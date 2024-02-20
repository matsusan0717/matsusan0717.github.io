    document.addEventListener("DOMContentLoaded", function() {       
        var boldElements = document.querySelectorAll("b");
        boldElements.forEach(function(element) {
            var text = element.textContent;
            var textWithoutHash = text.replace(/#/g, "");
            element.innerHTML = textWithoutHash;
        });
    document.querySelectorAll('.label-size, .status-msg-body, .label-info,.breadcrumbs').forEach(function(item) {
        let tmp = item.innerHTML;
        tmp = tmp.replace(/#/g, "");
        item.innerHTML = tmp;
        });

