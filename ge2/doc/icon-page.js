function search(obj) {

    var key = obj.value;
    var ndx = document.querySelector('#index-icon');
    if (key.length > 2) {
        ndx.querySelectorAll('span').forEach(function(e) {
            if (e.children[1].innerText.includes(key)) {
                e.style.display = 'flex'
            } else {
                e.style.display = 'none'
            }
        });

    } else {

        ndx.querySelectorAll('span').forEach(function(e) {
            e.style.display = 'flex'
        });

    }
}

document.addEventListener("DOMContentLoaded", function() {

    var div = document.getElementById('index-icon');
    taicon.index().forEach(function(ic) {
        var span = document.createElement('span')
        var i = document.createElement('i')
        i.setAttribute('data-icon', ic);
        span.innerHTML = '<b>' + ic + "</b>"
        span.prepend(i)
        div.append(span)
    })

    taicon.delay();

    document.querySelectorAll('#index-icon span').forEach(
    function(e) {

        e.addEventListener("click", function() {
            var svgd = e.querySelector('svg').outerHTML;
            var text = e.querySelector('b').innerText;
            document.querySelector('#temp h5').innerText = text;
            document.querySelector('#temp div.preview .s1').innerHTML = svgd
            document.querySelector('#temp div.preview .s2').innerHTML = svgd
            document.querySelector('#temp div.preview .s3').innerHTML = svgd
            document.querySelector('#temp div.preview .s4').innerHTML = svgd
            document.querySelector('#temp div.preview .s5').innerHTML = svgd
            document.querySelector('#temp div.preview .s6').innerHTML = svgd			
            document.querySelector('#temp input.code').value = '<i data-icon="' + e.querySelector('b').innerText + '"></i>';
            document.querySelector('#temp input.code').select();
            document.execCommand("copy");
        })

    })

});
