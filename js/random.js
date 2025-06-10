document.addEventListener("DOMContentLoaded", function() {
    var items1 = document.querySelectorAll('.random-item1');
    var items2 = document.querySelectorAll('.random-item2');

    if(items1.length > 0){
        var randomIndex1 = Math.floor(Math.random() * items1.length);
        items1[randomIndex1].style.display = 'block';
    }

    if(items2.length > 0){
        var randomIndex2 = Math.floor(Math.random() * items2.length);
        items2[randomIndex2].style.display = 'block';
    }
});
