function precancopy(ele='pre') {

    document.querySelectorAll(ele).forEach((el)=>{

        var span = document.createElement('span');
        span.className = 'copy';
        span.innerText = 'copy';
        el.appendChild(span);

        span.removeEventListener('click', dummy());

        span.addEventListener('click', function(e) {
            if (ele =='pre') {
                var text = span.closest(ele).querySelector('code').innerText;
            } else{
                var text = span.closest(ele).innerText;
            }
            const textarea = document.createElement('textarea');
            textarea.classname = 'hide';
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            // For mobile devices
            // Copy the text to the clipboard
            // navigator.clipboard.writeText(textarea.value);
            // Copy the text to the clipboard
            document.execCommand('copy');

            document.body.removeChild(textarea);
            span.innerText = 'copied';
            ta.class.add(span.closest(ele), 'copied')
            setTimeout(()=>{
                ta.class.remove(span.closest(ele), 'copied')
            }
            , 3000);
        });

    }
    );

}

document.addEventListener("DOMContentLoaded", function() {

    ta.fetch('#sitemenu .container');
    taicon.delay();

    if (ta.is_elementExists('.tocindex')) {

        ta.generateTOC('.tocindex');
    }

    precancopy();



});
